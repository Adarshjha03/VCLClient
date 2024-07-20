import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Switch from "@mui/material/Switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditQuiz = () => {
  const { id } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const [topics, setTopics] = useState([]);
  const backendUrl = "https://api.virtualcyberlabs.com";

  useEffect(() => {
    fetchQuizData();
    fetchTopics();
  }, [id]);

  const fetchQuizData = async () => {
    try {
      const token = localStorage.getItem("Token");
      const response = await fetch(`${backendUrl}/quiz/${id}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch quiz.");
      }
      const data = await response.json();
      setQuizData(data);
    } catch (error) {
      console.error("Error fetching quiz:", error);
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
        throw new Error("Failed to fetch topics.");
      }
      const data = await response.json();
      setTopics(data);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const handleQuizChange = (event) => {
    const { name, value } = event.target;
    setQuizData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCodeChange = (field, content) => {
    setQuizData((prevData) => ({
      ...prevData,
      [field]: content,
    }));
  };

  const updateQuestionText = (questionid, content) => {
    setQuizData((prevData) => ({
      ...prevData,
      questions: prevData.questions.map((q) =>
        q.id === questionid ? { ...q, text: content } : q
      ),
    }));
  };

  const updateOptionText = (questionid, optionid, content) => {
    setQuizData((prevData) => ({
      ...prevData,
      questions: prevData.questions.map((q) =>
        q.id === questionid
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === optionid ? { ...o, text: content } : o
              ),
            }
          : q
      ),
    }));
  };

  const addOption = (questionid) => {
    setQuizData((prevData) => ({
      ...prevData,
      questions: prevData.questions.map((q) => {
        if (q.id === questionid && q.options.length < 4) {
          const newOption = {
            id: q.options.length + 1,
            text: "",
            isCorrect: false,
          };
          return { ...q, options: [...q.options, newOption] };
        }
        return q;
      }),
    }));
  };

  const deleteOption = (questionid, optionid) => {
    setQuizData((prevData) => ({
      ...prevData,
      questions: prevData.questions.map((q) => {
        if (q.id === questionid && q.options.length > 2) {
          return {
            ...q,
            options: q.options.filter((o) => o.id !== optionid),
          };
        }
        return q;
      }),
    }));
  };

  const toggleOptionCorrect = (questionid, optionid) => {
    setQuizData((prevData) => ({
      ...prevData,
      questions: prevData.questions.map((q) =>
        q.id === questionid
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === optionid ? { ...o, isCorrect: !o.isCorrect } : o
              ),
            }
          : q
      ),
    }));
  };

  const addQuestion = () => {
    setQuizData((prevData) => ({
      ...prevData,
      questions: [
        ...prevData.questions,
        {
          id: prevData.questions.length + 1,
          text: "",
          options: [
            { id: 1, text: "", isCorrect: false },
            { id: 2, text: "", isCorrect: false },
          ],
        },
      ],
    }));
  };

  const deleteQuestion = (questionid) => {
    setQuizData((prevData) => ({
      ...prevData,
      questions: prevData.questions.filter((q) => q.id !== questionid),
    }));
  };

  const handleQuizSubmit = async (event) => {
    event.preventDefault();
  
    // Check if at least one option is marked as correct for each question
    for (const question of quizData.questions) {
      const hasCorrectOption = question.options.some((option) => option.isCorrect);
      if (!hasCorrectOption) {
        setResponseMessage("Each question must have at least one correct option.");
        return;
      }
    }
  
    try {
      const token = localStorage.getItem("Token");
      const response = await fetch(`${backendUrl}/quiz/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(quizData),
      });
      if (!response.ok) {
        throw new Error("Failed to update quiz.");
      }
      const data = await response.json();
      setResponseMessage(data.message || "Quiz updated successfully");
    } catch (error) {
      console.error("Error updating quiz:", error);
    }
  };
  
  if (!quizData) {
    return <div>Loading...</div>;
  }

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "code-block"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "code-block",
  ];

  return (
    <div className="container mx-auto p-8 z-100">
      <h1 className="text-2xl font-bold mb-4">Edit Quiz Challenge</h1>
      <form onSubmit={handleQuizSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Quiz Name
          </label>
          <input
            type="text"
            name="name"
            value={quizData.name}
            onChange={handleQuizChange}
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
            value={quizData.difficulty}
            onChange={handleQuizChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Select Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <input
            type="text"
            name="description"
            value={quizData.description}
            onChange={handleQuizChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Quiz Information
          </label>
          <ReactQuill
            theme="snow"
            value={quizData.quizInformation}
            onChange={(content) => handleCodeChange("quizInformation", content)}
            modules={modules}
            formats={formats}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Supporting Material
          </label>
          <input
            type="text"
            name="supportingMaterial"
            value={quizData.supportingMaterial}
            onChange={handleQuizChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Topic
          </label>
          <select
            name="topic"
            value={quizData.topic}
            onChange={handleQuizChange}
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
        
        <h2 className="text-xl font-bold mb-2">Questions</h2>
        {quizData.questions.map((question, questionIndex) => (
  <div
    key={questionIndex}
    className="mb-4 border border-gray-300 p-4 rounded-lg relative"
  >
    <label className="block text-md font-bold mb-2">
      Question {questionIndex + 1}
    </label>
    <button
      type="button"
      onClick={() => deleteQuestion(question.id)}
      className="absolute top-2 right-2 text-red-500"
    >
      <FontAwesomeIcon icon={faTrash} />
    </button>
    <ReactQuill
      theme="snow"
      value={question.text}
      onChange={(content) => updateQuestionText(question.id, content)}
      modules={modules}
      formats={formats}
    />
    <h3 className="text-md text-gray-700 font-semibold mt-2 mb-1">Options</h3>
    {question.options.map((option, optionIndex) => (
      <div key={optionIndex} className="flex items-center mb-2 ml-2">
        <ReactQuill
          theme="snow"
          value={option.text}
          onChange={(content) =>
            updateOptionText(question.id, option.id, content)
          }
          modules={modules}
          formats={formats}
          className="w-full"
        />
        <Switch
          checked={option.isCorrect}
          onChange={() => toggleOptionCorrect(question.id, option.id)}
          className="ml-2"
        />
        {question.options.length > 2 && (
          <button
            type="button"
            onClick={() => deleteOption(question.id, option.id)}
            className="ml-2 text-red-500"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        )}
      </div>
    ))}
    {question.options.length < 4 && (
      <button
        type="button"
        onClick={() => addOption(question.id)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-2"
      >
        Add Option
      </button>
    )}
  </div>
))}

        <button
          type="button"
          onClick={addQuestion}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-2"
        >
          Add Question
        </button>
        <div className="mt-4 text-right">
          <button
            type="submit"
            className="bg-blue-500  text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </form>
      {responseMessage && (
  <div
    className={`${
      typeof responseMessage === "string" && responseMessage.includes("success")
        ? "bg-green-100 border border-green-400 text-green-700"
        : "bg-red-100 border border-red-400 text-red-700"
    } px-4 py-3 rounded mt-4`}
    role="alert"
  >
    {typeof responseMessage === "string" ? responseMessage : responseMessage.message}
  </div>
)}
    </div>
  );
};

export default EditQuiz;
