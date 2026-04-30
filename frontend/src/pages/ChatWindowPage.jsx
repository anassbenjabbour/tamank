import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/apiService';
import { getUser } from '../utils/auth';

export default function ChatWindowPage() {
  const { peerId } = useParams();
  const navigate = useNavigate();
  const currentUser = getUser();
  const [messages, setMessages] = useState([]);
  const [peerUser, setPeerUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    fetchPeerUser();
  }, [peerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/api/chat/conversations/${peerId}/messages`);
      setMessages(res.data.messages || []);
    } catch (err) {
      setError('Failed to load messages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPeerUser = async () => {
    try {
      const res = await api.get(`/api/users/${peerId}`);
      setPeerUser(res.data.user);
    } catch (err) {
      console.error('Failed to load peer user', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setSending(true);
    try {
      const res = await api.post('/api/chat/messages', { to: peerId, content: messageText.trim() });
      setMessages([...messages, res.data.message]);
      setMessageText('');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to send message';
      if (errorMsg.includes('blocked')) {
        setIsBlocked(true);
        setError('You are blocked or blocked this user');
      } else {
        alert(errorMsg);
      }
    } finally {
      setSending(false);
    }
  };

  const handleBlockUser = async () => {
    try {
      await api.post(`/api/chat/block/${peerId}`);
      alert('User blocked');
      navigate('/chat');
    } catch (err) {
      alert('Failed to block user');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading conversation...</div>;
  }

  if (error && error.includes('blocked')) {
    return (
      <div className="max-w-2xl mx-auto">
        <Link to="/chat" className="text-primary hover:underline mb-4 inline-block">
          ← Back to messages
        </Link>
        <div className="callout-danger p-6 rounded-lg text-center">
          <p className="font-bold mb-4">{error}</p>
          <button
            onClick={() => navigate('/chat')}
            className="px-4 py-2 btn-danger rounded hover:opacity-95"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[600px]">
      {/* Header */}
        <div className="bg-card rounded-t-lg shadow border-b p-4 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-lg text">{peerUser?.name || 'User'}</h1>
          {peerUser?.city && (
            <p className="text-sm text-muted">📍 {peerUser.city}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Link to={`/profile/${peerId}`} className="px-3 py-2 border border-primary text-primary rounded hover:bg-page text-sm font-medium">
            View Profile
          </Link>
          <button
            onClick={handleBlockUser}
            className="px-3 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50 text-sm font-medium"
          >
            Block
          </button>
          <Link
            to="/chat"
            className="px-3 py-2 text-gray-600 hover:text-gray-900 text-sm"
          >
            ✕
          </Link>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-page p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isOwn = msg.sender === currentUser._id;
            return (
              <div key={idx} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-lg ${isOwn ? 'msg-own' : 'msg-other'}`}>
                  <p className="break-words">{msg.content}</p>
                  <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-muted'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-card rounded-b-lg shadow border-t p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={isBlocked}
          />
          <button
            type="submit"
            disabled={sending || isBlocked || !messageText.trim()}
            className="px-6 py-2 btn-primary rounded-lg hover:opacity-95 disabled:bg-gray-400 font-medium"
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}
