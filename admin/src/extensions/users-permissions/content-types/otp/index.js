const schemaConfig = require('./schema-config');

module.exports = {
    collectionName: 'up_otp',
    info: {
        name: 'otp',
        description: '',
        singularName: 'otp',
        pluralName: 'otp',
        displayName: 'OTP',
    },
    options: {
        draftAndPublish: false,
        timestamps: true,
    },
    attributes: {
        uuid: {
            type: 'string',
            configurable: false,
        },
        code: {
            type: 'integer',
            configurable: false,
            private: true,
            searchable: false,
        },
        expirationDate: {
            configurable: false,
            searchable: false,
            type: 'datetime',
        },
        owner: {
            type: 'relation',
            relation: 'manyToOne',
            target: 'plugin::users-permissions.user',
            inversedBy: 'otp',
        },
    },
    config: schemaConfig,
};
