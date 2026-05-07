const Joi = require('joi');

module.exports = {
  update: { body: Joi.object({ hospitalId: Joi.string().required(), icuBeds: Joi.number().min(0).required(), ventilators: Joi.number().min(0).required(), bloodUnits: Joi.object({ A: Joi.number().min(0).default(0), B: Joi.number().min(0).default(0), O: Joi.number().min(0).default(0), AB: Joi.number().min(0).default(0) }).required(), ambulancesAvailable: Joi.number().min(0).required(), traumaTeamOnDuty: Joi.boolean().required() }) },
  match: { query: Joi.object({ lat: Joi.number().required(), lng: Joi.number().required(), severityLevel: Joi.string().valid('CRITICAL', 'HIGH', 'MEDIUM', 'LOW').required(), requiredSpecialty: Joi.string().allow('').optional() }) }
};
