const mongoose = require('mongoose');
const { WORKFLOW_STATUS } = require('../../utils/constants');

const stepSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: String, enum: ['PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'FALLBACK'], default: 'PENDING' },
    startedAt: { type: Date },
    completedAt: { type: Date },
    error: { type: String },
    output: { type: mongoose.Schema.Types.Mixed }
  },
  { _id: false }
);

const workflowSchema = new mongoose.Schema(
  {
    incident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', required: true, unique: true, index: true },
    status: { type: String, enum: Object.values(WORKFLOW_STATUS), default: WORKFLOW_STATUS.PENDING, index: true },
    steps: { type: [stepSchema], default: [] },
    fallbackActive: { type: Boolean, default: false },
    fallbackReason: { type: String },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Workflow', workflowSchema);
