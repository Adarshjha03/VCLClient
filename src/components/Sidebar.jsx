import React, { useState, useEffect } from 'react';

import plusLogo from '../assets/add.png';
import Modal from 'react-modal';
import AddTopic from '../addTopic.jsx';
import AddCategory from '../addCategory.jsx';
import checkCircleOutline from '../assets/check-circle-outline.svg'
import AddBadges from './addBadge';
import DeleteTopic from './DeleteTopic';
import DeleteCategory from './DeleteCategory';
import { FaPencilAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Circles ,TailSpin} from 'react-loader-spinner';
import { FaTimes, FaCog, FaMedal, FaCode, FaTrophy, FaUser, FaTrash, FaHashtag, FaChevronRight, FaChevronDown, FaBars } from 'react-icons/fa';
import { MdAnalytics,MdCorporateFare } from 'react-icons/md';
import { BsBookshelf } from 'react-icons/bs';
import { FaLaptopCode} from 'react-icons/fa';
//import './scrollbar.css';
const Sidebar = ({ onTopicSelect }) => {
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState({});
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedTopic, setselectedTopic] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [subAdmin, setSubAdmin] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [PLmodalIsOpen, setPLModalIsOpen] = useState(false);
  const [badgeModalIsOpen, setBadgeModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [deletePLModalIsOpen, setDeletePLModalIsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [activeButton, setActiveButton] = useState(null);
  const [username, setUsername] = useState('');
  const backendUrl = "https://api.virtualcyberlabs.com";
  const [showMenu, setShowMenu] = useState(false);
  const handleToggleMenu = () => {
    setShowMenu(!showMenu);
  };
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
        setSubAdmin(userData.subadmin);
        setUsername(userData.username);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("Token");
        const response = await fetch(`${backendUrl}/category`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const savedCategory = localStorage.getItem('selectedCategoryId');
    const savedTopicId = localStorage.getItem('selectedTopic');

    if (savedCategory) {
      setSelectedCategoryId(Number(savedCategory));
      fetchTopics(Number(savedCategory));
    }
    if (savedTopicId) {
      setselectedTopic(Number(savedTopicId));
    }
  }, []);

  useEffect(() => {
    if (selectedCategoryId !== null) {
      localStorage.setItem('selectedCategoryId', selectedCategoryId);
    }
  }, [selectedCategoryId]);


  useEffect(() => {
    if (selectedTopic !== null) {
      localStorage.setItem('selectedTopic', selectedTopic);
    }
  }, [selectedTopic]);

  const fetchTopics = async (categoryId) => {
    try {
      const token = localStorage.getItem("Token");
      const response = await fetch(`${backendUrl}/category/${categoryId}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch topics');
      }
      const data = await response.json();
      setTopics((prevTopics) => ({ ...prevTopics, [categoryId]: data }));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCategoryClick = (categoryId) => {
    if (expandedCategories.includes(categoryId)) {
      // If the clicked category is already expanded, collapse it
      setExpandedCategories(expandedCategories.filter(id => id !== categoryId));
    } else {
      // Collapse any expanded category first
      setExpandedCategories([categoryId]);
      fetchTopics(categoryId);
    }
    
    setSelectedCategoryId(categoryId);
  };
  

  const handleTopicClick = (topicId) => {
    setselectedTopic(topicId);
    onTopicSelect(topicId);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };
  const openPLModal = () => {
    setPLModalIsOpen(true);
  };
  const closePLModal = () => {
    setPLModalIsOpen(false);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openBadgeModal = () => {
    setBadgeModalIsOpen(true);
  };

  const closeBadgeModal = () => { setBadgeModalIsOpen(false); };
  const openDeleteModal = () => {  setDeleteModalIsOpen(true);};

  const openDeletePLModal = () => { setDeletePLModalIsOpen(true); };
  const closeDeletePLModal = () => { setDeletePLModalIsOpen(false); };
  const closeDeleteModal = () => { setDeleteModalIsOpen(false); };
  const handleButtonClick = (topicId) => {
    setActiveButton(topicId);
    onTopicSelect(topicId === 0 ? 0 : topicId);
  };
  if (isLoading) {  return   <div className="flex items-center justify-center h-screen">
    <TailSpin
      height="60"
      width="60"
      color="#0000FF"
      ariaLabel="loading-indicator"
    />
  </div>;}
  if (error) {  return <div>Error: {error}</div>; }

  return (
    // <div className={`w-1/6 h-full overflow-y-auto border-r sm:block ${showMenu ? 'block' : 'hidden'}`} style={{ backgroundColor: '#000930' }}>
    //     <div
    //   className={`w-1/6 h-full overflow-y-auto border-r bg-[#000930] sm:block ${showMenu ? 'block' : 'hidden sm:absolute sm:inset-0 sm:w-full sm:z-50'}`}
    // >
  <>
   <div
        className="sm:hidden absolute top-4 left-4 text-2xl text-gray-600 cursor-pointer"
        onClick={handleToggleMenu}
        style={{ zIndex: showMenu ? '60' : 'auto' }} // Ensuring a higher z-index for the cross icon
      >
        {showMenu ? <FaTimes style={{ zIndex: '60' }} /> : <FaBars />}
      </div>
    <div className={`sm:w-1/6 w-full h-full overflow-y-auto  bg-[#000930] ${showMenu ? 'block sm:static' : 'hidden sm:block'}`} style={{ zIndex: showMenu ? '50' : 'auto' }}>
  <div className="p-3 font-sans text-white">
    <div className="flex justify-center">
      <img src={"https://cyber-range-assets.s3.ap-south-1.amazonaws.com/assets/" + (window.location.origin.includes("https://") ? window.location.origin.slice(8) : window.location.origin) + "/logo.png"} alt="HeadLogo" className="w-50 content-evenly mb-3" />
    </div>


    <div>
      {admin && (<div>
        <div className="p-2 font-semibold text-md flex items-center justify-start border-b border-gray-100/55 hover:bg-blue-400 rounded-sm hover:rounded-sm hover:text-white transition duration-300">
          <span>ADMIN SETTINGS</span>
        </div>
        <div className="space-y-2 py-2 ">
          <div> <Link
            to={`/adminConfig`}

            className={`p-1 text-xs flex items-center justify-start transition duration-300 rounded-sm hover:rounded-sm hover:bg-blue-400 hover:text-white ${activeButton === -2 && 'bg-blue-600 text-white'}`}
            style={{ textTransform: 'uppercase' }}
          >
            <FaCog className="w-4 h-4 mr-2" />
            Site Builder
          </Link>
            <Link
              to="/integration"
              className={`p-1 text-xs flex items-center justify-start transition duration-300 rounded-sm hover:rounded-sm hover:bg-blue-400 hover:text-white ${activeButton === -2 && 'bg-blue-600 text-white'}`}
              style={{ textTransform: 'uppercase' }}
            >
              <FaCog className="w-4 h-4 mr-2" />
              Integrations
            </Link>
            {/* <Link
              to="/temp"
              className={`p-1 text-xs flex items-center justify-start transition duration-300 rounded-sm hover:rounded-sm hover:bg-blue-400 hover:text-white ${activeButton === -2 && 'bg-blue-600 text-white'}`}
              style={{ textTransform: 'uppercase' }}
            >
              <FaCog className="w-4 h-4 mr-2" />
              Configuration
            </Link> */}
            </div>
        </div>
      </div>)}
      {admin ? (
        <Link to="/dashboard">
          <div className="p-2 font-semibold text-md flex items-center justify-start border-b border-gray-100/55 hover:bg-blue-400 rounded-sm hover:rounded-sm hover:text-white transition duration-300">
            <span>DASHBOARD</span>
            <MdAnalytics className="ml-2 text-lg" />
          </div>
        </Link>
      ) : (
        <div className="p-2 font-semibold text-md flex items-center justify-start border-b border-gray-100/55 hover:bg-blue-400 rounded-sm hover:rounded-sm hover:text-white transition duration-300">
          <span>DASHBOARD</span>
        </div>
      )}

      <div className="space-y-2 py-2 ">
        {!admin && !subAdmin && (<div className=''><Link
          to={`/profile/${username}`}
          onClick={() => {
            window.location.href = `/profile/${username}`;
          }}
          className={`p-1 my-1 text-xs flex items-center justify-start transition duration-300 rounded-sm hover:rounded-sm hover:bg-blue-400 hover:text-white ${activeButton === -1 && 'bg-blue-600 text-white'}`}
          style={{ textTransform: 'uppercase' }}
        >
          <FaUser className="w-4 h-4 mr-2" />
          My Profile
        </Link>
          <Link
            to={`/settings/${username}`}
            onClick={() => {
              window.location.href = `/settings/${username}`;
            }}
            className={`p-1 mt-2 text-xs flex items-center justify-start transition duration-300 rounded-sm hover:rounded-sm hover:bg-blue-400 hover:text-white ${activeButton === -2 && 'bg-blue-600 text-white'}`}
            style={{ textTransform: 'uppercase' }}
          >
            <FaCog className="w-4 h-4 mr-2" />
            Settings
          </Link></div>)}

        <div className="flex items-center justify-between">
          <div
            className={`flex items-center justify-start p-1 text-xs rounded-sm transition duration-300 hover:bg-blue-400 hover:text-white w-full ${activeButton === -3 && 'bg-blue-600 text-white'}`}
            style={{ textTransform: 'uppercase' }}
          >
            <Link
              to="/badges"
              className="flex items-center justify-start"
              style={{ marginRight: admin ? '0.5rem' : 0 }}
            >
              <FaMedal className="w-4 h-4 mr-2" />
              Earn Badges
            </Link>
            {admin && (
              <button
                onClick={openBadgeModal}
                className="flex items-center justify-center rounded-sm hover:bg-transparent transition duration-300 ml-3"
              >
                <img src={plusLogo} alt="Add Badge" className="w-4 h-4 " />
              </button>
            )}
          </div>
        </div>
        <div
          className={`p-1 text-xs flex items-center justify-start transition duration-300 rounded-sm hover:cursor-pointer hover:bg-blue-400 hover:text-white ${activeButton === 0 && 'bg-blue-600 text-white'}`}
          style={{ textTransform: 'uppercase' }}
          onClick={() => handleButtonClick(0)}
        >
          <FaCode className="w-4 h-4 mr-2" />
          All Problem Labs
        </div>
        <Link
          to="/leaderboard"
          className={`p-1 text-xs flex items-center justify-start transition duration-300 rounded-sm hover:rounded-sm hover:bg-blue-400 hover:text-white ${activeButton === -4 && 'bg-blue-600 text-white'}`}
          style={{ textTransform: 'uppercase' }}
        >
          <FaTrophy className="w-4 h-4 mr-2" />
          Leaderboard
        </Link>
      </div>
      <div className="p-2 font-semibold text-md flex items-center justify-start  rounded-sm hover:rounded-sm hover:bg-blue-400 hover:text-white transition duration-300 border-b border-gray-100/55">
        <span>PROBLEM LABS</span>
        {subAdmin && (
          <div className="p-2 font-medium text-xs flex items-center justify-start rounded-sm hover:rounded-sm hover:bg-blue-400 hover:text-white transition duration-300">
            <button onClick={openPLModal} className={`flex items-center focus:outline-none rounded-md py-1 px-2 pr-0 hover:bg-blue-400 hover:text-white`} style={{ textTransform: 'uppercase' }}>
              <img src={plusLogo} alt="Add Topic" className="w-4 h-4  fixed-size-icon" />
            </button>
          </div>
        )}
        {admin && (
          <button
            onClick={(e) => { e.stopPropagation(); openDeletePLModal(); }}
            className="flex items-center justify-center rounded-sm hover:bg-transparent transition duration-300"
            style={{ width: '20px', height: '20px' }}
          >
            <FaTrash className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="space-y-1 pt-2">
        {categories.map((category) => (
          <div key={category.id}>
            <div
              onClick={() => handleCategoryClick(category.id)}
              className="p-2 text-xs flex items-center justify-between hover:bg-blue-400 rounded-sm hover:rounded-sm hover:text-white transition duration-300 cursor-pointer"
            >
              <div className="flex items-center">
                <span className="mr-2"> <img src={checkCircleOutline} alt="Check Circle Outline" width="15" height="15s" /></span>
                {category.name.toUpperCase()}
              </div>
              <div className="flex items-center">
                {subAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategoryId(category.id);
                      openModal();
                    }}
                    className="flex items-center justify-center rounded-sm hover:bg-transparent transition duration-300 mr-2"
                    style={{ width: '20px', height: '20px' }}
                  >
                    <FaPencilAlt className="text-white w-3 h-4" />
                  </button>
                )}
                {admin && (
                  <button
                    onClick={(e) => { e.stopPropagation(); openDeleteModal(); setSelectedCategoryId(category.id); }}
                    className="flex items-center justify-center rounded-sm hover:bg-transparent transition duration-300"
                    style={{ width: '20px', height: '20px' }}
                  >
                    <FaTrash className="w-3  h-4" />
                  </button>
                )}
              </div>
              {!admin && !subAdmin && (<span className="mr-2 transition-transform duration-300">
                {expandedCategories.includes(category.id) ? (
                  <FaChevronDown className="w-4 h-4 transform " />
                ) : (
                  <FaChevronRight className="w-4 h-4" />
                )}
              </span>)}
            </div>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedCategories.includes(category.id) ? 'max-h-96' : 'max-h-0'
                }`}
            >
              {expandedCategories.includes(category.id) && (
                <div className="pl-4">
                  {topics[category.id] && topics[category.id].length > 0 ? (
                    topics[category.id].map((topic) => (
                      <div
                        key={topic.id}
                        onClick={() => handleTopicClick(topic.id)}
                        className={`p-2 text-xs flex items-center justify-between rounded-sm hover:rounded-sm hover:bg-blue-400 hover:text-white transition duration-300 ease-in-out delay-150${selectedTopic === topic.id && 'bg-blue-600 text-white'
                          }`}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="flex items-center text-blue-100">{topic.name.toUpperCase()}</div>
                      </div>
                    ))
                  ) : (
                    <div className="p-1 text-xs duration-300">No topics available </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex-grow mb-auto">
  <div className="p-2 font-semibold text-md flex items-center justify-start border-b border-gray-100/55 hover:bg-blue-400 rounded-sm hover:rounded-sm hover:text-white transition duration-300">
    <span>KNOWLEDGE BASE</span>
  </div>
  <div className="space-y-2 py-2">
    <Link
      to="/ide-simulator"
      className={`p-1 text-xs flex items-center justify-start transition duration-300 rounded-sm hover:rounded-sm hover:bg-blue-400 hover:text-white ${activeButton === -5 && 'bg-blue-600 text-white'}`}
      style={{ textTransform: 'uppercase' }}
    >
      <FaLaptopCode className="w-4 h-4 mr-2" />
      IDE Simulator
    </Link>
    {/* <Link
      to="/temp"
      className={`p-1 text-xs flex items-center justify-start transition duration-300 rounded-sm hover:rounded-sm hover:bg-blue-400 hover:text-white ${activeButton === -6 && 'bg-blue-600 text-white'}`}
      style={{ textTransform: 'uppercase' }}
    >
      <MdCorporateFare className="w-4 h-4 mr-2" />
      Placement Prep
    </Link>
    <Link
      to="/temp"
      className={`p-1 text-xs flex items-center justify-start transition duration-300 rounded-sm hover:rounded-sm hover:bg-blue-400 hover:text-white ${activeButton === -7 && 'bg-blue-600 text-white'}`}
      style={{ textTransform: 'uppercase' }}
    >
      <BsBookshelf className="w-4 h-4 mr-2" />
      Research Forum
    </Link> */}
  </div>
</div>
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
    shouldCloseOnOverlayClick={true}
  >
    <button onClick={closeModal}
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
      <FaTimes />
    </button>
    <AddTopic />
  </Modal>
  <Modal
    isOpen={PLmodalIsOpen}
    onRequestClose={closePLModal}
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
      onClick={closePLModal}
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
      <FaTimes />
    </button>
    <AddCategory />
  </Modal>
  <Modal
    isOpen={badgeModalIsOpen}
    onRequestClose={closeBadgeModal}
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
      onClick={closeBadgeModal}
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
      <FaTimes />
    </button>
    <AddBadges />
  </Modal>
  <Modal
    isOpen={deleteModalIsOpen}
    onRequestClose={closeDeleteModal}
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
      onClick={closeDeleteModal}
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
      <FaTimes />
    </button>
    <DeleteTopic />
  </Modal>
  <Modal
    isOpen={deletePLModalIsOpen}
    onRequestClose={closeDeletePLModal}
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
      onClick={closeDeletePLModal}
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
      <FaTimes />
    </button>
    <DeleteCategory />
  </Modal>
</div></>
    

  );
};

export default Sidebar;



