const VoiceEvent = require('./voice.model');
const sosService = require('../sos/sos.service');
const speechService = require('../../services/speech.service');
const { VOICE_KEYWORDS } = require('../../utils/constants');
const { AppError } = require('../../utils/responseFormatter');

function keywordMatch(transcript) {
  const text = String(transcript || '').toLowerCase();
  for (const [language, keywords] of Object.entries(VOICE_KEYWORDS)) {
    const keyword = keywords.find((item) => text.includes(item.toLowerCase()));
    if (keyword) return { detected: true, language, keyword };
  }
  return { detected: false, language: 'en', keyword: '' };
}

async function processVoice({ userId, buffer, mimeType, transcript, lat, lng, language = 'en' }) {
  const stt = transcript ? { transcript, confidence: 0.95, languageCode: language, source: 'provided-transcript' } : await speechService.transcribeAudio(buffer, language + '-IN', mimeType);
  const match = keywordMatch(stt.transcript);
  const shouldTrigger = match.detected && stt.confidence >= 0.85;
  const event = await VoiceEvent.create({ user: userId, transcript: stt.transcript, confidence: stt.confidence, language: match.language || language, keywordDetected: shouldTrigger, status: shouldTrigger ? 'SOS_TRIGGERED' : 'IGNORED', metadata: { stt, keyword: match.keyword } });
  if (shouldTrigger) {
    if (!lat || !lng) throw new AppError('GPS headers are required for voice SOS', 400, 'GPS_REQUIRED');
    const result = await sosService.triggerSos({ userId, lat, lng, injuryType: 'voice emergency', vehicleType: 'unknown', source: 'VOICE', metadata: { voiceEventId: event.id, transcript: stt.transcript } });
    event.incident = result.incident._id;
    await event.save();
    return { voiceEvent: event, sos: result };
  }
  return { voiceEvent: event, sos: null };
}

async function cancelVoice({ voiceEventId, userId }) {
  const event = await VoiceEvent.findOneAndUpdate({ _id: voiceEventId, user: userId }, { status: 'CANCELLED' }, { new: true });
  if (!event) throw new AppError('Voice event not found', 404, 'VOICE_EVENT_NOT_FOUND');
  if (event.incident) await sosService.cancelSos(event.incident, userId);
  return event;
}

module.exports = { processVoice, cancelVoice, keywordMatch };
