module.exports = function registerSosQueue(queue) {
  queue.process('process-sos', 3, async (job) => {
    const workflowService = require('../modules/workflow/workflow.service');
    return workflowService.startWorkflow({ incidentId: job.data.incidentId });
  });
};
