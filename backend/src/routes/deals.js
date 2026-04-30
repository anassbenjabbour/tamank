const express = require('express');
const Joi = require('joi');
const { validateBody } = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { initiateDeal, agreeDeal, confirmArrival, completeDeal, submitRating } = require('../controllers/dealsController');

const router = express.Router();

const initSchema = Joi.object({ listingId: Joi.string().required() });
const agreeSchema = Joi.object({ dealId: Joi.string().required() });
const ratingSchema = Joi.object({ dealId: Joi.string().required(), rating: Joi.number().min(1).max(5).required(), comment: Joi.string().allow('', null).optional() });

router.post('/', requireAuth, validateBody(initSchema), initiateDeal);
router.post('/agree', requireAuth, validateBody(agreeSchema), agreeDeal);
router.post('/:id/confirm-arrival', requireAuth, confirmArrival);
router.post('/:id/complete', requireAuth, completeDeal);
router.post('/:id/rate', requireAuth, validateBody(ratingSchema), submitRating);

module.exports = router;
