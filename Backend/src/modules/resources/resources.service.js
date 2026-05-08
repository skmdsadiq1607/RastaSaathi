const Resources = require('./resources.model');
const hospitalService = require('../hospital/hospital.service');
const { getIO } = require('../../config/socket');

async function updateResources(payload) {
  const resources = await Resources.findOneAndUpdate(
    { hospital: payload.hospitalId },
    { hospital: payload.hospitalId, icuBeds: payload.icuBeds, ventilators: payload.ventilators, bloodUnits: payload.bloodUnits, ambulancesAvailable: payload.ambulancesAvailable, traumaTeamOnDuty: payload.traumaTeamOnDuty, lastSyncedAt: new Date() },
    { upsert: true, new: true }
  ).populate('hospital');
  const io = getIO();
  if (io) io.of('/dashboard').to('dashboard').emit('resource:updated', resources);
  return resources;
}

async function listResources() {
  return Resources.find().populate('hospital').sort({ updatedAt: -1 });
}

async function matchResources(query) {
  const result = await hospitalService.selectHospital({ lat: Number(query.lat), lng: Number(query.lng), severityLevel: query.severityLevel, injuryType: query.requiredSpecialty || 'unknown', requiredSpecialty: query.requiredSpecialty });
  return result.ranked;
}

module.exports = { updateResources, listResources, matchResources };
