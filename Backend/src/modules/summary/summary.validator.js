const Joi = require('joi');

module.exports = {
  generate: { body: Joi.object({ incidentId: Joi.string().required() }) },
  get: { params: Joi.object({ incidentId: Joi.string().required() }) }
};
