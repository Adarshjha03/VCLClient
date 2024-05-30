import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const DeleteCategory = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const backendUrl = "https://api.virtualcyberlabs.com";

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const token = localStorage.getItem("Token");
        const response = await fetch(`${backendUrl}/category`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch topics.");
        }

        const data = await response.json();
        setTopics(data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchTopics();
  }, [backendUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTopic || !password || !agreed) {
      alert("Please fill in all fields and agree to the terms.");
      return;
    }

    try {
      const token = localStorage.getItem("Token");
      const response = await fetch(`${backendUrl}/category`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          id: parseInt(selectedTopic, 10), // Ensure topic_id is an integer
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete Category.");
      }

      alert("Category deleted successfully.");
      setSelectedTopic("");
      setPassword("");
      setAgreed(false);
      setTopics((prevTopics) => prevTopics.filter((topic) => topic.id !== parseInt(selectedTopic, 10)));
    } catch (error) {
      console.error("Error deleting Category:", error);
      alert("Error deleting Category.");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">Delete Category</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="p-2 border rounded w-full"
            required
          >
            <option value="">Select Category</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type={passwordVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded w-full pr-10"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-12 right-0 pr-3 flex items-center text-sm leading-5"
          >
            <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
          </button>
        </div>
        <div className="mb-4 space-x-2">
          <input
            type="checkbox"
            id="agreed"
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
          />
          <label htmlFor="agreed" className="text-xs">
            I understand that deleting the topic will delete all the labs within the topic.
          </label>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          style={{ backgroundColor: '#213099' }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default DeleteCategory;
