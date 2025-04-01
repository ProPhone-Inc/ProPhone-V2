import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['owner', 'super_admin', 'user', 'sub_user'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'banned'],
    default: 'active'
  },
  showAds: {
    type: Boolean,
    default: true
  },
  adFreeSubscription: {
    active: { type: Boolean, default: false },
    startDate: Date,
    nextBillingDate: Date,
    stripeSubscriptionId: String
  },
  subUserSubscriptions: [{
    subUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    active: Boolean,
    startDate: Date,
    nextBillingDate: Date,
    stripeSubscriptionId: String
  }],
  permissions: [{
    type: String
  }],
  parentUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  avatar: String,
  joinDate: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);