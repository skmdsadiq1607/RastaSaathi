const express = require('express');
const controller = require('./summary.controller');
const validator = require('./summary.validator');
const validate = require('../../middleware/validate.middleware');
const { requireAuth } = require('../../middleware/auth.middleware');
const router = express.Router();
router.post('/generate', requireAuth, validate(validator.generate), controller.generate);
router.get('/:incidentId', requireAuth, validate(validator.get), controller.get);
module.exports = router;
