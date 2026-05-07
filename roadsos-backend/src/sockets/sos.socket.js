const sosService = require('../modules/sos/sos.service');
const incidentService = require('../modules/incident/incident.service');

const readings = new Map();
const countdowns = new Map();

function accelerationMagnitude(accelerometer = {}) {
  const x = Number(accelerometer.x || 0);
  const y = Number(accelerometer.y || 0);
  const z = Number(accelerometer.z || 0);
  return Math.sqrt(x * x + y * y + z * z) / 9.80665;
}

function registerSosSocket(socket, namespace) {
  socket.on('join:incident', ({ incidentId }) => socket.join(String(incidentId)));
  socket.on('leave:incident', ({ incidentId }) => socket.leave(String(incidentId)));
  socket.on('gps:update', async (payload) => {
    const previous = readings.get(socket.id);
    const currentMagnitude = accelerationMagnitude(payload.accelerometer);
    const previousMagnitude = previous ? previous.magnitude : currentMagnitude;
    const delta = Math.abs(currentMagnitude - previousMagnitude);
    readings.set(socket.id, { magnitude: currentMagnitude, payload, timestamp: Date.now() });
    namespace.to(String(payload.incidentId || socket.data.user.id)).emit('responder:location', { userId: socket.data.user.id, ...payload });
    if (socket.data.user.role === 'victim' && delta > 3 && !countdowns.has(socket.id)) {
      let remaining = 10;
      const countdown = { cancelled: false };
      countdowns.set(socket.id, countdown);
      const interval = setInterval(async () => {
        remaining -= 1;
        socket.emit('sos:countdown', { remaining });
        if (remaining <= 0) {
          clearInterval(interval);
          countdowns.delete(socket.id);
          if (!countdown.cancelled) {
            const result = await sosService.triggerSos({ userId: socket.data.user.id, lat: payload.lat, lng: payload.lng, injuryType: 'auto impact detected', vehicleType: 'unknown', source: 'AUTO_DETECTED', impactForce: delta });
            socket.join(String(result.incident._id));
          }
        }
      }, 1000);
    }
  });
  socket.on('sos:cancel', () => {
    const countdown = countdowns.get(socket.id);
    if (countdown) countdown.cancelled = true;
    countdowns.delete(socket.id);
    socket.emit('sos:cancelled', { cancelled: true });
  });
  socket.on('responder:accept', async ({ incidentId }) => {
    const incident = await incidentService.assignIncident(incidentId, socket.data.user.id);
    socket.join(String(incidentId));
    namespace.to(String(incidentId)).emit('sos:updated', incident);
  });
  socket.on('responder:arrived', async ({ incidentId }) => {
    const incident = await incidentService.markArrived(incidentId, socket.data.user.id);
    namespace.to(String(incidentId)).emit('sos:updated', incident);
  });
  socket.on('disconnect', () => {
    readings.delete(socket.id);
    countdowns.delete(socket.id);
  });
}

module.exports = registerSosSocket;
