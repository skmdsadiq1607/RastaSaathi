const dotenv = require('dotenv');
const Joi = require('joi');

dotenv.config();

const schema = Joi.object({
  PORT: Joi.number().default(5000),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  MONGODB_URI: Joi.string().default('mongodb://127.0.0.1:27017/roadsos'),
  REDIS_URL: Joi.string().default('redis://127.0.0.1:6379'),
  JWT_SECRET: Joi.string().min(16).default('dev_access_secret_change_before_production'),
  JWT_REFRESH_SECRET: Joi.string().min(16).default('dev_refresh_secret_change_before_production'),
  TWILIO_ACCOUNT_SID: Joi.string().allow('').default(''),
  TWILIO_AUTH_TOKEN: Joi.string().allow('').default(''),
  TWILIO_PHONE_NUMBER: Joi.string().allow('').default(''),
  GOOGLE_MAPS_API_KEY: Joi.string().allow('').default(''),
  GOOGLE_CLOUD_PROJECT_ID: Joi.string().allow('').default(''),
  FCM_SERVER_KEY: Joi.string().allow('').default(''),
  CLAUDE_API_KEY: Joi.string().allow('').default(''),
  FRONTEND_URL: Joi.string().uri().default('http://localhost:5173'),
  BULL_BOARD_USER: Joi.string().default('admin'),
  BULL_BOARD_PASS: Joi.string().default('change_me')
}).unknown(true);

const { value, error } = schema.validate(process.env, { abortEarly: false });

if (error) {
  throw new Error('Invalid environment configuration: ' + error.details.map((item) => item.message).join(', '));
}

module.exports = Object.freeze({
  port: Number(value.PORT),
  nodeEnv: value.NODE_ENV,
  isProduction: value.NODE_ENV === 'production',
  isTest: value.NODE_ENV === 'test',
  mongodbUri: value.MONGODB_URI,
  redisUrl: value.REDIS_URL,
  jwtSecret: value.JWT_SECRET,
  jwtRefreshSecret: value.JWT_REFRESH_SECRET,
  twilioAccountSid: value.TWILIO_ACCOUNT_SID,
  twilioAuthToken: value.TWILIO_AUTH_TOKEN,
  twilioPhoneNumber: value.TWILIO_PHONE_NUMBER,
  googleMapsApiKey: value.GOOGLE_MAPS_API_KEY,
  googleCloudProjectId: value.GOOGLE_CLOUD_PROJECT_ID,
  fcmServerKey: value.FCM_SERVER_KEY,
  claudeApiKey: value.CLAUDE_API_KEY,
  frontendUrl: value.FRONTEND_URL,
  bullBoardUser: value.BULL_BOARD_USER,
  bullBoardPass: value.BULL_BOARD_PASS
});
