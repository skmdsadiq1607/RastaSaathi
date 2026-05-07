const fallbackService = require('./fallback.service');
const { sendSuccess } = require('../../utils/responseFormatter');
const wrap = (handler) => async (req, res, next) => { try { await handler(req, res, next); } catch (error) { next(error); } };
exports.webhook = wrap(async (req, res) => { const result = await fallbackService.parseResponderSms({ from: req.body.From, body: req.body.Body, messageSid: req.body.MessageSid }); res.type('text/xml').send('<Response><Message>RoadSoS received ' + result.action + '</Message></Response>'); });
exports.messages = wrap(async (req, res) => sendSuccess(res, await fallbackService.listFallbackMessages(req.params.incidentId), 'Fallback messages loaded'));
