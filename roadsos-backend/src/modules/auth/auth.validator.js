const Joi = require('joi');
const { ROLES, LANGUAGES } = require('../../utils/constants');

const emergencyContact = Joi.object({ name: Joi.string().required(), phone: Joi.string().required(), relation: Joi.string().default('contact') });

module.exports = {
  register: { body: Joi.object({ name: Joi.string().min(2).required(), phone: Joi.string().required(), email: Joi.string().email().required(), password: Joi.string().min(8).required(), role: Joi.string().valid(...Object.values(ROLES)).required(), languagePreference: Joi.string().valid(...LANGUAGES).default('en'), emergencyContacts: Joi.array().items(emergencyContact).max(3).default([]), lat: Joi.number(), lng: Joi.number() }) },
  login: { body: Joi.object({ email: Joi.string().email().required(), password: Joi.string().required() }) },
  refresh: { body: Joi.object({ refreshToken: Joi.string().optional() }) },
  fcmToken: { body: Joi.object({ token: Joi.string().required() }) },
  forgotPassword: { body: Joi.object({ phone: Joi.string().required(), email: Joi.string().email().optional() }) },
  resetPassword: { body: Joi.object({ phone: Joi.string().required(), otp: Joi.string().length(6).required(), password: Joi.string().min(8).required() }) }
};
