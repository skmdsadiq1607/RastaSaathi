const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    address: { type: String, required: true, trim: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }
    },
    specialties: { type: [String], default: [], index: true },
    icuBeds: { type: Number, min: 0, default: 0 },
    traumaCenter: { type: Boolean, default: false, index: true },
    bloodBankAvailable: { type: Boolean, default: false },
    phone: { type: String, required: true, trim: true },
    emergencyContact: { type: String, required: true, trim: true },
    region: { type: String, default: 'Hyderabad', index: true },
    active: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

hospitalSchema.index({ location: '2dsphere' });
hospitalSchema.index({ traumaCenter: 1, bloodBankAvailable: 1 });

module.exports = mongoose.model('Hospital', hospitalSchema);
