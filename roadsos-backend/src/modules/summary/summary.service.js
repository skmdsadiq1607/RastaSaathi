const IncidentSummary = require('./summary.model');
const Incident = require('../incident/incident.model');
const TimelineEvent = require('../timeline/timeline.model');
const TransparencyDecision = require('../transparency/transparency.model');
const Workflow = require('../workflow/workflow.model');
const aiService = require('../../services/ai.service');
const transparencyService = require('../transparency/transparency.service');
const { AppError } = require('../../utils/responseFormatter');

async function generateSummary({ incidentId }) {
  const incident = await Incident.findById(incidentId).populate('victim responder selectedHospital');
  if (!incident) throw new AppError('Incident not found', 404, 'INCIDENT_NOT_FOUND');
  const [timeline, decisions, workflow] = await Promise.all([
    TimelineEvent.find({ incident: incidentId }).sort({ createdAt: 1 }),
    TransparencyDecision.find({ incident: incidentId }).sort({ createdAt: 1 }),
    Workflow.findOne({ incident: incidentId })
  ]);
  const ai = await aiService.generateIncidentSummary({ incident, timeline, decisions, workflow });
  const summary = await IncidentSummary.findOneAndUpdate(
    { incident: incidentId },
    { incident: incidentId, briefSummary: ai.summary.briefSummary, timeline: ai.summary.timeline, decisionsExplained: ai.summary.decisionsExplained, outcome: ai.summary.outcome, recommendations: ai.summary.recommendations, modelUsed: ai.modelUsed },
    { upsert: true, new: true }
  );
  await transparencyService.recordDecision({ incident: incidentId, decisionType: 'SUMMARY', inputPayload: { incidentId }, outputPayload: summary, confidenceScore: ai.modelUsed === 'rule-based-fallback' ? 0.72 : 0.9, modelUsed: ai.modelUsed, reasoning: 'Incident summary generated from timeline, decisions, workflow, and outcome records.' });
  return summary;
}

async function getSummary(incidentId) {
  const summary = await IncidentSummary.findOne({ incident: incidentId });
  if (!summary) throw new AppError('Summary not found', 404, 'SUMMARY_NOT_FOUND');
  return summary;
}

module.exports = { generateSummary, getSummary };
