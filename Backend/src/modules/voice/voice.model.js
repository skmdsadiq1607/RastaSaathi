const mongoose = require('mongoose');

const voiceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    incident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident' },
    transcript: { type: String, default: '' },
    confidence: { type: Number, min: 0, max: 1, default: 0 },
    language: { type: String, enum: ['en', 'hi', 'ta', 'te', 'kn'], default: 'en' },
    keywordDetected: { type: Boolean, default: false },
    status: { type: String, enum: ['TRANSCRIBED', 'SOS_TRIGGERED', 'CANCELLED', 'IGNORED'], default: 'TRANSCRIBED' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

module.exports = mongoose.model('VoiceEvent', voiceSchema);
