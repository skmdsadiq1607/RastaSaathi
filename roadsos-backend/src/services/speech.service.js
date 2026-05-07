const speech = require('@google-cloud/speech');
const env = require('../config/env');

let client;

function getClient() {
  if (!env.googleCloudProjectId) return null;
  if (!client) client = new speech.SpeechClient({ projectId: env.googleCloudProjectId });
  return client;
}

async function transcribeAudio(buffer, languageCode = 'en-IN', mimeType = 'audio/webm') {
  const speechClient = getClient();
  if (!speechClient || !buffer || !buffer.length) {
    return { transcript: '', confidence: 0, languageCode, source: 'not-transcribed' };
  }
  const encoding = mimeType.includes('wav') ? 'LINEAR16' : 'WEBM_OPUS';
  const [response] = await speechClient.recognize({
    audio: { content: buffer.toString('base64') },
    config: {
      encoding,
      sampleRateHertz: encoding === 'LINEAR16' ? 16000 : 48000,
      languageCode,
      alternativeLanguageCodes: ['hi-IN', 'ta-IN', 'te-IN', 'kn-IN'],
      enableAutomaticPunctuation: true
    }
  });
  const alternatives = response.results.flatMap((result) => result.alternatives || []);
  const best = alternatives.sort((a, b) => (b.confidence || 0) - (a.confidence || 0))[0];
  return { transcript: best ? best.transcript : '', confidence: best ? best.confidence || 0 : 0, languageCode, source: 'google-stt' };
}

module.exports = { transcribeAudio };
