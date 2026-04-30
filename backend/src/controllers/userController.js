const bcrypt = require('bcrypt');
const User = require('../models/User');

const SALT_ROUNDS = 12;

async function getPublicProfile(req, res) {
  const id = req.params.id;
  const user = await User.findById(id).select('name city badges trustScore completedDeals isVerified');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
}

async function getMe(req, res) {
  const user = await User.findById(req.userId).select('-passwordHash -verificationToken -verificationTokenExpires');
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json({ user });
}

async function updateMe(req, res) {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: 'Not found' });

  const { name, city } = req.body;
  if (name) user.name = name;
  if (city !== undefined) user.city = city;
  await user.save();

  res.json({ user: user.toJSON() });
}

async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Missing fields' });

  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: 'Not found' });

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid current password' });

  user.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await user.save();

  res.json({ message: 'Password updated' });
}

module.exports = { getPublicProfile, getMe, updateMe, changePassword };
