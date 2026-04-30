const Listing = require('../models/Listing');
const User = require('../models/User');
const { suggestPriceRange } = require('../utils/price');

async function createListing(req, res) {
  const { title, description, price, condition, location, images } = req.body;
  const user = await User.findById(req.userId);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  if (!user.isVerified) return res.status(403).json({ error: 'Email verification required to post listings' });

  const listing = new Listing({ title, description, price, condition, location, images: images || [], owner: req.userId });
  await listing.save();
  res.status(201).json({ listing });
}

async function updateListing(req, res) {
  const id = req.params.id;
  const listing = await Listing.findById(id);
  if (!listing) return res.status(404).json({ error: 'Listing not found' });
  if (listing.owner.toString() !== req.userId) return res.status(403).json({ error: 'Forbidden' });

  const { title, description, price, condition, location, images, isActive } = req.body;
  if (title !== undefined) listing.title = title;
  if (description !== undefined) listing.description = description;
  if (price !== undefined) listing.price = price;
  if (condition !== undefined) listing.condition = condition;
  if (location !== undefined) listing.location = location;
  if (images !== undefined) listing.images = images;
  if (isActive !== undefined) listing.isActive = isActive;

  await listing.save();
  res.json({ listing });
}

async function deleteListing(req, res) {
  const id = req.params.id;
  const listing = await Listing.findById(id);
  if (!listing) return res.status(404).json({ error: 'Listing not found' });
  if (listing.owner.toString() !== req.userId) return res.status(403).json({ error: 'Forbidden' });
  await listing.remove();
  res.json({ message: 'Deleted' });
}

async function getListing(req, res) {
  const id = req.params.id;
  const listing = await Listing.findById(id).populate('owner', 'name city badges trustScore isVerified');
  if (!listing) return res.status(404).json({ error: 'Listing not found' });
  const priceRange = suggestPriceRange(listing.price, listing.condition);
  const feedback = listing.priceFeedbackPercent();
  res.json({ listing, priceRange, feedback });
}

async function listListings(req, res) {
  const { q, city, condition, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
  const filter = { isActive: true };
  if (city) filter.location = city;
  if (condition) filter.condition = condition;
  if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
  if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };

  let query = Listing.find(filter).populate('owner', 'name city badges trustScore');
  if (q) {
    // text search fallback to regex
    query = Listing.find({ $text: { $search: q }, ...filter }).populate('owner', 'name city badges trustScore');
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([query.sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).exec(), Listing.countDocuments(filter).exec()]);
  res.json({ items, total, page: Number(page), limit: Number(limit) });
}

async function votePriceFeedback(req, res) {
  const id = req.params.id;
  const { vote } = req.body; // 'fair' or 'expensive'
  const listing = await Listing.findById(id);
  if (!listing) return res.status(404).json({ error: 'Listing not found' });
  if (vote === 'fair') listing.fairVotes += 1;
  else if (vote === 'expensive') listing.expensiveVotes += 1;
  else return res.status(400).json({ error: 'Invalid vote' });
  await listing.save();
  const feedback = listing.priceFeedbackPercent();
  res.json({ feedback });
}

module.exports = { createListing, updateListing, deleteListing, getListing, listListings, votePriceFeedback };
