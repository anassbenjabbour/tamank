import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/apiService';

export default function CreateListingPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('good');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/api/listings', {
        title,
        description,
        price: Number(price),
        condition,
        location,
        images: []
      });
      navigate(`/listings/${res.data.listing._id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <Link to="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-bold transition">
        ← Back to listings
      </Link>

      {/* Main Card */}
      <div className="max-w-2xl bg-white rounded-2xl shadow-elegant p-8 md:p-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Post an Item for Sale</h1>
          <p className="text-gray-600 font-medium">Share your item with trusted buyers in your community</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl mb-8 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Title Field */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Item Title <span className="text-accent-600">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., iPhone 12 Pro, Mountain Bike..."
              maxLength="200"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 font-medium"
              required
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-600 font-medium">Be specific and descriptive</p>
              <p className="text-xs text-gray-500 font-medium">{title.length}/200</p>
            </div>
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us more about your item: brand, model, condition, features, any damage..."
              rows="6"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 font-medium resize-none"
            />
            <p className="text-xs text-gray-600 font-medium mt-2">More details = faster sales</p>
          </div>

          {/* Price & Condition Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Price (DH) <span className="text-accent-600">*</span>
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                min="0"
                step="100"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Condition <span className="text-accent-600">*</span>
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 font-medium"
                required
              >
                <option value="new">✨ New (Never used)</option>
                <option value="good">👍 Good (Lightly used)</option>
                <option value="repair">🔧 Needs Repair</option>
              </select>
            </div>
          </div>

          {/* Location Field */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Location / City
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Casablanca, Rabat, Marrakech..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 font-medium"
            />
          </div>

          {/* Price Tips */}
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-xl p-6">
            <p className="text-sm text-primary-900 font-bold">
              💡 <strong>Fair Pricing Tips:</strong>
            </p>
            <ul className="text-sm text-primary-800 mt-3 space-y-1 font-medium ml-6 list-disc">
              <li>Research similar items in your area</li>
              <li>Factor in wear and tear</li>
              <li>Be open to reasonable offers</li>
              <li>Community members vote on fairness</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-bold shadow-subtle hover:shadow-card hover:from-primary-700 hover:to-primary-800 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 transform hover:-translate-y-0.5 disabled:hover:translate-y-0"
            >
              {loading ? 'Publishing...' : '🚀 Publish Listing'}
            </button>
            <Link
              to="/"
              className="flex-1 px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
