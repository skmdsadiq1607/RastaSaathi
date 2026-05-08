const Joi = require('joi');

module.exports = {
  select: { body: Joi.object({ incidentId: Joi.string().optional(), lat: Joi.number().required(), lng: Joi.number().required(), severityLevel: Joi.string().valid('CRITICAL', 'HIGH', 'MEDIUM', 'LOW').required(), injuryType: Joi.string().default('unknown'), requiredSpecialty: Joi.string().allow('').optional() }) },
  id: { params: Joi.object({ id: Joi.string().required() }) }
};
