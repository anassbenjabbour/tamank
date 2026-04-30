const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateVerificationToken } = require('../utils/token');
const { sendVerificationEmail } = require('../utils/email');
const config = require('../config');

const SALT_ROUNDS = 12;

async function register(req, res) {
  const { name, email, password, city } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing required fields' });

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: 'Email already in use' });

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const verificationToken = generateVerificationToken();
  const verificationTokenExpires = new Date(Date.now() + 24 * 3600 * 1000);

  const user = new User({ name, email, passwordHash, city, verificationToken, verificationTokenExpires });
  await user.save();

  // Send verification email (best-effort)
  try {
    await sendVerificationEmail(email, verificationToken);
  } catch (err) {
    console.warn('Failed to send verification email', err);
  }

  return res.status(201).json({ message: 'Registered. Please verify your email before posting.' });
}

async function verifyEmail(req, res) {
  const token = req.query.token || req.body.token;
  if (!token) return res.status(400).json({ error: 'Token required' });

  const user = await User.findOne({ verificationToken: token });
  if (!user) return res.status(400).json({ error: 'Invalid token' });
  if (user.verificationTokenExpires && user.verificationTokenExpires < new Date()) {
    return res.status(400).json({ error: 'Token expired' });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  return res.json({ message: 'Email verified. You can now log in.' });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  if (!user.isVerified) return res.status(403).json({ error: 'Email not verified' });

  const token = jwt.sign({ sub: user._id.toString() }, config.jwtSecret, { expiresIn: '7d' });

  return res.json({ token, user: user.toJSON() });
}

async function me(req, res) {
  const user = await User.findById(req.userId).select('-passwordHash -verificationToken -verificationTokenExpires');
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json({ user });
}

module.exports = { register, login, verifyEmail, me };
