const resourcesService = require('./resources.service');
const { sendSuccess } = require('../../utils/responseFormatter');
const wrap = (handler) => async (req, res, next) => { try { await handler(req, res, next); } catch (error) { next(error); } };
exports.update = wrap(async (req, res) => sendSuccess(res, await resourcesService.updateResources(req.body), 'Resources updated'));
exports.list = wrap(async (_req, res) => sendSuccess(res, await resourcesService.listResources(), 'Resources loaded'));
exports.match = wrap(async (req, res) => sendSuccess(res, await resourcesService.matchResources(req.query), 'Resource match loaded'));
