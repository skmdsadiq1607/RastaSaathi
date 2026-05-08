const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema(
  {
    incident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', required: true, index: true },
    eventType: { type: String, required: true, index: true },
    description: { type: String, required: true },
    actor: { type: String, default: 'system' },
    status: { type: String, enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED'], default: 'COMPLETED' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

timelineSchema.index({ incident: 1, createdAt: 1 });

module.exports = mongoose.model('TimelineEvent', timelineSchema);
