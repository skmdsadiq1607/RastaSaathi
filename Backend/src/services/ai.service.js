const Anthropic = require('@anthropic-ai/sdk');
const env = require('../config/env');
const { firstAidPrompt, hospitalPrompt, severityPrompt, summaryPrompt } = require('../utils/aiPrompts');
const logger = require('../utils/logger');

const CLAUDE_MODEL = 'claude-sonnet-4-20250514';
let client;

function getClient() {
  if (!env.claudeApiKey) return null;
  if (!client) client = new Anthropic({ apiKey: env.claudeApiKey });
  return client;
}

async function callClaude(prompt, maxTokens = 900) {
  const anthropic = getClient();
  if (!anthropic) {
    return { text: '', modelUsed: 'rule-based-fallback', usedFallback: true };
  }
  try {
    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: maxTokens,
      temperature: 0.2,
      messages: [{ role: 'user', content: prompt }]
    });
    const text = message.content.map((part) => part.text || '').join('\n').trim();
    return { text, modelUsed: CLAUDE_MODEL, usedFallback: false };
  } catch (error) {
    logger.warn('Claude request failed', { message: error.message });
    return { text: '', modelUsed: 'rule-based-fallback', usedFallback: true };
  }
}

async function explainSeverity(input, score, level, recommendedResponse) {
  const response = await callClaude(severityPrompt(input, score, level), 700);
  if (response.text) return { ...response, text: response.text };
  return {
    text: 'Severity is ' + level + ' because the measured risk factors produced a score of ' + score + '. ' + recommendedResponse,
    modelUsed: response.modelUsed,
    usedFallback: true
  };
}

async function explainHospitalSelection(payload) {
  const response = await callClaude(hospitalPrompt(payload), 700);
  if (response.text) return response;
  const top = payload.hospitalName || 'the selected hospital';
  return {
    text: top + ' is ranked highest because it balances emergency resources, trauma capability, ETA, blood bank access, and specialty fit.',
    modelUsed: response.modelUsed,
    usedFallback: true
  };
}

async function createFirstAidGuide(payload) {
  const response = await callClaude(firstAidPrompt(payload), 1000);
  if (response.text) return response;
  const guide = [
    '1. Call emergency services and keep the person calm.',
    '2. Do not move the victim if head, neck, or spine injury is possible.',
    '3. Control visible bleeding with clean cloth and steady pressure.',
    '4. Keep the airway clear and monitor breathing until responders arrive.',
    '5. Share location, injury type, and consciousness status with RoadSoS responders.'
  ].join('\n');
  return { text: guide, modelUsed: response.modelUsed, usedFallback: true };
}

async function generateIncidentSummary(payload) {
  const response = await callClaude(summaryPrompt(payload), 1400);
  if (response.text) {
    try {
      return { summary: JSON.parse(response.text), modelUsed: response.modelUsed };
    } catch (_error) {
      return {
        summary: {
          briefSummary: response.text,
          timeline: payload.timeline || [],
          decisionsExplained: payload.decisions || [],
          outcome: payload.incident && payload.incident.outcome ? payload.incident.outcome : 'active',
          recommendations: ['Review response timing and resource allocation.']
        },
        modelUsed: response.modelUsed
      };
    }
  }
  return {
    summary: {
      briefSummary: 'Incident ' + payload.incident._id + ' involved ' + payload.incident.injuryType + ' with severity ' + payload.incident.severity.level + '.',
      timeline: payload.timeline || [],
      decisionsExplained: payload.decisions || [],
      outcome: payload.incident.outcome || 'active',
      recommendations: ['Use the recorded timeline and AI decisions for clinical handoff and operational review.']
    },
    modelUsed: response.modelUsed
  };
}

module.exports = { CLAUDE_MODEL, callClaude, explainSeverity, explainHospitalSelection, createFirstAidGuide, generateIncidentSummary };
