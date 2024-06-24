import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa'; // Added FaUserCircle for user icon
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineMailOutline } from 'react-icons/md';

// Utility function to calculate the time difference
const timeAgo = (date) => {
  const now = new Date();
  const diffInMs = now - new Date(date);
  
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const months = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30.44)); // Average days in a month
  const years = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365.25)); // Accounting for leap years

  if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (days < 20) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else if (months < 12) {
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  } else {
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }
};

const Navbar = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [unseenNotificationCount, setUnseenNotificationCount] = useState(0);
  const navigate = useNavigate();

  const backendUrl = "https://api.virtualcyberlabs.com";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("Token");
        const userResponse = await fetch(`${backendUrl}/user`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await userResponse.json();
        setUsername(userData.username);
        setAvatar(userData.avatar || 1);
        if (userData.notification && userData.latest_notifications) {
          setNotifications(userData.latest_notifications);
          const unseenCount = userData.latest_notifications.filter(n => !n.seen).length;
          setUnseenNotificationCount(unseenCount);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
  };

  const closeDropdown = () => {
    setIsProfileDropdownOpen(false);
    setIsNotificationDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    const closeDropdownOnClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target) &&
        isProfileDropdownOpen
      ) {
        setIsProfileDropdownOpen(false);
      }
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target) &&
        isNotificationDropdownOpen
      ) {
        setIsNotificationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', closeDropdownOnClickOutside);

    return () => {
      document.removeEventListener('mousedown', closeDropdownOnClickOutside);
    };
  }, [isProfileDropdownOpen, isNotificationDropdownOpen]);

  const avatarImagePath = `https://cyber-range-assets.s3.ap-south-1.amazonaws.com/avatars/${avatar}.png`;

  return (
    <div
      className="flex justify-between items-center p-4"
      style={{
        background: 'linear-gradient(315deg, #2234ae 0%, #191714 80%)',
        height: '55px',
      }}
    >
      <div className="text-xl font-bold text-white flex items-center">
        {/* Navigation */}
      </div>
      <div className="flex items-center">
        {/* Notification icon */}
        <div className="relative" ref={notificationDropdownRef}>
          <FaBell className="text-2xl text-white m-3 cursor-pointer" onClick={toggleNotificationDropdown} />
          {unseenNotificationCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unseenNotificationCount}
            </span>
          )}
          {isNotificationDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-2 max-h-80 overflow-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-700">No new notifications</div>
                ) : (
                  notifications.map((notification, index) => (
                    <div
                      key={index}
                      className={`flex items-center px-4 py-2 text-sm text-black hover:bg-gray-600 ${!notification.seen ? 'bg-white' : ''}`}
                    >
                      <MdOutlineMailOutline 
                        className="mr-2 text-blue-500" 
                        style={{ fontSize: '1.5rem', alignSelf: 'center' }} 
                      /> {/* Blue message icon centered vertically */}
                      <div className="flex-1 ml-2">
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-blue-400 text-base">{notification.title}</div>
                        </div>
                        <div className="text-gray-700 text-sm">{notification.description}</div>
                        <div className="flex justify-end">
                          <div className="text-xs text-gray-500 mt-1">{timeAgo(notification.date_time)}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
              </div>
              <Link to="/notifications" className="flex items-center justify-center mt-4 px-4 py-2 text-sm text-blue-500 hover:bg-gray-200 rounded-md font-medium">
      View All Notifications
    </Link>
            </div>
          )}
        </div>

        {/* Profile icon with dropdown */}
        <div className="relative" ref={profileDropdownRef}>
          <img
            src={avatarImagePath}
            alt="User Avatar"
            className="w-8 h-8 text-white cursor-pointer"
            onClick={toggleProfileDropdown}
          />
          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-1">
                <Link
                  to={`/profile/${username}`}
                  onClick={() => {
                    closeDropdown();
                    window.location.href = `/profile/${username}`;
                  }}
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                >
                  My Profile
                </Link>
                <Link
                  to={`/settings/${username}`}
                  onClick={() => {
                    closeDropdown();
                    window.location.href = `/settings/${username}`;
                  }}
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                >
                  Settings
                </Link>
                <Link
                  to="/"
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
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
