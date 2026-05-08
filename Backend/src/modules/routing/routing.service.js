const Routing = require('./routing.model');
const Incident = require('../incident/incident.model');
const mapsService = require('../../services/maps.service');
const transparencyService = require('../transparency/transparency.service');
const timelineService = require('../timeline/timeline.service');
const { getIO } = require('../../config/socket');
const { toPoint } = require('../../utils/geoUtils');

const etaTimers = new Map();

function emitEta(incidentId, payload) {
  const io = getIO();
  if (io && incidentId) io.of('/emergency').to(String(incidentId)).emit('eta:update', payload);
}

function startEtaUpdates(incidentId, origin, destination, severityLevel) {
  if (!incidentId || etaTimers.has(String(incidentId))) return;
  const timer = setInterval(async () => {
    const matrix = await mapsService.getDistanceMatrix(origin, destination, severityLevel);
    emitEta(incidentId, matrix);
  }, 30000);
  etaTimers.set(String(incidentId), timer);
}

function stopEtaUpdates(incidentId) {
  const timer = etaTimers.get(String(incidentId));
  if (timer) clearInterval(timer);
  etaTimers.delete(String(incidentId));
}

async function calculateRoute(payload) {
  const route = await mapsService.getDirections(payload.origin, payload.destination, payload.severityLevel);
  const routing = await Routing.create({
    incident: payload.incidentId,
    origin: toPoint(payload.origin.lat, payload.origin.lng),
    destination: toPoint(payload.destination.lat, payload.destination.lng),
    severityLevel: payload.severityLevel,
    polyline: route.polyline,
    etaSeconds: route.etaSeconds,
    distanceMeters: route.distanceMeters,
    alternateRoutes: route.alternateRoutes,
    routingMode: payload.severityLevel === 'CRITICAL' ? 'SEVERITY_AWARE' : 'STANDARD'
  });
  if (payload.incidentId) {
    await Incident.findByIdAndUpdate(payload.incidentId, { route: { etaSeconds: route.etaSeconds, distanceMeters: route.distanceMeters, polyline: route.polyline } });
    await transparencyService.recordDecision({ incident: payload.incidentId, decisionType: 'ROUTING', inputPayload: payload, outputPayload: route, confidenceScore: route.source === 'google-directions' ? 0.95 : 0.72, modelUsed: route.source, reasoning: payload.severityLevel === 'CRITICAL' ? 'Critical routing avoids tolls and prioritizes fastest emergency transfer.' : 'Standard emergency routing selected fastest available driving path.' });
    await timelineService.appendEvent({ incidentId: payload.incidentId, eventType: 'routing:calculated', description: 'Route calculated with ETA ' + route.etaSeconds + ' seconds', metadata: route });
    emitEta(payload.incidentId, route);
    startEtaUpdates(payload.incidentId, payload.origin, payload.destination, payload.severityLevel);
  }
  return { id: routing.id, ...route };
}

module.exports = { calculateRoute, startEtaUpdates, stopEtaUpdates };
