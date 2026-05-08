const dashboardService = require('./dashboard.service');
const { sendSuccess } = require('../../utils/responseFormatter');
const wrap = (handler) => async (req, res, next) => { try { await handler(req, res, next); } catch (error) { next(error); } };
exports.live = wrap(async (_req, res) => sendSuccess(res, await dashboardService.liveIncidents(), 'Live incidents loaded'));
exports.stats = wrap(async (_req, res) => sendSuccess(res, await dashboardService.stats(), 'Dashboard stats loaded'));
exports.feed = wrap(async (_req, res) => sendSuccess(res, await dashboardService.liveFeed(), 'Live feed loaded'));
exports.assign = wrap(async (req, res) => sendSuccess(res, await dashboardService.assign(req.params.id, req.body.responderId || req.user.id), 'Incident assigned'));
exports.resolve = wrap(async (req, res) => sendSuccess(res, await dashboardService.resolve(req.params.id, req.user.id, req.body.outcome || 'resolved'), 'Incident resolved'));
exports.escalate = wrap(async (req, res) => sendSuccess(res, await dashboardService.escalate(req.params.id, req.user.id, req.body.reason || 'Control room escalation'), 'Incident escalated'));
