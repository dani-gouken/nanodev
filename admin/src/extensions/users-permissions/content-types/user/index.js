'use strict';

const schemaConfig = require('./schema-config');

module.exports = {
    collectionName: 'up_users',
    info: {
        name: 'user',
        description: '',
        singularName: 'user',
        pluralName: 'users',
        displayName: 'User',
    },
    options: {
        draftAndPublish: false,
        timestamps: true,
    },
    attributes: {
        username: {
            type: 'string',
            minLength: 3,
            unique: true,
            configurable: false,
            required: true,
        },
        email: {
            type: 'email',
            minLength: 6,
            configurable: false,
            required: true,
        },
        provider: {
            type: 'string',
            configurable: false,
        },
        password: {
            type: 'password',
            minLength: 6,
            configurable: false,
            private: true,
            searchable: false,
        },
        resetPasswordToken: {
            type: 'string',
            configurable: false,
            private: true,
            searchable: false,
        },
        otp: {
            type: 'number',
            configurable: false,
            private: true,
            searchable: false,
        },
        otpExpirationDate: {
            configurable: false,
            private: true,
            searchable: false,
            type: 'datetime',
        },
        confirmationToken: {
            type: 'string',
            configurable: false,
            private: true,
            searchable: false,
        },
        confirmed: {
            type: 'boolean',
            default: false,
            configurable: false,
        },
        blocked: {
            type: 'boolean',
            default: false,
            configurable: false,
        },
        role: {
            type: 'relation',
            relation: 'manyToOne',
            target: 'plugin::users-permissions.role',
            inversedBy: 'users',
            configurable: false,
        },
        otp: {
            type: 'relation',
            relation: 'oneToMany',
            target: 'plugin::users-permissions.otp',
            mappedBy: 'owner',
            configurable: false,
        },
    },
    config: schemaConfig,
};
