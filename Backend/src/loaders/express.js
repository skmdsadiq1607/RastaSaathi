const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const env = require('../config/env');
const { publicRateLimiter } = require('../middleware/rateLimit.middleware');
const { httpLogger } = require('../middleware/logger.middleware');
const { languageMiddleware } = require('../middleware/language.middleware');

function loadExpress(app) {
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors({ origin: env.frontendUrl, credentials: true }));
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true, limit: '5mb' }));
  app.use(cookieParser());
  app.use(mongoSanitize());
  app.use(xss());
  app.use(compression());
  app.use(httpLogger);
  app.use(publicRateLimiter);
  app.use(languageMiddleware);
}

module.exports = loadExpress;
