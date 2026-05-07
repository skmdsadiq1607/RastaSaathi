const resourcesService = require('../modules/resources/resources.service');
const Resources = require('../modules/resources/resources.model');

async function syncKnownResources() {
  const resources = await Resources.find();
  return Promise.all(resources.map((resource) => resourcesService.updateResources({ hospitalId: resource.hospital, icuBeds: resource.icuBeds, ventilators: resource.ventilators, bloodUnits: resource.bloodUnits, ambulancesAvailable: resource.ambulancesAvailable, traumaTeamOnDuty: resource.traumaTeamOnDuty })));
}

function scheduleResourceSync(queue) {
  return queue.add('resource-sync', {}, { repeat: { every: 5 * 60 * 1000 }, removeOnComplete: true });
}

module.exports = { syncKnownResources, scheduleResourceSync };
