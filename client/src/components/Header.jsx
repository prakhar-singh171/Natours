import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import defaultImage from '../assets/default.jpg';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

 const photo = user 
    ? (user.photo === 'default.jpg' ? defaultImage : user.photo) 
    : defaultImage; 
  return (
    <header className="bg-green-700 text-white py-4 px-6 flex justify-between items-center shadow-md">
      {/* Left Navigation (All Tours Button) */}
      <nav>
        <Link
          to="/tours"
          className="px-4 py-2 bg-white text-green-700 rounded font-semibold hover:bg-gray-100 transition duration-200"
        >
          All Tours
        </Link>
      </nav>

      {/* Logo and Project Name */}
      <div className="flex items-center space-x-3">
        <img src="/img/logo-white.png" alt="NatureQuest Logo" className="h-10" />
        <span className="text-xl font-bold text-white">NatureQuest</span>
      </div>

      {/* User Navigation */}
      <nav className="relative">
        {user ? (
          <div className="relative">
            {/* Profile Button */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
             <img
                src={photo}
                alt={`Photo of ${user?.name ?? 'User'}`}
                className="w-10 h-10 rounded-full border border-white"
              />
              <span className="font-semibold">{user.name.split(" ")[0]}</span>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg w-48 z-10">
                <Link to="/me" className="block px-4 py-2 hover:bg-gray-100">
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex space-x-3 items-center">
            <Link
              to="/login"
              className="px-4 py-2 border border-white text-white rounded hover:bg-white hover:text-green-700 font-semibold transition duration-200"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-yellow-400 text-black rounded font-semibold hover:bg-yellow-500 transition duration-200"
            >
              Sign up
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
