import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/navbar1";
import PieChart from "./components/PieChart";
import TopLabsTable from "./components/TopLabsTable";
import BarChart from "./components/BarChart";
import SearchUsers from "./components/SearchUsers";

const Dashboard = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [labsPerCategory, setLabsPerCategory] = useState([]);
  const [topLabsPerCategory, setTopLabsPerCategory] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [allUsers, setAllUsers] = useState([]);
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
          throw new Error("No token found");
        }
        const response = await fetch(`${backendUrl}/dashboard`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch Dashboard Data");
        }
        const responseData = await response.json();
        console.log(responseData); // Handle the response data as needed
        setLabsPerCategory(responseData.labs_per_category);
        setTopLabsPerCategory(responseData.top_labs_per_category);
        setTopUsers(responseData.top_users);

        setTotalUsers(responseData.total_users);

        setAllUsers(responseData.all_users); // Assuming the response has all_users
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Dashboard data:", error);
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
      <Sidebar
        showMenu={showMenu}
        onTopicSelect={handleTopicChange}
        activeTopic={selectedTopic}
      />
      <div className="flex-1 bg-white overflow-y-auto">
        <Navbar style={{ position: "fixed", width: "100%", zIndex: 1000 }} />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">DASHBOARD</h2>

          {/* First row */}
          <div className="flex flex-col md:flex-row mb-6 gap-6">
            <div className="w-full md:w-5/12 h-[40vh] bg-gray-100 rounded-lg p-3">
              <h3 className="text-xl font-bold  text-center">
                Lab Distribution
              </h3>
              <PieChart data={labsPerCategory} />
            </div>
            <div className="w-full md:w-7/12 h-[40vh] bg-gray-100 rounded-lg py-3 px-1">
              <h3 className="text-xl font-bold mb-2 text-center">
                Most Solved
              </h3>
              <TopLabsTable data={topLabsPerCategory} />
            </div>
          </div>

<<<<<<< HEAD
                        <div className="w-full md:w-5/12 h-[45vh] bg-gray-100 rounded-lg p-4">
                        <SearchUsers users={allUsers} backendUrl={backendUrl} /></div>
                        </div>
                    
                    <button
                                className="bg-blue-500 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
                                onClick={handleExport}
                            >
                                Extract All Users
                            </button>
=======
          {/* Second row */}
          <div className="flex flex-col md:flex-row mb-6 gap-6">
            <div className="w-full md:w-7/12 h-[45vh] bg-gray-100 rounded-lg py-3">
              <h3 className="text-xl font-bold  text-center">User Analytics</h3>
              <div className="flex h-full">
                <div className="flex-1">
                  <BarChart data={topUsers} />
>>>>>>> origin
                </div>
                <div className="flex-1 flex flex-col items-center p-4">
                  <div className="bg-blue-200 rounded-lg p-3 mb-6 w-full text-center">
                    <div className="text-lg font-semibold">{totalUsers}</div>
                    <div>Total Users</div>
                  </div>

                  <div className="flex justify-around w-full">
                    {topUsers.slice(0, 3).map((user, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center space-y-2 "
                      >
                        <a href={`/profile/${user.username}`}>
                          <img
                            src={`https://cyber-range-assets.s3.ap-south-1.amazonaws.com/avatars/${user.avatar}.png`}
                            alt={`Avatar of ${user.username}`}
                            className="w-16 h-16 bg-gray-300 rounded-full"
                          />
                        </a>
                        <a href={`/profile/${user.username}`}>
                          <span>{user.username}</span>
                        </a>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 font-bold text-blue-600">
                    TOP 3 Learners
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-5/12 h-[45vh] bg-gray-100 rounded-lg ">
              <SearchUsers users={allUsers} backendUrl={backendUrl} />
            </div>
          </div>

         
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
