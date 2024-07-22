import React, { useState, useEffect } from 'react';
import Navbar from './components/navbar1'; // Assuming this is the correct path
import Sidebar from './components/Sidebar'; // Assuming this is the correct path
import { MdOutlineMailOutline } from 'react-icons/md';
import { TailSpin } from 'react-loader-spinner';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(() => {
    const storedTopic = localStorage.getItem("selectedTopic");
    return storedTopic ? parseInt(storedTopic) : 0;
  });
  const [topics, setTopics] = useState([]);

  const backendUrl = "https://api.virtualcyberlabs.com";

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const token = localStorage.getItem("Token");
        const response = await fetch(`${backendUrl}/topic`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch topics');
        }
        const data = await response.json();
        setTopics(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchTopics();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("Token");
        const response = await fetch(`${backendUrl}/notifications`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleTopicChange = (topicId) => {
    setSelectedTopic(topicId);
    localStorage.setItem("selectedTopic", topicId.toString());
  };

  const timeAgo = (date) => {
    const now = new Date();
    const diffInMs = now - new Date(date);

    const minutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30.44)); // Average days in a month
    const years = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365.25)); // Accounting for leap years

    if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (hours < 24) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (days < 30) {
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else if (months < 12) {
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
      return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <TailSpin
          height="80"
          width="80"
          color="#0000FF"
          ariaLabel="loading-indicator"
        />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex h-screen font-sans relative">
      <Sidebar onTopicSelect={handleTopicChange} activeTopic={selectedTopic} topics={topics} />
      <div className="flex-1" style={{ background: "#e0efee", overflowY: "hidden" }}>
        <Navbar style={{ position: "fixed", width: "100%", zIndex: 1000 }} />

        <div className="p-4" style={{ marginTop: "5px", overflowY: "auto", height: "calc(100vh - 80px)" }}>
          <h1 className="text-3xl font-bold mb-6">Notifications</h1>
          <div className="bg-white rounded-lg shadow">
            {notifications.map((notification, index) => (
              <div key={index} className="flex items-center p-4 border-b border-gray-200">
                <MdOutlineMailOutline className="text-3xl text-blue-500 mr-4" />
                <div className="flex-grow">
                  <h2 className="text-lg font-semibold text-blue-600">{notification.title}</h2>
                  <p className="text-gray-600">{notification.description}</p>
                  <p className="text-sm text-gray-400 mt-1">{timeAgo(notification.date_time)}</p>
                </div>
                {!notification.seen && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">New</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
