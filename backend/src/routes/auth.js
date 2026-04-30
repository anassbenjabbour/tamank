const express = require('express');
const rateLimit = require('express-rate-limit');
const Joi = require('joi');
const { validateBody } = require('../middleware/validate');
const { register, login, verifyEmail, me } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const authLimiter = rateLimit({ windowMs: 60 * 1000, max: 20 });

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  city: Joi.string().allow('', null)
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

router.post('/register', authLimiter, validateBody(registerSchema), register);
router.post('/login', authLimiter, validateBody(loginSchema), login);
router.get('/verify-email', authLimiter, verifyEmail);
router.get('/me', requireAuth, me);

module.exports = router;
