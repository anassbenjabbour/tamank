const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const config = require('./config');
  const authRoutes = require('./routes/auth');
  const usersRoutes = require('./routes/users');
  const listingsRoutes = require('./routes/listings');
  const chatRoutes = require('./routes/chat');
  const dealsRoutes = require('./routes/deals');
  const meetupsRoutes = require('./routes/meetups');

async function main() {
  await mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const app = express();
  app.use(express.json());

  // Global rate limiter (light)
  const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 120
  });
  app.use(apiLimiter);

  app.use('/api/auth', authRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/listings', listingsRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/deals', dealsRoutes);
  app.use('/api/meetups', meetupsRoutes);

  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  const port = config.port;
  app.listen(port, () => {
    console.log(`Tamank backend listening on port ${port}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
