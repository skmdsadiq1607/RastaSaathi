const transparencyService = require('./transparency.service');
const { sendSuccess } = require('../../utils/responseFormatter');
const wrap = (handler) => async (req, res, next) => { try { await handler(req, res, next); } catch (error) { next(error); } };
exports.get = wrap(async (req, res) => sendSuccess(res, await transparencyService.getIncidentDecisions(req.params.incidentId), 'AI decision log loaded'));
