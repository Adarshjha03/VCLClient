import React, { useState, useEffect } from "react";

const AddStudyMaterialModal = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [materialName, setMaterialName] = useState("");
  const [materialLink, setMaterialLink] = useState("");
  const [keywords, setKeywords] = useState("");
  const backendUrl = "https://api.virtualcyberlabs.com";

  useEffect(() => {
    const fetchCategories = async () => {
        try {
          const token = localStorage.getItem("Token");
          const response = await fetch(`${backendUrl}/category`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
          const data = await response.json();
          setCategories(data);
        } catch (error) {
          console.error("Failed to fetch categories:", error);
        }
      };
      
      fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const fetchTopics = async () => {
        try {
          const token = localStorage.getItem("Token");
          const response = await fetch(
            `${backendUrl}/category/${selectedCategory.id}`,
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );
          const data = await response.json();
          setTopics(data);
        } catch (error) {
          console.error("Failed to fetch topics:", error);
        }
      };
  
      fetchTopics();
    }
  }, [selectedCategory]);
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const keywordsArray = keywords.split(",").map((keyword) => keyword.trim());
    try {
      const token = localStorage.getItem("Token");
      const response = await fetch(`${backendUrl}/study_materials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
        topic_id: selectedTopic.id,
          name: materialName,
          link: materialLink,
          keywords: keywordsArray,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add study material");
      }

      // Clear form fields after successful submission
      setSelectedCategory(null);
      setSelectedTopic(null);
      setMaterialName("");
      setMaterialLink("");
      setKeywords("");

      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Add Study Material</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Category</label>
          <select
            value={selectedCategory ? selectedCategory.id : ""}
            onChange={(e) =>
              setSelectedCategory(
                categories.find((c) => c.id === parseInt(e.target.value))
              )
            }
            className="w-full p-2 border"
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Topic</label>
          <select
            value={selectedTopic ? selectedTopic.id : ""}
            onChange={(e) =>
              setSelectedTopic(
                topics.find((t) => t.id === parseInt(e.target.value))
              )
            }
            className="w-full p-2 border"
            required
          >
            <option value="" disabled>
              Select a topic
            </option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Material Name</label>
          <input
            type="text"
            value={materialName}
            onChange={(e) => setMaterialName(e.target.value)}
            className="w-full p-2 border"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Material Link</label>
          <input
            type="url"
            value={materialLink}
            onChange={(e) => setMaterialLink(e.target.value)}
            className="w-full p-2 border"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Keywords (comma separated)</label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full p-2 border"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-800 text-white p-2 rounded"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudyMaterialModal;
