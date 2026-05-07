const Joi = require('joi');

module.exports = {
  status: { params: Joi.object({ incidentId: Joi.string().required() }) }
};
