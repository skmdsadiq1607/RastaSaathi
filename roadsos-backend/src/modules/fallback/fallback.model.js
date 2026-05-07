const mongoose = require('mongoose');

const fallbackSchema = new mongoose.Schema(
  {
    incident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', index: true },
    phone: { type: String, required: true, trim: true },
    direction: { type: String, enum: ['OUTBOUND', 'INBOUND'], required: true },
    body: { type: String, required: true },
    parsedCommand: { type: String, enum: ['ACCEPT', 'REJECT', 'UNKNOWN', 'SOS'], default: 'UNKNOWN' },
    status: { type: String, enum: ['QUEUED', 'SENT', 'DELIVERED', 'RECEIVED', 'FAILED'], default: 'QUEUED' },
    providerMessageId: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

module.exports = mongoose.model('FallbackMessage', fallbackSchema);
