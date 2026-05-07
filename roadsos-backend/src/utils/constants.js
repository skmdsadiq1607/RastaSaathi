const ROLES = Object.freeze({ VICTIM: 'victim', RESPONDER: 'responder', ADMIN: 'admin' });
const SEVERITY_LEVELS = Object.freeze({ CRITICAL: 'CRITICAL', HIGH: 'HIGH', MEDIUM: 'MEDIUM', LOW: 'LOW' });
const INCIDENT_STATUS = Object.freeze({
  DETECTED: 'DETECTED',
  COUNTDOWN: 'COUNTDOWN',
  SOS_TRIGGERED: 'SOS_TRIGGERED',
  WORKFLOW_ACTIVE: 'WORKFLOW_ACTIVE',
  RESPONDER_ASSIGNED: 'RESPONDER_ASSIGNED',
  RESPONDER_ARRIVED: 'RESPONDER_ARRIVED',
  ESCALATED: 'ESCALATED',
  RESOLVED: 'RESOLVED',
  CANCELLED: 'CANCELLED'
});
const WORKFLOW_STATUS = Object.freeze({ PENDING: 'PENDING', RUNNING: 'RUNNING', COMPLETED: 'COMPLETED', FAILED: 'FAILED' });
const ALERT_STATUS = Object.freeze({ QUEUED: 'QUEUED', SENT: 'SENT', DELIVERED: 'DELIVERED', FAILED: 'FAILED' });
const LANGUAGES = Object.freeze(['en', 'hi', 'ta', 'te', 'kn']);
const VOICE_KEYWORDS = Object.freeze({
  en: ['help', 'accident', 'injured', 'emergency'],
  hi: ['मदद', 'दुर्घटना', 'आपातकाल', 'घायल'],
  ta: ['உதவி', 'விபத்து', 'அவசரம்', 'காயம்'],
  te: ['సహాయం', 'ప్రమాదం', 'అత్యవసరం', 'గాయం', 'అవసరం'],
  kn: ['ಸಹಾಯ', 'ಅಪಘಾತ', 'ತುರ್ತು', 'ಗಾಯ']
});
const DEFAULT_LANGUAGE = 'en';

module.exports = { ROLES, SEVERITY_LEVELS, INCIDENT_STATUS, WORKFLOW_STATUS, ALERT_STATUS, LANGUAGES, VOICE_KEYWORDS, DEFAULT_LANGUAGE };
