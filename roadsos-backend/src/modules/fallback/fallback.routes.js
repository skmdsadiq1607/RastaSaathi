const express = require('express');
const controller = require('./fallback.controller');
const validator = require('./fallback.validator');
const validate = require('../../middleware/validate.middleware');
const { requireAuth } = require('../../middleware/auth.middleware');
const router = express.Router();
router.post('/sms/webhook', validate(validator.webhook), controller.webhook);
router.get('/:incidentId/messages', requireAuth, controller.messages);
module.exports = router;
