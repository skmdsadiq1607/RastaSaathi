const Joi = require('joi');

const location = Joi.object({ lat: Joi.number().required(), lng: Joi.number().required() });
module.exports = {
  calculate: { body: Joi.object({ incidentId: Joi.string().optional(), origin: location.required(), destination: location.required(), severityLevel: Joi.string().valid('CRITICAL', 'HIGH', 'MEDIUM', 'LOW').required() }) }
};
