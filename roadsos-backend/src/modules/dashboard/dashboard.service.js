const Incident = require('../incident/incident.model');
const DashboardEvent = require('./dashboard.model');
const incidentService = require('../incident/incident.service');
const { INCIDENT_STATUS } = require('../../utils/constants');

async function liveIncidents() {
  return Incident.find({ status: { $nin: [INCIDENT_STATUS.RESOLVED, INCIDENT_STATUS.CANCELLED] } }).populate('victim responder selectedHospital').sort({ createdAt: -1 });
}

async function stats() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const incidents = await Incident.find({ createdAt: { $gte: start } });
  const total = incidents.length;
  const resolved = incidents.filter((item) => item.status === INCIDENT_STATUS.RESOLVED).length;
  const bySeverity = incidents.reduce((acc, item) => {
    const key = item.severity.level;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const responseTimes = incidents.filter((item) => item.resolvedAt).map((item) => (item.resolvedAt - item.createdAt) / 1000);
  const avgResponseTime = responseTimes.length ? Math.round(responseTimes.reduce((sum, value) => sum + value, 0) / responseTimes.length) : 0;
  return { totalSOS: total, activeSOS: incidents.filter((item) => item.status !== INCIDENT_STATUS.RESOLVED).length, criticalCases: bySeverity.CRITICAL || 0, bySeverity, avgResponseTime, resolutionRate: total ? Math.round((resolved / total) * 100) : 0, resolvedToday: resolved };
}

async function liveFeed() {
  return DashboardEvent.find().sort({ createdAt: -1 }).limit(50);
}

async function assign(id, responderId) {
  return incidentService.assignIncident(id, responderId);
}

async function resolve(id, actorId, outcome) {
  return incidentService.resolveIncident(id, actorId, outcome);
}

async function escalate(id, actorId, reason) {
  return incidentService.escalateIncident(id, actorId, reason);
}

module.exports = { liveIncidents, stats, liveFeed, assign, resolve, escalate };
