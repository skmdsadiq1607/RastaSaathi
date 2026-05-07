const { getIO } = require('../config/socket');

module.exports = function registerIncidentEvents(eventBus) {
  eventBus.on('incident:updated', ({ incident }) => {
    const io = getIO();
    if (io) {
      io.of('/emergency').to(String(incident._id)).emit('sos:updated', incident);
      io.of('/dashboard').to('dashboard').emit('sos:updated', incident);
    }
  });
};
