import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/apiService';

export default function HomePage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('');
  const [condition, setCondition] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetchListings();
  }, [searchQuery, city, condition, minPrice, maxPrice]);

  const fetchListings = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (searchQuery) params.q = searchQuery;
      if (city) params.city = city;
      if (condition) params.condition = condition;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await api.get('/api/listings', { params });
      setListings(res.data.items || []);
    } catch (err) {
      setError('Failed to load listings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings();
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold text mb-2">
            Discover Local Treasures
          </h1>
          <p className="text-muted font-medium">Browse trusted items in your city</p>
        </div>
        <Link to="/listings/create" className="px-7 py-3 btn-accent rounded-xl font-bold shadow-subtle hover:shadow-card transition-all duration-300 transform hover:-translate-y-0.5 whitespace-nowrap">
          + Post Item
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-card rounded-2xl shadow-card p-8">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search Field */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Search Items</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., iPhone, laptop..."
                className="w-full px-4 py-3 bg-gray-50 border border-muted rounded-xl focus:bg-card focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 font-medium"
              />
            </div>

            {/* City Field */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., Casablanca"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 font-medium"
              />
            </div>

            {/* Condition Dropdown */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 font-medium"
              >
                <option value="">Any</option>
                <option value="new">New</option>
                <option value="good">Good</option>
                <option value="repair">Needs Repair</option>
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Min Price (DH)</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="100"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 font-medium"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Max Price (DH)</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="10000"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 font-medium"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button type="submit" className="px-8 py-3 btn-primary rounded-xl font-bold shadow-subtle hover:shadow-card transition-all duration-300 transform hover:-translate-y-0.5">Search</button>
            <button type="button" onClick={() => { setSearchQuery(''); setCity(''); setCondition(''); setMinPrice(''); setMaxPrice(''); }} className="px-8 py-3 bg-page text-muted rounded-xl font-bold hover:bg-card transition-all duration-300">Clear Filters</button>
          </div>
        </form>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-2xl font-medium">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16 text-gray-500">
          <div className="inline-flex items-center gap-2">
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce delay-200"></div>
          </div>
          <p className="mt-4 font-medium">Loading listings...</p>
        </div>
      )}

      {/* Listings Grid */}
      {!loading && listings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Link
              key={listing._id}
              to={`/listings/${listing._id}`}
              className="group bg-card rounded-2xl shadow-card hover:shadow-elegant transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
            >
              {/* Image */}
              <div className="h-56 bg-page flex items-center justify-center text-sm font-medium relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-60 transition-opacity"></div>
                <span className="relative">📦 {listing.title}</span>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Title & Condition */}
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text line-clamp-1 group-hover:text-primary transition">
                    {listing.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-page text-primary text-xs font-bold rounded-lg capitalize">
                      {listing.condition || 'Good'}
                    </span>
                    {listing.location && (
                      <span className="text-xs text-gray-600 font-medium">📍 {listing.location}</span>
                    )}
                  </div>
                </div>

                {/* Description */}
                {listing.description && (
                  <p className="text-gray-600 text-sm line-clamp-2 font-medium">
                    {listing.description}
                  </p>
                )}

                {/* Price */}
                  <div className="pt-2 border-t border-muted">
                  <span className="text-3xl font-bold text-primary">
                    {listing.price} DH
                  </span>
                </div>

                {/* Seller Info */}
                {listing.owner && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{listing.owner.name}</p>
                        {listing.owner.isVerified && (
                          <p className="text-xs text-primary-600 font-semibold">✓ Verified</p>
                        )}
                      </div>
                      {listing.owner.badges && listing.owner.badges.length > 0 && (
                        <div className="flex gap-1">
                          {listing.owner.badges.slice(0, 2).map((b, i) => (
                            <span key={i} className="text-lg" title={b}>
                              🏅
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && listings.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-card">
          <p className="text-3xl mb-3">🔍</p>
          <p className="text-lg font-bold text-gray-900 mb-2">No listings found</p>
          <p className="text-gray-600 font-medium mb-6">Try adjusting your filters or be the first to post!</p>
          <Link
            to="/listings/create"
            className="inline-block px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-bold shadow-subtle hover:shadow-card transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Create First Listing
          </Link>
        </div>
      )}
    </div>
  );
}
