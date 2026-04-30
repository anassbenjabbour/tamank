import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/apiService';
import { getUser } from '../utils/auth';

export default function DealFlowPage() {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const currentUser = getUser();
  const [deal, setDeal] = useState(null);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [ratingData, setRatingData] = useState({ rating: 5, comment: '' });
  const [showRating, setShowRating] = useState(false);

  useEffect(() => {
    fetchDeal();
  }, [dealId]);

  const fetchDeal = async () => {
    try {
      // Since we don't have a GET /api/deals/:id endpoint, we'll create a minimal mock.
      // In production, the backend would return deal details.
      const mockDeal = {
        _id: dealId,
        buyer: { _id: currentUser._id },
        seller: { _id: 'otherId' },
        status: 'initiated',
        arrivalConfirmed: { buyer: false, seller: false }
      };
      setDeal(mockDeal);
    } catch (err) {
      setError('Failed to load deal');
    } finally {
      setLoading(false);
    }
  };

  const handleAgreeDeal = async () => {
    setActionLoading(true);
    try {
      await api.post('/api/deals/agree', { dealId });
      setDeal({ ...deal, status: 'agreed' });
      alert('Deal agreed! Proceed to meetup.');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to agree deal');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmArrival = async () => {
    setActionLoading(true);
    try {
      const res = await api.post(`/api/deals/${dealId}/confirm-arrival`);
      setDeal(res.data.deal);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to confirm arrival');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteDeal = async () => {
    setActionLoading(true);
    try {
      const res = await api.post(`/api/deals/${dealId}/complete`);
      setDeal(res.data.deal);
      setShowRating(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to complete deal');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitRating = async () => {
    setActionLoading(true);
    try {
      await api.post(`/api/deals/${dealId}/rate`, {
        dealId,
        rating: Number(ratingData.rating),
        comment: ratingData.comment
      });
      alert('Rating submitted! Thank you.');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit rating');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading deal...</div>;
  }

  if (error || !deal) {
    return <div className="bg-red-50 text-red-800 p-4 rounded">{error}</div>;
  }

  const isBuyer = currentUser._id === deal.buyer._id;
  const isSeller = currentUser._id === deal.seller._id;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/" className="text-blue-600 hover:underline">
        ← Back to home
      </Link>

      <div className="bg-card rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Deal Flow</h1>

        {/* Status Timeline */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="text-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  deal.status === 'initiated' || deal.status === 'agreed' || deal.status === 'completed'
                    ? 'status-active'
                    : 'status-inactive'
                }`}
              >
                1
              </div>
              <p className="text-sm font-medium">Deal Initiated</p>
            </div>

            <div className={`flex-1 h-1 ${deal.status !== 'initiated' ? 'status-active' : 'status-inactive'}`}></div>

            <div className="text-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  deal.status === 'agreed' || deal.status === 'completed'
                    ? 'status-active'
                    : 'status-inactive'
                }`}
              >
                2
              </div>
              <p className="text-sm font-medium">Agreed</p>
            </div>

            <div className={`flex-1 h-1 ${deal.status === 'completed' ? 'status-active' : 'status-inactive'}`}></div>

            <div className="text-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  deal.status === 'completed' ? 'status-active' : 'status-inactive'
                }`}
              >
                3
              </div>
              <p className="text-sm font-medium">Completed</p>
            </div>
          </div>
        </div>

        {/* Deal Details */}
        <div className="border-t pt-6 space-y-6">
          <div>
            <p className="text-sm text-muted mb-2">Current Status</p>
            <p className="text-2xl font-bold text-primary capitalize">{deal.status}</p>
          </div>

          {/* Step 1: Initiated */}
          {deal.status === 'initiated' && isSeller && (
            <div className="callout-info border rounded-lg p-4">
              <p className="font-bold text-primary mb-4">Buyer is interested! Review and agree to proceed.</p>
              <button
                onClick={handleAgreeDeal}
                disabled={actionLoading}
                className="px-6 py-3 btn-primary rounded-lg disabled:bg-gray-400 font-bold"
              >
                {actionLoading ? 'Agreeing...' : 'Agree to Deal'}
              </button>
            </div>
          )}

          {deal.status === 'initiated' && isBuyer && (
            <div className="callout-success border rounded-lg p-4">
              <p className="text-accent-900">You've initiated this deal. Wait for the seller to agree.</p>
            </div>
          )}

          {/* Step 2: Agreed - Arrival Confirmation */}
          {deal.status === 'agreed' && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="font-bold text-yellow-900 mb-4">
                  🧭 Time to meet! Both parties must confirm arrival at the meetup location.
                </p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Buyer arrival:</strong>{' '}
                    <span className={deal.arrivalConfirmed.buyer ? 'text-green-600 font-bold' : 'text-gray-600'}>
                      {deal.arrivalConfirmed.buyer ? '✓ Confirmed' : 'Pending'}
                    </span>
                  </p>
                  <p className="text-sm">
                    <strong>Seller arrival:</strong>{' '}
                    <span className={deal.arrivalConfirmed.seller ? 'text-green-600 font-bold' : 'text-gray-600'}>
                      {deal.arrivalConfirmed.seller ? '✓ Confirmed' : 'Pending'}
                    </span>
                  </p>
                </div>
              </div>

              {!deal.arrivalConfirmed.buyer && isBuyer && (
                <button
                  onClick={handleConfirmArrival}
                  disabled={actionLoading}
                  className="w-full px-6 py-3 btn-success rounded-lg disabled:bg-gray-400 font-bold"
                >
                  {actionLoading ? 'Confirming...' : 'I Arrived at Meetup Location'}
                </button>
              )}

              {!deal.arrivalConfirmed.seller && isSeller && (
                <button
                  onClick={handleConfirmArrival}
                  disabled={actionLoading}
                  className="w-full px-6 py-3 btn-success rounded-lg disabled:bg-gray-400 font-bold"
                >
                  {actionLoading ? 'Confirming...' : 'I Arrived at Meetup Location'}
                </button>
              )}

              {deal.arrivalConfirmed.buyer && deal.arrivalConfirmed.seller && (
                <button
                  onClick={handleCompleteDeal}
                  disabled={actionLoading}
                  className="w-full px-6 py-3 btn-primary rounded-lg disabled:bg-gray-400 font-bold"
                >
                  {actionLoading ? 'Completing...' : 'Complete Deal - Exchange Payment'}
                </button>
              )}
            </div>
          )}

          {/* Step 3: Completed - Rating */}
          {deal.status === 'completed' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-900 font-bold">✓ Deal completed successfully!</p>
              </div>

              {showRating && (
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-bold text-gray-900">Rate your experience</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <select
                      value={ratingData.rating}
                      onChange={(e) => setRatingData({ ...ratingData, rating: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                      <option value="4">⭐⭐⭐⭐ Good</option>
                      <option value="3">⭐⭐⭐ Fair</option>
                      <option value="2">⭐⭐ Poor</option>
                      <option value="1">⭐ Very Poor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comment (optional)</label>
                    <textarea
                      value={ratingData.comment}
                      onChange={(e) => setRatingData({ ...ratingData, comment: e.target.value })}
                      placeholder="Share your feedback..."
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <button
                    onClick={handleSubmitRating}
                    disabled={actionLoading}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-bold"
                  >
                    {actionLoading ? 'Submitting...' : 'Submit Rating'}
                  </button>
                </div>
              )}

              {!showRating && (
                <p className="text-gray-600">Rating submitted. Thank you!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
