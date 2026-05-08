const languageService = require('./language.service');
const { sendSuccess } = require('../../utils/responseFormatter');
const wrap = (handler) => async (req, res, next) => { try { await handler(req, res, next); } catch (error) { next(error); } };
exports.detect = wrap(async (req, res) => sendSuccess(res, await languageService.detectLanguage(req.body.text), 'Language detected'));
exports.locale = wrap(async (req, res) => sendSuccess(res, languageService.getLocale(req.params.language), 'Locale loaded'));
