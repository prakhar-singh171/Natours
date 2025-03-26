import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user, setUser, token, backendUrl, fetchUserData } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [activeTab, setActiveTab] = useState('settings');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) fetchUserData();
  }, [user]);

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', user.name);
    formData.append('email', user.email);
    if (profileImage) formData.append('photo', profileImage);

    try {
      const response = await axios.patch(`${backendUrl}/users/updateMe`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Settings updated successfully!');
      setUser(response.data.data.user);
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update settings';
      toast.error(msg);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      await axios.patch(`${backendUrl}/users/updateMyPassword`, {
        passwordCurrent: currentPassword,
        password: newPassword,
        passwordConfirm: confirmPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Password updated successfully!');
    } catch (error) {
      const msg = error.response?.data?.message || 'Something went wrong';
      toast.error(msg);
    }
  };

  return (
    <div className="container mx-auto p-6 flex">
      <div className="w-1/4 bg-gray-100 p-4 rounded-lg shadow-lg">
        <ul>
          <li className={`p-2 cursor-pointer ${activeTab === 'settings' ? 'font-bold' : ''}`} onClick={() => setActiveTab('settings')}>Settings</li>
          <li className={`p-2 cursor-pointer ${activeTab === 'reviews' ? 'font-bold' : ''}`} onClick={() => setActiveTab('reviews')}>My Reviews</li>
          <li className="p-2 cursor-pointer" onClick={() => navigate('/my-bookings')}>My Bookings</li>
        </ul>
      </div>
      <div className="w-3/4 ml-6">
        {activeTab === 'settings' && user && (
          <div>
            <h1 className="text-3xl font-bold text-center mb-8">Profile Settings</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-6 bg-white shadow-lg rounded-2xl">
                <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                <form onSubmit={handleSettingsSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Name</label>
                    <input
                      type="text"
                      value={user.name}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                      className="w-full mt-1 px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Email Address</label>
                    <input
                      type="email"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                      className="w-full mt-1 px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Profile Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfileImage(e.target.files[0])}
                      className="w-full mt-1"
                    />
                    {user.photo && (
                      <img
                        src={`${backendUrl}/img/users/${user.photo.trim()}`}
                        alt="User"
                        className="mt-4 w-20 h-20 rounded-full"
                      />
                    )}
                  </div>
                  <button type="submit" className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Save Changes
                  </button>
                </form>
              </div>
              <div className="p-6 bg-white shadow-lg rounded-2xl">
                <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full mt-1 px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full mt-1 px-4 py-2 border rounded-lg"
                      required
                    />
                    <label className="block text-sm font-medium">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full mt-1 px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;