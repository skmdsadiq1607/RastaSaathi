const alertsService = require('./alerts.service');
const { sendSuccess } = require('../../utils/responseFormatter');
const wrap = (handler) => async (req, res, next) => { try { await handler(req, res, next); } catch (error) { next(error); } };
exports.list = wrap(async (req, res) => sendSuccess(res, await alertsService.listAlerts(req.query), 'Alerts loaded'));
