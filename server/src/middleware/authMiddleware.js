const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { inMemoryUsers } = require('../models/User');
const { getDBStatus } = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'travel_planner_super_secret_jwt_key_2026_production'
      );

      if (getDBStatus()) {
        const user = await User.findById(decoded.id).select('-password');
        if (user) {
          req.user = user;
          return next();
        }
      }

      // Check fallback store
      const fallbackUser = inMemoryUsers.find(
        (u) => u._id === decoded.id || u.id === decoded.id
      );

      if (fallbackUser) {
        const { password, ...userWithoutPassword } = fallbackUser;
        req.user = userWithoutPassword;
        return next();
      }

      return res.status(401).json({ message: 'Not authorized, user not found' });
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token provided' });
};

module.exports = { protect };
