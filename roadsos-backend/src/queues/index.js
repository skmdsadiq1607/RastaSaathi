const Queue = require('bull');
const env = require('../config/env');
const logger = require('../utils/logger');

const queues = new Map();

function createQueue(name) {
  const queue = new Queue(name + '.queue', env.redisUrl, { defaultJobOptions: { removeOnComplete: 100, removeOnFail: 200 } });
  queue.on('failed', (job, error) => logger.error('Queue job failed', { queue: name, jobId: job.id, message: error.message }));
  queues.set(name, queue);
  return queue;
}

function getQueue(name) {
  return queues.get(name) || createQueue(name);
}

function allQueues() {
  return ['sos', 'alerts', 'severity', 'sms'].map(getQueue);
}

function registerProcessors() {
  require('./sos.queue')(getQueue('sos'));
  require('./alerts.queue')(getQueue('alerts'));
  require('./severity.queue')(getQueue('severity'));
  require('./sms.queue')(getQueue('sms'));
}

async function getQueueStatus() {
  const result = {};
  for (const [name, queue] of queues.entries()) {
    const counts = await queue.getJobCounts('waiting', 'active', 'completed', 'failed', 'delayed');
    const failed = await queue.getFailed(0, 20);
    result[name] = { ...counts, failedJobs: failed.map((job) => ({ id: job.id, name: job.name, data: job.data, failedReason: job.failedReason })) };
  }
  return result;
}

async function retryFailed(name) {
  const queue = getQueue(name);
  const failed = await queue.getFailed();
  await Promise.all(failed.map((job) => job.retry()));
  return { retried: failed.length };
}

module.exports = { getQueue, allQueues, registerProcessors, getQueueStatus, retryFailed };
