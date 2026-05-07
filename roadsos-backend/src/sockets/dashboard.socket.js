module.exports = function registerDashboardSocket(socket) {
  socket.join('dashboard');
  socket.emit('dashboard:connected', { connected: true });
};
