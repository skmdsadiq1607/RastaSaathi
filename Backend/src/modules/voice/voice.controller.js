const voiceService = require('./voice.service');
const { sendSuccess } = require('../../utils/responseFormatter');
const wrap = (handler) => async (req, res, next) => { try { await handler(req, res, next); } catch (error) { next(error); } };
function coords(req) { return { lat: Number(req.headers['x-gps-lat'] || req.body.lat), lng: Number(req.headers['x-gps-lng'] || req.body.lng) }; }
exports.trigger = wrap(async (req, res) => { const data = await voiceService.processVoice({ userId: req.user.id, transcript: req.body.transcript, language: req.body.language, ...coords(req) }); sendSuccess(res, data, 'Voice processed'); });
exports.stream = wrap(async (req, res) => { const data = await voiceService.processVoice({ userId: req.user.id, buffer: req.file ? req.file.buffer : undefined, mimeType: req.file ? req.file.mimetype : undefined, language: req.body.language || 'en', ...coords(req) }); sendSuccess(res, data, 'Voice stream processed'); });
exports.cancel = wrap(async (req, res) => sendSuccess(res, await voiceService.cancelVoice({ voiceEventId: req.body.voiceEventId, userId: req.user.id }), 'Voice SOS cancelled'));
