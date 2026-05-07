const routingService = require('./routing.service');
const { sendSuccess } = require('../../utils/responseFormatter');
const wrap = (handler) => async (req, res, next) => { try { await handler(req, res, next); } catch (error) { next(error); } };
exports.calculate = wrap(async (req, res) => sendSuccess(res, await routingService.calculateRoute(req.body), 'Route calculated', 201));
