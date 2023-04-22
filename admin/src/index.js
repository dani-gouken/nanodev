'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap(/*{ strapi }*/) {
    const plugin = await strapi.plugins["users-permissions"];
    const roleService = plugin.services["role"];
    const store = strapi.store({ type: 'plugin', name: 'users-permissions' });

    const roles = await roleService.find();
    const hasCitizenRole = roles.filter((e) => e.name == "citizen").length != 0
    const hasAdministratorRole = roles.filter((e) => e.type == "administrator").length != 0
    let config = await store.get({ key: 'advanced' });


    if (!hasCitizenRole && !hasAdministratorRole) {
      await roleService.createRole({
        name: 'Citizen',
        description: 'Citizen role',
        type: 'citizen',
      })
      await roleService.createRole({
        name: 'Administrator',
        description: 'Administrator role',
        type: 'administrator',
      })

      let config = await store.get({ key: 'advanced' });
      config = !config ? {
        unique_email: true,
        allow_register: true,
        email_confirmation: false,
        email_reset_password: null,
        email_confirmation_redirection: null,
        default_role: 'citizen',
      } : {
        ...config,
        default_role: "citizen"
      };
      await store.set({ key: 'advanced', value: config });
    }

    const categoriesCount = await strapi.entityService.count('api::category.category');
    if (categoriesCount == 0) {
      await strapi.entityService.create('api::category.category', {
        data: {
          name: 'Public transports',
        }
      })

      await strapi.entityService.create('api::category.category', {
        data: {
          name: 'Security',
        }
      })
    }
  },
};
