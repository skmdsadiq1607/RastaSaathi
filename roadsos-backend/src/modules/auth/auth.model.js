const mongoose = require('mongoose');
const { ROLES, LANGUAGES } = require('../../utils/constants');

const emergencyContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    relation: { type: String, trim: true, default: 'contact' }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(ROLES), required: true, index: true },
    languagePreference: { type: String, enum: LANGUAGES, default: 'en' },
    emergencyContacts: { type: [emergencyContactSchema], validate: [(items) => items.length <= 3, 'Maximum 3 emergency contacts'] },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: undefined }
    },
    responderStatus: { type: String, enum: ['AVAILABLE', 'BUSY', 'OFFLINE'], default: 'AVAILABLE' },
    fcmTokens: { type: [String], default: [] },
    refreshTokenHash: { type: String },
    resetOtpHash: { type: String },
    resetOtpExpiresAt: { type: Date }
  },
  { timestamps: true }
);

userSchema.index({ location: '2dsphere' });
userSchema.index({ role: 1, responderStatus: 1 });

module.exports = mongoose.model('User', userSchema);
