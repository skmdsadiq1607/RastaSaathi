const mongoose = require('mongoose');

const transparencySchema = new mongoose.Schema(
  {
    incident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', index: true },
    decisionType: { type: String, enum: ['SEVERITY', 'HOSPITAL', 'ROUTING', 'FIRST_AID', 'SUMMARY'], required: true, index: true },
    inputPayload: { type: mongoose.Schema.Types.Mixed, required: true },
    outputPayload: { type: mongoose.Schema.Types.Mixed, required: true },
    confidenceScore: { type: Number, min: 0, max: 1, default: 0.8 },
    modelUsed: { type: String, required: true },
    reasoning: { type: String, required: true }
  },
  { timestamps: true }
);

transparencySchema.index({ incident: 1, createdAt: -1 });

module.exports = mongoose.model('TransparencyDecision', transparencySchema);
