const mongoose = require('mongoose');

const dashboardEventSchema = new mongoose.Schema(
  {
    incident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', index: true },
    eventType: { type: String, required: true, index: true },
    message: { type: String, required: true },
    severityLevel: { type: String, enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

dashboardEventSchema.index({ createdAt: -1 });

module.exports = mongoose.model('DashboardEvent', dashboardEventSchema);
