import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './utils/auth';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import HomePage from './pages/HomePage';
import ListingDetailsPage from './pages/ListingDetailsPage';
import CreateListingPage from './pages/CreateListingPage';
import ChatInboxPage from './pages/ChatInboxPage';
import ChatWindowPage from './pages/ChatWindowPage';
import UserProfilePage from './pages/UserProfilePage';
import DealFlowPage from './pages/DealFlowPage';
import MeetupConfirmationPage from './pages/MeetupConfirmationPage';

// Layout
import Layout from './components/Layout';

// Protected route wrapper
function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout>
                <HomePage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/listings/:id"
          element={
            <PrivateRoute>
              <Layout>
                <ListingDetailsPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/listings/create"
          element={
            <PrivateRoute>
              <Layout>
                <CreateListingPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Layout>
                <ChatInboxPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/chat/:peerId"
          element={
            <PrivateRoute>
              <Layout>
                <ChatWindowPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <PrivateRoute>
              <Layout>
                <UserProfilePage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/deals/:dealId"
          element={
            <PrivateRoute>
              <Layout>
                <DealFlowPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/meetup/:dealId"
          element={
            <PrivateRoute>
              <Layout>
                <MeetupConfirmationPage />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
