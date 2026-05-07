const mongoose = require('mongoose');
const { SEVERITY_LEVELS } = require('../../utils/constants');

const routingSchema = new mongoose.Schema(
  {
    incident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', index: true },
    origin: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }
    },
    destination: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }
    },
    severityLevel: { type: String, enum: Object.values(SEVERITY_LEVELS), required: true },
    polyline: { type: String, default: '' },
    etaSeconds: { type: Number, min: 0, required: true },
    distanceMeters: { type: Number, min: 0, required: true },
    alternateRoutes: { type: [mongoose.Schema.Types.Mixed], default: [] },
    routingMode: { type: String, enum: ['STANDARD', 'SEVERITY_AWARE'], default: 'STANDARD' }
  },
  { timestamps: true }
);

routingSchema.index({ origin: '2dsphere' });
routingSchema.index({ destination: '2dsphere' });

module.exports = mongoose.model('Routing', routingSchema);
