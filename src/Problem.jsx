import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/navbar1";
import linkImage from "./assets/link.png";
import ideaicon from "./ideaicon.png";
import EditButton from "./EditButton"; // Import EditButton component
const ProblemPage = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [verificationResponseMessage, setVerificationResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [challenge, setChallenge] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(() => {
    const storedTopic = localStorage.getItem("selectedTopic");
    return storedTopic ? parseInt(storedTopic) : 0;
  });
  const [vmData, setVmData] = useState(null);
  const backendUrl = "https://api.virtualcyberlabs.com";
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("Token");
        const userResponse = await fetch(
          `${backendUrl}/user`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
          // added a new comment
        );
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await userResponse.json();
        setAdmin(userData.admin);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("Token");
        const response = await fetch(
          `${backendUrl}/challenge/${id}`,
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
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const requestVirtualMachine = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${backendUrl}/req_vm`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error(`Failed to request virtual machine. Status: ${response.status}`);
      }
      const data = await response.json();
      if (data && data.message) {
        setResponseMessage(data.message);
        setVmData(data);
      } else {
        throw new Error("Invalid response format");
      }
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

  const handleSubmitAnswer = async () => {
    try {
      const token = localStorage.getItem("Token");
      const response = await fetch(
        `${backendUrl}/verify/${id}`,
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
      setVerificationResponseMessage(responseData.message);
    } catch (error) {
      console.error("Error verifying flag:", error);
      setVerificationResponseMessage("Failed to verify flag.");
    }
  };

  if (!challenge) return <p>No challenge data found.</p>;

  return (
    <div className="flex h-screen font-sans overflow-hidden">
      <Sidebar showMenu={showMenu} onTopicSelect={handleTopicChange} activeTopic={selectedTopic} />
      <div className="flex-1 overflow-y-auto" style={{ background: "#e0efee" }}>
        <Navbar />
        <div className="p-4">
          <div className="container mx-auto p-8">
            <div className="mb-8 flex justify-between items-center">

              <EditButton admin={admin} /> {/* Use EditButton component */}
            </div>
            {/* Challenge Details */}
            <div className="grid grid-cols-2 gap-8">
              {/* Open the Virtual Lab */}
              <div className="bg-gradient-to-r from-green-500 to-green-400 p-6 rounded-lg shadow-lg mb-8 flex justify-center items-center">
                <div className="flex flex-col items-center">
                  <h1 className="text-2xl font-bold mb-4 text-center">{challenge.name}</h1>
                  <h2 className="text-lg font-semibold mb-2 text-center text-white">Open the Virtual Lab</h2>
                  <div className="flex flex-col items-center">
                    <button className="bg-white font-semibold text-003366 px-4 py-2 rounded hover:bg-blue-200" onClick={requestVirtualMachine} disabled={isLoading}>
                      {isLoading ? "Loading..." : "Start Virtual Lab"}
                    </button>
                    {vmData && (
                      <div className="mt-2 text-center text-blue-900">
                        <p className="text-blue-900">
                          URL:{" "}
                          <a href={vmData.vm_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm">
                            {vmData.vm_url}
                          </a>
                        </p>
                        <p>Password: {vmData.password}</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Submit Answer */}
              <div style={{ backgroundColor: "#11255a", height: "230px" }} className="p-6 rounded-lg shadow-lg">
  <h2 className="text-lg font-semibold mb-4 text-white text-center">Submit Answer</h2>
  <p className="text-sm text-white mb-4 text-center">Enumerate users and submit with comma separation</p>
  <div className="flex items-center justify-center mb-4">
    <input type="text" placeholder="Your answer..." className="w-100p px-4 py-2 rounded border border-003366 focus:outline-none focus:border-blue-400 text-003366" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} />
    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded font-semibold ml-2" onClick={handleSubmitAnswer} disabled={isLoading}>
      Submit
    </button>
  </div>
  {/* Display verification response message */}
  {verificationResponseMessage && (
    <div className="text-green-500 text-center py-2">{verificationResponseMessage}</div>
  )}
</div>


              {/* Problem Statement */}
              <div className="col-span-2 sm:col-span-1 pr-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="border-b-2 border-blue-900 text-lg font-bold mb-4">Problem Statement</h2>
                  <p className="mb-4" style={{ wordWrap: 'break-word' }}>{challenge.problem_statement}</p>
                  {challenge.supporting_material !== "NULL" && (
                    <div className="flex items-center">
                      <a href={challenge.supporting_material.startsWith("https") ? challenge.supporting_material : `http://${challenge.supporting_material}`} className="text-base font-semibold mb-2" target="_blank">
                        Supporting Material
                      </a>
                      <img src={linkImage} alt="Link" className="w-4 h-4 ml-1" />
                    </div>
                  )}
                </div>
              </div>

              {/* Prohibited Activities */}
              <div className="col-span-2 sm:col-span-1 pl-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="border-b-2 border-blue-900 text-lg font-bold mb-4">Prohibited Activities</h2>
                  <p>
                    Please note that the following activities are strictly prohibited on any of the attack boxes, except if allowed in the description to do same:
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
                  <p>If found any of these rules to be not followed, actions will be taken accordingly.</p>
                </div>
              </div>




            </div>
            {/* Check Solution Button */}
            <div className="flex justify-start">
              <div>
                <a href={challenge.solution.startsWith("https") ? challenge.solution : `http://${challenge.solution}`} style={{ backgroundColor: "#11255a" }} className=" text-white px-6 py-4 rounded hover:bg-blue-600" target="_blank">
                  <img src={ideaicon} alt="Image" className="w-6 h-6 mr-1 inline -mt-1" /> Check Solution
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FaBars className="sm:hidden absolute top-4 left-4 text-2xl text-gray-600 cursor-pointer" onClick={toggleMenu} />
    </div>
  );
};

export default ProblemPage;
