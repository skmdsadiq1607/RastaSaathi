const Sos = require('./sos.model');
const Incident = require('../incident/incident.model');
const eventBus = require('../../events');
const timelineService = require('../timeline/timeline.service');
const { getRedisClient } = require('../../config/redis');
const { toPoint } = require('../../utils/geoUtils');
const { INCIDENT_STATUS } = require('../../utils/constants');
const { AppError } = require('../../utils/responseFormatter');
const logger = require('../../utils/logger');

async function assertSosRate(userId) {
  const redis = getRedisClient();
  const hourKey = Math.floor(Date.now() / 3600000);
  const key = 'sos:rate:' + userId + ':' + hourKey;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, 3600);
  if (count > 300) throw new AppError('SOS rate limit exceeded for this hour', 429, 'SOS_RATE_LIMITED');
}

async function enqueueWorkflow(incidentId) {
  try {
    const { getQueue } = require('../../queues');
    const queue = getQueue('sos');
    if (queue) {
      await queue.add('process-sos', { incidentId: String(incidentId) }, { attempts: 3, backoff: { type: 'exponential', delay: 1000 } });
      return;
    }
  } catch (error) {
    logger.warn('SOS queue unavailable, running workflow inline', { message: error.message });
  }
  setImmediate(async () => {
    try {
      const workflowService = require('../workflow/workflow.service');
      await workflowService.startWorkflow({ incidentId });
    } catch (error) {
      logger.error('Inline workflow failed', { incidentId: String(incidentId), message: error.message });
    }
  });
}

async function triggerSos(payload) {
  const userId = payload.userId;
  if (!userId) throw new AppError('userId is required to trigger SOS', 400, 'USER_REQUIRED');
  await assertSosRate(userId);
  const point = toPoint(payload.lat, payload.lng);
  const sos = await Sos.create({ user: userId, location: point, injuryType: payload.injuryType, vehicleType: payload.vehicleType, source: payload.source, metadata: payload.metadata || {} });
  const incident = await Incident.create({ sos: sos._id, victim: userId, location: point, injuryType: payload.injuryType, vehicleType: payload.vehicleType, status: INCIDENT_STATUS.SOS_TRIGGERED, metadata: { preAssessment: payload } });
  sos.incident = incident._id;
  sos.status = 'WORKFLOW_STARTED';
  await sos.save();
  await timelineService.appendEvent({ incidentId: incident._id, eventType: 'sos:created', description: 'SOS created from ' + sos.source, actor: String(userId), metadata: { lat: payload.lat, lng: payload.lng } });
  eventBus.emit('sos:created', { sos, incident });
  await enqueueWorkflow(incident._id);
  return { sos, incident };
}

async function cancelSos(id, userId) {
  const incident = await Incident.findOneAndUpdate({ _id: id, victim: userId, status: { $in: [INCIDENT_STATUS.COUNTDOWN, INCIDENT_STATUS.SOS_TRIGGERED] } }, { status: INCIDENT_STATUS.CANCELLED }, { new: true });
  if (!incident) throw new AppError('SOS cannot be cancelled', 400, 'SOS_CANCEL_FAILED');
  await Sos.findByIdAndUpdate(incident.sos, { status: 'CANCELLED' });
  await timelineService.appendEvent({ incidentId: incident._id, eventType: 'sos:cancelled', description: 'SOS cancelled by victim', actor: String(userId) });
  eventBus.emit('sos:cancelled', { incident });
  return incident;
}

async function history(userId, { page = 1, limit = 10 }) {
  const query = { victim: userId };
  const [items, total] = await Promise.all([
    Incident.find(query).populate('selectedHospital responder').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Incident.countDocuments(query)
  ]);
  return { items, total, page, pages: Math.ceil(total / limit) };
}

module.exports = { triggerSos, cancelSos, history, assertSosRate };
