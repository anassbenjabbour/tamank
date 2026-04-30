const express = require('express');
const Joi = require('joi');
const { validateBody } = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { sendMessage, getConversation, listConversations, blockUser, unblockUser } = require('../controllers/chatController');

const router = express.Router();

const sendSchema = Joi.object({ to: Joi.string().required(), content: Joi.string().min(1).required(), dealId: Joi.string().optional() });

router.get('/conversations', requireAuth, listConversations);
router.get('/conversations/:peerId/messages', requireAuth, getConversation);
router.post('/messages', requireAuth, validateBody(sendSchema), sendMessage);
router.post('/block/:id', requireAuth, blockUser);
router.delete('/block/:id', requireAuth, unblockUser);

module.exports = router;
