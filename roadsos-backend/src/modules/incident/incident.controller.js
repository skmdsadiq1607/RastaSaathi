const incidentService = require('./incident.service');
const { sendSuccess } = require('../../utils/responseFormatter');
const wrap = (handler) => async (req, res, next) => { try { await handler(req, res, next); } catch (error) { next(error); } };
exports.get = wrap(async (req, res) => sendSuccess(res, await incidentService.getIncident(req.params.id), 'Incident loaded'));
exports.list = wrap(async (req, res) => sendSuccess(res, await incidentService.listIncidents(req.query), 'Incidents loaded'));
exports.arrived = wrap(async (req, res) => sendSuccess(res, await incidentService.markArrived(req.params.id, req.user.id), 'Arrival recorded'));
