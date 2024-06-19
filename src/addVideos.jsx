import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import axios from "axios";

const AddVideos = () => {
  const [videoLinks, setVideoLinks] = useState([""]); // Initialize with one empty input
  const [responseMessage, setResponseMessage] = useState(null);
  const backendUrl = "https://api.virtualcyberlabs.com";

  const handleAddLink = () => {
    setVideoLinks([...videoLinks, ""]); // Add a new empty link input
  };

  const handleRemoveLink = (index) => {
    setVideoLinks(videoLinks.filter((_, i) => i !== index)); // Remove the link at the specified index
  };

  const handleLinkChange = (index, value) => {
    const newLinks = videoLinks.map((link, i) => (i === index ? value : link));
    setVideoLinks(newLinks);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const topicId = localStorage.getItem("selectedTopic"); // Assume topic ID is stored in local storage


    const data = {
      topic_id: topicId,
      videos: videoLinks.filter(link => link), // Filter out empty links
    };

    try {
      const token = localStorage.getItem("Token");
      console.log(data);
      const response = await axios.post(`${backendUrl}/learning_videos`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      setResponseMessage("Videos successfully added!");
    } catch (error) {
      console.error("Error adding videos:", error);
      setResponseMessage("Failed to add videos.");
    }
  };
  useEffect(() => {
    const fetchExistingLinks = async () => {
      const topicId = localStorage.getItem("selectedTopic");
    
      if (topicId) {
        try {
          const token = localStorage.getItem("Token");
          const response = await fetch(`${backendUrl}/learning_videos?topic=${topicId}`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
    
          if (!response.ok) {
            throw new Error('Failed to fetch existing links');
          }
    
          const data = await response.json();
          setVideoLinks(data.videos || []); // Set the existing videos or an empty array
        } catch (error) {
          console.error("Error fetching existing links:", error);
        }
      }
    };

    fetchExistingLinks();
  }, []);
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">ADD LEARNING PATHS</h1>
      <form onSubmit={handleSubmit}>
        {videoLinks.map((link, index) => (
          <div key={index} className="flex items-center mb-4">
            <input
              type="url"
              placeholder={`Video Link ${index + 1}`}
              value={link}
              onChange={(e) => handleLinkChange(index, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => handleRemoveLink(index)}
              className="ml-2 p-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300"
              disabled={videoLinks.length === 1} // Disable remove button if only one input
            >
              <FaTrash />
            </button>
          </div>
        ))}
        <div className="flex justify-start mb-4">
          <button
            type="button"
            onClick={handleAddLink}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <FaPlus className="mr-2" />
            Add Link
          </button>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
      {/* Display response message if any */}
      {responseMessage && (
        <div className={`mt-4 p-4 rounded ${responseMessage.includes("successfully") ? 'bg-green-100 text-green-700 border-green-400' : 'bg-red-100 text-red-700 border-red-400'}`} role="alert">
          {responseMessage}
        </div>
      )}
    </div>
  );
};

export default AddVideos;
