const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const inMemoryUsers = [
  {
    _id: 'user_demo_traveler',
    name: 'Demo Traveler',
    email: 'demo@travelplanner.com',
    password: bcrypt.hashSync('123456', 10),
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    bio: 'Exploring the world with Trail Mate',
    createdAt: new Date(),
  },
];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    bio: {
      type: String,
      default: 'Avid traveler & adventure seeker',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
module.exports.inMemoryUsers = inMemoryUsers;
