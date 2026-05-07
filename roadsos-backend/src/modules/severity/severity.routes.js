const express = require('express');
const controller = require('./severity.controller');
const validator = require('./severity.validator');
const validate = require('../../middleware/validate.middleware');
const { requireAuth } = require('../../middleware/auth.middleware');
const router = express.Router();
router.post('/predict', requireAuth, validate(validator.predict), controller.predict);
module.exports = router;
