const { getIO } = require('../config/socket');

module.exports = function registerHospitalEvents(eventBus) {
  eventBus.on('hospital:selected', ({ incidentId, hospital }) => {
    const io = getIO();
    if (io) io.of('/emergency').to(String(incidentId)).emit('hospital:selected', hospital);
  });
};
