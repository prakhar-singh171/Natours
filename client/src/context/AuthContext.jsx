import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Set axios defaults to always send credentials (cookies, etc)
  axios.defaults.withCredentials = true;

  // Fetch user details when token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      fetchUserData();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  }, [token]);

  // Function to fetch user details from backend
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data.data.data);
      setUser(response.data.data.data);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
    }
  };

  // Function to log out
  const logout = async () => {
    try {
      await axios.get(`${backendUrl}/users/logout`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }

    // Always clear client-side data
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser, logout, backendUrl, fetchUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
