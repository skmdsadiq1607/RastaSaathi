const express = require('express');
const controller = require('./alerts.controller');
const validator = require('./alerts.validator');
const validate = require('../../middleware/validate.middleware');
const { requireAuth } = require('../../middleware/auth.middleware');
const router = express.Router();
router.get('/', requireAuth, validate(validator.list), controller.list);
module.exports = router;
