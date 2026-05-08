const TimelineEvent = require('./timeline.model');
const { getIO } = require('../../config/socket');

async function appendEvent({ incidentId, eventType, description, actor = 'system', status = 'COMPLETED', metadata = {} }) {
  const event = await TimelineEvent.create({ incident: incidentId, eventType, description, actor, status, metadata });
  const io = getIO();
  if (io) io.of('/emergency').to(String(incidentId)).emit('timeline:update', event);
  return event;
}

async function getTimeline(incidentId) {
  return TimelineEvent.find({ incident: incidentId }).sort({ createdAt: 1 });
}

module.exports = { appendEvent, getTimeline };
