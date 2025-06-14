import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage'; // Import the SignupPage
import ToursPage from './pages/ToursPage';
import { AuthProvider } from './context/AuthContext';
import TourPage from './pages/TourPage';
import Footer from './components/Footer';
import ResetPasswordPage from './pages/ResetPassword';
import ProfilePage from './pages/ProfilePage.JSX';
import VerifyPayment from './pages/VerifyPayment';
import MyAppointments from './pages/MyBookings';
import MyBookings from './pages/MyBookings';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyReviews from './pages/MyReviews';
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} /> {/* Add SignupPage route */}
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} /> {/* ResetPasswordPage route */}

              <Route
                path="/tours"
                element={
                  <ProtectedRoute>
                    <ToursPage />
                  </ProtectedRoute>
                }
              />
               <Route path="/me" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
                 <Route path="/verify-payment" element={<VerifyPayment />} /> {/* Added VerifyPayment route */}

              <Route path="/tour/:slug" element={<TourPage />} /> {/* Dynamic route */}
              <Route path="*" element={<Navigate to="/login" replace />} />
              <Route path="/my-bookings" element={<MyBookings />} />

                <Route path="/my-reviews" element={
                    <ProtectedRoute>
                      <MyReviews />
                    </ProtectedRoute>
                  } />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} />

          </main>
        </div>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;
