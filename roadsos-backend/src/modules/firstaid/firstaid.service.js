const FirstAidSession = require('./firstaid.model');
const aiService = require('../../services/ai.service');
const transparencyService = require('../transparency/transparency.service');
const timelineService = require('../timeline/timeline.service');

function parseSteps(markdown) {
  return String(markdown)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => ({ stepNumber: index + 1, text: line.replace(/^\d+[.)]\s*/, '') }));
}

async function createGuide(payload) {
  const ai = await aiService.createFirstAidGuide(payload);
  const session = await FirstAidSession.create({
    incident: payload.incidentId,
    victim: payload.userId,
    injuryType: payload.injuryType,
    severityLevel: payload.severityLevel,
    resourcesAvailable: payload.resourcesAvailable,
    language: payload.language,
    messages: [
      { role: 'system', content: 'RoadSoS first aid session started.' },
      { role: 'assistant', content: ai.text, metadata: { steps: parseSteps(ai.text), modelUsed: ai.modelUsed } }
    ]
  });
  if (payload.incidentId) {
    await transparencyService.recordDecision({ incident: payload.incidentId, decisionType: 'FIRST_AID', inputPayload: payload, outputPayload: { sessionId: session.id, guidance: ai.text }, confidenceScore: ai.usedFallback ? 0.7 : 0.92, modelUsed: ai.modelUsed, reasoning: 'First aid instructions generated for injury, severity, resources, and language.' });
    await timelineService.appendEvent({ incidentId: payload.incidentId, eventType: 'firstaid:started', description: 'AI-guided first aid session started', metadata: { sessionId: session.id } });
  }
  return { sessionId: session.id, messages: session.messages, steps: parseSteps(ai.text), guidance: ai.text };
}

async function followup({ sessionId, question }) {
  const session = await FirstAidSession.findById(sessionId);
  if (!session) throw new Error('First aid session not found');
  session.messages.push({ role: 'user', content: question });
  const ai = await aiService.createFirstAidGuide({ injuryType: session.injuryType, severityLevel: session.severityLevel, resourcesAvailable: session.resourcesAvailable, language: session.language, question, history: session.messages.map((message) => ({ role: message.role, content: message.content })) });
  session.messages.push({ role: 'assistant', content: ai.text, metadata: { steps: parseSteps(ai.text), modelUsed: ai.modelUsed } });
  await session.save();
  return { sessionId: session.id, messages: session.messages, answer: ai.text, steps: parseSteps(ai.text) };
}

async function getSession(sessionId) {
  return FirstAidSession.findById(sessionId);
}

module.exports = { createGuide, followup, getSession, parseSteps };
