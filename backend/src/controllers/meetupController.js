const { getSafeLocations } = require('../utils/safeLocations');

async function suggestLocations(req, res) {
  const city = req.query.city || '';
  const locations = getSafeLocations(city);
  res.json({ locations });
}

module.exports = { suggestLocations };
