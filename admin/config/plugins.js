module.exports = ({ env }) => ({
    email: {
        config: {
            provider: 'nodemailer',
            providerOptions: {
                host: env('SMTP_HOST', 'localhost'),
                port: env('SMTP_PORT', 1025),
            },
            settings: {
                defaultFrom: env("MAILER_FROM", 'noreply@nanocity.com'),
            },
        },
    },
})
