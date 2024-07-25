import React, { useState } from "react";

const AddCategory = () => {
  const [topic, setTopic] = useState("");
  const [labOption, setLabOption] = useState("");
  const [customLink, setCustomLink] = useState("");
  const [responseMessage, setResponseMessage] = useState(null);
  const backendUrl = "https://api.virtualcyberlabs.com";

  const handleTopicChange = (event) => {
    setTopic(event.target.value);
  };

  const handleLabOptionChange = (event) => {
    setLabOption(event.target.value);
    if (event.target.value !== "Other") {
      setCustomLink("");
    }
  };

  const handleCustomLinkChange = (event) => {
    setCustomLink(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("Token");
      const requestBody = { name: topic };
      
      if (labOption === "Other" && customLink) {
        requestBody.lab_link = customLink;
      } else if (labOption === "IDE Simulator") {
        requestBody.lab_link = "https://api.virtualcyberlabs.com/ide-simulator";
      } else if (labOption === "Remix") {
        requestBody.lab_link = "https://remix.ethereum.org/";
      } else if (labOption === "Collab-Google") {
        requestBody.lab_link = "https://colab.research.google.com/"; // Replace with the actual Collab-Google URL
      } else if (labOption !== "Kali Linux") {
        requestBody.lab_link = customLink;
      }
      
      const response = await fetch(`${backendUrl}/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        throw new Error("Failed to add topic.");
      }
      
      const data = await response.json();
      setResponseMessage(data);
      setTopic("");
      setLabOption("");
      setCustomLink("");
    } catch (error) {
      console.error("Error adding topic:", error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Add New Category</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Add Category
          </label>
          <input
            type="text"
            value={topic}
            onChange={handleTopicChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Custom Lab
          </label>
          <select
            value={labOption}
            onChange={handleLabOptionChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Select Lab</option>
            <option value="Kali Linux">Kali Linux</option>
            <option value="IDE Simulator">IDE Simulator</option>
            <option value="Collab-Google">Collab-Google</option>
            <option value="Remix">Remix</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {labOption === "Other" && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Custom Link URL
            </label>
            <input
              type="url"
              value={customLink}
              onChange={handleCustomLinkChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        )}
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
          New category added successfully: {responseMessage.name}
        </div>
      )}
    </div>
  );
};

export default AddCategory;
