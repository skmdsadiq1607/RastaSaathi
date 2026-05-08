const FallbackMessage = require('./fallback.model');
const Incident = require('../incident/incident.model');
const User = require('../auth/auth.model');
const Workflow = require('../workflow/workflow.model');
const smsService = require('../../services/sms.service');
const timelineService = require('../timeline/timeline.service');
const { fromPoint } = require('../../utils/geoUtils');
const { AppError } = require('../../utils/responseFormatter');

function encodeSms({ incident, hospitalName = 'Pending', eta = 'Pending' }) {
  const location = fromPoint(incident.location);
  return 'SOS|' + location.lat.toFixed(5) + ',' + location.lng.toFixed(5) + '|' + incident.severity.level + '|' + hospitalName + '|' + eta;
}

async function activateFallback({ incidentId, reason = 'Network or workflow timeout' }) {
  const incident = await Incident.findById(incidentId).populate('victim selectedHospital');
  if (!incident) throw new AppError('Incident not found', 404, 'INCIDENT_NOT_FOUND');
  const responders = await User.find({ role: 'responder', responderStatus: { $ne: 'OFFLINE' } }).limit(5);
  const recipients = [...(incident.victim.emergencyContacts || []).map((contact) => contact.phone), ...responders.map((responder) => responder.phone)].filter(Boolean);
  const body = encodeSms({ incident, hospitalName: incident.selectedHospital ? incident.selectedHospital.name : 'Pending', eta: incident.route.etaSeconds ? Math.ceil(incident.route.etaSeconds / 60) + 'min' : 'Pending' });
  const logs = [];
  for (const phone of [...new Set(recipients)]) {
    const result = await smsService.sendSms(phone, body);
    logs.push(await FallbackMessage.create({ incident: incidentId, phone, direction: 'OUTBOUND', body, parsedCommand: 'SOS', status: result.status === 'SENT' ? 'SENT' : 'FAILED', providerMessageId: result.providerMessageId, metadata: { reason, error: result.error } }));
  }
  await Workflow.findOneAndUpdate({ incident: incidentId }, { fallbackActive: true, fallbackReason: reason });
  await timelineService.appendEvent({ incidentId, eventType: 'fallback:activated', description: 'Low-network SMS fallback activated: ' + reason, metadata: { recipients: logs.length } });
  return { body, logs };
}

async function parseResponderSms({ from, body, messageSid }) {
  const clean = String(body || '').trim().toUpperCase();
  const [command, incidentId] = clean.split('|');
  const parsedCommand = command === 'ACCEPT' || command === 'REJECT' ? command : 'UNKNOWN';
  const log = await FallbackMessage.create({ incident: incidentId, phone: from, direction: 'INBOUND', body, parsedCommand, status: 'RECEIVED', providerMessageId: messageSid });
  if (parsedCommand === 'UNKNOWN') return { log, action: 'ignored' };
  const responder = await User.findOne({ phone: from, role: 'responder' });
  if (parsedCommand === 'ACCEPT' && responder) {
    const incidentService = require('../incident/incident.service');
    await incidentService.assignIncident(incidentId, responder._id);
  }
  if (parsedCommand === 'REJECT') {
    await timelineService.appendEvent({ incidentId, eventType: 'responder:rejected', description: 'Responder rejected incident via SMS', actor: from });
  }
  return { log, action: parsedCommand.toLowerCase() };
}

async function listFallbackMessages(incidentId) {
  return FallbackMessage.find({ incident: incidentId }).sort({ createdAt: 1 });
}

module.exports = { activateFallback, parseResponderSms, listFallbackMessages, encodeSms };
