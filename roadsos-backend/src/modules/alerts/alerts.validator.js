const Joi = require('joi');

module.exports = {
  list: { query: Joi.object({ incidentId: Joi.string().optional(), channel: Joi.string().valid('FCM', 'SMS', 'SOCKET').optional() }) }
};
