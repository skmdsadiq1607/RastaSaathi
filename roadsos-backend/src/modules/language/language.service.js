const fs = require('fs');
const path = require('path');
const translationService = require('../../services/translation.service');
const { LANGUAGES } = require('../../utils/constants');

function getLocale(language) {
  const lang = LANGUAGES.includes(language) ? language : 'en';
  const file = path.join(__dirname, 'locales', lang + '.json');
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

async function detectLanguage(text) {
  const language = await translationService.detectLanguage(text);
  return { language, supported: LANGUAGES.includes(language) };
}

module.exports = { getLocale, detectLanguage };
