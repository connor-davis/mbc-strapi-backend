module.exports = ({ env }) => ({
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: env("SMTP_HOST", "bl7n8.zadns.co.za"),
        port: env("SMTP_PORT", 25),
        secure: false,
        auth: {
          user: env("SMTP_USERNAME"),
          pass: env("SMTP_PASSWORD"),
        },
        logger: true,
      },
      settings: {
        defaultFrom: "no-reply@mountainbackpackers-club.co.za",
        defaultReplyTo: "no-reply@mountainbackpackers-club.co.za",
      },
    },
  },
  ckeditor: {
    enabled: true,
    resolve: "./src/plugins/strapi-plugin-ckeditor",
  },
});
