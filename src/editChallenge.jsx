import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Switch from '@mui/material/Switch';
const EditChallenge = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const backendUrl = "https://api.virtualcyberlabs.com";
  const [challengeData, setChallengeData] = useState({
    name: '',
    difficulty: '',
    description: '',
    problem_statement: '',
    supporting_material: '',
    solution: '',
    flag: '',
    topic_id: '',
    score: 0, // Initialize score as 0
    show_solution: false, // Add show_solution field
  });
  const [topics, setTopics] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    const fetchChallengeData = async () => {
      try {
        const token = localStorage.getItem("Token");
        const response = await fetch(`${backendUrl}/challenge/${id}`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch challenge data');
        }
        const data = await response.json();
        setChallengeData(data);
      } catch (error) {
        console.error('Error fetching challenge data:', error);
      } finally {
        setIsLoading(false);
      }
    };

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
        setTopics(data);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };

    fetchChallengeData();
    fetchTopics();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setChallengeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleToggleChange = (event) => {
    const { checked } = event.target;
    setChallengeData((prevData) => ({
      ...prevData,
      show_solution: checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("Token");
      const response = await fetch(`${backendUrl}/challenge/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(challengeData),
      });
      if (!response.ok) {
        throw new Error('Failed to update challenge');
      }
      const updatedData = await response.json();
      setResponseMessage(updatedData.message);
    } catch (error) {
      console.error('Error updating challenge:', error);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Edit Challenge</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={challengeData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Difficulty</label>
          <select
            name="difficulty"
            value={challengeData.difficulty}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Select Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
          <textarea
            name="description"
            value={challengeData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Problem Statement</label>
          <textarea
            name="problem_statement"
            value={challengeData.problem_statement}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Supporting Material</label>
          <textarea
            name="supporting_material"
            value={challengeData.supporting_material}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Solution</label>
          <textarea
            name="solution"
            value={challengeData.solution}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          ></textarea>
          <div className="flex items-center mt-2">
            <label className="block text-gray-700 text-sm font-bold mr-2">
              Solution Visibility
            </label>
            <label className="flex items-center mt-1">
              <Switch
                checked={challengeData.show_solution}
                onChange={handleToggleChange}
                color="primary" // You can customize the color if needed
              />
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Flag</label>
          <input
            type="text"
            name="flag"
            value={challengeData.flag}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Topic</label>
          <select
            name="topic_id"
            value={challengeData.topic_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
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
          <label className="block text-gray-700 text-sm font-bold mb-2">Score</label>
          <input
            type="text"
            name="score"
            value={challengeData.score}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Submit button */}
        <div className="flex justify-end">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Submit
          </button>
        </div>
      </form>
      {responseMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4" role="alert">
          {responseMessage}
        </div>
      )}
    </div>
  );
};

export default EditChallenge;
