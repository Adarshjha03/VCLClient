import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaBars, FaCalendar, FaTimes, FaEdit, FaFlagCheckered, FaRegCheckCircle } from "react-icons/fa";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/navbar1";
import { FaGithub, FaLinkedin, FaBookOpen, FaEnvelope, FaUser } from 'react-icons/fa';
import badge1 from './assets/badges/b1.jpg';
import badge2 from './assets/badges/b2.jpg';
import badge3 from './assets/badges/b3.jpg';
import Modal from 'react-modal';
import AvatarSelector from "./components/avatar";
const badges = [badge1, badge2, badge3];

const ProfilePage = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [CurrUser, setCurrUser] = useState(false);
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
    bonusScore: 0 ,
    totalScore: 0 ,
    totalTopics: 8 ,
    totalChallenges: 32 ,

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
  const toggleAvatarModal = () => {
    // console.log("toggleAvatarModal called");
    // console.log(showAvatarModal);
    setShowAvatarModal(!showAvatarModal);
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
          bonusScore: userData.bonus_score || 0,
          totalChallenges: userData.total_challenges || 32,
          totalScore: userData.total_score || 0,
          totalTopics: userData.total_topics || 8, // Only take the date part if date_joined is defined
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
        setAdmin(userData.admin);
        setCurrUser(userData.username);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  let isValid = CurrUser === id || admin;
  //console.log(isValid);
  // Function to handle topic selection
  const handleTopicChange = (topicId) => {
    setSelectedTopic(topicId); // Update selected topic
    localStorage.setItem("selectedTopic", topicId); // Save selected topic to localStorage
    navigate("/home"); // Navigate to the home page
  };
  const completionRate = user.totalChallenges > 0 ? (user.solvedChallenges.length / user.totalChallenges) * 100 : 0;
  const radius = 42; // Radius of the circle
  const circumference = 2 * Math.PI * radius;
  const strokeVal = (completionRate / 100) * circumference;
  const avatarImagePath = `https://cyber-range-assets.s3.ap-south-1.amazonaws.com/avatars/${user.avatar}.png`;
  const addHttpsIfNeeded = (url) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return "https://" + url;
    }
    return url;
};

// Usage example:
const githubUrl = addHttpsIfNeeded(user.githubUrl);
const portfolioUrl = addHttpsIfNeeded(user.portfolioUrl);
const linkedinUrl = addHttpsIfNeeded(user.linkedinUrl);
  return (
    <div className="flex h-screen font-sans-relative">
      <Sidebar showMenu={showMenu} onTopicSelect={handleTopicChange} activeTopic={selectedTopic} />
      <div className="flex-1 " style={{ background: "#ffffff", overflowY: "hidden" }}>
        <Navbar style={{ position: "fixed", width: "100%", zIndex: 1000 }} />
        <div className="container mx-auto px-12 py-8 flex flex-row space-x-4" style={{ marginTop: "1px", overflowY: "auto", height: "calc(100vh - 60px)" }}> {/* Center align elements */}
          <div className="w-1/3 bg-white rounded-lg py-6 px-4 mb-0 h-auto shadow-lg">
          <div className="relative mb-3 flex items-center justify-center"> {/* Changed justify-end to justify-center */}
            <div className="w-1/2 flex items-center justify-center">
                <div className="relative inline-block mr-4">
                    <img src={avatarImagePath} alt="User" className="w-24 h-24 rounded-full" />
                    {CurrUser === id && (
                        <div className="absolute top-16 right-0">
                            <button className="bg-blue-500 text-white rounded-full p-1" onClick={toggleAvatarModal}>
                                <FaEdit />
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="w-1/2 text-left"> {/* Changed text-right to text-left */}
                <h1 className="text-2xl font-bold">{`${user.firstName} ${user.lastName}`}</h1>
                <p className="text-gray-900">@{user.username}</p>
                <p className="text-gray-500">
                    Rank <span className="text-blue-700">121</span>
                </p>
            </div>
            </div>
            {isValid && (<a href={`/settings/${id}`}>
              <div className="flex justify-center items-center mb-3 bg-blue-300 w-full h-9 rounded-md cursor-pointer">
                <p className="text-blue-800 text-md font-bold">Edit Profile</p>
              </div>
            </a>)}
            <div className="justify-center space-y-1 mb-3">
              <div className="flex items-center space-x-2">
                <FaGithub className="text-black " size={18} />
                <div className="text-xs">
                  {user.githubUrl ? (
                    <Link to={githubUrl} target="_blank" rel="noopener noreferrer">
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
                    <Link to={portfolioUrl} target="_blank" rel="noopener noreferrer">
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
                    <Link to={linkedinUrl} target="_blank" rel="noopener noreferrer">
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
                  Challenge Points
                  <p className="text-gray-500">{user.score}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-3/4">
            <div className="flex space-x-4">
              <div className="bg-white rounded-lg p-4 w-full md:w-1/2 h-[33vh] flex flex-col justify-center items-center shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 text-center mb-2 pt-2">PROGRESS</h3>
                <div className="flex flex-col md:flex-row w-full justify-between items-center">
                  <div className="relative pl-8">
                  <svg width="140" height="140">
          <circle cx="70" cy="70" r={radius} fill="none" stroke="#ddd" strokeWidth="8" /> {/* Background circle */}
          <circle cx="70" cy="70" r={radius} fill="none" stroke="#1E88E5" strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - strokeVal}
            style={{ transition: 'stroke-dashoffset 0.5s ease 0s', transform: 'rotate(-90deg)', transformOrigin: 'center' }}
          /> {/* Foreground circle (progress) */}
        </svg>
                    <div className="absolute inset-0 flex justify-center items-center pl-10">
                      {completionRate.toFixed(0)}%
                    </div>

                  </div>
                  <ul className="ml-2  mr-4 md:mr-8 text-justify md:text-left">
                    <li><strong>Completed Labs:</strong> {user.solvedChallenges.length}</li>
                    <li><strong>Total Labs:</strong> {user.totalChallenges}</li>
                    <li><strong>Completed Topics:</strong> {user.completedTopics.length}</li>
                    <li><strong>Total Topics:</strong> {user.totalTopics}</li>
                  </ul>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6  mb-4 w-1/2 h-[33vh] flex flex-col shadow-md ">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">BADGES</h3>
                <div className="grid grid-cols-3 gap-4 justify-center items-center mt-2" style={{ overflow: 'hidden' }}> {/* Using grid for badge placement */}
                  {badges.map((badge, index) => (
                    <div
                      key={index}
                      className="relative w-full h-full max-w-xs max-h-xs rounded-full border-2 border-gray-400 overflow-hidden" style={{ aspectRatio: '1 / 1' }}>  {/* Maintained aspect ratio */}
                      <img
                        src={badge}
                        alt={`Badge ${index + 1}`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>



            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">RECENT LABS</h2>

              <div className="flex flex-col items-center">

                <table className="w-full border-collapse border border-gray-700">
                  <thead>
                    <tr>
                      <th className="text-left border border-gray-700 px-4 py-2">Lab</th>
                      <th className="text-center border border-gray-700 px-4 py-2">Difficulty</th>
                      <th className="text-center border border-gray-700 px-4 py-2">Score</th>
                      <th className="text-right border border-gray-700 px-4 py-2">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.solvedChallenges.map((challenge, index) => (
                      <tr key={index} className="border-b border-gray-700">
                        <td className="text-left border border-gray-700 px-4 py-2">
                          <Link to={`/problem/${challenge.challenge_id}`} className="text-blue-600 font-semibold">
                            {challenge.challenge_name}
                          </Link>
                        </td>
                        <td className="text-center border border-gray-700 px-4 py-2">
                          <span className={`inline-block rounded-xl px-2 py-1 ${challenge.difficulty === "Easy" ? "bg-green-100 border-green-600 text-green-600" :
                            challenge.difficulty === "Medium" ? "bg-yellow-100 border-yellow-600 text-yellow-600" :
                              challenge.difficulty === "Hard" ? "bg-red-100 border-red-600 text-red-600" :
                                "" // Default styling if difficulty is not specified
                            }`}>
                            {challenge.difficulty}
                          </span>
                        </td>


                        <td className="text-center border border-gray-700 px-4 py-2">{challenge.score}</td>
                        <td className="text-right border border-gray-700 px-4 py-2">{new Date(challenge.solved_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
            </div>


          </div>

        </div>
        <FaBars className="sm:hidden absolute top-4 left-4 text-2xl text-gray-600 cursor-pointer" onClick={toggleMenu} />
      </div>
      {showAvatarModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
          onClick={toggleAvatarModal} // Close modal when clicking outside
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
            }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <div className="flex justify-between items-center py-4 px-6">
              <h2 className="text-xl font-bold">Select Your Avatar</h2>
              <button onClick={toggleAvatarModal}>
                <FaTimes />
              </button>
            </div>
            <div className="px-6 pb-4">
              <AvatarSelector />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;
