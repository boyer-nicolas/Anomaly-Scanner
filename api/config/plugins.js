module.exports = ({
  env
}) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: 'smtp.niwee.email',
        port: 465,
        secure: true,
        auth: {
          user: 'no-reply@niwee.fr',
          pass: env('SMTP_PASSWORD'),
        },
        rejectUnauthorized: true,
        requireTLS: true,
        connectionTimeout: 5000,
      },
      settings: {
        defaultFrom: 'no-reply@niwee.fr',
        defaultReplyTo: 'support@niwee.fr',
      },
    }
  },
  redis: {
    config: {
      connections: {
        default: {
          connection: {
            host: 'dragonfly',
            port: 6379,
            db: 0,
          },
          settings: {
            debug: false,
          },
        },
      },
    },
  },
})
