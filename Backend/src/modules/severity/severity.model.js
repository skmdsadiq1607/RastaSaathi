const mongoose = require('mongoose');
const { SEVERITY_LEVELS } = require('../../utils/constants');

const severitySchema = new mongoose.Schema(
  {
    incident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', index: true },
    victim: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score: { type: Number, min: 0, max: 100, required: true },
    level: { type: String, enum: Object.values(SEVERITY_LEVELS), required: true, index: true },
    reasoning: { type: String, required: true },
    recommendedResponse: { type: String, required: true },
    components: { type: mongoose.Schema.Types.Mixed, default: {} },
    inputPayload: { type: mongoose.Schema.Types.Mixed, required: true }
  },
  { timestamps: true }
);

severitySchema.index({ incident: 1, createdAt: -1 });

module.exports = mongoose.model('Severity', severitySchema);
