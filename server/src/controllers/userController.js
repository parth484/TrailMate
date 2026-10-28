const User = require('../models/User');
const { inMemoryUsers } = require('../models/User');
const bcrypt = require('bcryptjs');
const { getDBStatus } = require('../config/db');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { name, bio, avatar } = req.body;

    if (getDBStatus()) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      if (name) user.name = name;
      if (bio !== undefined) user.bio = bio;
      if (avatar) user.avatar = avatar;

      const updatedUser = await user.save();
      return res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
      });
    } else {
      const user = inMemoryUsers.find(u => u._id === userId || u.id === userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      if (name) user.name = name;
      if (bio !== undefined) user.bio = bio;
      if (avatar) user.avatar = avatar;

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    if (getDBStatus()) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password does not match' });
      }

      user.password = newPassword;
      await user.save();
      return res.json({ message: 'Password updated successfully' });
    } else {
      const user = inMemoryUsers.find(u => u._id === userId || u.id === userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password does not match' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      return res.json({ message: 'Password updated successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateProfile, changePassword };
