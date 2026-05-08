const Workflow = require('./workflow.model');
const Incident = require('../incident/incident.model');
const severityService = require('../severity/severity.service');
const hospitalService = require('../hospital/hospital.service');
const routingService = require('../routing/routing.service');
const alertsService = require('../alerts/alerts.service');
const firstAidService = require('../firstaid/firstaid.service');
const fallbackService = require('../fallback/fallback.service');
const timelineService = require('../timeline/timeline.service');
const { WORKFLOW_STATUS, INCIDENT_STATUS } = require('../../utils/constants');
const { fromPoint } = require('../../utils/geoUtils');
const { AppError } = require('../../utils/responseFormatter');

const STEP_NAMES = ['predictSeverity', 'selectHospital', 'calculateRoute', 'dispatchAlerts', 'startFirstAid', 'beginTimeline'];

function initialSteps() {
  return STEP_NAMES.map((name) => ({ name, status: 'PENDING' }));
}

async function updateStep(workflow, name, patch) {
  const index = workflow.steps.findIndex((step) => step.name === name);
  if (index >= 0) workflow.steps[index] = { ...workflow.steps[index].toObject?.() || workflow.steps[index], ...patch };
  await workflow.save();
}

async function runStep(workflow, name, handler) {
  await updateStep(workflow, name, { status: 'RUNNING', startedAt: new Date(), error: undefined });
  try {
    const output = await handler();
    await updateStep(workflow, name, { status: 'COMPLETED', completedAt: new Date(), output });
    return output;
  } catch (error) {
    await updateStep(workflow, name, { status: 'FAILED', completedAt: new Date(), error: error.message });
    workflow.fallbackActive = true;
    workflow.fallbackReason = name + ': ' + error.message;
    await workflow.save();
    throw error;
  }
}

async function startWorkflow({ incidentId }) {
  const incident = await Incident.findById(incidentId).populate('victim selectedHospital');
  if (!incident) throw new AppError('Incident not found', 404, 'INCIDENT_NOT_FOUND');
  const workflow = await Workflow.findOneAndUpdate({ incident: incidentId }, { $setOnInsert: { status: WORKFLOW_STATUS.RUNNING, steps: initialSteps() } }, { new: true, upsert: true });
  workflow.status = WORKFLOW_STATUS.RUNNING;
  await workflow.save();
  await Incident.findByIdAndUpdate(incidentId, { status: INCIDENT_STATUS.WORKFLOW_ACTIVE });
  try {
    const pre = incident.metadata && incident.metadata.preAssessment ? incident.metadata.preAssessment : {};
    const severity = await runStep(workflow, 'predictSeverity', () => severityService.predictSeverity({ incidentId, userId: incident.victim._id, speed: pre.speed || 40, impactForce: pre.impactForce || 3, vehicleType: incident.vehicleType, injuryDescription: incident.injuryType, consciousnessLevel: pre.consciousnessLevel || 'conscious', age: pre.age || 30 }));
    const origin = fromPoint(incident.location);
    const hospitalResult = await runStep(workflow, 'selectHospital', () => hospitalService.selectHospital({ incidentId, lat: origin.lat, lng: origin.lng, severityLevel: severity.level, injuryType: incident.injuryType }));
    const destination = hospitalResult.selected.location;
    await runStep(workflow, 'calculateRoute', () => routingService.calculateRoute({ incidentId, origin, destination, severityLevel: severity.level }));
    await runStep(workflow, 'dispatchAlerts', () => alertsService.dispatchAlerts({ incidentId }));
    await runStep(workflow, 'startFirstAid', () => firstAidService.createGuide({ incidentId, userId: incident.victim._id, injuryType: incident.injuryType, severityLevel: severity.level, resourcesAvailable: ['clean cloth', 'phone speaker'], language: incident.victim.languagePreference || 'en' }));
    await runStep(workflow, 'beginTimeline', () => timelineService.appendEvent({ incidentId, eventType: 'workflow:completed', description: 'Emergency workflow pipeline completed' }));
    workflow.status = WORKFLOW_STATUS.COMPLETED;
    workflow.completedAt = new Date();
    await workflow.save();
    return workflow;
  } catch (error) {
    await fallbackService.activateFallback({ incidentId, reason: error.message });
    workflow.status = WORKFLOW_STATUS.FAILED;
    workflow.fallbackActive = true;
    workflow.fallbackReason = error.message;
    await workflow.save();
    return workflow;
  }
}

async function getStatus(incidentId) {
  const workflow = await Workflow.findOne({ incident: incidentId }).populate('incident');
  if (!workflow) throw new AppError('Workflow not found', 404, 'WORKFLOW_NOT_FOUND');
  return workflow;
}

module.exports = { startWorkflow, getStatus };
