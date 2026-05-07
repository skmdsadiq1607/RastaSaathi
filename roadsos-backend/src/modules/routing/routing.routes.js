const express = require('express');
const controller = require('./routing.controller');
const validator = require('./routing.validator');
const validate = require('../../middleware/validate.middleware');
const { requireAuth } = require('../../middleware/auth.middleware');
const router = express.Router();
router.post('/calculate', requireAuth, validate(validator.calculate), controller.calculate);
module.exports = router;
