module.exports = function registerTimelineSocket(socket) {
  socket.on('timeline:join', ({ incidentId }) => socket.join(String(incidentId)));
  socket.on('timeline:leave', ({ incidentId }) => socket.leave(String(incidentId)));
};
