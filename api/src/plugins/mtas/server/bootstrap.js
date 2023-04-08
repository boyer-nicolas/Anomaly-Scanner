'use strict';

module.exports = ({ strapi }) =>
{
  // Create new email template
  strapi.plugins['email'].services.email.addTemplate({
    name: 'mtas',
    subject: 'MTAS',
    text: 'MTAS',
    html: 'MTAS'
  });
};
