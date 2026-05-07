const express = require('express');
const controller = require('./firstaid.controller');
const validator = require('./firstaid.validator');
const validate = require('../../middleware/validate.middleware');
const { requireAuth } = require('../../middleware/auth.middleware');
const router = express.Router();
router.post('/guide', requireAuth, validate(validator.guide), controller.guide);
router.post('/followup', requireAuth, validate(validator.followup), controller.followup);
module.exports = router;
