import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/apiService';
import { getUser } from '../utils/auth';

export default function UserProfilePage() {
  const { userId } = useParams();
  const currentUser = getUser();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const res = await api.get(`/api/users/${userId}`);
      setUser(res.data.user);
    } catch (err) {
      setError('Failed to load user profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading profile...</div>;
  }

  if (error || !user) {
    return <div className="callout-danger p-4 rounded">{error || 'User not found'}</div>;
  }

  const isOwn = currentUser && currentUser._id === userId;

  return (
    <div className="space-y-6">
      <Link to="/" className="text-primary hover:underline">
        ← Back to listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header */}
          <div className="bg-card rounded-lg shadow p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text">{user.name}</h1>
                {user.city && (
                  <p className="text-muted mt-2">📍 {user.city}</p>
                )}
              </div>
              {!isOwn && (
                <Link
                  to={`/chat/${userId}`}
                  className="px-4 py-2 btn-primary rounded-lg hover:opacity-95 font-medium"
                >
                  💬 Message
                </Link>
              )}
            </div>

            {user.isVerified && (
              <div className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                ✓ Verified Email
              </div>
            )}
          </div>

          {/* Trust & Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card rounded-lg shadow p-6 text-center">
                <p className="text-muted mb-2">Trust Score</p>
                <p className="text-4xl font-bold text-primary">{user.trustScore || 0}</p>
                <p className="text-xs text-muted mt-2">/100</p>
              </div>

            <div className="bg-card rounded-lg shadow p-6 text-center">
              <p className="text-muted mb-2">Completed Deals</p>
              <p className="text-4xl font-bold text-accent">{user.completedDeals || 0}</p>
            </div>

            <div className="bg-card rounded-lg shadow p-6 text-center">
              <p className="text-muted mb-2">Member Since</p>
              <p className="text-xl font-bold text">
                {new Date(user.createdAt).getFullYear()}
              </p>
            </div>
          </div>

          {/* Badges */}
          {user.badges && user.badges.length > 0 && (
            <div className="bg-card rounded-lg shadow p-6">
              <h2 className="font-bold text-lg text mb-4">Badges</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {user.badges.map((badge) => (
                  <div
                    key={badge}
                    className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center"
                  >
                    <p className="text-2xl mb-2">🏅</p>
                    <p className="text-sm font-medium text capitalize">
                      {badge.replace(/_/g, ' ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {isOwn && (
            <div className="callout-info border rounded-lg p-4">
              <p className="text-sm text-accent-900">
                <strong>This is your profile.</strong> Complete deals and get ratings to build trust!
              </p>
            </div>
          )}

          {/* Trust Badge */}
          <div className="bg-card rounded-lg shadow p-6">
            <h3 className="font-bold text mb-4">Trust Level</h3>
            <div className="space-y-2">
              {user.trustScore >= 80 && (
                <div className="flex items-center gap-2 text-green-700">
                  <span>★★★★★</span> <span className="text-sm">Excellent</span>
                </div>
              )}
              {user.trustScore >= 60 && user.trustScore < 80 && (
                <div className="flex items-center gap-2 text-blue-700">
                  <span>★★★★☆</span> <span className="text-sm">Good</span>
                </div>
              )}
              {user.trustScore >= 40 && user.trustScore < 60 && (
                <div className="flex items-center gap-2 text-yellow-700">
                  <span>★★★☆☆</span> <span className="text-sm">Fair</span>
                </div>
              )}
              {user.trustScore < 40 && (
                <div className="flex items-center gap-2 text-gray-700">
                  <span>★★☆☆☆</span> <span className="text-sm">New Member</span>
                </div>
              )}
            </div>
          </div>

          {/* About */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-gray-900 mb-2">About</h3>
            <p className="text-sm text-gray-600">
              {user.isVerified
                ? 'This user has verified their email and can buy and sell items.'
                : 'This user needs to verify their email before posting.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
