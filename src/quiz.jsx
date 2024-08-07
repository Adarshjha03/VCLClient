import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaFileDownload,
  FaCheck,
  FaStar,
  FaRedoAlt,
  FaExclamationCircle,
} from "react-icons/fa";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/navbar1";
import unsolved from "./assets/unsolved.png";
import linkImage from "./assets/link.png";
import EditQButton from "./EditQbutton";
import { PiNotepad } from "react-icons/pi";
function processCodeSnippets(htmlContent) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  const codeIndicators = [
    '#include', 'int main', 'def ', 'class ', 'function', 'var ', 'let ', 'const ',
    'import ', 'from ', 'public class', 'package ', '<?php', '<script>', '<style>',
    '#!/usr/bin', 'using namespace', '#define', 'module', 'print(', 'console.log(',
    'System.out.println(', 'fmt.Println(', 'echo '
  ];

  let codeBlock = [];
  let inCodeBlock = false;
  const allParagraphs = Array.from(doc.body.childNodes);
  
  const newContent = [];

  allParagraphs.forEach((node, index) => {
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'P') {
      const trimmedText = node.textContent.trim();
      const isCode = codeIndicators.some(indicator => trimmedText.startsWith(indicator)) || 
                     node.classList.contains('ql-indent-1');

      if (isCode) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeBlock = [];
        }
        codeBlock.push(node.outerHTML);
      } else {
        if (inCodeBlock) {
          const pre = doc.createElement('pre');
          pre.className = 'bg-gray-800 text-white p-2 rounded my-2';
          pre.innerHTML = codeBlock.join('');
          newContent.push(pre.outerHTML);
          inCodeBlock = false;
          codeBlock = [];
        }
        newContent.push(node.outerHTML);
      }
    } else {
      if (inCodeBlock) {
        const pre = doc.createElement('pre');
        pre.className = 'bg-gray-800 text-white p-2 rounded my-2';
        pre.innerHTML = codeBlock.join('');
        newContent.push(pre.outerHTML);
        inCodeBlock = false;
        codeBlock = [];
      }
      newContent.push(node.outerHTML || node.textContent);
    }
  });

  if (inCodeBlock) {
    const pre = doc.createElement('pre');
    pre.className = 'bg-gray-800 text-white p-2 rounded my-2';
    pre.innerHTML = codeBlock.join('');
    newContent.push(pre.outerHTML);
  }

  return newContent.join('');
}
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
  const [verificationResponseMessage, setVerificationResponseMessage] =
    useState("");
  const [quizEvaluation, setQuizEvaluation] = useState(null);
  const [quizStatus, setQuizStatus] = useState("not_started");
  const [timeRemaining, setTimeRemaining] = useState(0); // Initialized to 0
  const backendUrl = "https://api.virtualcyberlabs.com";
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("Token");
        const userResponse = await fetch(`${backendUrl}/user`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
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
    let timer;
    if (quizStatus === "in_progress" && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (
      (timeRemaining === 0 || quizStatus === "ended") &&
      quizStatus !== "not_started"
    ) {
      handleSubmitQuiz();
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [quizStatus, timeRemaining, quiz]);

  useEffect(() => {
    if (quiz) {
      setTimeRemaining(quiz.quizTime * 60);
    }
  }, [quiz]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("Token");
        const response = await fetch(`${backendUrl}/quiz/${id}`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
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
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (quizStatus === "in_progress") {
        const message = "Reloading the page will submit the quiz. Are you sure you want to continue?";
        event.preventDefault();
        event.returnValue = message; // For older browsers
        return message; // For modern browsers
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [quizStatus]);
  // Remaining implementation

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("Token");
      const response = await fetch(`${backendUrl}/export_quiz/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download file.");
      }

      // Convert the response to a blob
      const blob = await response.blob();

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element and trigger the download
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = ""; // This will use the filename provided by the server
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleTopicChange = (topicId) => {
    setSelectedTopic(topicId);
    localStorage.setItem("selectedTopic", topicId);
    navigate("/home");
  };

  const handleAnswerChange = (questionId, optionId) => {
    setUserAnswers((prevAnswers) => {
      const updatedAnswers = { ...prevAnswers };

      if (!updatedAnswers[questionId]) {
        updatedAnswers[questionId] = [];
      }

      if (updatedAnswers[questionId].includes(optionId)) {
        updatedAnswers[questionId] = updatedAnswers[questionId].filter(
          (id) => id !== optionId
        );
      } else {
        updatedAnswers[questionId].push(optionId);
      }

      return updatedAnswers;
    });
  };

  const formatAnswersForAPI = (userAnswers, allQuestions) => {
    const questionIds = allQuestions.map((question) => question.id);
    return questionIds.map((questionId) => {
      const selectedOptions = userAnswers[questionId] || [];
      return {
        question_id: parseInt(questionId),
        is_option1_answer: selectedOptions.includes(1),
        is_option2_answer: selectedOptions.includes(2),
        is_option3_answer: selectedOptions.includes(3),
        is_option4_answer: selectedOptions.includes(4),
      };
    });
  };

  const handleSubmitQuiz = async () => {
    try {
      const token = localStorage.getItem("Token");
      const formattedAnswers = formatAnswersForAPI(userAnswers, quiz.questions);

      const response = await fetch(`${backendUrl}/verify_quiz/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ answers: formattedAnswers }),
      });

      if (!response.ok) {
        throw new Error("Failed to verify quiz answers.");
      }
      const responseData = await response.json();

      setQuizEvaluation(responseData);
      setQuizStatus("ended"); // Add this line to update the quiz status

      setVerificationResponseMessage(
        `Score: ${responseData.score}
        Correct Answers: ${responseData.correct_answers}/${
          responseData.total_questions
        }
        Incorrect Answers: ${
          responseData.total_questions - responseData.correct_answers
        }`
      );
    } catch (error) {
      console.error("Error verifying quiz answers:", error);
      setVerificationResponseMessage("Failed to verify quiz answers.");
    }
  };

  const handleResetSelection = (questionId) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: [],
    }));
  };

  if (!quiz) return <p>No quiz data found.</p>;

  return (
    <div className="flex h-screen font-sans overflow-hidden">
      <Sidebar
        showMenu={showMenu}
        onTopicSelect={handleTopicChange}
        activeTopic={selectedTopic}
      />
      <div className="flex-1 flex flex-col">
        <Navbar className="sticky top-0 z-10" />
        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/4 bg-white overflow-y-auto p-4 border-r flex flex-col h-full">
            <div className="flex-grow">
              <h1 className="flex items-center justify-between text-2xl font-bold mb-4">
                <span>{quiz.name}</span>
                {admin && (
                  <FaFileDownload
                    className="text-lg text-blue-900 cursor-pointer ml-2"
                    onClick={handleDownload}
                    title="Download Responses"
                  />
                )}
              </h1>
              <div className="flex justify-between mb-4">
                <div className="flex items-center">
                  <FaTachometerAlt className="text-orange-400 mr-2" />
                  <span>{quiz.difficulty}</span>
                </div>
                <div className="flex items-center">
                  {quiz.solved ? (
                    <FaCheck className="text-yellow-500 mr-2" />
                  ) : (
                    <img
                      src={unsolved}
                      alt="Unsolved"
                      className="w-5 h-5 mr-2"
                    />
                  )}
                  <span>{quiz.solved ? "Solved" : "Unsolved"}</span>
                </div>
                <div className="flex items-center">
                  <FaStar className="text-blue-500 mr-2" />
                  <span>
                    {quiz.marksPerQuestion * quiz.questions.length} Points
                  </span>
                </div>
              </div>

              <h2 className="text-lg font-bold mb-2">Quiz Information</h2>
              <div
                className="mb-4 text-justify"
                dangerouslySetInnerHTML={{ __html: quiz.quizInformation }}
              />
              {quiz.supportingMaterial &&
                quiz.supportingMaterial !== "NULL" && (
                  <div className="flex items-center mb-4">
                    <a
                      href={`http://${quiz.supportingMaterial}`}
                      className="text-base font-semibold text-blue-600 hover:text-blue-800"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Supporting Material
                    </a>
                    <img src={linkImage} alt="Link" className="w-4 h-4 ml-1" />
                  </div>
                )}
            </div>
            <div className="mb-4">
              <div className="text-red-600 text-xs font-semibold mb-2">
                <h3 className="inline-block mr-2 mb-1 ">
                  <u>Warning:</u>
                </h3>
                <span className="flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  Reloading this quiz window will automatically submit your
                  answers.
                </span>
              </div>
              {!quiz.solved && (
                <div className="text-red-600 text-xs font-semibold">
                  <span className="flex items-center">
                    <FaExclamationCircle className="mr-1" />
                    This is an unsolved quiz. Remember, only your first attempt
                    will be scored.
                  </span>
                </div>
              )}
            </div>
            {subAdmin && (
              <div className="mt-auto pt-4 border-t">
                <EditQButton admin={subAdmin} />
              </div>
            )}
          </div>

          <div className="w-3/4 bg-gray-100 overflow-y-auto px-4 pb-4">
            <div className="sticky top-0 bg-gray-100 flex justify-between items-center pt-4 pb-2 mb-4">
              <div className="flex items-center">
                <PiNotepad className="mr-2 text-2xl rounded-full bg-white" />
                <h2 className="text-2xl font-bold">Quiz Questions</h2>
              </div>
              {quizStatus === "in_progress" && (
                <div
                  className={`text-md font-semibold rounded-sm p-2 ${
                    timeRemaining <= 60 ? "bg-orange-600" : "bg-green-600"
                  }`}
                >
                  Time Remaining: {formatTime(timeRemaining)}
                </div>
              )}
              {quizEvaluation && (
                <div className="flex space-x-4">
                  <div className="flex items-center px-4 py-2 rounded-lg">
                    Correct answers:
                    <span className="ml-1 font-semibold rounded-full bg-green-100 text-green-600 px-3 py-1">
                      {quizEvaluation.correct_answers}
                    </span>
                  </div>
                  <div className="flex items-center px-4 py-2 rounded-lg">
                    Total questions:
                    <span className="ml-1 font-semibold rounded-full bg-yellow-100 text-yellow-600 px-3 py-1">
                      {quizEvaluation.total_questions}
                    </span>
                  </div>
                  <div className="flex items-center px-4 py-2 rounded-lg">
                    Score:
                    <span className="ml-1 font-semibold text-lg rounded-full bg-blue-100 text-blue-600 px-3 py-1">
                      {quizEvaluation.score}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {quizStatus === "not_started" ? (
              <div className="text-center mt-10">
                <h3 className="text-2xl font-bold mb-4">
                  Ready to start the quiz?
                </h3>
                <p className="mb-4">
                  You will have <strong>{quiz.quizTime} minutes</strong> to
                  complete the quiz.
                </p>

                <button
                  onClick={() => setQuizStatus("in_progress")}
                  className="bg-blue-900 hover:bg-blue-600 text-white px-6 py-2 rounded font-semibold"
                >
                  Start Quiz
                </button>
              </div>
            ) : (
              <div
                className={quizStatus === "not_started" ? "filter blur-sm" : ""}
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitQuiz();
                  }}
                >
                  {quiz.questions.map((question, index) => {
                    const evaluation = quizEvaluation?.evaluation?.find(
                      (q) => q.question_id === question.id
                    );
                    const noOptionSelected =
                      quizEvaluation &&
                      (!userAnswers[question.id] ||
                        userAnswers[question.id].length === 0);

                    return (
                      <div
                        key={question.id}
                        className="mb-1 p-4 bg-white rounded-lg shadow"
                      >
                        <div className="flex mb-2">
                          <span className="font-semibold mr-2">
                            Q{index + 1}.
                          </span>
                          <div
                            className="font-semibold"
                            dangerouslySetInnerHTML={{
                              __html: processCodeSnippets(question.text),
                            }}
                          />
                        </div>
                        <div className="flex">
                          <div className="w-4/5 p-2 rounded border mr-1">
                            {question.options.map((option) => {
                              const isCorrect =
                                evaluation?.correct_answers[
                                  `is_option${option.id}_answer`
                                ];
                              const isSubmitted =
                                evaluation?.submitted_answers[
                                  `is_option${option.id}_answer`
                                ];
                              const isSelected =
                                userAnswers[question.id]?.includes(option.id) ||
                                false;

                              let backgroundColor = "";
                              if (quizEvaluation) {
                                if (isCorrect) {
                                  backgroundColor = "bg-green-100";
                                } else if (isSubmitted) {
                                  backgroundColor = "bg-red-100";
                                }
                              }

                              return (
                                <div
                                  key={option.id}
                                  className={`flex items-start mb-2 ${backgroundColor} p-2 rounded`}
                                >
                                  <input
                                    type="checkbox"
                                    id={`option-${question.id}-${option.id}`}
                                    checked={isSelected}
                                    onChange={() =>
                                      handleAnswerChange(question.id, option.id)
                                    }
                                    disabled={quizEvaluation !== null}
                                    className="mr-2 mt-1"
                                  />
                                  <label
                                    htmlFor={`option-${question.id}-${option.id}`}
                                    className="text-sm w-full"
                                  >
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: processCodeSnippets(
                                          option.text
                                        ),
                                      }}
                                    />
                                  </label>
                                  {quizEvaluation &&
                                    (isCorrect ? (
                                      <AiOutlineCheckCircle className="ml-2 text-green-500" />
                                    ) : isSubmitted ? (
                                      <AiOutlineCloseCircle className="ml-2 text-red-500" />
                                    ) : null)}
                                </div>
                              );
                            })}
                          </div>
                          <div className="w-1/5 flex flex-col items-center justify-center p-2 rounded border ml-1">
                          {quizEvaluation ? (
  evaluation?.is_correct !== undefined ? (
    evaluation.is_correct ? (
      <>
        <AiOutlineCheckCircle className="text-green-500 text-2xl mb-1" />
        <span className="text-green-500 font-semibold text-center">
          Correct Answer
        </span>
      </>
    ) : (
      <>
        <AiOutlineCloseCircle className="text-red-500 text-2xl mb-1" />
        <span className="text-red-500 font-semibold text-center">
          Wrong Answer
        </span>
      </>
    )
  ) : (
    <>
      <FaExclamationCircle className="text-yellow-500 text-2xl mb-1" />
      <span className="text-yellow-500 font-semibold text-center">
        Your response has been recorded
      </span>
    </>
  )
) : (
  <button
    type="button"
    onClick={() => handleResetSelection(question.id)}
    className="text-blue-500 font-bold text-md flex flex-col items-center"
  >
    <FaRedoAlt className="mb-1" />
    <span className="text-center">
      Reset Selection
    </span>
  </button>
)}
                          </div>
                        </div>
                        {noOptionSelected && (
                          <div className="mt-2 text-yellow-600">
                            No option selected. Correct answer(s) highlighted.
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 mt-2 text-white px-4 py-2 rounded font-semibold"
                    disabled={
                      isLoading ||
                      quizEvaluation !== null ||
                      quizStatus !== "in_progress"
                    }
                  >
                    {quizEvaluation ? "Quiz Submitted" : "Submit Answers"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default QuizPage;
