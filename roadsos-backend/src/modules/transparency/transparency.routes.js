const express = require('express');
const Joi = require('joi');
const controller = require('./transparency.controller');
const validate = require('../../middleware/validate.middleware');
const { requireAuth } = require('../../middleware/auth.middleware');
const router = express.Router();
router.get('/:incidentId', requireAuth, validate({ params: Joi.object({ incidentId: Joi.string().required() }) }), controller.get);
module.exports = router;
