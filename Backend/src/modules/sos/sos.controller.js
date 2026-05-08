const sosService = require('./sos.service');
const { sendSuccess } = require('../../utils/responseFormatter');
const wrap = (handler) => async (req, res, next) => { try { await handler(req, res, next); } catch (error) { next(error); } };
exports.trigger = wrap(async (req, res) => { const userId = req.body.userId || req.user.id; const data = await sosService.triggerSos({ ...req.body, userId }); sendSuccess(res, data, 'SOS triggered', 201); });
exports.cancel = wrap(async (req, res) => { const data = await sosService.cancelSos(req.params.id, req.user.id); sendSuccess(res, data, 'SOS cancelled'); });
exports.history = wrap(async (req, res) => { const data = await sosService.history(req.user.id, req.query); sendSuccess(res, data, 'SOS history loaded'); });
