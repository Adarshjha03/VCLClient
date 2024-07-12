import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Switch from "@mui/material/Switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const EditQuiz = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const backendUrl = "https://api.virtualcyberlabs.com";
  const [quizData, setQuizData] = useState({
    name: "",
    difficulty: "",
    description: "",
    quizInformation: "",
    supportingMaterial: "",
    topic: "",
    questions: [],
  });
  const [topics, setTopics] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const token = localStorage.getItem("Token");
        const response = await fetch(` ${backendUrl}/quiz/${id}`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch quiz data");
        }
        const data = await response.json();
        setQuizData(data);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
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
          throw new Error("Failed to fetch topics");
        }
        const data = await response.json();
        setTopics(data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchQuizData();
    fetchTopics();
  }, [id, backendUrl]);

  const handleQuizChange = (e) => {
    const { name, value } = e.target;
    setQuizData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCodeChange = (name, content) => {
    setQuizData((prevData) => ({
      ...prevData,
      [name]: content,
    }));
  };

  const handleQuizEditSubmit = async (e) => {
    e.preventDefault();
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
        throw new Error("Failed to update quiz");
      }
      const data = await response.json();
      setResponseMessage({
        message: "Quiz updated successfully!",
        type: "success",
      });
    } catch (error) {
      setResponseMessage({ message: "Error updating quiz", type: "error" });
      console.error("Error updating quiz:", error);
    }
  };

  const updateQuestionText = (questionId, content) => {
    setQuizData((prevData) => ({
      ...prevData,
      questions: prevData.questions.map((question) =>
        question.id === questionId ? { ...question, text: content } : question
      ),
    }));
  };

  const updateOptionText = (questionId, optionId, content) => {
    setQuizData((prevData) => ({
      ...prevData,
      questions: prevData.questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map((option) =>
                option.id === optionId ? { ...option, text: content } : option
              ),
            }
          : question
      ),
    }));
  };

  const toggleOptionCorrect = (questionId, optionId) => {
    setQuizData((prevData) => ({
      ...prevData,
      questions: prevData.questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map((option) =>
                option.id === optionId
                  ? { ...option, isCorrect: !option.isCorrect }
                  : option
              ),
            }
          : question
      ),
    }));
  };

  const deleteOption = (questionId, optionId) => {
    setQuizData((prevData) => ({
      ...prevData,
      questions: prevData.questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.filter(
                (option) => option.id !== optionId
              ),
            }
          : question
      ),
    }));
  };

  const addOption = (questionId) => {
    const newOption = { id: Date.now(), text: "", isCorrect: false };
    setQuizData((prevData) => ({
      ...prevData,
      questions: prevData.questions.map((question) =>
        question.id === questionId
          ? { ...question, options: [...question.options, newOption] }
          : question
      ),
    }));
  };

  const deleteQuestion = (questionId) => {
    setQuizData((prevData) => ({
      ...prevData,
      questions: prevData.questions.filter(
        (question) => question.id !== questionId
      ),
    }));
  };

  const addQuestion = () => {
    const newQuestion = { id: Date.now(), text: "", options: [] };
    setQuizData((prevData) => ({
      ...prevData,
      questions: [...prevData.questions, newQuestion],
    }));
  };

  const renderQuizForm = () => {
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
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Edit Quiz Challenge</h1>
        <form onSubmit={handleQuizEditSubmit}>
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
            <ReactQuill
              theme="snow"
              value={quizData.description}
              onChange={(content) => handleCodeChange("description", content)}
              modules={modules}
              formats={formats}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Quiz Information
            </label>
            <ReactQuill
              theme="snow"
              value={quizData.quizInformation}
              onChange={(content) =>
                handleCodeChange("quizInformation", content)
              }
              modules={modules}
              formats={formats}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Supporting Material
            </label>
            <ReactQuill
              theme="snow"
              value={quizData.supportingMaterial}
              onChange={(content) =>
                handleCodeChange("supportingMaterial", content)
              }
              modules={modules}
              formats={formats}
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

          {quizData.questions.map((question) => (
  <div key={question.id} className="mb-4">
    <label className="block text-gray-600 text-sm font-bold mb-1 pl-3">
      Question {question.id}
    </label>
    <div className="mb-4">
      <ReactQuill
        theme="snow"
        value={question.text}
        onChange={(content) => updateQuestionText(question.id, content)}
        modules={modules}
        formats={formats}
      />
    </div>
    {question.options.map((option, index) => ( // Add `index` here
      <div key={option.id} className="mb-4 pl-2">
        <label className="block text-gray-600 text-sm font-bold mb-1 pl-3">
          Option {index + 1} {/* Use `index` to display option number */}
        </label>
        <div className="flex items-center">
          <div className="flex-grow mr-2">
            <ReactQuill
              theme="snow"
              value={option.text}
              onChange={(content) => updateOptionText(question.id, option.id, content)}
              modules={modules}
              formats={formats}
            />
          </div>
          <Switch
            checked={option.isCorrect}
            onChange={() => toggleOptionCorrect(question.id, option.id)}
            color="primary"
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
      </div>
    ))}
  </div>
))}

          <button
            type="button"
            onClick={addQuestion}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Question
          </button>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Edit Quiz
            </button>
          </div>
        </form>
        {responseMessage && (
          <div
            className={`bg-${
              responseMessage.type === "success" ? "green" : "red"
            }-100 border border-${
              responseMessage.type === "success" ? "green" : "red"
            }-400 text-${
              responseMessage.type === "success" ? "green" : "red"
            }-700 px-4 py-3 rounded mt-4`}
            role="alert"
          >
            {responseMessage.message}
          </div>
        )}
      </div>
    );
  };

  return isLoading ? <div>Loading...</div> : renderQuizForm();
};

export default EditQuiz;
