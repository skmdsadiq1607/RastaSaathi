const summaryService = require('./summary.service');
const { sendSuccess } = require('../../utils/responseFormatter');
const wrap = (handler) => async (req, res, next) => { try { await handler(req, res, next); } catch (error) { next(error); } };
exports.generate = wrap(async (req, res) => sendSuccess(res, await summaryService.generateSummary(req.body), 'Summary generated', 201));
exports.get = wrap(async (req, res) => sendSuccess(res, await summaryService.getSummary(req.params.incidentId), 'Summary loaded'));
