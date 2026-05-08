module.exports = function registerSeverityQueue(queue) {
  queue.process('predict-severity', 5, async (job) => {
    const severityService = require('../modules/severity/severity.service');
    return severityService.predictSeverity(job.data);
  });
};
