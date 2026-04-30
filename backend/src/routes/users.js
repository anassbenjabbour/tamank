const express = require('express');
const Joi = require('joi');
const { validateBody } = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { getPublicProfile, getMe, updateMe, changePassword } = require('../controllers/userController');

const router = express.Router();

const updateSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  city: Joi.string().allow('', null).optional()
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required()
});

router.get('/me', requireAuth, getMe);
router.put('/me', requireAuth, validateBody(updateSchema), updateMe);
router.post('/me/change-password', requireAuth, validateBody(changePasswordSchema), changePassword);
router.get('/:id', getPublicProfile);

module.exports = router;
