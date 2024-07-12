import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaCheck, FaStar } from 'react-icons/fa';
import Sidebar from "./components/Sidebar";
import Navbar from "./components/navbar1";
import unsolved from "./assets/unsolved.png";
import linkImage from "./assets/link.png";
import EditQButton from "./EditQbutton"; // Import EditButton component

const QuizPage = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [subAdmin, setSubAdmin] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(() => {
    const storedTopic = localStorage.getItem("selectedTopic");
    return storedTopic ? parseInt(storedTopic) : 0;
  });
  const [userAnswers, setUserAnswers] = useState({});
  const [verificationResponseMessage, setVerificationResponseMessage] = useState("");
  const [quizEvaluation, setQuizEvaluation] = useState(null);
  const backendUrl = "https://api.virtualcyberlabs.com";
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("Token");
        const userResponse = await fetch(
          `${backendUrl}/user`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await userResponse.json();
        setAdmin(userData.admin);
        setSubAdmin(userData.subadmin);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("Token");
        const response = await fetch(
           `${backendUrl}/quiz/${id}`,
            {
              headers: {
                Authorization: `Token ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch quiz details.");
        }
        const data = await response.json();
        setQuiz(data);
      } catch (error) {
        console.error("Error loading the quiz:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleTopicChange = (topicId) => {
    setSelectedTopic(topicId);
    localStorage.setItem("selectedTopic", topicId);
    navigate("/home");
  };

  const handleAnswerChange = (questionId, optionId) => {
    setUserAnswers((prevAnswers) => {
      const updatedAnswers = { ...prevAnswers };
      if (updatedAnswers[questionId]) {
        if (updatedAnswers[questionId].includes(optionId)) {
          // Remove the option if it is already selected
          updatedAnswers[questionId] = updatedAnswers[questionId].filter(id => id !== optionId);
        } else {
          // Add the option if it is not already selected
          updatedAnswers[questionId].push(optionId);
        }
      } else {
        // Initialize with the selected option
        updatedAnswers[questionId] = [optionId];
      }
      return updatedAnswers;
    });
  };

  const formatAnswersForAPI = (userAnswers) => {
    return Object.entries(userAnswers).map(([questionId, selectedOptions]) => ({
      question_id: parseInt(questionId),
      is_option1_answer: selectedOptions.includes(1),
      is_option2_answer: selectedOptions.includes(2),
      is_option3_answer: selectedOptions.includes(3),
      is_option4_answer: selectedOptions.includes(4),
    }));
  };

  const handleSubmitQuiz = async () => {
    try {
      const token = localStorage.getItem("Token");
      const response = await fetch(
        `${backendUrl}/verify_quiz/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ answers: formatAnswersForAPI(userAnswers) }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to verify quiz answers.");
      }
      const responseData = await response.json();
      
      setQuizEvaluation(responseData);
      
      setVerificationResponseMessage(`
        Score: ${responseData.score}
        Correct Answers: ${responseData.correct_answers}/${responseData.total_questions}
        ${responseData.incorrect_answers ? `Incorrect Answers: ${responseData.incorrect_answers}` : ''}
      `);
    } catch (error) {
      console.error("Error verifying quiz answers:", error);
      setVerificationResponseMessage("Failed to verify quiz answers.");
    }
  };

  if (!quiz) return <p>No quiz data found.</p>;

  return (
    <div className="flex h-screen font-sans overflow-hidden">
      <Sidebar showMenu={showMenu} onTopicSelect={handleTopicChange} activeTopic={selectedTopic} />
      <div className="flex-1 overflow-y-auto" style={{ background: "#e0efee" }}>
        <Navbar style={{ position: "fixed", width: "100%", zIndex: 1000 }}/>
        <div className="px-4">
          <div className="container mx-auto pt-8 px-8 pb-2">
            <div className="mb-8 flex justify-between items-center font-semibold">
              {subAdmin && (
                <EditQButton admin={subAdmin} />
              )}
            </div>
            <div className="flex flex-wrap -mx-4">
              <div className="w-full sm:w-1/2 px-4 mb-8">
                <div className="bg-gradient-to-r from-green-500 to-green-400 p-6 rounded-lg shadow-lg w-full flex justify-center items-center mb-8">
                  <div className="flex flex-col items-center">
                    <h1 className="text-2xl font-bold mb-4 text-center text-white">{quiz.name}</h1>
                    <div className="flex justify-around w-full mb-4 space-x-8">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-white rounded-full flex justify-center items-center">
                          <FaTachometerAlt className="text-orange-400 text-2xl" />
                        </div>
                        <p className="text-sm font-semibold text-white mt-1">{quiz.difficulty}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-white rounded-full flex justify-center items-center">
                          {quiz.solved ? (
                            <FaCheck className="text-yellow-500 text-xl" />
                          ) : (
                            <img src={unsolved} alt="Unsolved" className="w-10 h-10" />
                          )}
                        </div>
                        <p className="text-sm font-semibold text-white mt-1">
                          {quiz.solved ? "Solved" : "Unsolved"}
                        </p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-white rounded-full flex justify-center items-center">
                          <FaStar className="text-blue-500 text-xl" />
                        </div>
                        <p className="text-sm font-semibold text-white mt-1">{quiz.marksPerQuestion * quiz.questions.length} Points
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                  <h2 className="border-b-2 border-blue-900 text-lg font-bold mb-4">Quiz Information</h2>
                  <p className="mb-4" style={{ wordWrap: 'break-word' }} dangerouslySetInnerHTML={{ __html: quiz.quizInformation }} />
                  {quiz.supportingMaterial && (
  <div className="flex items-center">
    <a 
      href={quiz.supportingMaterial.startsWith("https") ? quiz.supportingMaterial : `https://${quiz.supportingMaterial}`} 
      className="text-base font-semibold mb-2" 
      target="_blank" 
      rel="noopener noreferrer"
      onClick={() => console.log("Link clicked:", quiz.supportingMaterial)}
    >
      Supporting Material
    </a>
    <img src={linkImage} alt="Link" className="w-4 h-4 ml-1" />
  </div>
) }
                </div>
              </div>
              <div className="w-full sm:w-1/2 px-4">
                <div className="bg-white p-6 rounded-lg shadow-lg h-fit overflow-y-auto">
                  <h2 className="text-lg font-semibold mb-4 text-center">Quiz Questions</h2>
                  {quiz.questions.map((question) => {
                    const evaluation = quizEvaluation?.evaluation?.find(q => q.question_id === question.id);
                    return (
                      <div key={question.id} className="mb-6">
                        <p className="mb-2 font-semibold" dangerouslySetInnerHTML={{ __html: question.text }} />
                        {question.options.map((option) => {
                          const isCorrect = evaluation?.correct_answers[`is_option${option.id}_answer`];
                          const isSubmitted = evaluation?.submitted_answers[`is_option${option.id}_answer`];
                          
                          return (
                            <div key={option.id} className="flex items-start mb-1 ">
                              <div className="flex-shrink-0 mt-1 mr-3">
                                <input
                                  type="checkbox"
                                  name={`question-${question.id}`}
                                  id={`option-${option.id}`}
                                  value={option.id}
                                  checked={userAnswers[question.id]?.includes(option.id) || false}
                                  onChange={() => handleAnswerChange(question.id, option.id)}
                                  disabled={quizEvaluation !== null}
                                />
                              </div>
                              <label
                                htmlFor={`option-${option.id}`}
                                className={`text-sm flex-grow ${
                                  quizEvaluation
                                    ? isCorrect
                                      ? "text-green-500 font-bold"
                                      : isSubmitted
                                        ? "text-red-500"
                                        : ""
                                    : ""
                                }`}
                              >
                                <div dangerouslySetInnerHTML={{ __html: option.text }} />
                              </label>
                            </div>
                          );
                        })}
                        {quizEvaluation?.evaluation && (
                          <div className={`mt-2 ${
                            evaluation?.is_correct
                              ? "text-green-500"
                              : "text-red-500"
                          }`}>
                            {evaluation?.is_correct ? "Correct" : "Incorrect"}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold"
                    onClick={handleSubmitQuiz}
                    disabled={isLoading || quizEvaluation !== null}
                  >
                    {quizEvaluation ? "Quiz Submitted" : "Submit Answers"}
                  </button>
                  {verificationResponseMessage && (
  <div className="mt-4 flex flex-col items-center">
    <h3 className="font-bold text-lg mb-2 text-center">Quiz Summary</h3>
    <pre className=" text-center">{verificationResponseMessage}</pre>
  </div>
)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
