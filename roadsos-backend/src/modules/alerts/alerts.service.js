const Alert = require('./alerts.model');
const Incident = require('../incident/incident.model');
const User = require('../auth/auth.model');
const DashboardEvent = require('../dashboard/dashboard.model');
const smsService = require('../../services/sms.service');
const notificationService = require('../../services/notification.service');
const timelineService = require('../timeline/timeline.service');
const { getIO } = require('../../config/socket');
const { toPoint } = require('../../utils/geoUtils');

const templates = {
  en: 'RoadSoS emergency: accident at {lat},{lng}. Severity: {severity}. Incident: {incidentId}.',
  hi: 'RoadSoS आपातकाल: {lat},{lng} पर दुर्घटना। गंभीरता: {severity}. घटना: {incidentId}.',
  ta: 'RoadSoS அவசரம்: {lat},{lng} விபத்து. தீவிரம்: {severity}. சம்பவம்: {incidentId}.',
  te: 'RoadSoS అత్యవసరం: {lat},{lng} వద్ద ప్రమాదం. తీవ్రత: {severity}. ఘటన: {incidentId}.',
  kn: 'RoadSoS ತುರ್ತು: {lat},{lng} ನಲ್ಲಿ ಅಪಘಾತ. ತೀವ್ರತೆ: {severity}. ಘಟನೆ: {incidentId}.'
};

function formatTemplate(language, data) {
  const template = templates[language] || templates.en;
  return template.replace('{lat}', data.lat).replace('{lng}', data.lng).replace('{severity}', data.severity).replace('{incidentId}', data.incidentId);
}

async function nearestResponders(location) {
  const point = toPoint(location.lat, location.lng);
  let responders = await User.find({ role: 'responder', responderStatus: { $ne: 'OFFLINE' }, location: { $near: { $geometry: point, $maxDistance: 30000 } } }).limit(5);
  if (!responders.length) responders = await User.find({ role: 'responder', responderStatus: { $ne: 'OFFLINE' } }).limit(5);
  return responders;
}

async function dispatchAlerts({ incidentId }) {
  const incident = await Incident.findById(incidentId).populate('victim selectedHospital');
  const location = { lat: incident.location.coordinates[1], lng: incident.location.coordinates[0] };
  const victim = incident.victim;
  const language = victim.languagePreference || 'en';
  const message = formatTemplate(language, { ...location, severity: incident.severity.level, incidentId });
  const responders = await nearestResponders(location);
  const alerts = [];
  for (const responder of responders) {
    const push = await notificationService.sendToTokens(responder.fcmTokens, {
      notification: { title: 'RoadSoS Emergency', body: message },
      data: { incidentId: String(incidentId), severity: incident.severity.level }
    });
    alerts.push(await Alert.create({ incident: incidentId, recipientUser: responder._id, channel: 'FCM', status: push.failureCount ? 'FAILED' : 'SENT', language, message, metadata: { push } }));
  }
  for (const contact of victim.emergencyContacts || []) {
    const sms = await smsService.sendSms(contact.phone, message);
    alerts.push(await Alert.create({ incident: incidentId, recipientPhone: contact.phone, channel: 'SMS', status: sms.status === 'SENT' ? 'SENT' : 'FAILED', language, message, providerMessageId: sms.providerMessageId, deliveryError: sms.error }));
  }
  const io = getIO();
  if (io) {
    io.of('/dashboard').to('dashboard').emit('sos:created', { incidentId, severity: incident.severity, location });
    io.of('/emergency').to(String(incidentId)).emit('alert:dispatched', { count: alerts.length });
  }
  await DashboardEvent.create({ incident: incidentId, eventType: 'alert:dispatched', message: 'Emergency alerts dispatched to responders and contacts', severityLevel: incident.severity.level, metadata: { alerts: alerts.length } });
  await timelineService.appendEvent({ incidentId, eventType: 'alert:dispatched', description: 'Alerts dispatched across FCM, SMS, and dashboard', metadata: { count: alerts.length } });
  return alerts;
}

async function listAlerts(filter = {}) {
  const query = {};
  if (filter.incidentId) query.incident = filter.incidentId;
  if (filter.channel) query.channel = filter.channel;
  return Alert.find(query).sort({ createdAt: -1 });
}

module.exports = { dispatchAlerts, listAlerts, nearestResponders, formatTemplate };
