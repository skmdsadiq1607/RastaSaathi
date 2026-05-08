const Joi = require('joi');

module.exports = {
  guide: { body: Joi.object({ incidentId: Joi.string().optional(), injuryType: Joi.string().required(), severityLevel: Joi.string().valid('CRITICAL', 'HIGH', 'MEDIUM', 'LOW').required(), resourcesAvailable: Joi.array().items(Joi.string()).default([]), language: Joi.string().valid('en', 'hi', 'ta', 'te', 'kn').default('en') }) },
  followup: { body: Joi.object({ sessionId: Joi.string().required(), question: Joi.string().min(1).required() }) }
};
