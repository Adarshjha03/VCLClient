import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Sidebar from "./components/Sidebar";
import Profile from "./Profile.png";
import Navbar from "./components/navbar1";

const ProfilePage = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
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
  });
  const [statistics, setStatistics] = useState([
    { label: "Total Labs Completed", value: 0 },
    { label: "Topics Completed", value: 0 },
    { label: "Total Score", value: 0 },
  ]);

  const [selectedTopic, setSelectedTopic] = useState(() => {
    const storedTopic = localStorage.getItem("selectedTopic");
    return storedTopic ? parseInt(storedTopic) : 0;
  });
  const backendUrl = "http://cyberrangedev.ap-south-1.elasticbeanstalk.com";
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("Token");
        const response = await fetch(`${backendUrl}/user`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user data.");
        }
        const userData = await response.json();
        setUser({
          firstName: userData.first_name,
          lastName: userData.last_name,
          email: userData.email,
          phoneNumber: userData.phone_number,
          githubUrl: userData.github_url,
          portfolioUrl: userData.portfolio_url,
          linkedinUrl: userData.linkedin_url,
          userType: userData.user_type,
          admin: userData.admin === "true",
          subadmin: userData.subadmin === "true",
          score: userData.score,
          solvedChallenges: userData.solved_challenges,
          completedTopics: userData.completed_topics,
          dateJoined: userData.date_joined.split(" ")[0], // Only take the date part
        });

        const totalLabsCompleted = userData.solved_challenges.length;
        const topicsCompleted = userData.completed_topics.length;
        const totalScore = userData.score;

        setStatistics([
          { label: "Total Labs Completed", value: totalLabsCompleted },
          { label: "Topics Completed", value: topicsCompleted },
          { label: "Total Score", value: totalScore },
        ]);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Function to handle topic selection
  const handleTopicChange = (topicId) => {
    setSelectedTopic(topicId); // Update selected topic
    localStorage.setItem("selectedTopic", topicId); // Save selected topic to localStorage
    navigate("/home"); // Navigate to the home page
  };

  return (
    <div className="flex h-screen font-sans overflow-hidden">
      <Sidebar showMenu={showMenu} onTopicSelect={handleTopicChange} activeTopic={selectedTopic} />
      <div className="flex-1 overflow-y-auto" style={{ background: "#e0efee" }}>
        <Navbar />
        <div className="container mx-auto p-8">
          <div className="flex items-center mb-8">
            <img src={Profile} alt="User" className="w-24 h-24 rounded-full mr-4" />
            <div>
              <h1 className="text-2xl font-bold">{`${user.firstName} ${user.lastName}`}</h1>
              <p className="text-gray-900">{user.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="border border-gray-800 p-4">
              <p className="font-bold">Github:</p>
              <p className="text-gray-900">{user.githubUrl}</p>
            </div>
            <div className="border border-gray-800 p-4">
              <p className="font-bold">LinkedIn:</p>
              <p className="text-gray-900">{user.linkedinUrl}</p>
            </div>
            <div className="border border-gray-800 p-4">
              <p className="font-bold">Portfolio:</p>
              <p className="text-gray-900 break-all">{user.portfolioUrl}</p>
            </div>
            <div className="border border-gray-800 p-4">
              <p className="font-bold">Joined On:</p>
              <p className="text-gray-900">{user.dateJoined}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {statistics.map((statistic, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-gray-800 hover:bg-yellow-500 hover:text-gray-900 transition duration-300"
              >
                <h3 className="text-lg font-semibold text-white">{statistic.label}</h3>
                <p className="text-gray-400">{statistic.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <FaBars className="sm:hidden absolute top-4 left-4 text-2xl text-gray-600 cursor-pointer" onClick={toggleMenu} />
    </div>
  );
};

export default ProfilePage;