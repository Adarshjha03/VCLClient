import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/navbar1";
import addImage from "./assets/add2.png"; // Importing the PNG image
import Modal from "react-modal";
import AddChallenge from "./addChallenge";
import SearchBar from "./components/SearchBar";
import { TailSpin } from "react-loader-spinner";
import { FaPlus, FaTrash } from "react-icons/fa";
import AddVideos from "./addVideos";
import Switch from '@mui/material/Switch';

const HomePage = () => {
  const [selectedTopic, setSelectedTopic] = useState(() => {
    const storedTopic = localStorage.getItem("selectedTopic");
    return storedTopic ? parseInt(storedTopic) : 0;
  });
  const [topics, setTopics] = useState([]);
  const [problems, setProblems] = useState([]);
  const [constproblems, setConstProblems] = useState([]);
  const [error, setError] = useState(null);
  const [resources, setResources] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const backendUrl = "https://api.virtualcyberlabs.com";
  const [isLoading, setIsLoading] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [subAdmin, setSubAdmin] = useState(false);
  const [isAddChallengeModalOpen, setAddChallengeModalOpen] = useState(false);
  const [isAddVideosModalOpen, setAddVideosModalOpen] = useState(false);
  const [showChallenges, setShowChallenges] = useState(true);
  const [quizzes, setQuizzes] = useState([]);

  const handleSearch = (filteredProblems) => {
    setProblems(filteredProblems);
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
          throw new Error("Failed to fetch user data");
        }
        const userData = await userResponse.json();
        setAdmin(userData.admin);
        setSubAdmin(userData.subadmin);
      } catch (error) {
        setError(error.message);
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
          throw new Error("Failed to fetch topics");
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
    const fetchProblemsAndQuizzes = async () => {
      try {
        const token = localStorage.getItem("Token");
        const response = await fetch(`${backendUrl}/challenges/${selectedTopic}?difficulty=all`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch problems');
        }
        const data = await response.json();
        setProblems(data.challenges);
        setQuizzes(data.quizzes);
        setConstProblems(data.challenges);
        setResources(data.videos || []);
        if (data.videos && data.videos.length > 0) {
          setSelectedVideo(data.videos[0].link);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProblemsAndQuizzes();
  }, [selectedTopic]);

  useEffect(() => {
    localStorage.setItem("selectedTopic", selectedTopic.toString());
  }, [selectedTopic]);

  const handleOpenAddChallengeModal = () => {
    setAddChallengeModalOpen(true);
  };

  const handleCloseAddChallengeModal = () => {
    setAddChallengeModalOpen(false);
  };

  const handleTopicChange = (topicId) => {
    setSelectedTopic(topicId);
  };

  const handleVideoSelect = (videoUrl) => {
    setSelectedVideo(videoUrl);
  };

  const handleOpenAddVideosModal = () => {
    setAddVideosModalOpen(true);
  };

  const handleCloseAddVideosModal = () => {
    setAddVideosModalOpen(false);
  };

  const handleToggleChange = (event) => {
    setShowChallenges(event.target.checked);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <TailSpin
          height="80"
          width="80"
          color="#0000FF"
          ariaLabel="loading-indicator"
        />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const activeTopicName =
    topics.find((topic) => topic.id === selectedTopic)?.name || "All Problems";

  const colors = {
    Easy: "linear-gradient(to right, #26c585, #24c6c0)",
    Medium: "linear-gradient(to right, #f95b37, #fca339)",
    Hard: "linear-gradient(to right, #f43150, #f2512e)",
    easy: "linear-gradient(to right, #26c585, #24c6c0)",
    medium: "linear-gradient(to right, #f95b37, #fca339)",
    hard: "linear-gradient(to right, #f43150, #f2512e)",
  };

  return (
    <div className="flex h-screen font-sans relative">
      <Sidebar
        onTopicSelect={handleTopicChange}
        activeTopic={selectedTopic}
        topics={topics}
      />
      <div
        className="flex-1"
        style={{ background: "#e0efee", overflowY: "hidden" }}
      >
        <Navbar style={{ position: "fixed", width: "100%", zIndex: 1000 }} />

        <div
          className="p-4"
          style={{
            marginTop: "1px",
            overflowY: "auto",
            height: "calc(100vh - 60px)",
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold uppercase">
              {activeTopicName}
            </h2>
            <div className="flex items-center">
              <span className="mr-2  font-semibold">Quizzes</span>
              <Switch checked={showChallenges} onChange={handleToggleChange} />
              <span className="ml-2 font-semibold">Labs</span>
            </div>
          </div>
          <div className="m-4">
            <SearchBar problems={constproblems} onSearch={handleSearch} />
          </div>

          {resources.length > 0 &&
            !(selectedTopic === 0 || activeTopicName === "All Problems") && (
              <div className=" flex my-6">
                <div className="flex-1  mt-5 shadow-lg overflow-hidden ">
                  <div className="flex h-full">
                    {/* Video Player */}
                    <div className="flex-1 p-2">
                      <iframe
                        width="100%"
                        height="370"
                        src={`https://www.youtube.com/embed/${new URLSearchParams(
                          new URL(selectedVideo).search
                        ).get("v")}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-md shadow-md"
                      ></iframe>
                    </div>

                    {/* Scrollable List of Videos */}
                    <div className="w-1/3 h-96 overflow-y-auto rounded-md bg-gray-200 bg-opacity-50  border-gray-400 p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Learning Path
                      </h3>
                      <div className="grid gap-3">
                        {resources.map((resource, index) => (
                          <div
                            key={index}
                            className={`video-item flex items-center p-2 rounded-md cursor-pointer transition-colors duration-300 
                   ${
                     selectedVideo === resource
                       ? "bg-blue-300 bg-opacity-70"
                       : "bg-gray-300  hover:bg-blue-300 bg-opacity-70"
                   }`}
                            onClick={() => handleVideoSelect(resource.link)}
                          >
                            {/* Replace iframe with a clickable thumbnail */}
                            <img
                              src={`https://img.youtube.com/vi/${new URLSearchParams(
                                new URL(resource.link).search
                              ).get("v")}/hqdefault.jpg`}
                              alt={`Thumbnail of video ${index + 1}`}
                              className="w-24 h-16 object-cover rounded-md mr-3"
                            />
                            <div className="flex flex-col">
                              <span className="text-sm text-gray-800 font-bold w-48 line-clamp-2">
                                {resource.title}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          {showChallenges ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {problems.map((problem) => (
                <div
                  key={problem.id}
                  className="border border-gray-300 flex flex-col p-6 rounded-md"
                  style={{
                    background: colors[problem.difficulty],
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    height: "auto", // Set height to auto or specify a fixed height if needed
                  }}
                >
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <h3 className="text-white text-lg font-semibold ">
                        {problem.name}
                      </h3>
                      <span
                        className="text-sm font-bold text-black bg-white px-2 py-1 rounded-md"
                        style={{ marginLeft: "8px", alignSelf: "flex-start" }}
                      >
                        {problem.difficulty}
                      </span>
                    </div>
                    <p className="text-justify text-sm text-white mb-3 mt-2">
                      {problem.description}
                    </p>
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quizzes.length > 0 ? (
  quizzes.map((quiz) => (
    <div
      key={quiz.id}
      className="border border-gray-300 flex flex-col p-6 rounded-md"
      style={{
        background: colors[quiz.difficulty],
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
        height: "auto",
      }}
    >
      <div className="flex-grow">
        <div className="flex justify-between items-center">
          <h3 className="text-white text-lg font-semibold ">
            {quiz.name}
          </h3>
          <span
            className="text-sm font-bold text-black bg-white px-2 py-1 rounded-md"
            style={{ marginLeft: "8px", alignSelf: "flex-start" }}
          >
            {quiz.difficulty}
          </span>
        </div>
        <p className="text-justify text-sm text-white mb-3 mt-2">
          {quiz.description}
        </p>
      </div>
      <Link
        to={`/Quiz/${quiz.id}`}
        className="bg-cyan-50 hover:bg-gray-300 text-black px-3 py-1 rounded-md font-bold hover:text-cyan-500 transition duration-300 self-start mt-auto"
      >
        View
      </Link>
    </div>
  ))
) : (
  <div className="w-full text-center py-8">
    <p className="text-lg font-semibold text-gray-600">Currently no quizzes are present.</p>
  </div>
)}
            </div>
          )}

          {subAdmin &&
            (selectedTopic === 0 || activeTopicName === "All Problems") && (
              <div
                onClick={handleOpenAddChallengeModal}
                className="absolute bottom-4 right-4 cursor-pointer"
              >
                <img
                  src={addImage}
                  alt="Add"
                  style={{ width: "50px", height: "50px" }}
                />
              </div>
            )}

          {admin &&
            !(selectedTopic === 0 || activeTopicName === "All Problems") && (
              <div
                onClick={handleOpenAddVideosModal}
                className="absolute bottom-4 right-4  p-3 cursor-pointer flex items-center text-white rounded bg-blue-800"
              >
                <FaPlus className="mr-2" />
                Add Videos
              </div>
            )}
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isAddChallengeModalOpen}
        onRequestClose={handleCloseAddChallengeModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "70%", // Adjust width as needed
            maxHeight: "80vh",
            overflowY: "auto",
            borderRadius: "10px",
            padding: "20px",
          },
        }}
        shouldCloseOnOverlayClick={true}
      >
        <button
          onClick={handleCloseAddChallengeModal}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            cursor: "pointer",
            backgroundColor: "transparent",
            border: "none",
            color: "black",
          }}
        >
          <FaTimes />
        </button>
        <AddChallenge />
      </Modal>

      <Modal
        isOpen={isAddVideosModalOpen}
        onRequestClose={handleCloseAddVideosModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "70%", // Adjust width as needed
            maxHeight: "80vh",
            overflowY: "auto",
            borderRadius: "10px",
            padding: "20px",
          },
        }}
        shouldCloseOnOverlayClick={true}
      >
        <button
          onClick={handleCloseAddVideosModal}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            cursor: "pointer",
            backgroundColor: "transparent",
            border: "none",
            color: "black",
          }}
        >
          <FaTimes />
        </button>
        <AddVideos />
      </Modal>
    </div>
  );
};

export default HomePage;
