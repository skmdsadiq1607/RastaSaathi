const bcrypt = require('bcryptjs');
const { connectDb, disconnectDb } = require('../src/config/db');
const User = require('../src/modules/auth/auth.model');
const Hospital = require('../src/modules/hospital/hospital.model');
const Incident = require('../src/modules/incident/incident.model');
const Sos = require('../src/modules/sos/sos.model');
const Workflow = require('../src/modules/workflow/workflow.model');
const TimelineEvent = require('../src/modules/timeline/timeline.model');
const { toPoint, calculateDistanceKm, estimateEtaSeconds } = require('../src/utils/geoUtils');
const logger = require('../src/utils/logger');

const locations = [
  [17.385, 78.4867, 'Charminar'], [17.4375, 78.4483, 'Begumpet'], [17.4504, 78.3805, 'HITEC City'], [17.4933, 78.3915, 'Kukatpally'], [17.3616, 78.4747, 'Falaknuma'], [17.4065, 78.4772, 'Koti'], [17.4284, 78.4575, 'Ameerpet'], [17.3992, 78.4764, 'Abids'], [17.4401, 78.3489, 'Gachibowli'], [17.3724, 78.4378, 'Mehdipatnam']
];
const severities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const injuries = ['head injury', 'fracture', 'bleeding', 'chest pain', 'minor bruises', 'spine pain'];

async function ensureUsers() {
  const passwordHash = await bcrypt.hash('RoadSoS@123', 10);
  const victim = await User.findOneAndUpdate({ email: 'demo.victim@roadsos.in' }, { name: 'Demo Victim', phone: '+919100000001', email: 'demo.victim@roadsos.in', passwordHash, role: 'victim', languagePreference: 'en', emergencyContacts: [{ name: 'Family Contact', phone: '+919100000002', relation: 'family' }] }, { upsert: true, new: true });
  const responder = await User.findOneAndUpdate({ email: 'demo.responder@roadsos.in' }, { name: 'Demo Responder', phone: '+919100000003', email: 'demo.responder@roadsos.in', passwordHash, role: 'responder', location: toPoint(17.42, 78.45), responderStatus: 'AVAILABLE' }, { upsert: true, new: true });
  return { victim, responder };
}

async function run() {
  await connectDb();
  const { victim, responder } = await ensureUsers();
  const hospitals = await Hospital.find();
  for (let i = 0; i < 50; i += 1) {
    const [lat, lng, area] = locations[i % locations.length];
    const severity = severities[i % severities.length];
    const hospital = hospitals[i % hospitals.length];
    const createdAt = new Date(Date.now() - i * 14 * 60 * 60 * 1000);
    const point = toPoint(lat + (i % 5) * 0.002, lng + (i % 4) * 0.002);
    const hospitalLocation = { lat: hospital.location.coordinates[1], lng: hospital.location.coordinates[0] };
    const distanceKm = calculateDistanceKm({ lat: point.coordinates[1], lng: point.coordinates[0] }, hospitalLocation);
    const etaSeconds = estimateEtaSeconds(distanceKm, severity);
    const sos = await Sos.create({ user: victim._id, location: point, injuryType: injuries[i % injuries.length], vehicleType: i % 2 ? 'car' : 'two-wheeler', source: 'ONE_TAP', status: 'RESOLVED', createdAt, updatedAt: createdAt });
    const incident = await Incident.create({ sos: sos._id, victim: victim._id, responder: responder._id, selectedHospital: hospital._id, location: point, injuryType: injuries[i % injuries.length], vehicleType: i % 2 ? 'car' : 'two-wheeler', severity: { score: severity === 'CRITICAL' ? 92 : severity === 'HIGH' ? 74 : severity === 'MEDIUM' ? 48 : 21, level: severity, reasoning: 'Seeded from completed incident record' }, route: { etaSeconds, distanceMeters: Math.round(distanceKm * 1000), polyline: '' }, status: 'RESOLVED', resolvedAt: new Date(createdAt.getTime() + etaSeconds * 1000 + 20 * 60 * 1000), outcome: 'transported to ' + hospital.name, metadata: { area }, createdAt, updatedAt: createdAt });
    sos.incident = incident._id;
    await sos.save();
    await Workflow.create({ incident: incident._id, status: 'COMPLETED', completedAt: incident.resolvedAt, steps: ['predictSeverity', 'selectHospital', 'calculateRoute', 'dispatchAlerts', 'startFirstAid', 'beginTimeline'].map((name) => ({ name, status: 'COMPLETED', startedAt: createdAt, completedAt: createdAt })) });
    await TimelineEvent.insertMany([{ incident: incident._id, eventType: 'sos:created', description: 'SOS created near ' + area, actor: 'seed', createdAt }, { incident: incident._id, eventType: 'incident:resolved', description: 'Incident resolved and transported', actor: 'seed', createdAt: incident.resolvedAt }]);
  }
  logger.info('Seeded realistic incident records', { count: 50 });
  await disconnectDb();
}

run().catch(async (error) => { logger.error('Incident seeding failed', { message: error.message, stack: error.stack }); await disconnectDb(); process.exit(1); });
