import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/navbar1";
import PieChart from "./components/PieChart";
import TopLabsTable from "./components/TopLabsTable";
import BarChart from "./components/BarChart";

const Dashboard = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [labsPerCategory, setLabsPerCategory] = useState([]);
    const [topLabsPerCategory, setTopLabsPerCategory] = useState([]);
    const [topUsers, setTopUsers] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(() => {
        const storedTopic = localStorage.getItem("selectedTopic");
        return storedTopic ? parseInt(storedTopic) : 0;
    });
    const backendUrl = "https://api.virtualcyberlabs.com";
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem("Token");
                if (!token) {
                    throw new Error('No token found');
                }
                const response = await fetch(`${backendUrl}/dashboard`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch Dashboard Data');
                }
                const responseData = await response.json();
                console.log(responseData); // Handle the response data as needed
                setLabsPerCategory(responseData.labs_per_category);
                setTopLabsPerCategory(responseData.top_labs_per_category);
                setTopUsers(responseData.top_users);
                fetchBadges(); // Ensure this function is defined or remove this call
                setLoading(false);
            } catch (error) {
                console.error('Error fetching Dashboard data:', error);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleTopicChange = (topicId) => {
        setSelectedTopic(topicId);
        localStorage.setItem("selectedTopic", topicId);
        navigate("/home");
    };

    if (loading) {
        return <div>Loading...</div>; // Add a better loading indicator as needed
    }

    return (
        <div className="flex h-screen font-sans">
            <Sidebar showMenu={showMenu} onTopicSelect={handleTopicChange} activeTopic={selectedTopic} />
            <div className="flex-1 bg-white overflow-y-auto">
                <Navbar style={{ position: "fixed", width: "100%", zIndex: 1000 }} />
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-6">DASHBOARD</h2>
                    {/* First row */}
                    <div className="flex flex-col md:flex-row mb-6 gap-6">
                        <div className="w-full md:w-5/12 h-[40vh] bg-gray-100 rounded-lg p-2">
                            <PieChart data={labsPerCategory} />
                        </div>
                        <div className="w-full md:w-7/12 h-[40vh] bg-gray-100 rounded-lg p-4">
                            <TopLabsTable data={topLabsPerCategory} />
                        </div>
                    </div>

                    {/* Second row */}
                    <div className="flex flex-col md:flex-row mb-6 gap-6">
                        <div className="w-full md:w-7/12 h-[40vh] bg-gray-100 rounded-lg p-2">
                            <BarChart data={topUsers} />
                        </div>
                        <div className="w-full md:w-5/12 h-[40vh] bg-gray-100 rounded-lg p-4"></div>
                    </div>

                    {/* Third row */}
                    <div className="w-full h-[40vh] bg-gray-100 rounded-lg p-4"></div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
