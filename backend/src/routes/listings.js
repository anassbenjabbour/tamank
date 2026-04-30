const express = require('express');
const Joi = require('joi');
const { validateBody } = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { createListing, updateListing, deleteListing, getListing, listListings, votePriceFeedback } = require('../controllers/listingsController');

const router = express.Router();

const createSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().allow('', null).optional(),
  price: Joi.number().positive().required(),
  condition: Joi.string().valid('new', 'good', 'repair').required(),
  location: Joi.string().allow('', null).optional(),
  images: Joi.array().items(Joi.string().uri()).optional()
});

const updateSchema = Joi.object({
  title: Joi.string().min(3).max(200).optional(),
  description: Joi.string().allow('', null).optional(),
  price: Joi.number().positive().optional(),
  condition: Joi.string().valid('new', 'good', 'repair').optional(),
  location: Joi.string().allow('', null).optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  isActive: Joi.boolean().optional()
});

const voteSchema = Joi.object({ vote: Joi.string().valid('fair', 'expensive').required() });

router.get('/', listListings);
router.post('/', requireAuth, validateBody(createSchema), createListing);
router.get('/:id', getListing);
router.put('/:id', requireAuth, validateBody(updateSchema), updateListing);
router.delete('/:id', requireAuth, deleteListing);
router.post('/:id/price-feedback', validateBody(voteSchema), votePriceFeedback);

module.exports = router;
