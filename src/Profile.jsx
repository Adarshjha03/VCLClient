import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaBars, FaCalendar, FaCheck, FaEdit, FaFlagCheckered, FaRegCheckCircle } from "react-icons/fa";
import Sidebar from "./components/Sidebar";
import Profile from "./assets/avatar.png";
import Navbar from "./components/navbar1";
import { FaGithub, FaLinkedin, FaBookOpen, FaEnvelope, FaUser } from 'react-icons/fa';
import badge1 from './assets/badges/b1.jpg';
import badge2 from './assets/badges/b2.jpg';
import badge3 from './assets/badges/b3.jpg';

const badges = [badge1, badge2, badge3];

const ProfilePage = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState({
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
  const backendUrl = "https://api.virtualcyberlabs.com";
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

        // Check if userData is defined
        if (!userData) {
          console.error("User data is undefined");
          return;
        }

        setUser({
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
          bonusScore: user.bonus_score || 0, // Only take the date part if date_joined is defined
        });

        const totalLabsCompleted = userData.solved_challenges ? userData.solved_challenges.length : 0;
        const topicsCompleted = userData.completed_topics ? userData.completed_topics.length : 0;
        const totalScore = userData.score || 0;

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
  }, []); // Empty dependency array to ensure the effect runs only once

  // Function to handle topic selection
  const handleTopicChange = (topicId) => {
    setSelectedTopic(topicId); // Update selected topic
    localStorage.setItem("selectedTopic", topicId); // Save selected topic to localStorage
    navigate("/home"); // Navigate to the home page
  };

  return (
    <div className="flex h-screen font-sans-relative">
      <Sidebar showMenu={showMenu} onTopicSelect={handleTopicChange} activeTopic={selectedTopic} />
      <div className="flex-1 " style={{ background: "#ffffff" , overflowY: "hidden"}}>
        <Navbar style={{ position: "fixed", width: "100%", zIndex: 1000 }} />
        <div className="container mx-auto px-12 py-8 flex flex-row space-x-4" style={{marginTop: "1px", overflowY: "auto", height: "calc(100vh - 60px)"}}> {/* Center align elements */}
          <div className="w-1/4 bg-white rounded-lg p-6 mb-0 h-full shadow-md">
            <div className="relative mb-3 flex items-center justify-center"> {/* Changed justify-end to justify-center */}
              <div className="relative inline-block mr-4"> {/* Removed mr-4 */}
                <img src={Profile} alt="User" className="w-24 h-24 rounded-full" />
                <a href="/temp" className="absolute top-16 right-0">
                  <button className="bg-blue-500 text-white rounded-full p-1">
                    <FaEdit />
                  </button>
                </a>
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold">{`${user.firstName} ${user.lastName}`}</h1>
                <p className="text-gray-900">@{user.username}</p>
                <p className="text-gray-500">
                  Rank <span className="text-blue-700">121</span>
                </p>

              </div>
            </div>
            <a href="/temp">
              <div className="flex justify-center items-center mb-3 bg-blue-300 w-full h-9 rounded-md cursor-pointer">
                <p className="text-blue-800 text-md font-bold">Edit Profile</p>
              </div>
            </a>
            <div className="justify-center space-y-1 mb-3">
              <div className="flex items-center space-x-2">
                <FaGithub className="text-black " size={18} />
                <div className="text-xs">
                  {user.githubUrl ? (
                    <Link to={user.githubUrl} target="_blank" rel="noopener noreferrer">
                      Github
                    </Link>
                  ) : (
                    <span>Not provided</span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FaBookOpen className="text-black " size={18} />
                <div className="text-xs">
                  {user.portfolioUrl ? (
                    <Link to={user.portfolioUrl} target="_blank" rel="noopener noreferrer">
                      Portfolio
                    </Link>
                  ) : (
                    <span>Not provided</span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FaLinkedin className="text-black " size={18} />
                <div className="text-xs">
                  {user.linkedinUrl ? (
                    <Link to={user.linkedinUrl} target="_blank" rel="noopener noreferrer">
                      LinkedIn
                    </Link>
                  ) : (
                    <span>Not provided</span>
                  )}
                </div>
              </div>
            </div>
            <hr className="border-2 border-blue-900"></hr>
            <div className="justify-center space-y-1 mb-3">
              <h2 className="text-xl font-bold text-gray-900 my-2">Community Stats</h2>

              <div className="flex items-center space-x-2 mb-2">
                <FaEnvelope className="text-green-500" size={24} />
                <div className="text-sm text-gray-900">
                  Email
                  <p className="text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <FaUser className="text-blue-900" size={24} />
                <div className="text-sm text-gray-900">
                  User Type
                  <p className="text-gray-500">{user.userType === "user" ? "Learner" : user.userType}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <FaCalendar className="text-orange-500" size={24} />
                <div className="text-sm text-gray-900">
                  Date Joined
                  <p className="text-gray-500">{user.dateJoined}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FaRegCheckCircle className="text-green-500" size={24} />
                <div className="text-sm text-gray-900">
                  Bonus Points
                  <p className="text-gray-500">{user.bonusScore}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FaFlagCheckered className="text-red-500" size={24} />
                <div className="text-sm text-gray-900">
                  Total Points
                  <p className="text-gray-500">{user.score + user.bonusScore}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-3/4">
            <div className="flex space-x-4">
            <div className="bg-white rounded-lg p-6 mb-4 w-1/2 h-[33vh] shadow-md">
  
    <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Lab Progress</h3>
    <div className="flex flex-col items-center">
    <div className="relative w-16 h-16 items-center"> {/* Changed items-center to items-right */}
      {/* Outer Circle */}
      <svg viewBox="0 0 50 50" className="circular-chart items-center">
        <circle
          className="circle"
          cx="25"
          cy="25"
          r="16"
          strokeDasharray="70,100" // Fixed progress value to 70
          stroke="#0074D9" // Color for progress
          strokeWidth="3" // Width of the progress bar
          fill="transparent"
        />
      </svg>
    </div>
    <div className="text-gray-500 text-sm mt-2">
      <p className="text-center">Labs Attempted: <span className="font-bold">17</span></p> {/* Aligned text to the right */}
      <p className="text-center">Total Labs: <span className="font-bold">25</span></p> {/* Aligned text to the right */}
    </div>
  </div>
</div>

<div className="bg-white rounded-lg p-6 mb-4 w-1/2 h-[33vh] flex flex-col shadow-md ">
  <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Badges</h3> {/* Horizontally centered */}
  <div className="flex flex-wrap justify-center items-center mt-2"> {/* Centering badges */}
    {badges.map((badge, index) => (
      <div
        key={index}
        className="w-24 h-24 rounded-full border-2 border-gray-400 m-2 overflow-hidden flex justify-center items-center"
      >
        <img
          src={badge}
          alt={`Badge ${index + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
    ))}
  </div>
</div>


            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Labs</h2>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">Name</th>
                    <th className="text-left">Difficulty</th>
                    <th className="text-left">Score</th>
                  </tr>
                </thead>
               <tbody>
  <tr>
    <td>Lab 1</td>
    <td>Easy</td>
    <td>90</td>
  </tr>
  <tr>
    <td>Lab 2</td>
    <td>Medium</td>
    <td>75</td>
  </tr>
  <tr>
    <td>Lab 3</td>
    <td>Hard</td>
    <td>60</td>
  </tr>
  {/* Add more rows as needed */}
  <tr>
    <td>Lab 4</td>
    <td>Easy</td>
    <td>85</td>
  </tr>
  <tr>
    <td>Lab 5</td>
    <td>Medium</td>
    <td>70</td>
  </tr>
  <tr>
    <td>Lab 6</td>
    <td>Hard</td>
    <td>55</td>
  </tr>
  {/* Add more rows as needed */}
  <tr>
    <td>Lab 7</td>
    <td>Easy</td>
    <td>80</td>
  </tr>
  <tr>
    <td>Lab 8</td>
    <td>Medium</td>
    <td>65</td>
  </tr>
  <tr>
    <td>Lab 9</td>
    <td>Hard</td>
    <td>50</td>
  </tr>
  {/* Add more rows as needed */}
  <tr>
    <td>Lab 10</td>
    <td>Easy</td>
    <td>75</td>
  </tr>
</tbody>

              </table>
            </div>
          </div>

        </div>
        <FaBars className="sm:hidden absolute top-4 left-4 text-2xl text-gray-600 cursor-pointer" onClick={toggleMenu} />
      </div>
    </div>
  );
};

export default ProfilePage;
