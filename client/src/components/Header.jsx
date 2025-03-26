import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  console.log(user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-green-700 text-white py-4 px-6 flex justify-between items-center">
      {/* Left Navigation */}
      <nav>
        <Link to="/tours" className="text-lg font-semibold hover:underline">
          All Tours
        </Link>
      </nav>

      {/* Logo and Project Name */}
      <div className="flex items-center space-x-3">
        <img src="/img/logo-white.png" alt="NatureQuest Logo" className="h-10" />
        <span className="text-xl font-bold">NatureQuest</span>
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
                src={`/img/users/${user.photo || "default.jpg"}`} // Fallback image
                alt={`Photo of ${user.name}`}
                className="w-10 h-10 rounded-full border border-white"
              />
              <span className="font-semibold">{user.name.split(" ")[0]}</span>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg w-48">
                <Link to="/me" className="block px-4 py-2 hover:bg-gray-100">
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login"); // Redirect to login after logout
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex space-x-4">
            <Link to="/login" className="hover:underline">
              Log in
            </Link>
            <Link to="/signup" className="bg-yellow-400 px-4 py-2 rounded text-black font-semibold hover:bg-yellow-500">
              Sign up
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;