const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { getRedisClient } = require('../config/redis');
const User = require('../modules/auth/auth.model');
const { AppError } = require('../utils/responseFormatter');

function extractToken(req) {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7);
  return req.cookies && req.cookies.accessToken ? req.cookies.accessToken : null;
}

async function requireAuth(req, _res, next) {
  try {
    const token = extractToken(req);
    if (!token) throw new AppError('Authentication required', 401, 'AUTH_REQUIRED');
    const redis = getRedisClient();
    const blacklisted = await redis.get('jwt:blacklist:' + token);
    if (blacklisted) throw new AppError('Token has been logged out', 401, 'TOKEN_BLACKLISTED');
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub).select('-passwordHash -refreshTokenHash -resetOtpHash');
    if (!user) throw new AppError('User no longer exists', 401, 'USER_NOT_FOUND');
    req.user = { id: user.id, role: user.role, languagePreference: user.languagePreference, profile: user };
    next();
  } catch (error) {
    next(error.name === 'JsonWebTokenError' ? new AppError('Invalid token', 401, 'INVALID_TOKEN') : error);
  }
}

function authorize(...roles) {
  return (req, _res, next) => {
    try {
      if (!req.user) throw new AppError('Authentication required', 401, 'AUTH_REQUIRED');
      if (!roles.includes(req.user.role)) throw new AppError('Insufficient permissions', 403, 'FORBIDDEN');
      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { requireAuth, authorize, extractToken };
