const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    status: { type: String, enum: ['initiated', 'agreed', 'completed', 'cancelled'], default: 'initiated' },
    arrivalConfirmed: {
      buyer: { type: Boolean, default: false },
      seller: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Deal', dealSchema);
