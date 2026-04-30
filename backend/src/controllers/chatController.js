const Message = require('../models/Message');
const User = require('../models/User');

async function sendMessage(req, res) {
  const senderId = req.userId;
  const { to, content, dealId } = req.body;
  if (!to || !content) return res.status(400).json({ error: 'Missing fields' });

  const [sender, receiver] = await Promise.all([User.findById(senderId), User.findById(to)]);
  if (!sender || !receiver) return res.status(404).json({ error: 'User not found' });

  // If receiver has blocked sender, prevent message
  if (receiver.blockedUsers && receiver.blockedUsers.find((id) => id.toString() === senderId)) {
    return res.status(403).json({ error: 'You are blocked by this user' });
  }

  // If sender has blocked receiver, also prevent outgoing messages
  if (sender.blockedUsers && sender.blockedUsers.find((id) => id.toString() === to)) {
    return res.status(403).json({ error: 'Unblock user to send messages' });
  }

  const message = new Message({ sender: senderId, receiver: to, content, deal: dealId });
  await message.save();

  res.status(201).json({ message });
}

async function getConversation(req, res) {
  const userId = req.userId;
  const peerId = req.params.peerId;
  const { page = 1, limit = 50 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const messages = await Message.find({
    $or: [
      { sender: userId, receiver: peerId },
      { sender: peerId, receiver: userId }
    ]
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .exec();

  res.json({ messages: messages.reverse() });
}

async function listConversations(req, res) {
  const userId = req.userId;
  // Aggregate last message per conversation partner
  const agg = await Message.aggregate([
    { $match: { $or: [{ sender: userId }, { receiver: userId }] } },
    { $project: { sender: 1, receiver: 1, content: 1, createdAt: 1, other: { $cond: [{ $eq: ['$sender', userId] }, '$receiver', '$sender'] } } },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: '$other',
        lastMessage: { $first: '$content' },
        lastAt: { $first: '$createdAt' }
      }
    },
    { $sort: { lastAt: -1 } }
  ]).exec();

  // Populate user info
  const conversations = await Promise.all(
    agg.map(async (item) => {
      const user = await User.findById(item._id).select('name city badges trustScore isVerified');
      return { user, lastMessage: item.lastMessage, lastAt: item.lastAt };
    })
  );

  res.json({ conversations });
}

async function blockUser(req, res) {
  const userId = req.userId;
  const targetId = req.params.id;
  if (userId === targetId) return res.status(400).json({ error: 'Cannot block yourself' });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: 'Not found' });
  if (!user.blockedUsers) user.blockedUsers = [];
  if (!user.blockedUsers.find((id) => id.toString() === targetId)) {
    user.blockedUsers.push(targetId);
    await user.save();
  }
  res.json({ message: 'User blocked' });
}

async function unblockUser(req, res) {
  const userId = req.userId;
  const targetId = req.params.id;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: 'Not found' });
  user.blockedUsers = (user.blockedUsers || []).filter((id) => id.toString() !== targetId);
  await user.save();
  res.json({ message: 'User unblocked' });
}

module.exports = { sendMessage, getConversation, listConversations, blockUser, unblockUser };
