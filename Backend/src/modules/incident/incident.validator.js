const Joi = require('joi');

module.exports = {
  id: { params: Joi.object({ id: Joi.string().required() }) },
  list: { query: Joi.object({ status: Joi.string().optional(), page: Joi.number().integer().min(1).default(1), limit: Joi.number().integer().min(1).max(100).default(25) }) },
  updateStatus: { params: Joi.object({ id: Joi.string().required() }), body: Joi.object({ status: Joi.string().required(), metadata: Joi.object().default({}) }) }
};
