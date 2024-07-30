import React, { useState, useEffect } from "react";
import Switch from '@mui/material/Switch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddChallenge = () => {
  const [challengeType, setChallengeType] = useState(null);
  const [challengeData, setChallengeData] = useState({
    name: "",
    difficulty: "Easy",
    description: "",
    problem_statement: "",
    supporting_material: "",
    solution: "",
    flag: "",
    topic: "",
    score: 0,
    show_solution: false,
  });
  const [topics, setTopics] = useState([]);
  const [responseMessage, setResponseMessage] = useState(null);
  const backendUrl = "https://api.virtualcyberlabs.com";

  // New state for MCQ quiz
  const [quizData, setQuizData] = useState({
    name: "",
    difficulty:"",
    description: "",
    quizInformation: "",
    supportingMaterial: "" ,
    marksPerQuestion: 2,
    showResponse: true,
    topic: "",
    quizTime: 5,
    questions: [
      {
        id: 1,
        text: '',
        options: [
          { id: 1, text: '', isCorrect: false },
          { id: 2, text: '', isCorrect: false },
        ],
      },
    ],
  });

  useEffect(() => {
    fetchTopics();
  }, []);

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


  const handleLabSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("Token");
      const response = await fetch(`${backendUrl}/challenges/${challengeData.topic}`, {
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

  const handleQuizSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("Token");
      const response = await fetch(`${backendUrl}/quizzes/${quizData.topic}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(quizData),
      });
      if (!response.ok) {
        throw new Error("Failed to add quiz.");
      }
      const data = await response.json();
      setResponseMessage(data);
    } catch (error) {
      console.error("Error adding quiz:", error);
    }
  };

  const handleLabChange = (event) => {
    const { name, value } = event.target;
    if (name === "score" && !Number.isNaN(parseInt(value))) {
      setChallengeData((prevData) => ({
        ...prevData,
        [name]: parseInt(value),
      }));
    } else {
      setChallengeData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleQuizChange = (event) => {
    const { name, value } = event.target;
    setQuizData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleToggleChange = () => {
    setChallengeData((prevData) => ({
      ...prevData,
      show_solution: !prevData.show_solution,
    }));
  };

  // MCQ form functions
  const addQuestion = () => {
    setQuizData((prevData) => ({
      ...prevData,
      questions: [
        ...prevData.questions,
        {
          id: prevData.questions.length + 1,
          text: '',
          options: [
            { id: 1, text: '', isCorrect: false },
            { id: 2, text: '', isCorrect: false },
          ],
        },
      ],
    }));
  };

  const deleteQuestion = (questionId) => {
    setQuizData((prevData) => ({
      ...prevData,
      questions: prevData.questions.filter((q) => q.id !== questionId),
    }));
  };
  const handleCodeChange = (field, content) => {
    setQuizData(prevData => ({
      ...prevData,
      [field]: content
    }));
  };
  
  const updateQuestionText = (questionId, content) => {
    setQuizData((prevData) => ({
      ...prevData,
      questions: prevData.questions.map((q) =>
        q.id === questionId ? { ...q, text: content } : q
      ),
    }));
  };
  
  const updateOptionText = (questionId, optionId, content) => {
    setQuizData((prevData) => ({
      ...prevData,
      questions: prevData.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === optionId ? { ...o, text: content } : o
              ),
            }
          : q
      ),
    }));
  };

  const addOption = (questionId) => {
    setQuizData((prevData) => ({
      ...prevData,
      questions: prevData.questions.map((q) => {
        if (q.id === questionId && q.options.length < 4) {
          const newOption = {
            id: q.options.length + 1,
            text: '',
            isCorrect: false,
          };
          return { ...q, options: [...q.options, newOption] };
        }
        return q;
      }),
    }));
  };

  const deleteOption = (questionId, optionId) => {
    setQuizData((prevData) => ({
      ...prevData,
      questions: prevData.questions.map((q) => {
        if (q.id === questionId && q.options.length > 2) {
          return {
            ...q,
            options: q.options.filter((o) => o.id !== optionId),
          };
        }
        return q;
      }),
    }));
  };


  const toggleOptionCorrect = (questionId, optionId) => {
    setQuizData((prevData) => ({
      ...prevData,
      questions: prevData.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === optionId ? { ...o, isCorrect: !o.isCorrect } : o
              ),
            }
          : q
      ),
    }));
  };

  const renderChallengeTypeSelection = () => (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Select Challenge Type</h1>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setChallengeType('LAB')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          LAB
        </button>
        <button
          onClick={() => setChallengeType('QUIZ')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          QUIZ
        </button>
      </div>
    </div>
  );
  const renderLabForm = () => (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Add New Lab Challenge</h1>
      <form onSubmit={handleLabSubmit}>
        {/* Form fields */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={challengeData.name}
            onChange={handleLabChange}
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
            onChange={handleLabChange}
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
            onChange={handleLabChange}
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
            onChange={handleLabChange}
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
            onChange={handleLabChange}
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
            onChange={handleLabChange}
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
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Flag
          </label>
          <input
            type="text"
            name="flag"
            value={challengeData.flag}
            onChange={handleLabChange}
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
            onChange={handleLabChange}
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
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Score
          </label>
          <input
            type="text"
            name="score"
            value={challengeData.score}
            onChange={handleLabChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
      {/* Display response message if any */}
      {responseMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4" role="alert">
          {responseMessage.message}
        </div>
      )}
    </div>
  );
  const renderQuizForm = () => {
    const modules = {
      toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link',  'code-block'],
        ['clean']
      ],
    };

    const formats = [
      'header',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link',  'code-block'
    ];

    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Add New Quiz Challenge</h1>
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
              onChange={(content) => handleCodeChange('quizInformation', content)}
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
              name="upportingMaterial"
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
          <div className="flex items-center mt-2 mb-2">
            <label className="block text-gray-700 text-sm font-bold mr-2">
              Show Response
            </label>
            <label className="flex items-center mt-1">
              <Switch
                checked={quizData.showResponse}
                onChange={handleQuizChange}
                color="primary" // You can customize the color if needed
              />
            </label>

          </div>
          <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Quiz Time (in minutes)
          </label>
          <input
            type="number"
            name="quiz_time"
            value={quizData.quizTime}
            onChange={handleQuizChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
          {quizData.questions.map((question) => (
  <div key={question.id} className="mb-8 p-4 border rounded relative">
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Question {question.id}
      </label>
      <ReactQuill
        theme="snow"
        value={question.text}
        onChange={(content) => updateQuestionText(question.id, content)}
        modules={modules}
        formats={formats}
      />
    </div>
    {question.options.map((option, index) => (
      <div key={option.id} className="mb-2">
        <label className="block text-gray-600 text-sm font-bold mb-1 pl-3">
              Option {index + 1}
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
    {question.options.length < 4 && (
      <button
        type="button"
        onClick={() => addOption(question.id)}
        className="mt-2 mx-1 px-3 py-1 bg-green-500 text-white rounded"
      >
        Add Option
      </button>
    )}
    <button
      type="button"
      onClick={() => deleteQuestion(question.id)}
      className="absolute top-2 right-2 text-red-500 text-xl p-2"
    >
      <FontAwesomeIcon icon={faTrash} />
    </button>
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
              Submit Quiz
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
  
  if (!challengeType) {
    return renderChallengeTypeSelection();
  }
  
  return (
    <div>
      {challengeType === 'LAB' ? renderLabForm() : renderQuizForm()}
    </div>
  );
  
  
};

export default AddChallenge;