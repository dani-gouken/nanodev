const plugins = require("../../../config/plugins");
const contentTypes = require("./content-types");
const controllers = require("./controllers")

module.exports = (plugin) => {
    plugin.contentTypes = {
        ...plugin.contentTypes,
        ...contentTypes
    };
    plugin.controllers.auth.callback = controllers.auth.callback
    plugin.controllers.auth.otp = controllers.auth.otp
    plugin.controllers.auth.register = controllers.auth.register

    plugin.routes['content-api'].routes.push({
        method: 'POST',
        path: '/auth/otp/:uuid/verify',
        handler: 'auth.otp',
        config: {
            middlewares: ['plugin::users-permissions.rateLimit'],
            prefix: '',
            auth: false
        },
    });
    return plugin;
};
