const TransparencyDecision = require('./transparency.model');

async function recordDecision(payload) {
  return TransparencyDecision.create(payload);
}

async function getIncidentDecisions(incidentId) {
  return TransparencyDecision.find({ incident: incidentId }).sort({ createdAt: 1 });
}

module.exports = { recordDecision, getIncidentDecisions };
