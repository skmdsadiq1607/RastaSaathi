const hospitalService = require('./hospital.service');
const { sendSuccess } = require('../../utils/responseFormatter');
const wrap = (handler) => async (req, res, next) => { try { await handler(req, res, next); } catch (error) { next(error); } };
exports.select = wrap(async (req, res) => sendSuccess(res, await hospitalService.selectHospital(req.body), 'Hospital selected'));
exports.list = wrap(async (_req, res) => sendSuccess(res, await hospitalService.listHospitals(), 'Hospitals loaded'));
exports.get = wrap(async (req, res) => sendSuccess(res, await hospitalService.getHospital(req.params.id), 'Hospital loaded'));
