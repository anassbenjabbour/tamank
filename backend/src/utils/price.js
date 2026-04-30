function suggestPriceRange(price, condition) {
  // Simple rule engine: adjust ranges by condition
  // 'new' => -5% .. +5%
  // 'good' => -15% .. +10%
  // 'repair' => -50% .. -10%
  let minFactor = 0.85;
  let maxFactor = 1.1;
  if (condition === 'new') {
    minFactor = 0.95;
    maxFactor = 1.05;
  } else if (condition === 'good') {
    minFactor = 0.85;
    maxFactor = 1.1;
  } else if (condition === 'repair') {
    minFactor = 0.5;
    maxFactor = 0.9;
  }
  const min = Math.round(price * minFactor);
  const max = Math.round(price * maxFactor);
  return { min, max };
}

module.exports = { suggestPriceRange };
