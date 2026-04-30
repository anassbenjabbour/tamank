import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/apiService';
import { getUser } from '../utils/auth';

export default function ListingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getUser();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [priceRange, setPriceRange] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [votedPriceType, setVotedPriceType] = useState(null);
  const [initiatingDeal, setInitiatingDeal] = useState(false);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const res = await api.get(`/api/listings/${id}`);
      setListing(res.data.listing);
      setPriceRange(res.data.priceRange);
      setFeedback(res.data.feedback);
    } catch (err) {
      setError('Failed to load listing');
    } finally {
      setLoading(false);
    }
  };

  const handleVotePrice = async (voteType) => {
    try {
      const res = await api.post(`/api/listings/${id}/price-feedback`, { vote: voteType });
      setFeedback(res.data.feedback);
      setVotedPriceType(voteType);
    } catch (err) {
      alert('Failed to vote on price');
    }
  };

  const handleInitiateDeal = async () => {
    if (!listing) return;
    if (listing.owner._id === currentUser._id) {
      alert('Cannot buy your own listing');
      return;
    }
    setInitiatingDeal(true);
    try {
      const res = await api.post('/api/deals', { listingId: id });
      navigate(`/deals/${res.data.deal._id}`);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to initiate deal');
    } finally {
      setInitiatingDeal(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error || !listing) {
    return <div className="callout-danger p-4 rounded text-center">{error || 'Listing not found'}</div>;
  }

  const isOwner = currentUser && listing.owner._id === currentUser._id;

  return (
    <div className="space-y-6">
      <Link to="/" className="text-blue-600 hover:underline">
        ← Back to listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <div className="h-96 bg-page rounded-lg flex items-center justify-center text-lg">
            [Image: {listing.title}]
          </div>

          {/* Details */}
          <div className="bg-card rounded-lg shadow p-6 space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
              <p className="text-muted mt-2">{listing.description}</p>
            </div>

            <div className="border-t pt-4">
              <h2 className="font-bold text mb-2">Details</h2>
              <ul className="space-y-2 text-muted">
                <li>
                  <strong>Condition:</strong> <span className="capitalize">{listing.condition}</span>
                </li>
                <li>
                  <strong>Location:</strong> {listing.location || 'Not specified'}
                </li>
                <li>
                  <strong>Posted:</strong> {new Date(listing.createdAt).toLocaleDateString()}
                </li>
              </ul>
            </div>

            {/* Price Feedback */}
            {priceRange && (
              <div className="callout-info border rounded-lg p-4">
                <h3 className="font-bold text mb-2">Price Check</h3>
                <p className="text-muted mb-3">
                  Suggested range for {listing.condition} condition: <strong>{priceRange.min} - {priceRange.max} DH</strong>
                </p>
                {feedback && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">Community feedback:</p>
                    <div className="flex gap-2 mt-1">
                      <div className="flex-1">
                        <div className="text-green-600 font-bold">{feedback.fair}%</div>
                        <div className="text-xs text-gray-500">Fair price</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-orange-600 font-bold">{feedback.expensive}%</div>
                        <div className="text-xs text-gray-500">Too expensive</div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVotePrice('fair')}
                    disabled={votedPriceType === 'fair'}
                    className="flex-1 px-3 py-2 border border-green-300 text-green-700 rounded hover:bg-green-50 disabled:bg-green-100 text-sm font-medium"
                  >
                    ✓ Fair price
                  </button>
                  <button
                    onClick={() => handleVotePrice('expensive')}
                    disabled={votedPriceType === 'expensive'}
                    className="flex-1 px-3 py-2 border border-orange-300 text-orange-700 rounded hover:bg-orange-50 disabled:bg-orange-100 text-sm font-medium"
                  >
                    ✗ Too expensive
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Seller info & CTA */}
        <div className="space-y-4">
          {/* Seller Card */}
          <div className="bg-card rounded-lg shadow p-6">
            <h3 className="font-bold text mb-4">Seller</h3>
            <Link to={`/profile/${listing.owner._id}`} className="hover:opacity-80">
              <p className="font-bold text-lg text">{listing.owner.name}</p>
              {listing.owner.city && (
                <p className="text-muted text-sm">📍 {listing.owner.city}</p>
              )}
            </Link>

            {listing.owner.isVerified && (
              <div className="mt-3 flex items-center gap-2 text-accent text-sm">
                <span>✓ Verified</span>
              </div>
            )}

            {listing.owner.badges && listing.owner.badges.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium text-muted mb-2">Badges:</p>
                <div className="flex flex-wrap gap-2">
                  {listing.owner.badges.map((badge) => (
                    <span key={badge} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                      🏅 {badge}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600">
                <strong>Trust Score:</strong> {listing.owner.trustScore || 0}/100
              </p>
              <p className="text-sm text-gray-600">
                <strong>Completed Deals:</strong> {listing.owner.completedDeals || 0}
              </p>
            </div>
          </div>

          {/* Price */}
          <div className="bg-card rounded-lg shadow p-6">
            <p className="text-muted mb-2">Price</p>
            <p className="text-4xl font-bold text-primary">{listing.price} DH</p>
          </div>

          {/* Action Buttons */}
          {!isOwner ? (
            <div className="space-y-2">
              <button onClick={handleInitiateDeal} disabled={initiatingDeal} className="w-full px-4 py-3 btn-primary rounded-lg disabled:bg-gray-400 font-bold text-lg">
                {initiatingDeal ? 'Initiating...' : 'Interested - Start Deal'}
              </button>
              <Link to={`/chat/${listing.owner._id}`} className="block w-full px-4 py-3 border border-primary text-primary rounded-lg hover:bg-page text-center font-medium">
                💬 Message Seller
              </Link>
            </div>
          ) : (
            <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-600">
              This is your listing
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
