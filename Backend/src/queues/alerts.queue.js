module.exports = function registerAlertsQueue(queue) {
  queue.process('dispatch-alerts', 5, async (job) => {
    const alertsService = require('../modules/alerts/alerts.service');
    return alertsService.dispatchAlerts(job.data);
  });
};
