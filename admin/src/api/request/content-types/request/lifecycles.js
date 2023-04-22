module.exports = {
    async afterUpdate(event) {
        const { result, params } = event;
        const entry = await strapi.entityService.findOne('api::request.request', result.id, {
            populate: { author: true },
        });

        if (["ACCEPTED", "REJECTED"].includes(entry.status)) {
            await strapi.plugins["email"].services.email.send({
                to: entry.author.email,
                subject: 'Status of your request',
                text: `The status of your request #${entry.id} - ${entry.title} was updated to ${entry.status}`
            });
        }

    }
};
