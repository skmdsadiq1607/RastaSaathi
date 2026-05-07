const DashboardEvent = require('../modules/dashboard/dashboard.model');
const { getIO } = require('../config/socket');

module.exports = function registerSosEvents(eventBus) {
  eventBus.on('sos:created', async ({ incident }) => {
    const io = getIO();
    if (io) {
      io.of('/emergency').to(String(incident._id)).emit('sos:created', incident);
      io.of('/dashboard').to('dashboard').emit('sos:created', incident);
      io.of('/responder').emit('sos:created', incident);
    }
    await DashboardEvent.create({ incident: incident._id, eventType: 'sos:created', message: 'New SOS incident created', severityLevel: incident.severity.level, metadata: { location: incident.location } });
  });
  eventBus.on('sos:cancelled', ({ incident }) => {
    const io = getIO();
    if (io) io.of('/emergency').to(String(incident._id)).emit('sos:updated', incident);
  });
};
