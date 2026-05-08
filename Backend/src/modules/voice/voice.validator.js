const Joi = require('joi');

module.exports = {
  trigger: { body: Joi.object({ transcript: Joi.string().allow('').optional(), lat: Joi.number().optional(), lng: Joi.number().optional(), language: Joi.string().valid('en', 'hi', 'ta', 'te', 'kn').default('en') }) },
  cancel: { body: Joi.object({ voiceEventId: Joi.string().required() }) }
};
