const mongoose = require('mongoose');

const sosSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    incident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident' },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }
    },
    injuryType: { type: String, default: 'unknown', trim: true },
    vehicleType: { type: String, default: 'unknown', trim: true },
    source: { type: String, enum: ['ONE_TAP', 'VOICE', 'AUTO_DETECTED', 'SMS_FALLBACK'], default: 'ONE_TAP' },
    status: { type: String, enum: ['CREATED', 'CANCELLED', 'WORKFLOW_STARTED', 'RESOLVED'], default: 'CREATED', index: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

sosSchema.index({ location: '2dsphere' });
sosSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Sos', sosSchema);
