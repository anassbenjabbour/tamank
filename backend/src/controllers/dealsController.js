const Deal = require('../models/Deal');
const Listing = require('../models/Listing');
const User = require('../models/User');
const Rating = require('../models/Rating');
const { updateTrustAndBadges } = require('../utils/trust');

async function initiateDeal(req, res) {
  const buyerId = req.userId;
  const { listingId } = req.body;
  if (!listingId) return res.status(400).json({ error: 'Missing listingId' });

  const listing = await Listing.findById(listingId);
  if (!listing) return res.status(404).json({ error: 'Listing not found' });
  if (!listing.isActive) return res.status(400).json({ error: 'Listing not available' });

  const sellerId = listing.owner.toString();
  if (sellerId === buyerId) return res.status(400).json({ error: 'Cannot buy your own listing' });

  const deal = new Deal({ buyer: buyerId, seller: sellerId, listing: listingId });
  await deal.save();
  res.status(201).json({ deal });
}

async function agreeDeal(req, res) {
  const userId = req.userId;
  const { dealId } = req.body;
  const deal = await Deal.findById(dealId);
  if (!deal) return res.status(404).json({ error: 'Deal not found' });
  // Only seller can agree
  if (deal.seller.toString() !== userId) return res.status(403).json({ error: 'Only seller can agree' });
  deal.status = 'agreed';
  await deal.save();
  res.json({ deal });
}

async function confirmArrival(req, res) {
  const userId = req.userId;
  const dealId = req.params.id;
  const deal = await Deal.findById(dealId);
  if (!deal) return res.status(404).json({ error: 'Deal not found' });

  if (deal.buyer.toString() === userId) deal.arrivalConfirmed.buyer = true;
  else if (deal.seller.toString() === userId) deal.arrivalConfirmed.seller = true;
  else return res.status(403).json({ error: 'Not a participant' });

  await deal.save();
  res.json({ deal });
}

async function completeDeal(req, res) {
  const userId = req.userId;
  const dealId = req.params.id;
  const deal = await Deal.findById(dealId);
  if (!deal) return res.status(404).json({ error: 'Deal not found' });

  // Only participants can complete; require both arrival confirmed
  if (deal.buyer.toString() !== userId && deal.seller.toString() !== userId) return res.status(403).json({ error: 'Not a participant' });
  if (!deal.arrivalConfirmed.buyer || !deal.arrivalConfirmed.seller) return res.status(400).json({ error: 'Both users must confirm arrival before completing' });

  deal.status = 'completed';
  await deal.save();

  // Update completedDeals count for both users
  await User.findByIdAndUpdate(deal.buyer, { $inc: { completedDeals: 1 } });
  await User.findByIdAndUpdate(deal.seller, { $inc: { completedDeals: 1 } });

  // Recompute trust for both parties
  await Promise.all([updateTrustAndBadges(deal.buyer), updateTrustAndBadges(deal.seller)]);

  res.json({ deal });
}

async function submitRating(req, res) {
  const raterId = req.userId;
  const { dealId, rating, comment } = req.body;
  if (!dealId || !rating) return res.status(400).json({ error: 'Missing fields' });

  const deal = await Deal.findById(dealId);
  if (!deal) return res.status(404).json({ error: 'Deal not found' });
  if (deal.status !== 'completed') return res.status(400).json({ error: 'Can only rate after completion' });

  let ratedUser;
  if (deal.buyer.toString() === raterId) ratedUser = deal.seller;
  else if (deal.seller.toString() === raterId) ratedUser = deal.buyer;
  else return res.status(403).json({ error: 'Not a participant' });

  const existing = await Rating.findOne({ rater: raterId, deal: dealId });
  if (existing) return res.status(400).json({ error: 'Already rated' });

  const r = new Rating({ rater: raterId, ratedUser, rating: Number(rating), comment: comment || '', deal: dealId });
  await r.save();

  // Update trust score and badges for rated user
  await updateTrustAndBadges(ratedUser);

  res.json({ rating: r });
}

module.exports = { initiateDeal, agreeDeal, confirmArrival, completeDeal, submitRating };
