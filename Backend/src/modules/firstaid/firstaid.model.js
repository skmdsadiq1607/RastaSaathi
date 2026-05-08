const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['system', 'user', 'assistant'], required: true },
    content: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true, _id: true }
);

const firstAidSchema = new mongoose.Schema(
  {
    incident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', index: true },
    victim: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    injuryType: { type: String, required: true },
    severityLevel: { type: String, enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'], required: true },
    resourcesAvailable: { type: [String], default: [] },
    language: { type: String, enum: ['en', 'hi', 'ta', 'te', 'kn'], default: 'en' },
    messages: { type: [messageSchema], default: [] },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('FirstAidSession', firstAidSchema);
