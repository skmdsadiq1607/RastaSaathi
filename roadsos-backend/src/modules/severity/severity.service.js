const Severity = require('./severity.model');
const Incident = require('../incident/incident.model');
const { getIO } = require('../../config/socket');
const aiService = require('../../services/ai.service');
const transparencyService = require('../transparency/transparency.service');
const timelineService = require('../timeline/timeline.service');
const { calculateSeverityScore, recommendedResponse } = require('../../utils/severityScorer');

async function predictSeverity(input) {
  const { score, level, components } = calculateSeverityScore(input);
  const response = recommendedResponse(level);
  const ai = await aiService.explainSeverity(input, score, level, response);
  const document = await Severity.create({
    incident: input.incidentId,
    victim: input.userId,
    score,
    level,
    reasoning: ai.text,
    recommendedResponse: response,
    components,
    inputPayload: input
  });
  if (input.incidentId) {
    await Incident.findByIdAndUpdate(input.incidentId, { severity: { score, level, reasoning: ai.text } });
    await transparencyService.recordDecision({
      incident: input.incidentId,
      decisionType: 'SEVERITY',
      inputPayload: input,
      outputPayload: { score, level, components, recommendedResponse: response },
      confidenceScore: Math.min(0.98, 0.64 + score / 300),
      modelUsed: ai.modelUsed,
      reasoning: ai.text
    });
    await timelineService.appendEvent({ incidentId: input.incidentId, eventType: 'severity:predicted', description: 'Severity predicted as ' + level + ' with score ' + score, metadata: { score, level } });
    const io = getIO();
    if (io) io.of('/emergency').to(String(input.incidentId)).emit('severity:predicted', { score, level, reasoning: ai.text, recommendedResponse: response });
  }
  return { id: document.id, score, level, reasoning: ai.text, recommendedResponse: response, components };
}

module.exports = { predictSeverity };
