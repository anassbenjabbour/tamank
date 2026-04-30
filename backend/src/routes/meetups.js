const express = require('express');
const { suggestLocations } = require('../controllers/meetupController');

const router = express.Router();

// GET /api/meetups/suggest?city=casablanca
router.get('/suggest', suggestLocations);

module.exports = router;
