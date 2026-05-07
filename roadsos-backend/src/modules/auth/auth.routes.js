const express = require('express');
const controller = require('./auth.controller');
const validator = require('./auth.validator');
const validate = require('../../middleware/validate.middleware');
const { requireAuth } = require('../../middleware/auth.middleware');

const router = express.Router();
router.post('/register', validate(validator.register), controller.register);
router.post('/login', validate(validator.login), controller.login);
router.post('/refresh', validate(validator.refresh), controller.refresh);
router.post('/logout', requireAuth, controller.logout);
router.get('/me', requireAuth, controller.me);
router.post('/fcm-token', requireAuth, validate(validator.fcmToken), controller.fcmToken);
router.post('/forgot-password', validate(validator.forgotPassword), controller.forgotPassword);
router.post('/reset-password', validate(validator.resetPassword), controller.resetPassword);
module.exports = router;
