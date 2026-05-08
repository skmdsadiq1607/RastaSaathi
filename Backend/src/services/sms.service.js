const env = require('../config/env');
const { getTwilioClient } = require('../config/twilio');

async function sendSms(to, body) {
  const client = getTwilioClient();
  if (!client || !env.twilioPhoneNumber) {
    return { status: 'FAILED', providerMessageId: null, error: 'Twilio credentials are not configured' };
  }
  const message = await client.messages.create({ from: env.twilioPhoneNumber, to, body });
  return { status: 'SENT', providerMessageId: message.sid, error: null };
}

module.exports = { sendSms };
