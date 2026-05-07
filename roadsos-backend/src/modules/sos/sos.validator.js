const Joi = require('joi');

module.exports = {
  trigger: { body: Joi.object({ lat: Joi.number().required(), lng: Joi.number().required(), userId: Joi.string().optional(), injuryType: Joi.string().default('unknown'), vehicleType: Joi.string().default('unknown'), source: Joi.string().valid('ONE_TAP', 'VOICE', 'AUTO_DETECTED', 'SMS_FALLBACK').default('ONE_TAP'), consciousnessLevel: Joi.string().default('conscious'), speed: Joi.number().default(0), impactForce: Joi.number().default(0), age: Joi.number().default(30) }) },
  cancel: { params: Joi.object({ id: Joi.string().required() }) },
  history: { query: Joi.object({ page: Joi.number().integer().min(1).default(1), limit: Joi.number().integer().min(1).max(50).default(10) }) }
};
