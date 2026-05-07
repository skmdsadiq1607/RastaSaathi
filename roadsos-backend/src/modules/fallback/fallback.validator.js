const Joi = require('joi');

module.exports = {
  webhook: { body: Joi.object({ From: Joi.string().required(), Body: Joi.string().required(), MessageSid: Joi.string().optional() }).unknown(true) }
};
