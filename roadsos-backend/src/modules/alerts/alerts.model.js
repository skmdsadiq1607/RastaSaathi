const mongoose = require('mongoose');
const { ALERT_STATUS } = require('../../utils/constants');

const alertSchema = new mongoose.Schema(
  {
    incident: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', required: true, index: true },
    recipientUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recipientPhone: { type: String, trim: true },
    channel: { type: String, enum: ['FCM', 'SMS', 'SOCKET'], required: true, index: true },
    status: { type: String, enum: Object.values(ALERT_STATUS), default: ALERT_STATUS.QUEUED, index: true },
    language: { type: String, enum: ['en', 'hi', 'ta', 'te', 'kn'], default: 'en' },
    message: { type: String, required: true },
    providerMessageId: { type: String },
    deliveryError: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

alertSchema.index({ incident: 1, channel: 1 });

module.exports = mongoose.model('Alert', alertSchema);
