const env = require('../../config/env');
const authService = require('./auth.service');
const { extractToken } = require('../../middleware/auth.middleware');
const { sendSuccess } = require('../../utils/responseFormatter');

const cookieOptions = { httpOnly: true, secure: env.isProduction, sameSite: 'strict', path: '/' };
const wrap = (handler) => async (req, res, next) => { try { await handler(req, res, next); } catch (error) { next(error); } };

function setCookies(res, tokens) {
  res.cookie('refreshToken', tokens.refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.cookie('accessToken', tokens.accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
}

exports.register = wrap(async (req, res) => { const data = await authService.register(req.body); setCookies(res, data); sendSuccess(res, data, 'Registration successful', 201); });
exports.login = wrap(async (req, res) => { const data = await authService.login(req.body); setCookies(res, data); sendSuccess(res, data, 'Login successful'); });
exports.refresh = wrap(async (req, res) => { const token = req.cookies.refreshToken || req.body.refreshToken; const data = await authService.refresh(token); setCookies(res, data); sendSuccess(res, data, 'Token refreshed'); });
exports.logout = wrap(async (req, res) => { const data = await authService.logout(req.user.id, extractToken(req)); res.clearCookie('refreshToken', cookieOptions); res.clearCookie('accessToken', cookieOptions); sendSuccess(res, data, 'Logout successful'); });
exports.me = wrap(async (req, res) => { const user = await authService.getProfile(req.user.id); sendSuccess(res, { user }, 'Profile loaded'); });
exports.fcmToken = wrap(async (req, res) => { const user = await authService.attachFcmToken(req.user.id, req.body.token); sendSuccess(res, { user }, 'FCM token saved'); });
exports.forgotPassword = wrap(async (req, res) => { const data = await authService.requestPasswordReset(req.body); sendSuccess(res, data, 'OTP processed'); });
exports.resetPassword = wrap(async (req, res) => { const data = await authService.resetPassword(req.body); sendSuccess(res, data, 'Password reset successful'); });
