import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaTimes } from "react-icons/fa";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/navbar1";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Badges = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [badges, setBadges] = useState({ completed_topics: [], remaining_topics: [] });
    const [selectedTopic, setSelectedTopic] = useState(() => {
        const storedTopic = localStorage.getItem("selectedTopic");
        return storedTopic ? parseInt(storedTopic) : 0;
    });
    const [deleteBadgeId, setDeleteBadgeId] = useState(null);
    const [password, setPassword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
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

    const handleDeleteBadge = async (badgeId) => {
        setDeleteBadgeId(badgeId);
        setIsModalOpen(true);
    };

    const confirmDeleteBadge = async () => {
        if (password.trim() === '') return; // Password cannot be empty

        try {
            const token = localStorage.getItem("Token");
            const response = await fetch(`${backendUrl}/topic_badge`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({ topic_id: deleteBadgeId, password }),
            });
            if (!response.ok) {
                setResponseMessage("Failed to Delete Badge");
                throw new Error('Failed to delete badge');
            }
            else {
                const responseData = await response.json();
                setResponseMessage("Badge Deleted successfuly");
            } // Set response message
        } catch (error) {
            setResponseMessage("Failed to connect");
            console.error('Error deleting badge:', error);
        }
    };
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="flex h-screen font-sans">
            <Sidebar showMenu={showMenu} onTopicSelect={handleTopicChange} activeTopic={selectedTopic} />
            <div className="flex-1 bg-white overflow-y-auto">
                <Navbar style={{ position: "fixed", width: "100%", zIndex: 1000 }} />
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-6">BADGES</h2>
                    {admin && (
                        <div className="bg-white rounded shadow p-4 mb-6">
                            <h3 className="text-xl font-semibold mb-4">All Badges</h3>
                            {badges.remaining_topics.filter(topic => topic.badge_url !== null).length > 0 ? (
                                <div className="grid grid-cols-5 gap-4 justify-items-center">
                                    {badges.remaining_topics
                                        .filter(topic => topic.badge_url !== null)
                                        .map((badge) => (
                                            <div key={badge.id} className="relative flex flex-col items-center">
                                                <img src={badge.badge_url} alt={badge.name} className="w-32 h-32 rounded-lg shadow-md" />
                                                <p className="mt-2 text-sm font-medium text-center">{badge.name}</p>
                                                <button className="absolute top-1 right-2 text-red-500" onClick={() => handleDeleteBadge(badge.id)}>
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No Badges here...</p>
                            )}
                        </div>
                    )}
                    {!admin && (
                        <>
                            <div className="bg-white rounded shadow p-4 mb-6">
                                <h3 className="text-xl font-semibold mb-4">Completed Badges</h3>
                                {badges.completed_topics.length > 0 ? (
                                    <div className="grid grid-cols-5 gap-4">
                                        {badges.completed_topics.map((topic) => (
                                            <div key={topic.topic_id} className="text-center flex flex-col items-center">
                                                <img src={topic.badge_url} alt={topic.badge_name || 'Badge'} className="w-32 h-32 rounded-lg shadow-md" />
                                                <p className="mt-2 text-sm font-medium">{topic.badge_name || 'Unnamed Badge'}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No Badges here...</p>
                                )}
                            </div>
                            <div className="bg-white rounded shadow p-4">
                                <h3 className="text-xl font-semibold mb-4">Remaining Badges</h3>
                                {badges.remaining_topics.filter(topic => topic.badge_url !== null).length > 0 ? (
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
                                ) : (
                                    <p className="text-gray-500">No Badges here...</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-md relative" onClick={(e) => e.stopPropagation()}>
                        <button className="absolute top-0 right-0 mt-1 mr-1 text-black" onClick={() => setIsModalOpen(false)}>
                            <FaTimes />
                        </button>
                        <h2 className="text-xl font-bold mb-4">Confirm Badge Deletion</h2>
                        <p className="text-sm mb-4">Are you sure you want to delete the badge?</p>
                        <p className="text-sm mb-4 font-semibold">{badges.remaining_topics.find(topic => topic.id === deleteBadgeId)?.name}</p>
                        <div className="mb-4 relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type={passwordVisible ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="p-2 border rounded w-full pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-12 right-0 pr-3 flex items-center text-sm leading-5"
                            >
                                <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
                            </button>
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={confirmDeleteBadge}
                            >
                                Delete
                            </button>
                        </div>
                        {responseMessage && (
                            <div className={`bg-${responseMessage.includes('success') ? 'green' : 'red'}-100 border border-${responseMessage.includes('success') ? 'green' : 'red'}-400 text-${responseMessage.includes('success') ? 'green' : 'red'}-700 px-4 py-3 rounded mt-4`} role="alert">
                                {responseMessage}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Badges;
