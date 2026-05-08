const { LANGUAGES, DEFAULT_LANGUAGE } = require('../utils/constants');

function pickLanguage(value) {
  if (!value) return DEFAULT_LANGUAGE;
  const normalized = String(value).split(',')[0].trim().slice(0, 2).toLowerCase();
  return LANGUAGES.includes(normalized) ? normalized : DEFAULT_LANGUAGE;
}

function languageMiddleware(req, _res, next) {
  const profileLanguage = req.user && req.user.languagePreference;
  req.language = pickLanguage(profileLanguage || req.headers['accept-language']);
  next();
}

module.exports = { languageMiddleware, pickLanguage };
