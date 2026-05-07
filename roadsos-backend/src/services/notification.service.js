const env = require('../config/env');
const logger = require('../utils/logger');

async function sendToTokens(tokens, payload) {
  const cleanTokens = [...new Set((tokens || []).filter(Boolean))];
  if (!cleanTokens.length) return { successCount: 0, failureCount: 0, responses: [] };
  if (!env.fcmServerKey) {
    return { successCount: 0, failureCount: cleanTokens.length, responses: cleanTokens.map((token) => ({ token, error: 'FCM server key is not configured' })) };
  }
  const response = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      Authorization: 'key=' + env.fcmServerKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ registration_ids: cleanTokens, notification: payload.notification, data: payload.data })
  });
  if (!response.ok) {
    const text = await response.text();
    logger.warn('FCM request failed', { status: response.status, body: text });
    return { successCount: 0, failureCount: cleanTokens.length, responses: cleanTokens.map((token) => ({ token, error: text })) };
  }
  const data = await response.json();
  return { successCount: data.success || 0, failureCount: data.failure || 0, responses: data.results || [] };
}

module.exports = { sendToTokens };
