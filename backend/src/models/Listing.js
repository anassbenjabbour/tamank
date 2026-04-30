const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    price: { type: Number, required: true },
    condition: { type: String, enum: ['new', 'good', 'repair'], default: 'good' },
    location: { type: String, default: '' },
    images: { type: [String], default: [] },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fairVotes: { type: Number, default: 0 },
    expensiveVotes: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

listingSchema.index({ title: 'text', description: 'text' });

listingSchema.methods.priceFeedbackPercent = function () {
  const total = this.fairVotes + this.expensiveVotes;
  if (total === 0) return { fair: 0, expensive: 0 };
  return { fair: Math.round((this.fairVotes / total) * 100), expensive: Math.round((this.expensiveVotes / total) * 100) };
};

module.exports = mongoose.model('Listing', listingSchema);
