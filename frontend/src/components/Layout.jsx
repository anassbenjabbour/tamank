import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, removeToken } from '../utils/auth';

export default function Layout({ children }) {
  const user = getUser();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('tamank_theme') || 'bright';
    } catch (e) {
      return 'bright';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try { localStorage.setItem('tamank_theme', theme); } catch(e){}
  }, [theme]);

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-page">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card backdrop-blur-md border-b border-muted shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity group">
            <span className="text-3xl font-bold text-primary">Tamank</span>
            <span className="text-sm font-semibold text-primary group-hover:text-primary transition">ثمنك</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="font-medium text-muted hover:text-primary transition relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 primary-underline group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/listings/create" className="font-medium text-muted hover:text-primary transition relative group">
              Post Item
              <span className="absolute bottom-0 left-0 w-0 h-0.5 primary-underline group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/chat" className="font-medium text-muted hover:text-primary transition relative group">
              Messages
              <span className="absolute bottom-0 left-0 w-0 h-0.5 primary-underline group-hover:w-full transition-all duration-300"></span>
            </Link>
            {user && (
              <Link to={`/profile/${user._id}`} className="font-medium text-muted hover:text-primary transition relative group">
                Profile
                <span className="absolute bottom-0 left-0 w-0 h-0.5 primary-underline group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
            {/* Theme toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'bright' : 'dark')}
                className="px-3 py-2 rounded-lg text-sm font-medium theme-toggle-btn hover:opacity-90 transition"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? '🌙 Dark' : '🌤 Bright'}
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 btn-accent rounded-lg font-semibold shadow-subtle hover:shadow-card transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Logout
            </button>
          </nav>
          <div className="md:hidden">
            <button className="p-2 rounded-lg text-primary hover:bg-page">
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>
    </div>
  );
}
