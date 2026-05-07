const Joi = require('joi');

module.exports = { detect: { body: Joi.object({ text: Joi.string().min(1).required() }) } };
