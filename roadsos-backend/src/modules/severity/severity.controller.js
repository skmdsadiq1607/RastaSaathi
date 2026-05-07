const severityService = require('./severity.service');
const { sendSuccess } = require('../../utils/responseFormatter');
const wrap = (handler) => async (req, res, next) => { try { await handler(req, res, next); } catch (error) { next(error); } };
exports.predict = wrap(async (req, res) => sendSuccess(res, await severityService.predictSeverity(req.body), 'Severity predicted', 201));
