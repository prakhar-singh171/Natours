import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-toastify";

const ResetPasswordPage = () => {
  const { token } = useParams(); // Get the reset token from the URL
  const navigate = useNavigate();

  const [password, setPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Adjust based on your environment setup

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match. Please try again.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.patch(
        `${backendUrl}/users/resetPassword/${token}`,
        { password,passwordConfirm:confirmPassword },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.status === 'success') {
        toast.success('Password reset successful! You can now log in.');
        navigate('/login'); // Redirect to login page after successful reset
      } else {
      
        toast.error('Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Reset password error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 text-white rounded-md shadow ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
