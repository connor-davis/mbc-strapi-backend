const path = require("path");

module.exports = {
  async afterUpdate(event) {
    const { result } = event;

    try {
      const newsletter = await strapi.db.query("api::news-letter.news-letter").findOne({ where: { id: result.id }, populate: true });
      const unsubscribedEmails = await strapi.db.query("api::unsubscribed-email.unsubscribed-email").findMany();
      const dontSendToThese = unsubscribedEmails.map((data) => data.email);

      if (result.publishedAt && !result.emailed) {
        console.log("News letter has not been emailed. Performing bulk email.");

        const startTime = Date.now();

        const users = await strapi.db
          .query("plugin::users-permissions.user")
          .findMany({
            where: {
              blocked: false,
              email: {
                $notIn: [...dontSendToThese],
              },
              user_types: {
                userType: [...newsletter.user_types.map((type) => type.userType)],
              },
            },
            populate: true,
          });

        users.map(async (user) => {
          let content = result.Content;

          content = content.replace("{firstName}", user.firstName);
          content = content.replace("{unsubscribe}", "<a href=\"https://mountainbackpackers-club.co.za/unsubscribe?email=" + user.email + "\" style=\"text-decoration:none;color:#ea580c;\">Unsubscribe</a>")

          await strapi.plugins["email"].services.email.send({
            to: user.email,
            from: "info@mountainbackpackers-club.co.za",
            replyTo: result.replyTo,
            subject: result.Subject,
            html: content,
            attachments: result.hasAttachments ? [
              ...result.attachments.map((attachment) => {
                return {
                  filename: attachment.name,
                  path: path.join(process.cwd(), "public", attachment.url),
                  cid: attachment.hash,
                }
              })
            ] : []
          });
        });

        await strapi.entityService.update(
          "api::news-letter.news-letter",
          result.id,
          {
            data: {
              emailed: true,
            },
          }
        );

        const endTime = Date.now();

        const timeTaken = endTime - startTime;

        console.log("Bulk email took " + timeTaken + " ms.");
      }
    } catch (error) {
      console.log(error);
    }
  },
};
