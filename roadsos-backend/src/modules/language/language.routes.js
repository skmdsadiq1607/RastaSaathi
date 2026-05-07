const express = require('express');
const Joi = require('joi');
const controller = require('./language.controller');
const validator = require('./language.validator');
const validate = require('../../middleware/validate.middleware');
const router = express.Router();
router.post('/detect', validate(validator.detect), controller.detect);
router.get('/locales/:language', validate({ params: Joi.object({ language: Joi.string().valid('en', 'hi', 'ta', 'te', 'kn').required() }) }), controller.locale);
module.exports = router;
