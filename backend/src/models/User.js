const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    city: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    trustScore: { type: Number, default: 0 },
    badges: { type: [String], default: [] },
    completedDeals: { type: Number, default: 0 },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.verificationToken;
  delete obj.verificationTokenExpires;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
