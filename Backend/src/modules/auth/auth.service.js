const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../../config/env');
const { getRedisClient } = require('../../config/redis');
const { toPoint } = require('../../utils/geoUtils');
const { AppError } = require('../../utils/responseFormatter');
const smsService = require('../../services/sms.service');
const User = require('./auth.model');

function sanitizeUser(user) {
  const object = user.toObject ? user.toObject() : user;
  delete object.passwordHash;
  delete object.refreshTokenHash;
  delete object.resetOtpHash;
  return object;
}

function signAccessToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, { expiresIn: '15m' });
}

function signRefreshToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, env.jwtRefreshSecret, { expiresIn: '7d' });
}

async function issueTokens(user) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await user.save();
  return { accessToken, refreshToken };
}

async function register(payload) {
  const exists = await User.findOne({ email: payload.email.toLowerCase() });
  if (exists) throw new AppError('Email is already registered', 409, 'EMAIL_EXISTS');
  const passwordHash = await bcrypt.hash(payload.password, 12);
  const user = await User.create({
    name: payload.name,
    phone: payload.phone,
    email: payload.email.toLowerCase(),
    passwordHash,
    role: payload.role,
    languagePreference: payload.languagePreference,
    emergencyContacts: payload.emergencyContacts,
    location: payload.lat && payload.lng ? toPoint(payload.lat, payload.lng) : undefined
  });
  const tokens = await issueTokens(user);
  return { user: sanitizeUser(user), ...tokens };
}

async function login(payload) {
  const user = await User.findOne({ email: payload.email.toLowerCase() });
  if (!user) throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  const valid = await bcrypt.compare(payload.password, user.passwordHash);
  if (!valid) throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  const tokens = await issueTokens(user);
  return { user: sanitizeUser(user), ...tokens };
}

async function refresh(refreshToken) {
  if (!refreshToken) throw new AppError('Refresh token required', 401, 'REFRESH_REQUIRED');
  let payload;
  try {
    payload = jwt.verify(refreshToken, env.jwtRefreshSecret);
  } catch (_error) {
    throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH');
  }
  const user = await User.findById(payload.sub);
  if (!user || !user.refreshTokenHash) throw new AppError('Refresh token is not active', 401, 'REFRESH_INACTIVE');
  const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
  if (!matches) throw new AppError('Refresh token mismatch', 401, 'REFRESH_MISMATCH');
  const tokens = await issueTokens(user);
  return { user: sanitizeUser(user), ...tokens };
}

async function logout(userId, accessToken) {
  const user = await User.findById(userId);
  if (user) {
    user.refreshTokenHash = undefined;
    await user.save();
  }
  if (accessToken) {
    const decoded = jwt.decode(accessToken);
    const ttl = decoded && decoded.exp ? Math.max(decoded.exp - Math.floor(Date.now() / 1000), 1) : 900;
    await getRedisClient().set('jwt:blacklist:' + accessToken, '1', 'EX', ttl);
  }
  return { loggedOut: true };
}

async function attachFcmToken(userId, token) {
  const user = await User.findByIdAndUpdate(userId, { $addToSet: { fcmTokens: token } }, { new: true }).select('-passwordHash -refreshTokenHash -resetOtpHash');
  if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  return sanitizeUser(user);
}

async function requestPasswordReset({ phone, email }) {
  const query = email ? { $or: [{ phone }, { email: email.toLowerCase() }] } : { phone };
  const user = await User.findOne(query);
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  if (user) {
    user.resetOtpHash = await bcrypt.hash(otp, 10);
    user.resetOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await smsService.sendSms(user.phone, 'RoadSoS password reset OTP: ' + otp + '. It expires in 10 minutes.');
  }
  return { otpSent: Boolean(user), expiresInSeconds: 600 };
}

async function resetPassword({ phone, otp, password }) {
  const user = await User.findOne({ phone });
  if (!user || !user.resetOtpHash || !user.resetOtpExpiresAt || user.resetOtpExpiresAt < new Date()) {
    throw new AppError('OTP is invalid or expired', 400, 'INVALID_OTP');
  }
  const matches = await bcrypt.compare(otp, user.resetOtpHash);
  if (!matches) throw new AppError('OTP is invalid or expired', 400, 'INVALID_OTP');
  user.passwordHash = await bcrypt.hash(password, 12);
  user.resetOtpHash = undefined;
  user.resetOtpExpiresAt = undefined;
  await user.save();
  return { reset: true };
}

async function getProfile(userId) {
  const user = await User.findById(userId).select('-passwordHash -refreshTokenHash -resetOtpHash');
  if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  return user;
}

module.exports = { register, login, refresh, logout, attachFcmToken, requestPasswordReset, resetPassword, getProfile };
