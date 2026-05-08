const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../modules/auth/auth.model');
const sosSocket = require('./sos.socket');
const timelineSocket = require('./timeline.socket');
const dashboardSocket = require('./dashboard.socket');

async function authSocket(socket, next) {
  try {
    const token = socket.handshake.auth.token || String(socket.handshake.headers.authorization || '').replace('Bearer ', '');
    if (!token) return next(new Error('Authentication required'));
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub).select('-passwordHash -refreshTokenHash -resetOtpHash');
    if (!user) return next(new Error('User not found'));
    socket.data.user = { id: user.id, role: user.role, profile: user };
    next();
  } catch (error) {
    next(error);
  }
}

function registerSockets(io) {
  const emergency = io.of('/emergency');
  const dashboard = io.of('/dashboard');
  const responder = io.of('/responder');
  emergency.use(authSocket);
  dashboard.use(authSocket);
  responder.use(authSocket);
  emergency.on('connection', (socket) => { sosSocket(socket, emergency); timelineSocket(socket, emergency); });
  dashboard.on('connection', (socket) => dashboardSocket(socket, dashboard));
  responder.on('connection', (socket) => sosSocket(socket, responder));
}

module.exports = registerSockets;
