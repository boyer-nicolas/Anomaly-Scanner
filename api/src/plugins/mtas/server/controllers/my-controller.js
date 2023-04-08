'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('mtas')
      .service('myService')
      .getWelcomeMessage();
  },
});
