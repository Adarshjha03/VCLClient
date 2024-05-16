import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaBars, FaCalendar, FaTimes, FaEdit, FaFlagCheckered, FaRegCheckCircle } from "react-icons/fa";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/navbar1";
import { FaGithub, FaLinkedin, FaBookOpen, FaEnvelope, FaUser } from 'react-icons/fa';

const Settings = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [user, setUser] = useState({
    avatar: 1,
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    githubUrl: "",
    portfolioUrl: "",
    linkedinUrl: "",
    userType: "",
    admin: false,
    subadmin: false,
    score: 0,
    solvedChallenges: [],
    completedTopics: [],
    dateJoined: "",
    bonusScore: 0,
    totalScore: 0,
    totalTopics: 8,
    totalChallenges: 32,

  });


  const [selectedTopic, setSelectedTopic] = useState(() => {
    const storedTopic = localStorage.getItem("selectedTopic");
    return storedTopic ? parseInt(storedTopic) : 0;
  });
  const backendUrl = "https://api.virtualcyberlabs.com";
  const { id } = useParams();
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  


  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("Token");
        const response = await fetch(`${backendUrl}/user/${id}`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user data.");
        }
        const userData = await response.json();

        // Check if userData is defined
        if (!userData) {
          console.error("User data is undefined");
          return;
        }

        setUser({
          avatar: userData.avatar || 1,
          firstName: userData.first_name || "",
          lastName: userData.last_name || "",
          email: userData.email || "",
          username: userData.username || "",
          phoneNumber: userData.phone_number || "",
          githubUrl: userData.github_url || "",
          portfolioUrl: userData.portfolio_url || "",
          linkedinUrl: userData.linkedin_url || "",
          userType: userData.user_type || "",
          admin: userData.admin === "true",
          subadmin: userData.subadmin === "true",
          score: userData.score || 0,
          solvedChallenges: userData.solved_challenges || [],
          completedTopics: userData.completed_topics || [],
          dateJoined: userData.date_joined ? userData.date_joined.split(" ")[0] : "",
          bonusScore: user.bonus_score || 0,
          totalChallenges: user.total_challenges || 32,
          totalScore: user.total_score || 0,
          totalTopics: user.total_topics || 8, // Only take the date part if date_joined is defined
        });


      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);
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
        setAdmin(userData.admin);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  let isValid = username === id || admin;
  //console.log(isValid);
  // Function to handle topic selection
  const handleTopicChange = (topicId) => {
    setSelectedTopic(topicId); // Update selected topic
    localStorage.setItem("selectedTopic", topicId); // Save selected topic to localStorage
    navigate("/home"); // Navigate to the home page
  };

  return (
    <div className="flex h-screen font-sans-relative">
      <Sidebar showMenu={showMenu} onTopicSelect={handleTopicChange} activeTopic={selectedTopic} />
      <div className="flex-1 " style={{ background: "#ffffff", overflowY: "hidden" }}>
        <Navbar style={{ position: "fixed", width: "100%", zIndex: 1000 }} />
    </div>
    <FaBars className="sm:hidden absolute top-4 left-4 text-2xl text-gray-600 cursor-pointer" onClick={toggleMenu} />
    </div>
);
};

export default Settings;
