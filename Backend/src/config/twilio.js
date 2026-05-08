const twilio = require('twilio');
const env = require('./env');

function getTwilioClient() {
  if (!env.twilioAccountSid || !env.twilioAuthToken) {
    return null;
  }
  return twilio(env.twilioAccountSid, env.twilioAuthToken);
}

module.exports = { getTwilioClient };
