import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/navbar1";
import { FaBars, FaPlus } from "react-icons/fa";

const Settings = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [username, setUsername] = useState('');
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        githubUrl: "",
        portfolioUrl: "",
        linkedinUrl: "",
        avatar: 1,
    });
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [responseMessage, setResponseMessage] = useState(null);
    const [bonusPoints, setBonusPoints] = useState(0);
    const [showAddPoints, setShowAddPoints] = useState(false);
    const [newBonusPoints, setNewBonusPoints] = useState(0);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const [selectedTopic, setSelectedTopic] = useState(() => {
        const storedTopic = localStorage.getItem("selectedTopic");
        return storedTopic ? parseInt(storedTopic) : 0;
    });

    const backendUrl = "https://api.virtualcyberlabs.com";
    const { id } = useParams();
    const navigate = useNavigate();

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
            setUser({
                firstName: userData.first_name || "",
                lastName: userData.last_name || "",
                email: userData.email || "",
                phoneNumber: userData.phone_number || "",
                githubUrl: userData.github_url || "",
                portfolioUrl: userData.portfolio_url || "",
                linkedinUrl: userData.linkedin_url || "",
                avatar: userData.avatar,
            });
            setUsername(userData.username);
            setBonusPoints(userData.bonus_score || 0); // Set the bonus points
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const fetchCurrentUser = async () => {
        try {
            const token = localStorage.getItem("Token");
            const response = await fetch(`${backendUrl}/user`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch current user data.");
            }
            const currentUserData = await response.json();
            setAdmin(currentUserData.admin);
        } catch (error) {
            console.error("Error fetching current user data:", error);
        }
    };

    useEffect(() => {
        fetchUserData();
        fetchCurrentUser();
    }, []);

    const handleProfileSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem("Token");
            const response = await fetch(`${backendUrl}/user${admin ? `/${id}` : ''}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({
                    first_name: user.firstName,
                    last_name: user.lastName,
                    email: user.email,
                    phone_number: user.phoneNumber,
                    github_url: user.githubUrl,
                    portfolio_url: user.portfolioUrl,
                    linkedin_url: user.linkedinUrl,
                    avatar: user.avatar,
                }),
            });

            if (response.ok) {
                setResponseMessage('Profile updated successfully');
            } else {
                setResponseMessage('Error updating profile');
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setResponseMessage('Error updating profile');
        }
    };

    const handlePasswordSubmit = async (event) => {
        event.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setResponseMessage('New passwords do not match');
            return;
        }

        try {
            const token = localStorage.getItem("Token");
            const requestBody = admin
                ? { username: id, newPassword }
                : { oldPassword, newPassword };

            const response = await fetch(`${backendUrl}/update_password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                setResponseMessage('Password updated successfully');
            } else {
                setResponseMessage('Error updating password');
            }
        } catch (error) {
            console.error("Error updating password:", error);
            setResponseMessage('Error updating password');
        }
    };

    const handleAddBonusPoints = async () => {
        try {
            const token = localStorage.getItem("Token");
            const response = await fetch(`${backendUrl}/add_bonus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify({
                    username: username,
                    bonus_score: newBonusPoints,
                }),
            });

            if (response.ok) {
                setResponseMessage('Bonus points added successfully');
                 // Update the bonus points state
                setShowAddPoints(false); // Hide the popup
            } else {
                setResponseMessage('Error adding bonus points');
            }
        } catch (error) {
            console.error("Error adding bonus points:", error);
            setResponseMessage('Error adding bonus points');
        }
    };

    const handleTopicChange = (topicId) => {
        setSelectedTopic(topicId); // Update selected topic
        localStorage.setItem("selectedTopic", topicId);
        navigate("/home");
    };
    return (
        <div className="flex h-screen font-sans-relative">
            <Sidebar showMenu={showMenu} onTopicSelect={handleTopicChange} activeTopic={selectedTopic} />
            <div className="flex-1 overflow-y-auto" style={{ background: "#ffffff", overflowY: "hidden" }}>
                <Navbar style={{ position: "fixed", width: "100%", zIndex: 1000 }} />
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Settings</h2>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Profile</h3>
                        <form onSubmit={handleProfileSubmit}>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={user.firstName}
                                    onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                                    className="p-2 border rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={user.lastName}
                                    onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                                    className="p-2 border rounded"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={user.email}
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    className="p-2 border rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    value={user.phoneNumber}
                                    onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
                                    className="p-2 border rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="GitHub URL"
                                    value={user.githubUrl}
                                    onChange={(e) => setUser({ ...user, githubUrl: e.target.value })}
                                    className="p-2 border rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="Portfolio URL"
                                    value={user.portfolioUrl}
                                    onChange={(e) => setUser({ ...user, portfolioUrl: e.target.value })}
                                    className="p-2 border rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="LinkedIn URL"
                                    value={user.linkedinUrl}
                                    onChange={(e) => setUser({ ...user, linkedinUrl: e.target.value })}
                                    className="p-2 border rounded"
                                />
                            </div>
                            <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white items-center rounded hover:bg-blue-600">
                                Update Profile
                            </button>
                        </form>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Change Password</h3>
                        <form onSubmit={handlePasswordSubmit}>
                            {!admin && (
                                <input
                                    type="password"
                                    placeholder="Old Password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="p-2 border rounded mb-2 w-full md:w-auto mr-4"
                                />
                            )}
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="p-2 border rounded mb-2 w-full md:w-auto mr-4"
                            />
                            
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                className="p-2 border rounded mb-2 w-full md:w-auto mr-4"
                            />
                            <p>
                            <button type="submit" className="mb-2 mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                Update Password
                            </button>
                            </p>
                        </form>
                    </div>

                    {admin && (
                        <div className="mb-12">
                            <h3 className="text-xl font-semibold mb-2">Add Bonus Points</h3>
                            <p>Current Bonus Points: {bonusPoints}</p>
                            <form onSubmit={handleAddBonusPoints} className="mt-4">
                                <div className="flex items-center mb-2">
                                    <input
                                        type="number"
                                        placeholder="Enter bonus points"
                                        value={newBonusPoints}
                                        onChange={(e) => setNewBonusPoints(parseInt(e.target.value))}
                                        className="p-2 border rounded mr-2"
                                    />
                                   
                                </div>
                                <p>
                                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                        Add Points
                                    </button>
                                    </p>
                            </form>
                        </div>
                    )}
                    {responseMessage && (
                        <div className={`bg-${responseMessage.includes('success') ? 'green' : 'red'}-100 border border-${responseMessage.includes('success') ? 'green' : 'red'}-400 text-${responseMessage.includes('success') ? 'green' : 'red'}-700 px-4 py-3 rounded mt-4`} role="alert">
                            {responseMessage}
                        </div>
                    )}
                </div>
            </div>
            <FaBars className="sm:hidden absolute top-4 left-4 text-2xl text-gray-600 cursor-pointer" onClick={() => setShowMenu(!showMenu)} />
        </div>
    );
};

export default Settings;
