const Incident = require('./incident.model');
const User = require('../auth/auth.model');
const timelineService = require('../timeline/timeline.service');
const routingService = require('../routing/routing.service');
const { getIO } = require('../../config/socket');
const { INCIDENT_STATUS } = require('../../utils/constants');
const { AppError } = require('../../utils/responseFormatter');

function emitIncidentUpdate(incident) {
  const io = getIO();
  if (io) {
    io.of('/emergency').to(String(incident._id)).emit('sos:updated', incident);
    io.of('/dashboard').to('dashboard').emit('sos:updated', incident);
  }
}

async function getIncident(id) {
  const incident = await Incident.findById(id).populate('victim responder selectedHospital sos');
  if (!incident) throw new AppError('Incident not found', 404, 'INCIDENT_NOT_FOUND');
  return incident;
}

async function listIncidents(filter = {}) {
  const page = Number(filter.page || 1);
  const limit = Number(filter.limit || 25);
  const query = {};
  if (filter.status) query.status = filter.status;
  const [items, total] = await Promise.all([
    Incident.find(query).populate('victim responder selectedHospital').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Incident.countDocuments(query)
  ]);
  return { items, total, page, pages: Math.ceil(total / limit) };
}

async function assignIncident(incidentId, responderId) {
  const responder = await User.findById(responderId);
  if (!responder || responder.role !== 'responder') throw new AppError('Responder not found', 404, 'RESPONDER_NOT_FOUND');
  const incident = await Incident.findByIdAndUpdate(incidentId, { responder: responderId, status: INCIDENT_STATUS.RESPONDER_ASSIGNED }, { new: true }).populate('victim responder selectedHospital');
  if (!incident) throw new AppError('Incident not found', 404, 'INCIDENT_NOT_FOUND');
  await User.findByIdAndUpdate(responderId, { responderStatus: 'BUSY' });
  await timelineService.appendEvent({ incidentId, eventType: 'responder:assigned', description: 'Responder ' + responder.name + ' assigned', actor: String(responderId) });
  emitIncidentUpdate(incident);
  return incident;
}

async function markArrived(incidentId, responderId) {
  const incident = await Incident.findByIdAndUpdate(incidentId, { status: INCIDENT_STATUS.RESPONDER_ARRIVED }, { new: true }).populate('victim responder selectedHospital');
  if (!incident) throw new AppError('Incident not found', 404, 'INCIDENT_NOT_FOUND');
  await timelineService.appendEvent({ incidentId, eventType: 'responder:arrived', description: 'Responder arrived at scene', actor: String(responderId) });
  emitIncidentUpdate(incident);
  return incident;
}

async function resolveIncident(incidentId, actorId, outcome = 'resolved') {
  const incident = await Incident.findByIdAndUpdate(incidentId, { status: INCIDENT_STATUS.RESOLVED, outcome, resolvedAt: new Date() }, { new: true }).populate('victim responder selectedHospital');
  if (!incident) throw new AppError('Incident not found', 404, 'INCIDENT_NOT_FOUND');
  if (incident.responder) await User.findByIdAndUpdate(incident.responder, { responderStatus: 'AVAILABLE' });
  routingService.stopEtaUpdates(incidentId);
  await timelineService.appendEvent({ incidentId, eventType: 'incident:resolved', description: 'Incident resolved: ' + outcome, actor: String(actorId) });
  emitIncidentUpdate(incident);
  return incident;
}

async function escalateIncident(incidentId, actorId, reason = 'Manual escalation requested') {
  const incident = await Incident.findByIdAndUpdate(incidentId, { status: INCIDENT_STATUS.ESCALATED, 'severity.level': 'CRITICAL' }, { new: true }).populate('victim responder selectedHospital');
  if (!incident) throw new AppError('Incident not found', 404, 'INCIDENT_NOT_FOUND');
  await timelineService.appendEvent({ incidentId, eventType: 'incident:escalated', description: reason, actor: String(actorId) });
  emitIncidentUpdate(incident);
  return incident;
}

module.exports = { getIncident, listIncidents, assignIncident, markArrived, resolveIncident, escalateIncident };
