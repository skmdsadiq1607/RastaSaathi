module.exports = function registerSmsQueue(queue) {
  queue.process('send-fallback-sms', 5, async (job) => {
    const fallbackService = require('../modules/fallback/fallback.service');
    return fallbackService.activateFallback(job.data);
  });
};
