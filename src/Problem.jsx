import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/navbar1";
import editImage from "./assets/edit.png";
import { useNavigate } from "react-router-dom";
const ProblemPage = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [challenge, setChallenge] = useState(null);
  const [admin, setAdmin] = useState(false); // Initially assuming the user is not an admin
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(() => {
    const storedTopic = localStorage.getItem("selectedTopic");
    return storedTopic ? parseInt(storedTopic) : 0;
  });
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("Token");
        const userResponse = await fetch(
          "http://cyberrange-backend-dev.ap-south-1.elasticbeanstalk.com/user",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await userResponse.json();
        setAdmin(userData.admin); // Update the admin state based on the response
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Call the fetchUserData function
    fetchUserData(); 
  }, []); // Empty dependency array to ensure this effect runs only once

  const { id } = useParams(); // Fetching id from the URL
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("Token");
        const response = await fetch(
          `http://cyberrange-backend-dev.ap-south-1.elasticbeanstalk.com/challenge/${id}`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch challenge details.");
        }
        const data = await response.json();
        setChallenge(data);
      } catch (error) {
        console.error("Error loading the challenge:", error);
        setResponseMessage("Failed to load challenge data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Function to request virtual machine
  const requestVirtualMachine = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://3.111.169.113/req_vm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to request virtual machine.");
      }
      const data = await response.json();
      setResponseMessage(data);
    } catch (error) {
      console.error("Error requesting virtual machine:", error);
      setResponseMessage({
        message: "An error occurred while requesting the virtual machine.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopicChange = (topicId) => {
    setSelectedTopic(topicId);
    localStorage.setItem("selectedTopic", topicId);
    navigate("/home");
  };
  // Function to handle user's answer submission
  const handleSubmitAnswer = async () => {
    try {
      const token = localStorage.getItem("Token");
      const response = await fetch(
        `http://cyberrange-backend-dev.ap-south-1.elasticbeanstalk.com/verify/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ flag: userAnswer }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to verify flag.");
      }
      const responseData = await response.json();
      setResponseMessage(responseData.message);
    } catch (error) {
      console.error("Error verifying flag:", error);
      setResponseMessage("Failed to verify flag.");
    }

    
  };

  if (!challenge) return <p>No challenge data found.</p>;
  return (
    <div className="flex h-screen font-sans overflow-hidden">
      {/* Left column */}
      <Sidebar showMenu={showMenu} onTopicSelect={handleTopicChange} activeTopic={selectedTopic}  />
      {/* Right section */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          background: "#e0efee",
        }}
      >
        <Navbar />

        {/* Main content */}
        <div className="p-4">
          <div className="container mx-auto p-8">
            <div className="mb-8 flex justify-between items-center">
              <h1 className="text-2xl font-bold mb-4">{challenge.name}</h1>
              {admin && (
                <Link
                  to={`/editChallenge/${challenge.id}`}
                  className="flex items-center"
                >
                  <img src={editImage} alt="Edit" className="w-4 h-4 mr-2" />
                  Edit
                </Link>
              )}
            </div>
            <div className="flex mb-8">
              <div className="w-1/2 pr-4">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="border-b-2 border-blue-900 text-lg font-bold mb-4 ">
                    Problem Statement
                  </h2>
                  <p>{challenge.problem_statement}</p>
                </div>
              </div>
              <div className="w-1/2 pl-4">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="border-b-2 border-blue-900 text-lg font-bold mb-4">
                    Prohibited Activities
                  </h2>
                  <p>
                    Please note that the following activities are strictly
                    prohibited on any of the attack boxes, except if allowed in
                    the description to do same:
                  </p>
                  <ul className="list-disc pl-5 mb-4">
                    <li>No Automatic scanners Allowed</li>
                    <li>DOS or DDOS Attack</li>
                    <li>No Directory Bruteforce Allowed</li>
                    <li>Attacking any Lab Instance</li>
                    <li>Gaining access to other users' machines</li>
                    <li>Attack on this site anyhow</li>
                    <li>No Payload Injection Allowed</li>
                  </ul>
                  <p>
                    If found any of these rules to be not followed, actions will
                    be taken accordingly.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex mb-8">
              <div className="w-1/2 pr-4">
                <div className="bg-gradient-to-r from-green-500 to-green-400 p-6 rounded-lg shadow-lg">
                  <h2 className="text-lg font-semibold mb-4 text-center text-white">
                    Open the Virtual Lab
                  </h2>
                  <div className="flex justify-center">
                    <button
                      className="bg-white font-semibold text-003366 px-4 py-2 rounded hover:bg-blue-200"
                      onClick={requestVirtualMachine}
                      disabled={isLoading}
                    >
                      {isLoading ? "Loading..." : "Start Virtual Lab"}
                    </button>
                  </div>
                  {responseMessage && (
                    <div className="flex flex-col items-center mt-4 text-sm">
                      <div>{responseMessage.message}</div>
                      {responseMessage.vm_url && (
                        <a
                          href={responseMessage.vm_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          VM URL: {responseMessage.vm_url}
                        </a>
                      )}
                      {responseMessage.password && (
                        <div>Password: {responseMessage.password}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="w-1/2 pl-4">
                <div
                  style={{ backgroundColor: "#11255a" }}
                  className="p-6 rounded-lg shadow-lg relative"
                >
                  <h2 className="text-lg font-semibold mb-4 text-white text-center">
                    Submit Answer
                  </h2>
                  <p className="text-sm text-white mb-4 text-center">
                    Enumerate users and submit with comma separation
                  </p>
                  <div className="flex items-center justify-center mb-4">
                    <input
                      type="text"
                      placeholder="Your answer..."
                      className="w-85p px-4 py-2 rounded-l border border-003366 focus:outline-none focus:border-blue-400 text-003366"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                    />
                    <button
                      className="bg-white text-11255a px-4 py-2 rounded-r font-semibold hover:text-black "
                      onClick={handleSubmitAnswer}
                      disabled={isLoading}
                    >
                      Submit
                    </button>
                  </div>
                  {responseMessage && (
                    <div className="text-green-500 text-center">
                      {responseMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">
                  Download Solution
                </h2>
                <a
                  href={
                    challenge.solution.startsWith("http")
                      ? challenge.solution
                      : `http://${challenge.solution}`
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  target="_blank"
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Hamburger icon for small screens */}
      <FaBars
        className="sm:hidden absolute top-4 left-4 text-2xl text-gray-600 cursor-pointer"
        onClick={toggleMenu} // Call toggleMenu on click
      />
    </div>
  );
};

export default ProblemPage;
