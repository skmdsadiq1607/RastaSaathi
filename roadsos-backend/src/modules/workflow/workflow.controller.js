const workflowService = require('./workflow.service');
const { sendSuccess } = require('../../utils/responseFormatter');
const wrap = (handler) => async (req, res, next) => { try { await handler(req, res, next); } catch (error) { next(error); } };
exports.status = wrap(async (req, res) => sendSuccess(res, await workflowService.getStatus(req.params.incidentId), 'Workflow status loaded'));
