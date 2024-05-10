import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import Sidebar from './components/Sidebar';
import Navbar from './components/navbar1';
import addImage from "./assets/add2.png"; // Importing the PNG image
import Modal from 'react-modal';
import AddChallenge from './addChallenge';

const HomePage = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(() => {
    const storedTopic = localStorage.getItem("selectedTopic");
    return storedTopic ? parseInt(storedTopic) :0;
  });
  const [topics, setTopics] = useState([]);
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState(null);
  const backendUrl = "https://api.virtualcyberlabs.com";
  const [isLoading, setIsLoading] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [subAdmin, setSubAdmin] = useState(false);
  const [isAddChallengeModalOpen, setAddChallengeModalOpen] = useState(false);
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
        setSubAdmin(userData.subadmin);  // Update the admin state based on the response
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Call the fetchUserData function
    fetchUserData(); // Assuming 'admin' state is required as before for conditional rendering
  }, []);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const token = localStorage.getItem("Token");
        const response = await fetch(`${backendUrl}/topic`, {
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
      try {
        const token = localStorage.getItem("Token");
        const response = await fetch(`${backendUrl}/challenges/${selectedTopic}`, {
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

  useEffect(() => {
    // Save selected topic in local storage whenever it changes
    localStorage.setItem("selectedTopic", selectedTopic.toString());
  }, [selectedTopic]);
  const handleOpenAddChallengeModal = () => {
    setAddChallengeModalOpen(true);
  };

  const handleCloseAddChallengeModal = () => {
    setAddChallengeModalOpen(false);
  };
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
        <div className="p-4" style={{ marginTop: "1px", overflowY: "auto", height: "calc(100vh - 80px)" }}>
 
            <h2 className="text-xl font-bold mb-4">{activeTopicName}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {problems.map((problem) => (
                   <div 
                   key={problem.id} 
                   className="border border-gray-300 flex flex-col p-6 rounded-md"
                   style={{ 
                      background: colors[problem.difficulty], 
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)", 
                      transition: "all 0.3s ease",
                      height: 'auto' // Set height to auto or specify a fixed height if needed
                   }}
                >
                   <div className="flex-grow">
                      <div className="flex justify-between items-center">
                         <h3 className="text-white text-lg font-semibold ">{problem.name}</h3>
                         <span className="text-sm font-bold text-black bg-white px-2 py-1 rounded-md" style={{ marginLeft: "8px", alignSelf: "flex-start" }}>
                            {problem.difficulty}
                         </span>
                      </div>
                      <p className="text-justify text-sm text-white mb-3 mt-2">{problem.description}</p>
                   </div>
                   <Link
                      to={`/Problem/${problem.id}`}
                      className="bg-cyan-50 hover:bg-gray-300 text-black px-3 py-1 rounded-md font-bold hover:text-cyan-500 transition duration-300 self-start mt-auto" 
                   >
                      View
                   </Link>
                </div>
                ))}
            </div>
            {(subAdmin && (selectedTopic === 0 || activeTopicName === "All Problems")) && ( // admin condition 
                <div onClick={handleOpenAddChallengeModal} className="absolute bottom-4 right-4 cursor-pointer">
                     <img src={addImage} alt="Add" style={{ width: "50px", height: "50px" }} /> 
                </div>
            )}
        </div>
      </div>
      <FaBars className="sm:hidden absolute top-4 left-4 text-2xl text-gray-600 cursor-pointer" onClick={() => setShowMenu(!showMenu)} />
      <Modal
  isOpen={isAddChallengeModalOpen}
  onRequestClose={handleCloseAddChallengeModal}
  style={{
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '70%', // Adjust width as needed
      maxHeight: '80vh', 
      overflowY: 'auto', 
      borderRadius: '10px',
      padding: '20px',
    },
  }}
  shouldCloseOnOverlayClick={true}
>
  <button
    onClick={handleCloseAddChallengeModal}
    style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      border: 'none',
      color: 'black',
    }}
  >
    Close
  </button>
  <AddChallenge />
</Modal>

    </div>
  );
};

export default HomePage;
