import React, { useState, useEffect } from "react";

const AddChallenge = () => {
  const [challengeData, setChallengeData] = useState({
    name: "",
    difficulty: "Easy",
    description: "",
    problem_statement: "",
    supporting_material: "",
    solution: "",
    flag: "",
    topic: "",
  });
  const [topics, setTopics] = useState([]);
  const [responseMessage, setResponseMessage] = useState(null);

  useEffect(() => {
    fetchTopics();
  }, []); // Fetch topics when component mounts

  const fetchTopics = async () => {
    try {const token = localStorage.getItem("Token");
      const response = await fetch("http://cyberrange-backend-dev.ap-south-1.elasticbeanstalk.com/topic", {
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {const token = localStorage.getItem("Token");
      const response = await fetch(`http://cyberrange-backend-dev.ap-south-1.elasticbeanstalk.com/challenges/${challengeData.topic}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(challengeData),
      });
      if (!response.ok) {
        throw new Error("Failed to add challenge.");
      }
      const data = await response.json();
      setResponseMessage(data);
    } catch (error) {
      console.error("Error adding challenge:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setChallengeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Add New Challenge</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
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
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Difficulty
          </label>
          <select
            name="difficulty"
            value={challengeData.difficulty}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={challengeData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Problem Statement
          </label>
          <textarea
            name="problem_statement"
            value={challengeData.problem_statement}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Supporting Material
          </label>
          <textarea
            name="supporting_material"
            value={challengeData.supporting_material}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Solution
          </label>
          <textarea
            name="solution"
            value={challengeData.solution}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Flag
          </label>
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
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Topic
          </label>
          <select
            name="topic"
            value={challengeData.topic}
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
          {responseMessage.message}
        </div>
      )}
    </div>
  );
};

export default AddChallenge;
