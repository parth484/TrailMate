const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'travel_planner_super_secret_jwt_key_2026_production');

      // Attempt to load from MongoDB first
      try {
        const user = await User.findById(decoded.id).select('-password');
        if (user) {
          req.user = user;
          return next();
        }
      } catch (err) {
        // Fallback store access
      }

      // Check fallback store
      const { inMemoryUsers } = require('../models/User');
      const fallbackUser = inMemoryUsers.find(u => u._id === decoded.id || u.id === decoded.id);
      
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

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
