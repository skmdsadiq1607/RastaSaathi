const mongoose = require('mongoose');
const { INCIDENT_STATUS, SEVERITY_LEVELS } = require('../../utils/constants');

const incidentSchema = new mongoose.Schema(
  {
    sos: { type: mongoose.Schema.Types.ObjectId, ref: 'Sos' },
    victim: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    responder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    selectedHospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }
    },
    injuryType: { type: String, default: 'unknown', trim: true },
    vehicleType: { type: String, default: 'unknown', trim: true },
    severity: {
      score: { type: Number, min: 0, max: 100, default: 0 },
      level: { type: String, enum: Object.values(SEVERITY_LEVELS), default: SEVERITY_LEVELS.LOW },
      reasoning: { type: String, default: '' }
    },
    route: {
      etaSeconds: { type: Number, default: 0 },
      distanceMeters: { type: Number, default: 0 },
      polyline: { type: String, default: '' }
    },
    status: { type: String, enum: Object.values(INCIDENT_STATUS), default: INCIDENT_STATUS.SOS_TRIGGERED, index: true },
    countdownExpiresAt: { type: Date },
    resolvedAt: { type: Date },
    outcome: { type: String, default: 'active' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

incidentSchema.index({ location: '2dsphere' });
incidentSchema.index({ status: 1, createdAt: -1 });
incidentSchema.index({ 'severity.level': 1, createdAt: -1 });

module.exports = mongoose.model('Incident', incidentSchema);
