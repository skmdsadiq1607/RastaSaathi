const Hospital = require('./hospital.model');
const Resources = require('../resources/resources.model');
const Incident = require('../incident/incident.model');
const mapsService = require('../../services/maps.service');
const aiService = require('../../services/ai.service');
const transparencyService = require('../transparency/transparency.service');
const timelineService = require('../timeline/timeline.service');
const { getIO } = require('../../config/socket');
const { toPoint, fromPoint } = require('../../utils/geoUtils');
const { AppError } = require('../../utils/responseFormatter');

function specialtyMatches(hospital, injuryType, requiredSpecialty) {
  const specialties = hospital.specialties.map((item) => item.toLowerCase());
  const required = String(requiredSpecialty || '').toLowerCase();
  const injury = String(injuryType || '').toLowerCase();
  if (required && specialties.includes(required)) return 100;
  if (/head|brain|spine|neuro/.test(injury) && specialties.some((item) => item.includes('neuro'))) return 100;
  if (/burn/.test(injury) && specialties.some((item) => item.includes('burn') || item.includes('plastic'))) return 90;
  if (/fracture|bone|orthopedic/.test(injury) && specialties.some((item) => item.includes('orthopedic'))) return 90;
  if (specialties.includes('emergency medicine') || specialties.includes('trauma')) return 75;
  return 45;
}

function resourceScore(hospital, resource) {
  const icuAvailable = resource ? resource.icuBeds : hospital.icuBeds;
  return Math.min(100, Math.max(0, icuAvailable * 8));
}

async function scoreHospital(hospital, resource, payload) {
  const destination = fromPoint(hospital.location);
  const matrix = await mapsService.getDistanceMatrix({ lat: payload.lat, lng: payload.lng }, destination, payload.severityLevel);
  const etaMinutes = matrix.etaSeconds / 60;
  const components = {
    icuAvailability: resourceScore(hospital, resource),
    traumaCenterMatch: hospital.traumaCenter ? 100 : payload.severityLevel === 'CRITICAL' ? 20 : 60,
    eta: Math.max(0, 100 - etaMinutes * 4),
    bloodBank: hospital.bloodBankAvailable ? 100 : 35,
    specialtyMatch: specialtyMatches(hospital, payload.injuryType, payload.requiredSpecialty)
  };
  const score = Math.round(
    components.icuAvailability * 0.25 +
      components.traumaCenterMatch * 0.25 +
      components.eta * 0.2 +
      components.bloodBank * 0.15 +
      components.specialtyMatch * 0.15
  );
  return {
    hospital,
    resource,
    score,
    components,
    etaSeconds: matrix.etaSeconds,
    distanceMeters: matrix.distanceMeters,
    location: destination,
    reasoning: hospital.name + ' scored ' + score + ' based on ICU, trauma capability, ETA, blood bank, and specialty fit.'
  };
}

async function selectHospital(payload) {
  const queryPoint = toPoint(payload.lat, payload.lng);
  let hospitals = await Hospital.find({ active: true, location: { $near: { $geometry: queryPoint, $maxDistance: 50000 } } }).limit(20);
  if (!hospitals.length) hospitals = await Hospital.find({ active: true }).limit(20);
  if (!hospitals.length) throw new AppError('No active hospitals are configured', 503, 'NO_HOSPITALS');
  const resources = await Resources.find({ hospital: { $in: hospitals.map((hospital) => hospital._id) } });
  const resourceByHospital = new Map(resources.map((resource) => [String(resource.hospital), resource]));
  const ranked = await Promise.all(hospitals.map((hospital) => scoreHospital(hospital, resourceByHospital.get(String(hospital._id)), payload)));
  ranked.sort((a, b) => b.score - a.score || a.etaSeconds - b.etaSeconds);
  const top3 = ranked.slice(0, 3);
  const selected = top3[0];
  const ai = await aiService.explainHospitalSelection({ ...payload, hospitalName: selected.hospital.name, score: selected.score, components: selected.components });
  selected.reasoning = ai.text || selected.reasoning;
  if (payload.incidentId) {
    await Incident.findByIdAndUpdate(payload.incidentId, { selectedHospital: selected.hospital._id });
    await transparencyService.recordDecision({ incident: payload.incidentId, decisionType: 'HOSPITAL', inputPayload: payload, outputPayload: top3.map((item) => ({ hospital: item.hospital._id, score: item.score, etaSeconds: item.etaSeconds, components: item.components })), confidenceScore: selected.score / 100, modelUsed: ai.modelUsed, reasoning: selected.reasoning });
    await timelineService.appendEvent({ incidentId: payload.incidentId, eventType: 'hospital:selected', description: 'Hospital selected: ' + selected.hospital.name, metadata: { hospitalId: selected.hospital._id, score: selected.score } });
    const io = getIO();
    if (io) io.of('/emergency').to(String(payload.incidentId)).emit('hospital:selected', selected);
  }
  return { selected, ranked: top3 };
}

async function listHospitals() {
  return Hospital.find({ active: true }).sort({ name: 1 });
}

async function getHospital(id) {
  const hospital = await Hospital.findById(id);
  if (!hospital) throw new AppError('Hospital not found', 404, 'HOSPITAL_NOT_FOUND');
  const resources = await Resources.findOne({ hospital: id });
  return { hospital, resources };
}

module.exports = { selectHospital, listHospitals, getHospital, scoreHospital };
