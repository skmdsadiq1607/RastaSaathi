const { AppError } = require('../utils/responseFormatter');

function validate(schema) {
  return (req, _res, next) => {
    try {
      for (const key of ['body', 'params', 'query']) {
        if (schema[key]) {
          const { value, error } = schema[key].validate(req[key], { abortEarly: false, stripUnknown: true });
          if (error) {
            throw new AppError('Validation failed', 400, 'VALIDATION_ERROR', error.details.map((detail) => detail.message));
          }
          req[key] = value;
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = validate;
