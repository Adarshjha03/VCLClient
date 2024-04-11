import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import Sidebar from './components/Sidebar';
import Navbar from './components/navbar1';
import addImage from "./assets/add.png"; // Importing the PNG image

const HomePage = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(0); // Default selected topic is 0 (All Problems)
  const [topics, setTopics] = useState([]);
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [admin, setAdmin] = useState(false); // Initially assuming the user is not an admin

    useEffect(() => {
        const fetchUserData = async () => {
            try {
              const token = localStorage.getItem("Token");
                const userResponse = await fetch('http://cyberrange-backend-dev.ap-south-1.elasticbeanstalk.com/user', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                if (!userResponse.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const userData = await userResponse.json();
                setAdmin(userData.admin); // Update the admin state based on the response
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        // Call the fetchUserData function
        fetchUserData(); // Assuming 'admin' state is required as before for conditional rendering
    }, []);

  useEffect(() => {
    const fetchTopics = async () => {
      try {const token = localStorage.getItem("Token");
        const response = await fetch('http://cyberrange-backend-dev.ap-south-1.elasticbeanstalk.com/topic', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch topics');
        }
        const data = await response.json();
        setTopics(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, []);

  useEffect(() => {
    const fetchProblems = async () => {
      try {const token = localStorage.getItem("Token");
        const response = await fetch(`http://cyberrange-backend-dev.ap-south-1.elasticbeanstalk.com/challenges/${selectedTopic}`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch problems');
        }
        const data = await response.json();
        setProblems(data.challenges); // Extracting challenges array from response
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, [selectedTopic]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleTopicChange = (topicId) => {
    setSelectedTopic(topicId);
  };

  const activeTopicName = topics.find(topic => topic.id === selectedTopic)?.name || "All Problems";

  const colors = {
    Easy: "linear-gradient(to right, #26c585, #24c6c0)",
    Medium: "linear-gradient(to right, #f95b37, #fca339)",
    Hard: "linear-gradient(to right, #f43150, #f2512e)",
  };

  return (
    <div className="flex h-screen font-sans relative">
      <Sidebar showMenu={showMenu} onTopicSelect={handleTopicChange} activeTopic={selectedTopic} topics={topics} />
      <div className="flex-1" style={{ background: "#e0efee", overflowY: "hidden" }}>  
        <Navbar style={{ position: "fixed", width: "100%", zIndex: 1000 }} />  
        <div className="p-4" style={{ marginTop: "1px", overflowY: "auto", height: "calc(100vh - 1px)" }}>  
            <h2 className="text-xl font-bold mb-4">{activeTopicName}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {problems.map((problem) => (
                    <div key={problem.id} className="border border-gray-300 p-6 rounded-md" style={{ background: colors[problem.difficulty], boxShadow: "0 4px 6px rgba(0,0,0,0.1)", transition: "all 0.3s ease" }}>
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold mb-2">{problem.name}</h3>
                            <span className="text-sm font-bold text-black bg-white px-2 py-1 rounded-md" style={{ marginLeft: "8px", alignSelf: "flex-start" }}>
                                {problem.difficulty}
                            </span>
                        </div>
                        <p className="text-sm text-white mb-4">{problem.description}</p>
                        <Link to={`/Problem/${problem.id}`} className="bg-cyan-50 hover:bg-gray-300 text-black px-4 py-2 rounded-md font-bold hover:text-cyan-500 transition duration-300">View</Link>

                    </div>
                ))}
            </div>
            {(admin && (selectedTopic === 0 || activeTopicName === "All Problems")) && ( // admin condition 
                <Link to="/addChallenge" className="absolute bottom-4 right-4">
                     <img src={addImage} alt="Add" style={{ width: "40px", height: "40px" }} /> 
                </Link>
            )}
        </div>
      </div>
      <FaBars className="sm:hidden absolute top-4 left-4 text-2xl text-gray-600 cursor-pointer" onClick={() => setShowMenu(!showMenu)} />
    </div>
  );
};

export default HomePage;
