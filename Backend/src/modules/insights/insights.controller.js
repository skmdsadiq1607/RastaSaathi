const insightsService = require('./insights.service');
const { sendSuccess } = require('../../utils/responseFormatter');
const wrap = (handler) => async (req, res, next) => { try { await handler(req, res, next); } catch (error) { next(error); } };
exports.hotspots = wrap(async (req, res) => sendSuccess(res, await insightsService.hotspots(req.query.period), 'Hotspots loaded'));
exports.trends = wrap(async (req, res) => sendSuccess(res, await insightsService.trends(req.query.period), 'Trends loaded'));
