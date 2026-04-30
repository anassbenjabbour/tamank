import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/apiService';
import { getUser } from '../utils/auth';

export default function MeetupConfirmationPage() {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const currentUser = getUser();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [city, setCity] = useState('casablanca');

  useEffect(() => {
    fetchSafeLocations();
  }, [city]);

  const fetchSafeLocations = async () => {
    try {
      const res = await api.get('/api/meetups/suggest', { params: { city } });
      setLocations(res.data.locations || []);
    } catch (err) {
      setError('Failed to load meetup locations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmArrival = async () => {
    try {
      await api.post(`/api/deals/${dealId}/confirm-arrival`);
      setConfirmed(true);
      setTimeout(() => navigate(`/deals/${dealId}`), 2000);
    } catch (err) {
      alert('Failed to confirm arrival');
    }
  };

  if (confirmed) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-green-900 mb-4">✓ Arrival Confirmed!</h1>
          <p className="text-green-800 mb-6">Redirecting to deal page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to={`/deals/${dealId}`} className="text-blue-600 hover:underline">
        ← Back to deal
      </Link>

      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Safe Meetup Locations</h1>
        <p className="text-gray-600 mb-6">Choose a public location that's safe and convenient for both parties.</p>

        {/* City Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select City</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="casablanca">Casablanca</option>
            <option value="rabat">Rabat</option>
            <option value="marrakech">Marrakech</option>
            <option value="fes">Fes</option>
            <option value="tangier">Tangier</option>
          </select>
        </div>

        {error && <div className="bg-red-50 text-red-800 p-4 rounded mb-6">{error}</div>}

        {loading && <div className="text-center py-12 text-gray-500">Loading locations...</div>}

        {/* Locations */}
        {!loading && locations.length > 0 && (
          <div className="space-y-3 mb-8">
            {locations.map((loc) => (
              <div
                key={loc.id}
                onClick={() => setSelectedLocation(loc)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                  selectedLocation?.id === loc.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{loc.name_en}</h3>
                    <p className="text-sm text-gray-700 mt-1">{loc.address}</p>
                    <p className="text-xs text-gray-500 mt-2">💡 {loc.notes}</p>
                    <div className="mt-3 flex gap-2 text-xs">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {loc.name_fr}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {loc.name_ar}
                      </span>
                    </div>
                  </div>
                  {selectedLocation?.id === loc.id && (
                    <div className="text-2xl">✓</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && locations.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">No suggested locations for this city. Please choose another.</p>
          </div>
        )}

        {/* Safety Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-blue-900 mb-3">🛡️ Safety Tips</h3>
          <ul className="text-sm text-blue-900 space-y-2">
            <li>✓ Meet in a busy public place during daylight hours</li>
            <li>✓ Bring a friend or let someone know where you're going</li>
            <li>✓ Check the item carefully before paying</li>
            <li>✓ Both parties must confirm arrival here</li>
            <li>✓ No online payments - cash only</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {selectedLocation && (
            <button
              onClick={handleConfirmArrival}
              className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-lg"
            >
              ✓ I've Arrived at {selectedLocation.name_en}
            </button>
          )}

          {!selectedLocation && (
            <button disabled className="w-full px-6 py-4 bg-gray-400 text-white rounded-lg font-bold text-lg cursor-not-allowed">
              Select a location to continue
            </button>
          )}

          <Link
            to={`/deals/${dealId}`}
            className="block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-center font-medium"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
