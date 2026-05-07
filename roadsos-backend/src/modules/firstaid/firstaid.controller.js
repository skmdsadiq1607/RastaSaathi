const firstAidService = require('./firstaid.service');
const { sendSuccess } = require('../../utils/responseFormatter');
const wrap = (handler) => async (req, res, next) => { try { await handler(req, res, next); } catch (error) { next(error); } };
exports.guide = wrap(async (req, res) => sendSuccess(res, await firstAidService.createGuide({ ...req.body, userId: req.user.id }), 'First aid guide ready', 201));
exports.followup = wrap(async (req, res) => sendSuccess(res, await firstAidService.followup(req.body), 'First aid answer ready'));
