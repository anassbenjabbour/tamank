const Rating = require('../models/Rating');
const User = require('../models/User');

async function updateTrustAndBadges(userId) {
  const user = await User.findById(userId);
  if (!user) return;

  // Compute average rating
  const ratings = await Rating.find({ ratedUser: userId });
  const avgRating = ratings.length ? ratings.reduce((s, r) => s + r.rating, 0) / ratings.length : 0;

  // Simple trust score: completedDeals * 10 + avgRating * 20
  const trustScore = Math.min(100, Math.round((user.completedDeals || 0) * 10 + avgRating * 20));
  user.trustScore = trustScore;

  // Badges
  const badges = new Set(user.badges || []);
  if (user.isVerified) badges.add('verified_user');
  if ((user.completedDeals || 0) >= 5) badges.add('5_deals_completed');
  if (trustScore >= 60) badges.add('trusted_seller');

  user.badges = Array.from(badges);
  await user.save();
}

module.exports = { updateTrustAndBadges };
