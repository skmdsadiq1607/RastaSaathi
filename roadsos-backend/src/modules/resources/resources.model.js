const mongoose = require('mongoose');

const bloodUnitsSchema = new mongoose.Schema(
  {
    A: { type: Number, min: 0, default: 0 },
    B: { type: Number, min: 0, default: 0 },
    O: { type: Number, min: 0, default: 0 },
    AB: { type: Number, min: 0, default: 0 }
  },
  { _id: false }
);

const resourcesSchema = new mongoose.Schema(
  {
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true, unique: true, index: true },
    icuBeds: { type: Number, min: 0, default: 0 },
    ventilators: { type: Number, min: 0, default: 0 },
    bloodUnits: { type: bloodUnitsSchema, default: () => ({}) },
    ambulancesAvailable: { type: Number, min: 0, default: 0 },
    traumaTeamOnDuty: { type: Boolean, default: false },
    lastSyncedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('HospitalResources', resourcesSchema);
