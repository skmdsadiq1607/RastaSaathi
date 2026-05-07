const { Translate } = require('@google-cloud/translate').v2;
const env = require('../config/env');
const { DEFAULT_LANGUAGE, LANGUAGES } = require('../utils/constants');

let client;

function getClient() {
  if (!env.googleCloudProjectId) return null;
  if (!client) client = new Translate({ projectId: env.googleCloudProjectId });
  return client;
}

function scriptDetect(text) {
  const value = String(text || '');
  if (/[ऀ-ॿ]/.test(value)) return 'hi';
  if (/[஀-௿]/.test(value)) return 'ta';
  if (/[ఀ-౿]/.test(value)) return 'te';
  if (/[ಀ-೿]/.test(value)) return 'kn';
  return DEFAULT_LANGUAGE;
}

async function detectLanguage(text) {
  const translate = getClient();
  if (translate) {
    const [detection] = await translate.detect(text);
    const language = Array.isArray(detection) ? detection[0].language : detection.language;
    return LANGUAGES.includes(language) ? language : scriptDetect(text);
  }
  return scriptDetect(text);
}

async function translateText(text, targetLanguage) {
  if (!LANGUAGES.includes(targetLanguage) || targetLanguage === 'en') return text;
  const translate = getClient();
  if (!translate) return text;
  const [translation] = await translate.translate(text, targetLanguage);
  return translation;
}

module.exports = { detectLanguage, translateText };
