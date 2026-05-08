const Joi = require('joi');

module.exports = {
  predict: { body: Joi.object({ incidentId: Joi.string().optional(), speed: Joi.number().min(0).default(0), impactForce: Joi.number().min(0).default(0), vehicleType: Joi.string().default('two-wheeler'), injuryDescription: Joi.string().allow('').default(''), consciousnessLevel: Joi.string().default('conscious'), age: Joi.number().min(0).max(120).default(30) }) }
};
