import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaGithub, FaBookOpen, FaLinkedin } from "react-icons/fa";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/navbar1";
import medal from "./assets/medal.png";
const LeaderboardPage = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(0);
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const backendUrl = "https://api.virtualcyberlabs.com";

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

    const renderLeaderboardEntry = (user, index, isCurrentUser) => {
        const userRank = isCurrentUser ? leaderboardData.findIndex((u) => u.username === currentUser.username) + 1 : index + 1;
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
                className={`border-b border-gray-400 ${isCurrentUser ? "bg-blue-300 text-black" : "text-white"}`}
                style={!isCurrentUser ? { transition: "background-color 0.3s, color 0.3s" } : {}}
                onMouseEnter={(e) => {
                    if (!isCurrentUser) {
                        e.currentTarget.style.backgroundColor = "#66bfff"; // blue-200
                        e.currentTarget.style.color = "#000"; // black
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isCurrentUser) {
                        e.currentTarget.style.backgroundColor = ""; // Reset to original
                        e.currentTarget.style.color = "#fff"; // white
                    }
                }}
            >
                <td className="text-left px-4 py-2 flex items-center">
                    <span className="mr-2">#{userRank}</span>
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full shadow-sm overflow-hidden mr-2">
                            <img
                                src={`https://cyber-range-assets.s3.ap-south-1.amazonaws.com/avatars/${user.avatar}.png`}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <Link to={`/profile/${user.username}`} className={`font-semibold ${isCurrentUser ? "text-black" : "text-blue-300"}`}>
                            {user.first_name} {user.last_name}
                        </Link>
                    </div>
                </td>
                <td className="text-center px-4 py-2">
                    <div className="flex justify-center">
                        {hasSocialLinks ? (
                            <>
                                {user.github_url ? (
                                    <a href={getValidUrl(user.github_url)} target="_blank" rel="noopener noreferrer">
                                        <FaGithub className="mx-1" />
                                    </a>
                                ) : null}
                                {user.portfolio_url ? (
                                    <a href={getValidUrl(user.portfolio_url)} target="_blank" rel="noopener noreferrer">
                                        <FaBookOpen className="mx-1" />
                                    </a>
                                ) : null}
                                {user.linkedin_url ? (
                                    <a href={getValidUrl(user.linkedin_url)} target="_blank" rel="noopener noreferrer">
                                        <FaLinkedin className="mx-1" />
                                    </a>
                                ) : null}
                            </>
                        ) : (
                            <span className="mx-1">-</span>
                        )}
                    </div>
                </td>
                <td className={`font-semibold ${isCurrentUser ? "text-black" : "text-white"} text-center`}>
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
                                        className="w-12 h-12 object-cover rounded-full mx-1 transition-transform duration-200 ease-in-out group-hover:scale-150"
                                        style={{ position: 'relative', zIndex: 1 }}
                                    />
                                    <span
                                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-auto p-2 m-2 min-w-max rounded-md shadow-md text-white bg-black text-xs font-bold transition-opacity duration-200 ease-in-out opacity-0 group-hover:opacity-100"
                                        style={{ zIndex: 2 }}
                                    >
                                        {topic.badge_name}
                                    </span>
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
                <div style={{ paddingTop: "2px" }}>
                    <h2 className="text-2xl font-bold mt-6 ml-10 text-[#000930]">LEADERBOARD<img src={medal} alt="Medal" className="inline-block w-8 h-8 ml-2" /></h2>
                    <div className="container mx-auto px-10 py-4">
                    <div className="flex justify-center items-center mb-8">
    {/* Second Place */}
    <div className="w-1/6 h-56 rounded-lg shadow-md bg-[#f6f1ff] p-4 flex flex-col justify-between items-center">
        <p className="text-xl font-semibold"><span className="text-lg">#2 </span>{leaderboardData[1]?.first_name}</p>
        <div className="w-20 h-20 rounded-full shadow-sm overflow-hidden mb-2">
            <Link to={`/profile/${leaderboardData[1]?.username}`} className="text-sm">
                <img
                    src={`https://cyber-range-assets.s3.ap-south-1.amazonaws.com/avatars/${leaderboardData[1]?.avatar}.png`}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                />
            </Link>
        </div>
        <p className="text-sm">@{leaderboardData[1]?.username}</p>
        <p>{leaderboardData[1]?.total_score} pts</p>
    </div>

    {/* First Place */}
    <div className="w-1/5 h-64 rounded-lg shadow-lg bg-[#fff9e0] p-4 flex flex-col justify-between items-center">
        <p className="text-xl font-semibold"><span className="text-lg">#1 </span>{leaderboardData[0]?.first_name}</p>
        <div className="w-24 h-24 rounded-full shadow-sm overflow-hidden">
    <Link to={`/profile/${leaderboardData[0]?.username}`} className="text-sm">
        <img
            src={`https://cyber-range-assets.s3.ap-south-1.amazonaws.com/avatars/${leaderboardData[0]?.avatar}.png`}
            alt="Avatar"
            className="w-full h-full object-cover border border-2"
            style={{ borderRadius: "50%", borderColor: "#FFD700" }}
        />
    </Link>
</div>

        <p className="text-sm">@{leaderboardData[0]?.username}</p>
        <p className="font-semibold">{leaderboardData[0]?.total_score} pts</p>
    </div>

    {/* Third Place */}
    <div className="w-1/6 h-56 rounded-lg shadow-md bg-[#fee7f1] p-4 flex flex-col justify-between items-center">
        <p className="text-xl font-semibold"><span className="text-lg">#3 </span>{leaderboardData[2]?.first_name}</p>
        <div className="w-20 h-20 rounded-full shadow-sm overflow-hidden mb-2">
            <Link to={`/profile/${leaderboardData[2]?.username}`} className="text-sm">
                <img
                    src={`https://cyber-range-assets.s3.ap-south-1.amazonaws.com/avatars/${leaderboardData[2]?.avatar}.png`}
                    alt="Avatar"
                    className="w-full h-full object-cover "
                />
            </Link>
        </div>
        <p className="text-sm">@{leaderboardData[2]?.username}</p>
        <p>{leaderboardData[2]?.total_score} pts</p>
    </div>
</div>

                        <div className="flex justify-center">
                            <div className="bg-[#000930] rounded-lg shadow-lg py-3 px-1  mb-4 w-5/6">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="text-left px-4 py-2 border-b text-white border-gray-400 ">Learner</th>
                                            <th className="text-center px-4 py-2 border-b text-white border-gray-400 ">Social Links</th>
                                            <th className="text-center px-4 py-2 border-b text-white border-gray-400 ">Score</th>
                                            <th className="text-center px-4 py-2 border-b text-white border-gray-400 ">Badges</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaderboardData.slice(0, 10).map((user, index) => (
                                            renderLeaderboardEntry(user, index, currentUser && user.username === currentUser.username)
                                        ))}
                                        {currentUser && !leaderboardData.slice(0, 10).some((user) => user.username === currentUser.username) && renderLeaderboardEntry(currentUser, null, true)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <FaBars
                    className="sm:hidden absolute top-4 left-4 text-2xl text-gray-600 cursor-pointer"
                    onClick={toggleMenu}
                />
            </div>
        </div>
    );
};

export default LeaderboardPage;
