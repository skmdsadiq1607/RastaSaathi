const express = require('express');
const controller = require('./workflow.controller');
const validator = require('./workflow.validator');
const validate = require('../../middleware/validate.middleware');
const { requireAuth } = require('../../middleware/auth.middleware');
const router = express.Router();
router.get('/:incidentId/status', requireAuth, validate(validator.status), controller.status);
module.exports = router;
