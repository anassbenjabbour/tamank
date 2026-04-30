const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    rater: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ratedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: '' },
    deal: { type: mongoose.Schema.Types.ObjectId, ref: 'Deal' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Rating', ratingSchema);
