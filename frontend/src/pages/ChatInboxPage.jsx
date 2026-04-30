import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/apiService';

export default function ChatInboxPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/api/chat/conversations');
      setConversations(res.data.conversations || []);
    } catch (err) {
      setError('Failed to load conversations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading conversations...</div>;
  }

  if (error) {
    return <div className="callout-danger p-4 rounded">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text">Messages</h1>

      {conversations.length === 0 ? (
        <div className="bg-card rounded-lg shadow p-8 text-center text-muted">
          <p>No conversations yet. Start a deal or message someone!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv) => (
            <Link key={conv.user._id} to={`/chat/${conv.user._id}`} className="bg-card rounded-lg shadow p-4 hover:shadow-md transition block">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-bold text">{conv.user.name}</p>
                  <p className="text-sm text-muted line-clamp-1">{conv.lastMessage}</p>
                  {conv.user.badges && conv.user.badges.length > 0 && (
                    <p className="text-xs text-muted mt-1">
                      {conv.user.badges.map((b) => `🏅 ${b}`).join(' ')}
                    </p>
                  )}
                </div>
                <p className="text-xs text-muted">
                  {new Date(conv.lastAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
