import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('Token');
    localStorage.removeItem('selectedToken');
    navigate('/');
  };

  useEffect(() => {
    const closeDropdownOnClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        isDropdownOpen
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', closeDropdownOnClickOutside);

    return () => {
      document.removeEventListener('mousedown', closeDropdownOnClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div
      className="flex justify-between items-center p-4"
      style={{
        background:
          'linear-gradient(315deg, #2234ae 0%, #191714 80%)',
        height: '60px',
      }}
    >
      <div className="text-xl font-bold text-white flex items-center">
       {/*Navigation*/}
      </div>
      <div className="flex items-center">
        {/* Notification icon */}
        <Link to="/temp">
          <FaBell className="text-2xl text-white m-3" />
        </Link>

        {/* Profile icon with dropdown */}
        <div className="relative" ref={dropdownRef}>
          <FaUser
            className="text-2xl text-white cursor-pointer"
            onClick={toggleDropdown}
          />
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <Link
                  to="/Profile"
                  onClick={closeDropdown}
                  role="menuitem"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  My Profile
                </Link>
                <Link
                  to="/temp"
                  onClick={closeDropdown}
                  role="menuitem"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Settings
                </Link>
                <Link
                  to="/"
                  onClick={handleLogout}
                  role="menuitem"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Logout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
