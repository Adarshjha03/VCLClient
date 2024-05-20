import React, { useState, useEffect } from "react";

const DeleteTopic = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const backendUrl ="https://api.virtualcyberlabs.com";
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

  const handleSubmit = () => {
    // Handle form submission
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">Delete Topic</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic
          </label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="p-2 border rounded w-full"
            required
          >
            <option value="">Select Topic</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
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

export default DeleteTopic;
