// Static curated list of safe public meetup locations by city.
// No GPS tracking. This is a simple lookup used to suggest meeting spots.

const LOCATIONS = {
  // Example entries for major Moroccan cities. Add more as needed.
  casablanca: [
    { id: 'casa1', name_en: 'Morocco Mall - Main Entrance', name_fr: 'Morocco Mall - Entrée principale', name_ar: 'الموركو مول - المدخل الرئيسي', address: 'Boulevard de la Corniche, Casablanca', notes: 'Busy public mall with security' },
    { id: 'casa2', name_en: 'Casa Port Train Station', name_fr: 'Gare Casa Port', name_ar: 'محطة القطار كازا بورت', address: 'Avenue des FAR, Casablanca', notes: 'Well-lit public transport hub' },
    { id: 'casa3', name_en: 'Place Mohammed V', name_fr: 'Place Mohammed V', name_ar: 'ساحة محمد الخامس', address: 'City Center, Casablanca', notes: 'Central square with regular foot traffic' }
  ],
  rabat: [
    { id: 'rabat1', name_en: 'Rabat Ville Station', name_fr: 'Gare Rabat Ville', name_ar: 'محطة الرباط المدينة', address: 'Rabat', notes: 'Main train station' },
    { id: 'rabat2', name_en: 'Boulevard Mohamed V', name_fr: 'Boulevard Mohamed V', name_ar: 'شارع محمد الخامس', address: 'Rabat city center', notes: 'Busy boulevard with shops and cafés' }
  ],
  marrakech: [
    { id: 'marr1', name_en: 'Jemaa el-Fnaa (outer cafés)', name_fr: 'Jemaa el-Fnaa (cafés extérieurs)', name_ar: 'جامع الفناء (المقاهي الخارجية)', address: 'Medina, Marrakech', notes: 'Busy tourist square — choose outer cafés' },
    { id: 'marr2', name_en: 'Menara Mall', name_fr: 'Menara Mall', name_ar: 'منارة مول', address: 'Avenue Mohammed VI, Marrakech', notes: 'Mall with security and parking' }
  ]
};

function getSafeLocations(city) {
  if (!city) return [];
  const key = city.trim().toLowerCase();
  return LOCATIONS[key] || [];
}

module.exports = { getSafeLocations };
