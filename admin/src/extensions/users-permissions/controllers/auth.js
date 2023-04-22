
const _ = require('lodash');
const utils = require('@strapi/utils');
const { getService } = require('@strapi/plugin-users-permissions/server/utils');
const {
    validateCallbackBody,
    validateRegisterBody,
} = require('@strapi/plugin-users-permissions/server/controllers/validation/auth');
const { v4: uuidv4 } = require('uuid');

const { sanitize } = utils;
const { ApplicationError, ValidationError } = utils.errors;

const { yup, validateYupSchema } = require('@strapi/utils');
const role = require('@strapi/plugin-users-permissions/server/services/role');

const otpVerificationSchema = yup.object({
    code: yup.string().required().length(6)
})
const validateOtpVerificationBody = validateYupSchema(otpVerificationSchema);

const sanitizeUser = (user, ctx) => {
    const { auth } = ctx.state;
    const userSchema = strapi.getModel('plugin::users-permissions.user');

    return sanitize.contentAPI.output(user, userSchema, { auth });
};
const sanitizeOtp = ({ expirationDate, uuid }, ctx) => {
    return { expirationDate, uuid };
};
const generateOtp = () => Math.floor(Math.random() * 899999 + 100000);

async function callback(ctx) {
    const provider = ctx.params.provider || 'local';
    const params = ctx.request.body;

    const store = strapi.store({ type: 'plugin', name: 'users-permissions' });
    const grantSettings = await store.get({ key: 'grant' });

    const grantProvider = provider === 'local' ? 'email' : provider;

    if (!_.get(grantSettings, [grantProvider, 'enabled'])) {
        throw new ApplicationError('This provider is disabled');
    }

    if (provider === 'local') {
        await validateCallbackBody(params);

        const { identifier } = params;

        // Check if the user exists.
        const user = await strapi.query('plugin::users-permissions.user').findOne({
            where: {
                provider,
                $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
            },
        });

        if (!user) {
            throw new ValidationError('Invalid identifier or password');
        }

        if (!user.password) {
            throw new ValidationError('Invalid identifier or password');
        }

        const validPassword = await getService('user').validatePassword(
            params.password,
            user.password
        );

        if (!validPassword) {
            throw new ValidationError('Invalid identifier or password');
        }

        const advancedSettings = await store.get({ key: 'advanced' });
        const requiresConfirmation = _.get(advancedSettings, 'email_confirmation');

        if (requiresConfirmation && user.confirmed !== true) {
            throw new ApplicationError('Your account email is not confirmed');
        }

        if (user.blocked === true) {
            throw new ApplicationError('Your account has been blocked by an administrator');
        }

        // we save the otp in the database

        const otpExpirationDate = new Date();
        otpExpirationDate.setHours(otpExpirationDate.getHours() + 1);
        const otpData = {
            uuid: uuidv4(),
            code: generateOtp(),
            expirationDate: otpExpirationDate,
            owner: user
        }
        const otp = await strapi.entityService.create('plugin::users-permissions.otp', {
            data: otpData
        });
        await strapi.plugins['email'].services.email.send({
            to: user.email,
            subject: 'Your authentication code',
            text: `Your authentication code is ${otpData.code}`
        });

        return ctx.send({
            otp: sanitizeOtp(otp)
        });
    }

    // Connect the user with the third-party provider.
    try {
        const user = await getService('providers').connect(provider, ctx.query);

        return ctx.send({
            jwt: getService('jwt').issue({ id: user.id }),
            user: await sanitizeUser(user, ctx),
        });
    } catch (error) {
        throw new ApplicationError(error.message);
    }
}

async function otp(ctx) {
    const { uuid } = ctx.params;
    const body = ctx.request.body;
    await validateOtpVerificationBody(body);
    const { code } = body;

    const otp = await strapi.db.query('plugin::users-permissions.otp').findOne(
        {
            where: { uuid, code },
            sort: { createdAt: 'DESC' },
            populate: {
                owner: {
                    populate: {
                        role: true
                    }
                },
            }
        });
    if (otp == null) {
        return ctx.badRequest('Failed to verify otp')
    }
    if (otp.expirationDate > (new Date())) {
        return ctx.badRequest('Otp has expired')
    }
    const user = otp.owner;
    await strapi.db.query('plugin::users-permissions.otp').delete({
        where: {
            id: otp.id
        }
    });
    return ctx.send({
        jwt: getService('jwt').issue({ id: user.id, role: user.role.type }),
        user: await sanitizeUser(user, ctx),
    });
}

const register = async (ctx) => {
    const pluginStore = await strapi.store({ type: 'plugin', name: 'users-permissions' });

    const settings = await pluginStore.get({ key: 'advanced' });

    if (!settings.allow_register) {
        throw new ApplicationError('Register action is currently disabled');
    }

    const params = {
        ..._.omit(ctx.request.body, [
            'confirmed',
            'blocked',
            'confirmationToken',
            'resetPasswordToken',
            'provider',
            'id',
            'createdAt',
            'updatedAt',
            'createdBy',
            'updatedBy',
            'role',
        ]),
        provider: 'local',
    };

    await validateRegisterBody(params);

    const role = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: settings.default_role } });

    if (!role) {
        throw new ApplicationError('Impossible to find the default role');
    }

    const { email, username, provider } = params;

    const identifierFilter = {
        $or: [
            { email: email.toLowerCase() },
            { username: email.toLowerCase() },
            { username },
            { email: username },
        ],
    };

    const conflictingUserCount = await strapi.query('plugin::users-permissions.user').count({
        where: { ...identifierFilter, provider },
    });

    if (conflictingUserCount > 0) {
        throw new ApplicationError('Email or Username are already taken');
    }

    if (settings.unique_email) {
        const conflictingUserCount = await strapi.query('plugin::users-permissions.user').count({
            where: { ...identifierFilter },
        });

        if (conflictingUserCount > 0) {
            throw new ApplicationError('Email or Username are already taken');
        }
    }

    const newUser = {
        ...params,
        role: role.id,
        email: email.toLowerCase(),
        username,
        confirmed: !settings.email_confirmation,
    };

    const user = await getService('user').add(newUser);

    const sanitizedUser = await sanitizeUser(user, ctx);

    if (settings.email_confirmation) {
        try {
            await getService('user').sendConfirmationEmail(sanitizedUser);
        } catch (err) {
            throw new ApplicationError(err.message);
        }

        return ctx.send({ user: sanitizedUser });
    }

    const jwt = getService('jwt').issue(_.pick(user, ['id']));

    return ctx.send({
        user: sanitizedUser,
    });
}

module.exports = {
    callback,
    otp,
    register
}
