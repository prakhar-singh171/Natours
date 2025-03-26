import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { toast } from "react-toastify";

const LoginPage = () => {
  const { setToken, backendUrl } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);
  const {fetchUserData}=useContext(AuthContext)
  const handleForgotPassword = async () => {
    if (!email) {
      toast.info('Please enter your email address first.');
      return;
    }

    setIsSendingReset(true);

    try {
      const response = await axios.post(
        `${backendUrl}/users/forgotPassword`,
        { email }
      );

      if (response.data.status === 'success') {
        toast.success('Password reset link has been sent to your email.');
      } else {
        toast.error('Failed to send password reset link.');
      }
    } catch (error) {
      console.error('Forgot password error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to send password reset link.');
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${backendUrl}/users/login`,
        { email, password }
      );

      if (response.data.status === 'success') {
        setToken(response.data.token);
        fetchUserData()
        navigate('/tours');
      } else {
        toast.error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white rounded-md shadow hover:bg-green-700"
          >
            Login
          </button>
        </form>
        <div className="mt-4 flex justify-between items-center">
          <button
            type="button"
            onClick={handleForgotPassword}
            className={`text-blue-500 hover:underline ${
              isSendingReset ? 'cursor-not-allowed opacity-50' : ''
            }`}
            disabled={isSendingReset}
          >
            {isSendingReset ? 'Sending...' : 'Forgot Password?'}
          </button>
          <p className="text-sm text-gray-600">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
