import React, { useState, useEffect } from 'react';
import headlogo from '../assets/dlogo.png';
import plusLogo from '../assets/add.png';
import Modal from 'react-modal';
import AddTopic from '../addTopic';
import { Link } from 'react-router-dom';
import { FaDesktop, FaKeyboard, FaLaptopCode, FaTasks ,FaCog, FaMedal, FaPuzzlePiece,FaBrain,FaSignOutAlt, FaCode, FaTrophy, FaQuestionCircle,FaSearch, FaUser,FaFlask } from 'react-icons/fa'; // Importing Font Awesome icons


const Sidebar = ({ showMenu, onTopicSelect, activeTopic }) => {
  const [topicsWithIcons, setTopicsWithIcons] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false); // State to manage visibility of profile options
  const backendUrl = "https://api.virtualcyberlabs.com";

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
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData(); 
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
        const updatedTopics = [...data];
        setTopicsWithIcons(updatedTopics);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={`w-1/5 h-full overflow-y-auto border-r bg-gray-100 sm:block ${showMenu ? 'block' : 'hidden'}`}>
      <div className="p-3">
        <img src={headlogo} alt="HeadLogo" className="w-3/4 content-evenly mb-4 ml-4 " />
        <div className="space-y-">
          {/* Dashboard as main heading */}
          <div className="p-2 font-bold text-lg flex items-center justify-start hover:bg-gray-400 hover:text-white transition duration-300 border-y border-gray-300">
            
            <span >Dashboard</span> {/* Larger text */}
          </div>
         
        {/* Profile section */}
        <div className="space-y-4 border-b border-gray-300">
            <div className="p-1 font-sans text-lg flex items-center justify-start hover:bg-gray-400 hover:text-white transition duration-300  ">
              <button  className="flex items-center">
                <FaUser className="w-4 h-4 mr-2" /> {/* Larger icon */}
                My Profile
              </button>
            </div>
           
              <div className="pl-4 space-y-2">
                {/* Profile links */}
                <Link to="/temp" className="p-1 font-sans text-md flex items-center justify-start hover:bg-gray-400 hover:text-white transition duration-300  ">
                  <FaCog className="w-4 h-4 mr-2" />
                  Settings
                </Link>
                <Link to="/temp" className="p-1 font-sans text-md flex items-center justify-start hover:bg-gray-400 hover:text-white transition duration-300  ">
                  <FaMedal className="w-4 h-4 mr-2" />
                  Earn Badges
                </Link>
                <Link to="/logout" className="p-1 font-sans text-md flex items-center justify-start hover:bg-gray-400 hover:text-white transition duration-300  ">
                  <FaSignOutAlt className="w-4 h-4 mr-2" />
                  Log out
                </Link>
              </div>
           
          </div>
          {/* Other sections */}
          <div className="space-y-4">
            <div className="p-1 font-sans text-lg flex items-center justify-start hover:bg-gray-400 hover:text-white transition duration-300  ">
              <Link to="/temp" className="flex items-center">
                <FaSearch className="w-4 h-4 mr-2" />
                Search Labs
              </Link>
            </div>
            </div>
            {/* Other sections */}
            <div className="space-y-4">
              {/* <div className="p-1 font-sans text-lg flex items-center justify-start hover:bg-gray-400 hover:text-white transition duration-300  "> */}
              <div
            className={`p-1 font-sans text-lg flex items-center justify-start hover:bg-gray-400 hover:text-white transition duration-300   ${
              activeTopic === 0 ? 'bg-gray-400 text-white' : ''
            }`}
            onClick={() => onTopicSelect(0)}
          >
              
                  <FaCode className="w-4 h-4 mr-2" />
                  All Problem Labs
              
              </div>
              </div>
              <div className="space-y-4 border-b border-gray-300">
              <div className="p-1 font-sans text-lg flex items-center justify-start hover:bg-gray-400 hover:text-white transition duration-300  ">
                <Link to="/temp" className="flex items-center">
                  <FaTrophy className="w-4 h-4 mr-2" />
                  Leaderboard
                </Link>
              </div>
              </div>
         
          {/* Problem Labs section */}
          <div className="p-2 font-bold text-lg flex items-center justify-start hover:bg-gray-400 hover:text-white transition duration-300 ">
            
            <span >Problem Labs</span> {/* Larger text */}
            {/* Add Topic button for admins */}
            {admin && (
              <div className="p-2 font-medium text-lg flex items-center justify-start hover:bg-gray-400 hover:text-white transition duration-300 ">
                <button onClick={openModal} className="flex items-center">
                  <img src={plusLogo} alt="Logo" className="w-4 h-4 mr-2 font-bold justify-evenly" />
                </button>
              </div>
            )}
          </div>
          {/* List of topics */}
          <div className="ml-4 space-y-2 "> {/* Indent and space the list of topics */}
            {topicsWithIcons.map((topic) => (
              <div
                key={topic.id}
                className={`p-2 font-sans text-md flex items-center justify-start hover:bg-gray-400 hover:text-white transition duration-300  ${
                  activeTopic === topic.id ? 'bg-gray-400 text-white' : ''
                }`}
                onClick={() => onTopicSelect(topic.id === 0 ? 0 : topic.id)}
              >
                <div className="flex items-center">
                <span className="mr-2">< FaLaptopCode className="w-4 h-4" /></span>
                  {topic.name}
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
      {/* Modal for adding topic */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
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
            borderRadius: '10px',
            padding: '20px',
          },
        }}
        shouldCloseOnOverlayClick={true}
      >
        <button
          onClick={closeModal}
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
        <AddTopic />
      </Modal>
    </div>
  );
};

export default Sidebar;
