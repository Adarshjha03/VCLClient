import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/navbar1";
import Modal from "react-modal";
import { FaPlus } from "react-icons/fa";
import AddStudyMaterialModal from "./AddStudyMaterialModal";

function Placements() {
  const [selectedTopic, setSelectedTopic] = useState(() => {
    const storedTopic = localStorage.getItem("selectedTopic");
    return storedTopic ? parseInt(storedTopic) : 0;
  });

  const [topics, setTopics] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const backendUrl = "https://api.virtualcyberlabs.com";
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      }
    };

    fetchTopics();
  }, []);

  useEffect(() => {
    const fetchStudyMaterials = async () => {
      try {
        const token = localStorage.getItem("Token");
        const response = await fetch(`${backendUrl}/study_materials`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch study materials");
        }
        const data = await response.json();
        setStudyMaterials(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudyMaterials();
  }, []);

  const handleTopicChange = (topicId) => {
    setSelectedTopic(topicId);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
            marginTop: "5px",
            overflowY: "auto",
            height: "calc(100vh - 60px)",
          }}
        >
          <h1 className="text-2xl font-bold mb-4">Study Materials</h1>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Topic Name</th>
                <th className="py-2 px-4 border-b">Material Name</th>
                <th className="py-2 px-4 border-b">Link</th>
                <th className="py-2 px-4 border-b">Keywords</th>
                <th className="py-2 px-4 border-b">Updated Date</th>
              </tr>
            </thead>
            <tbody>
              {studyMaterials
                .filter((material) => material.topic === selectedTopic)
                .map((material) => (
                  <tr key={material.id}>
                    <td className="py-2 px-4 border-b">{material.topic_name}</td>
                    <td className="py-2 px-4 border-b">{material.name || "N/A"}</td>
                    <td className="py-2 px-4 border-b">
                      <a
                        href={material.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                      >
                        {material.link || "N/A"}
                      </a>
                    </td>
                    <td className="py-2 px-4 border-b">
                      {material.keywords ? material.keywords.join(", ") : "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">{material.updated_date || "N/A"}</td>
                  </tr>
                ))}
              {studyMaterials
                .filter((material) => material.topic === selectedTopic)
                .filter((material) => !material.name)
                .map((material) => (
                  <tr key={material.id}>
                    <td className="py-2 px-4 border-b">{material.topic_name}</td>
                    <td className="py-2 px-4 border-b">N/A</td>
                    <td className="py-2 px-4 border-b">N/A</td>
                    <td className="py-2 px-4 border-b">N/A</td>
                    <td className="py-2 px-4 border-b">N/A</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="fixed bottom-4 right-4">
          <button
            onClick={handleOpenModal}
            className="bg-blue-800 text-white p-3 rounded-full shadow-lg"
          >
            <FaPlus />
          </button>
        </div>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
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
              width: "70%",
              maxHeight: "80vh",
              overflowY: "auto",
              borderRadius: "10px",
              padding: "20px",
            },
          }}
          shouldCloseOnOverlayClick={true}
        >
          <AddStudyMaterialModal onClose={handleCloseModal} />
        </Modal>
      </div>
    </div>
  );
}

export default Placements;
