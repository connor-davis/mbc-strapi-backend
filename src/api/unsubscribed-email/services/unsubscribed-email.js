'use strict';

/**
 * unsubscribed-email service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::unsubscribed-email.unsubscribed-email');
