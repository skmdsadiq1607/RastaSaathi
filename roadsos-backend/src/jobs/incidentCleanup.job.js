const Incident = require('../modules/incident/incident.model');
const { INCIDENT_STATUS } = require('../utils/constants');

async function cleanupExpiredCountdowns() {
  return Incident.updateMany({ status: INCIDENT_STATUS.COUNTDOWN, countdownExpiresAt: { $lt: new Date(Date.now() - 60 * 1000) } }, { status: INCIDENT_STATUS.CANCELLED, outcome: 'countdown expired without confirmation' });
}

module.exports = { cleanupExpiredCountdowns };
