const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema(
  {
    incident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', required: true, unique: true, index: true },
    briefSummary: { type: String, required: true },
    timeline: { type: mongoose.Schema.Types.Mixed, default: [] },
    decisionsExplained: { type: mongoose.Schema.Types.Mixed, default: [] },
    outcome: { type: String, default: '' },
    recommendations: { type: mongoose.Schema.Types.Mixed, default: [] },
    modelUsed: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('IncidentSummary', summarySchema);
