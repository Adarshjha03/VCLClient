import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/navbar1";

const Badges = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [badges, setBadges] = useState({ completed_topics: [], remaining_topics: [] });
    const [selectedTopic, setSelectedTopic] = useState(() => {
        const storedTopic = localStorage.getItem("selectedTopic");
        return storedTopic ? parseInt(storedTopic) : 0;
    });

    const backendUrl = "https://api.virtualcyberlabs.com";
    const navigate = useNavigate();

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
                fetchBadges();
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchBadges = async () => {
            try {
                const token = localStorage.getItem("Token");
                const badgesResponse = await fetch(`${backendUrl}/topic_badge`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                if (!badgesResponse.ok) {
                    throw new Error('Failed to fetch badges');
                }
                const badgesData = await badgesResponse.json();
                setBadges(badgesData);
            } catch (error) {
                console.error('Error fetching badges:', error);
            }
        };

        fetchUserData();
        fetchBadges();
    }, []);
    const handleTopicChange = (topicId) => {
        setSelectedTopic(topicId);
        localStorage.setItem("selectedTopic", topicId);
        navigate("/home");
    };

    const handleDeleteBadge = async (topicId) => {
        const confirmation = window.confirm("Are you sure you want to delete this badge?");
        if (confirmation) {
            try {
                const token = localStorage.getItem("Token");
                const response = await fetch(`${backendUrl}/delete_badge`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                    },
                    body: JSON.stringify({ topic_id: topicId }),
                });
                if (!response.ok) {
                    throw new Error('Failed to delete badge');
                }
                fetchBadges();
            } catch (error) {
                console.error('Error deleting badge:', error);
            }
        }
    };

    return (
        <div className="flex h-screen font-sans">
            <Sidebar showMenu={showMenu} onTopicSelect={handleTopicChange} activeTopic={selectedTopic} />
            <div className="flex-1 bg-white overflow-y-auto">
                <Navbar style={{ position: "fixed", width: "100%", zIndex: 1000 }} />
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Badges</h2>
                    {admin && (
                        <div className="bg-white rounded shadow p-4 mb-6">
                            <h3 className="text-xl font-semibold mb-4">All Badges</h3>
                            <div className="grid grid-cols-4 gap-4">
                                {badges.map((badge) => (
                                    <div key={badge.id} className="relative">
                                        <img src={badge.badge_url } alt={badge.name} className="w-32 h-32 rounded-lg shadow-md" />
                                        <p className="mt-2 text-sm font-medium text-center">{badge.name}</p>
                                        <button className="absolute top-0 right-0 mt-1 mr-1 text-red-500" onClick={() => handleDeleteBadge(badge.id)}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {!admin && (
                        <>
                            <div className="bg-white rounded shadow p-4 mb-6">
                                <h3 className="text-xl font-semibold mb-4">Completed Badges</h3>
                                <div className="grid grid-cols-5 gap-4">
                                    {badges.completed_topics.map((topic) => (
                                        <div key={topic.topic_id} className="text-center flex flex-col items-center">
                                            <img src={topic.badge_url } alt={topic.badge_name || 'Badge'} className="w-32 h-32 rounded-lg shadow-md" />
                                            <p className="mt-2 text-sm font-medium">{topic.badge_name || 'Unnamed Badge'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white rounded shadow p-4">
                                <h3 className="text-xl font-semibold mb-4">Remaining Badges</h3>
                                <div className="grid grid-cols-5 gap-4">
                                    {badges.remaining_topics
                .filter(topic => topic.badge_url !== null)
                .map((topic) => (
                                        <div key={topic.topic_id} className="text-center flex flex-col items-center">
                                            <img src={topic.badge_url || 'https://via.placeholder.com/150'} alt={topic.badge_name || 'Badge'} className="w-32 h-32 rounded-lg shadow-md" />
                                            <p className="mt-2 text-sm font-medium">{topic.topic_name}</p>
                                            <button
                                                onClick={() => handleTopicChange(topic.topic_id)}
                                                className="mt-2 text-white text-xs py-1 px-4 rounded transition-transform transform hover:scale-105"
                                                style={{ backgroundColor: '#213099', boxShadow: '0 0 10px rgba(33, 48, 153, 0.5)' }}
                                            >
                                                Earn
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Badges;
