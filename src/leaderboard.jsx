import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaStarHalfAlt, FaGithub, FaBookOpen, FaLinkedin } from "react-icons/fa";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/navbar1";
import medal from "./assets/medal.png";
import "./leaderboard.css";

const LeaderboardPage = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(0);
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const backendUrl = "https://api.virtualcyberlabs.com";
    const [admin, setAdmin] = useState(false);
    const [subAdmin, setSubAdmin] = useState(false);

    const handleTopicChange = (topicId) => {
        setSelectedTopic(topicId);
        localStorage.setItem("selectedTopic", topicId);
        window.location.href = "/home";
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("Token");

                // Fetch current user data
                const userResponse = await fetch(`${backendUrl}/user`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                const userData = await userResponse.json();
                setCurrentUser(userData);
                setAdmin(userData.admin);
                setSubAdmin(userData.subadmin);

                // Fetch leaderboard data
                const leaderboardResponse = await fetch(`${backendUrl}/leaderboard`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                const leaderboardData = await leaderboardResponse.json();
                setLeaderboardData(leaderboardData.leaderboard);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);
    const getValidUrl = (url) => {
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        return `https://${url}`;
    };
    const renderLeaderboardEntry = (user, index, isCurrentUser) => {
        const userRank = isCurrentUser
            ? leaderboardData.findIndex((u) => u.username === currentUser.username) + 1
            : index + 1;
        const hasSocialLinks = user.github_url || user.portfolio_url || user.linkedin_url;

        const getValidUrl = (url) => {
            if (url.startsWith('http://') || url.startsWith('https://')) {
                return url;
            }
            return `https://${url}`;
        };

        return (
            <tr
                key={user.user_id}
                className={`border-b border-gray-700 ${isCurrentUser ? "bg-blue-100 text-blue-700" : "text-blue-700"} hover:bg-blue-200`}
            >
                <td className="text-left px-4 py-2 flex items-center">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full shadow-sm overflow-hidden mr-2">
                            <img
                                src={`https://cyber-range-assets.s3.ap-south-1.amazonaws.com/avatars/${user.avatar}.png`}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <Link
                            to={`/profile/${user.username}`}
                            className={`font-semibold link-hover ${isCurrentUser ? "text-blue-700" : "text-blue-700"}`}
                        >
                            {user.first_name} {user.last_name}
                        </Link>
                    </div>
                </td>
                <td className="text-center px-4 bg-blue-200 py-2">{userRank}</td> {/* Removed background color */}
                <td className="text-center px-4 py-2">
                    <div className="flex justify-center">
                        {hasSocialLinks ? (
                            <>
                                {user.github_url && (
                                    <a href={getValidUrl(user.github_url)} target="_blank" rel="noopener noreferrer">
                                        <FaGithub className="mx-1" />
                                    </a>
                                )}
                                {user.portfolio_url && (
                                    <a href={getValidUrl(user.portfolio_url)} target="_blank" rel="noopener noreferrer">
                                        <FaBookOpen className="mx-1" />
                                    </a>
                                )}
                                {user.linkedin_url && (
                                    <a href={getValidUrl(user.linkedin_url)} target="_blank" rel="noopener noreferrer">
                                        <FaLinkedin className="mx-1" />
                                    </a>
                                )}
                            </>
                        ) : (
                            <span className="mx-1">-</span>
                        )}
                    </div>
                </td>
                <td className={`font-semibold hover-text ${isCurrentUser ? "text-blue-700" : "text-blue-700"} text-center`}>
                    {user.total_score}
                    <span className="text-xs font-normal"></span>
                </td>
                <td className="text-center px-4">
                    {user.completed_topics.length > 0 ? (
                        <div className="flex justify-center">
                            {user.completed_topics.slice(0, 3).map((topic, idx) => (
                                <div key={idx} className="relative mx-1 group">
                                    <img
                                        src={topic.badge_url}
                                        alt={`Badge ${idx + 1}`}
                                        className="w-12 h-12 object-cover rounded-full  transition-transform duration-200 ease-in-out group-hover:scale-150"
                                        style={{ position: 'relative', zIndex: 1 }}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <span>-</span>
                    )}
                </td>
            </tr>
        );
    };


    return (
        <div className="flex h-screen font-sans-relative">
            <Sidebar
                showMenu={showMenu}
                onTopicSelect={handleTopicChange}
                activeTopic={selectedTopic}
            />
            <div className="flex-1" style={{ background: "#ffffff", overflowY: "auto" }}>
                <Navbar style={{ position: "fixed", width: "100%", zIndex: 1000 }} />
                <div className="page-content" style={{ paddingTop: "2px" }}>
                    <h2 className="text-2xl font-bold mt-6 ml-10 text-[#000930]">LEADERBOARD<img src={medal} alt="Medal" className="inline-block w-8 h-8 ml-2" /></h2>
                    <div className="container mx-auto px-10 py-4">
                        <div className="top-player-container flex justify-between items-center mb-8">
                            {/* Second Place */}
                            <div className="w-1/4 h-40 rounded-lg shadow-md bg-[#795CFF] p-4 flex flex-col justify-between items-start top-player-card-2 ml-24 relative">
                                <div className="flex items-center mb-2">
                                    <div className="w-18 h-18 rounded-full shadow-sm overflow-hidden mr-4">
                                        <Link to={`/profile/${leaderboardData[1]?.username}`} className="text-sm">
                                            <img
                                                src={`https://cyber-range-assets.s3.ap-south-1.amazonaws.com/avatars/${leaderboardData[1]?.avatar}.png`}
                                                alt="Avatar"
                                                className="w-full h-full object-cover border border-2"
                                                style={{ borderRadius: "50%", borderColor: "#FFD700" }}
                                            />
                                        </Link>
                                    </div>
                                    <div>
                                    <Link to={`/profile/${leaderboardData[1]?.username}`} className="text-sm"> <p className="text-xl font-semibold text-white">{leaderboardData[1]?.first_name}</p>
                                        <p className="text-sm text-white">@{leaderboardData[1]?.username}</p></Link>
                                        <div className="mt-2 flex space-x-2">
                                            {leaderboardData[1]?.github_url && (
                                                <a href={getValidUrl(leaderboardData[1]?.github_url)} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                                                    <FaGithub />
                                                </a>
                                            )}
                                            {leaderboardData[1]?.portfolio_url && (
                                                <a href={getValidUrl(leaderboardData[1]?.portfolio_url)} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                                                    <FaBookOpen />
                                                </a>
                                            )}
                                            {leaderboardData[1]?.linkedin_url && (
                                                <a href={getValidUrl(leaderboardData[1]?.linkedin_url)} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                                                    <FaLinkedin />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute w-28 h-10 bg-white bg-opacity-50 rounded-r-full flex items-center justify-center top-28 left-0">
                {/* <img src={rank2coin} alt="Rank 2 Coin" className="w-16 h-16 mr-2" /> */}
                <FaStarHalfAlt className="text-yellow-300 text-lg mr-2"/> <span className="text-lg font-semibold text-white">{leaderboardData[1]?.total_score} pts</span>
            </div>

            <div className="absolute w-10 h-10 bg-[#c7d1da] rounded-full flex items-center justify-center top-2 right-2">
                {/* <img src={rank2coin} alt="Rank 2 Coin" className="w-16 h-16 mr-2" /> */}
                <span className="text-lg font-semibold text-white ">2</span>
            </div>
                            </div>
                            {/* First Place */}
                            <div className="w-1/4 h-44 rounded-lg shadow-lg bg-[#ff824c] p-4 flex flex-col justify-between items-start top-player-card-1 mx-1 relative">
                                <div className="flex items-center mb-2">
                                    <div className="w-18 h-18 rounded-full shadow-sm overflow-hidden mr-4">
                                        <Link to={`/profile/${leaderboardData[0]?.username}`} className="text-sm">
                                            <img
                                                src={`https://cyber-range-assets.s3.ap-south-1.amazonaws.com/avatars/${leaderboardData[0]?.avatar}.png`}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        </Link>
                                    </div>
                                    <div>
                                    <Link to={`/profile/${leaderboardData[0]?.username}`} className="text-sm">   <p className="text-xl font-semibold text-white">{leaderboardData[0]?.first_name}</p>
                                        <p className="text-sm text-white">@{leaderboardData[0]?.username}</p></Link>
                                        <div className="mt-2 flex space-x-2">
                                            {leaderboardData[0]?.github_url && (
                                                <a href={getValidUrl(leaderboardData[0]?.github_url)} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                                                    <FaGithub />
                                                </a>
                                            )}
                                            {leaderboardData[0]?.portfolio_url && (
                                                <a href={getValidUrl(leaderboardData[0]?.portfolio_url)} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                                                    <FaBookOpen />
                                                </a>
                                            )}
                                            {leaderboardData[0]?.linkedin_url && (
                                                <a href={getValidUrl(leaderboardData[0]?.linkedin_url)} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                                                    <FaLinkedin />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute w-28 h-10 bg-white bg-opacity-50 rounded-r-full flex items-center justify-center top-32 left-0">
                                {/* <img src={rank1coin} alt="Rank 2 Coin" className="w-4 h-4 mr-2" />  */}
                                <FaStarHalfAlt className="text-yellow-300 text-lg mr-2"/><span className="text-lg font-semibold text-white">{leaderboardData[0]?.total_score} pts</span>
                                </div>
                                <div className="absolute w-10 h-10 bg-[#e8b923]  rounded-full flex items-center justify-center top-2 right-2">
                {/* <img src={rank2coin} alt="Rank 2 Coin" className="w-16 h-16 mr-2" /> */}
                <span className="text-lg font-semibold text-white">1</span>
            </div>
                    
                            </div>
                            {/* Third Place */}
                            <div className="w-1/4 h-40 rounded-lg shadow-md bg-[#979A30] p-4 flex flex-col justify-between items-start top-player-card-3 mr-24 relative">
                                <div className="flex items-center mb-2">
                                    <div className="w-18 h-18 rounded-full shadow-sm overflow-hidden mr-4">
                                        <Link to={`/profile/${leaderboardData[2]?.username}`} className="text-sm">
                                            <img
                                                src={`https://cyber-range-assets.s3.ap-south-1.amazonaws.com/avatars/${leaderboardData[2]?.avatar}.png`}
                                                alt="Avatar"
                                                className="w-full h-full object-cover border border-2"
                                                style={{ borderRadius: "50%", borderColor: "#FFD700" }}
                                            />
                                        </Link>
                                    </div>
                                    <div>
                                    <Link to={`/profile/${leaderboardData[2]?.username}`} className="text-sm">  <p className="text-xl font-semibold text-white">{leaderboardData[2]?.first_name}</p>
                                        <p className="text-sm text-white">@{leaderboardData[2]?.username}</p></Link>
                                        <div className="mt-2 flex space-x-2">
                                            {leaderboardData[2]?.github_url && (
                                                <a href={getValidUrl(leaderboardData[2]?.github_url)} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                                                    <FaGithub />
                                                </a>
                                            )}
                                            {leaderboardData[2]?.portfolio_url && (
                                                <a href={getValidUrl(leaderboardData[2]?.portfolio_url)} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                                                    <FaBookOpen />
                                                </a>
                                            )}
                                            {leaderboardData[2]?.linkedin_url && (
                                                <a href={getValidUrl(leaderboardData[2]?.linkedin_url)} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">
                                                    <FaLinkedin />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute w-28 h-10 bg-white bg-opacity-50 rounded-r-full flex items-center justify-center top-28 left-0">
                                {/* <img src={rank3coin} alt="Rank 2 Coin" className="" />  */}
                                <FaStarHalfAlt className="text-yellow-300 text-lg mr-2"/><span className="text-lg font-semibold text-white">{leaderboardData[2]?.total_score} pts</span>
                                </div>
                                <div className="absolute w-10 h-10 bg-[#88540b] bg-opacity-80 rounded-full flex items-center justify-center top-2 right-2">
                {/* <img src={rank2coin} alt="Rank 2 Coin" className="w-16 h-16 mr-2" /> */}
                <span className="text-lg font-semibold text-white">3</span>
            </div>
                    
                            </div>
                        </div>
                        <div className="overflow-x-auto">
    <table className="min-w-full bg-white mx-8 rounded-lg shadow-md border-collapse overflow-hidden">
        <thead className="sticky top-0 bg-gray-100"> {/* Ensure header sticks and has a background */}
            <tr>
                <th className="text-left py-3 px-4 text-blue-700">User</th>
                <th className="text-center py-3 px-4 text-blue-700">Rank</th> {/* Removed background color */}
                <th className="text-center py-3 px-4 text-blue-700">Socials</th>
                <th className="text-center py-3 px-4 text-blue-700">Score</th>
                <th className="text-center py-3 px-4 text-blue-700">Badges</th>
            </tr>
        </thead>
        <tbody>
            {leaderboardData.slice(3, 14).map((user, index) => {
                const isCurrentUser = currentUser && user.username === currentUser.username;
                return renderLeaderboardEntry(user, index + 3, isCurrentUser); // Adjust index for rank calculation
            })}
        </tbody>
    </table>
</div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;
