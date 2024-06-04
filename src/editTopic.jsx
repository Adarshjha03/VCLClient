import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
const EditTopic = () => {
  const [topic, setTopic] = useState("");
  const [topics, setTopics] = useState([]);
  const [responseMessage, setResponseMessage] = useState(null);
  const backendUrl = "https://api.virtualcyberlabs.com";
  const [selectedTopic, setSelectedTopic] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const handleTopicChange = (event) => {
    setTopic(event.target.value);
  };

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const token = localStorage.getItem("Token");
        const  categoryId=localStorage.getItem("selectedCategoryId")
        const response = await fetch(`${backendUrl}/category/${categoryId}`, {
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

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {const token = localStorage.getItem("Token");
    const categoryId = localStorage.getItem("selectedCategoryId");
      const response = await fetch(`${backendUrl}/topic`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ name: topic
          ,category_id:categoryId,
         }),
      });
      if (!response.ok) {
        throw new Error("Failed to add topic.");
      }
      const data = await response.json();
      setResponseMessage(data);
      // Reset the topic input
      setTopic("");
    } catch (error) {
      console.error("Error adding topic:", error);
    }
  };
  const handleSubmitD = async (e) => {
    e.preventDefault();

    if (!selectedTopic || !password || !agreed) {
      alert("Please fill in all fields and agree to the terms.");
      return;
    }

    try {
      const token = localStorage.getItem("Token");
      const response = await fetch(`${backendUrl}/topic`, {
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
        throw new Error("Failed to delete topic.");
      }

      alert("Topic deleted successfully.");
      setSelectedTopic("");
      setPassword("");
      setAgreed(false);
      setTopics((prevTopics) => prevTopics.filter((topic) => topic.id !== parseInt(selectedTopic, 10)));
    } catch (error) {
      console.error("Error deleting topic:", error);
      alert("Error deleting topic.");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Add New Topic</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Add Topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={handleTopicChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
      {responseMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4" role="alert">
          New topic added successfully: {responseMessage.name}
        </div>
      )}
        <h3 className="text-xl font-semibold mb-4">Delete Topic</h3>
      <form onSubmit={handleSubmitD}>
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

export default EditTopic;
