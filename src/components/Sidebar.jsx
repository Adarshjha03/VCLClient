import React, { useState, useEffect } from 'react';
import headlogo from '../assets/dlogo.png';
import logo from '../assets/bullet.png'
import plusLogo from '../assets/add.png';
import Modal from 'react-modal'; // Import React Modal
import AddTopic from '../addTopic'; // Import the AddTopic component

const Sidebar = ({ showMenu, onTopicSelect, activeTopic }) => {
  const [topicsWithLogos, setTopicsWithLogos] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false); // State for modal
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
        const allProblemsTopic = { "id": 0 , "name": 'All Problems' };
        const updatedTopics = [allProblemsTopic, ...data];
        console.log(updatedTopics);
        setTopicsWithLogos(updatedTopics);
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
    <div
      className={`w-1/5 h-full overflow-y-auto border-r bg-gray-100 sm:block ${showMenu ? 'block' : 'hidden'}`}
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#a5a5a5 #f3f4f6',
      }}
    >
      <div className="p-3">
        <img src={headlogo} alt="HeadLogo" className="w-3/4 content-evenly mb-4 ml-4 " />
        <div className="space-y-4">
          {admin && (
            <div className="p-2 rounded-md font-medium text-xl flex items-center justify-start hover:bg-gray-400 hover:text-white transition duration-300 flex items-center">
              <button onClick={openModal} className="flex items-center">
                <img src={plusLogo} alt="Logo" className="w-4 h-4 mr-2 font-bold justify-evenly" />
                Add Topic
              </button>
            </div>
          )}
          {topicsWithLogos.map((topic) => (
            <div
              key={topic.id}
              className={`p-2 rounded-md font-medium text-sm flex items-center justify-start hover:bg-gray-400 hover:text-white transition duration-300 ${
                activeTopic === topic.id ? 'bg-[#2234ae] text-white' : ''
              }`}
              onClick={() => onTopicSelect(topic.id === 0 ? 0 : topic.id)}
            >
              <div className="flex items-center">
                <img src={logo} alt="Logo" className="w-4 h-4 mr-2" />
                {topic.name}
              </div>
            </div>
          ))}
        </div>
      </div>
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
  shouldCloseOnOverlayClick={true} // Close modal when clicking outside
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
