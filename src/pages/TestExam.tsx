// import React, { useEffect, useState, useCallback, useRef } from "react";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";
// import useUserProfile from "../hooks/useUserProfile";

// interface Question {
//   _id: string;
//   examId: string;
//   competency: string;
//   level: string;
//   questionText: string;
//   options: string[];
//   correctAnswerIndex: number;
//   duration: number;
// }

// interface Answer {
//   questionId: string;
//   selectedOptionIndex: number;
// }

// const TestExam: React.FC = () => {
//   const { examId } = useParams<{ examId: string }>();
//   const profile = useUserProfile();
//   const [accessAllowed, setAccessAllowed] = useState<boolean>(false);
//   const [accessError, setAccessError] = useState<string | null>(null);

//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [selectedOption, setSelectedOption] = useState<number | null>(null);
//   const [answers, setAnswers] = useState<Answer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [timer, setTimer] = useState<number>(60);
//   const timerRef = useRef<NodeJS.Timeout | null>(null);

//   const [showModal, setShowModal] = useState(false);

//   const navigate = useNavigate();

//   // Access control check
//   useEffect(() => {
//     if (!profile || !examId) return;

//     // Parse step number from examId (customize if needed)
//     const stepNumber = parseInt(examId.slice(-1), 10);

//     // Access rules:
//     if (stepNumber > profile.examProgress.currentStep) {
//       setAccessError("You can't access this exam step before completing previous steps.");
//       setAccessAllowed(false);
//       setShowModal(true);
//       setLoading(false);
//       return;
//     }

//     const lastResult = profile.examProgress.results.length > 0
//       ? profile.examProgress.results[profile.examProgress.results.length - 1]
//       : null;

//     if (lastResult && lastResult.scorePercent < 25) {
//       setAccessError("You scored under 25%, you cannot retake the exam.");
//       setAccessAllowed(false);
//       setShowModal(true);
//       setLoading(false);
//       return;
//     }

//     setAccessError(null);
//     setAccessAllowed(true);
//   }, [profile, examId]);

//   // Fetch questions if access allowed
//   useEffect(() => {
//     if (!accessAllowed || !examId) return;

//     setLoading(true);
//     const token = localStorage.getItem("approvalToken");

//     axios
//       .get<{ success: boolean; data: Question[] }>(
//         `https://digital-competency-platform-server.onrender.com/api/v1/questions/get-allQuestion/${examId}`,
//         {
//           headers: { Authorization: `${token}` },
//         }
//       )
//       .then((res) => {
//         if (res.data.success && res.data.data.length > 0) {
//           setQuestions(res.data.data);
//           setTimer(res.data.data[0].duration || 60);
//         } else {
//           setAccessError("No questions found for this exam.");
//           setShowModal(true);
//         }
//       })
//       .catch(() => {
//         setAccessError("Failed to load questions.");
//         setShowModal(true);
//       })
//       .finally(() => setLoading(false));
//   }, [accessAllowed, examId]);

//   // Timer logic
//   useEffect(() => {
//     if (timerRef.current) clearInterval(timerRef.current);

//     setTimer(questions[currentIndex]?.duration || 60);

//     timerRef.current = setInterval(() => {
//       setTimer((prev) => {
//         if (prev <= 1) {
//           handleNextQuestion();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//     };
//   }, [currentIndex, questions]);

//   // Handle next question or submit
//   const handleNextQuestion = useCallback(() => {
//     if (selectedOption !== null) {
//       setAnswers((prev) => [
//         ...prev,
//         {
//           questionId: questions[currentIndex]._id,
//           selectedOptionIndex: selectedOption,
//         },
//       ]);
//     } else {
//       setAnswers((prev) => [
//         ...prev,
//         {
//           questionId: questions[currentIndex]._id,
//           selectedOptionIndex: -1,
//         },
//       ]);
//     }

//     setSelectedOption(null);

//     if (currentIndex + 1 < questions.length) {
//       setCurrentIndex(currentIndex + 1);
//     } else {
//       submitAnswers();
//     }
//   }, [currentIndex, questions, selectedOption]);

//   // Submit answers to backend
//   const submitAnswers = () => {
//     const payload = {
//       examId,
//       answers,
//     };

//     const token = localStorage.getItem("approvalToken");

//     axios
//       .post("https://digital-competency-platform-server.onrender.com/api/v1/results/submit", payload, {
//         headers: {
//           Authorization: `${token}`,
//         },
//       })
//       .then(() => {
//         alert("Exam submitted successfully!");
//         navigate("/"); // Redirect after submit
//       })
//       .catch(() => alert("Failed to submit exam. Please try again."));
//   };

//   // Modal close handler
//   const handleCloseModal = () => {
//     setShowModal(false);
//     // Optionally redirect or just close modal
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <p className="text-xl font-semibold">Loading...</p>
//       </div>
//     );
//   }

//   if (showModal && accessError) {
//     return (
//       <>
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg text-center">
//             <h2 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h2>
//             <p className="mb-6 text-gray-700">{accessError}</p>
//             <button
//               onClick={handleCloseModal}
//               className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//         {/* Optionally keep the exam UI behind modal dimmed */}
//       </>
//     );
//   }

//   if (questions.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <p className="text-xl font-semibold">No questions available.</p>
//       </div>
//     );
//   }

//   const currentQuestion = questions[currentIndex];

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-24">
//       <h2 className="text-2xl font-bold mb-4">
//         Question {currentIndex + 1} / {questions.length}
//       </h2>

//       <div className="mb-4 p-4 bg-gray-50 rounded-md border border-gray-200">
//         <p className="text-lg font-semibold">{currentQuestion.questionText}</p>
//         <p className="text-sm italic text-gray-500">
//           Competency: {currentQuestion.competency} | Level: {currentQuestion.level}
//         </p>
//       </div>

//       <div className="grid gap-4 mb-6">
//         {currentQuestion.options.map((option, idx) => (
//           <label
//             key={idx}
//             className={`block cursor-pointer rounded-md border p-3 transition ${
//               selectedOption === idx
//                 ? "bg-emerald-500 text-white border-emerald-600"
//                 : "border-gray-300 hover:bg-gray-100"
//             }`}
//           >
//             <input
//               type="radio"
//               name="option"
//               value={idx}
//               checked={selectedOption === idx}
//               onChange={() => setSelectedOption(idx)}
//               className="hidden"
//             />
//             {option}
//           </label>
//         ))}
//       </div>

//       <div className="flex justify-between items-center">
//         <span className="text-sm font-medium text-gray-700">
//           Time left:{" "}
//           <span className={`font-bold ${timer <= 10 ? "text-red-600" : "text-gray-900"}`}>
//             {timer}s
//           </span>
//         </span>

//         <button
//           onClick={handleNextQuestion}
//           className="px-6 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
//           disabled={selectedOption === null}
//         >
//           {currentIndex + 1 === questions.length ? "Submit" : "Next"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TestExam;

import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import useUserProfile from "../hooks/useUserProfile";

interface Question {
  _id: string;
  examId: string;
  competency: string;
  level: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  duration: number;
}

interface Answer {
  questionId: string;
  selectedOptionIndex: number;
}

interface SubmitResponse {
  result: {
    userId: string;
    examId: string;
    score: number;
    passed: boolean;
    completedAt: string;
    _id: string;
  };
  certificationLevel: string;
  proceedToNext: boolean;
  certificateUrl: string;
}

const TestExam: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const profile = useUserProfile();
  const [accessAllowed, setAccessAllowed] = useState<boolean>(false);
  const [accessError, setAccessError] = useState<string | null>(null);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState<number>(60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [showAccessModal, setShowAccessModal] = useState(false);

  // New states for submit result modal
  const [showResultModal, setShowResultModal] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitResponse | null>(null);

  const navigate = useNavigate();

  // Access control check
  useEffect(() => {
    if (!profile || !examId) return;

    const stepNumber = parseInt(examId.slice(-1), 10);

    if (stepNumber > profile.examProgress.currentStep) {
      setAccessError(
        "You can't access this exam step before completing previous steps."
      );
      setAccessAllowed(false);
      setShowAccessModal(true);
      setLoading(false);
      return;
    }

    const lastResult =
      profile.examProgress.results.length > 0
        ? profile.examProgress.results[profile.examProgress.results.length - 1]
        : null;

    if (lastResult && lastResult.scorePercent < 25) {
      setAccessError("You scored under 25%, you cannot retake the exam.");
      setAccessAllowed(false);
      setShowAccessModal(true);
      setLoading(false);
      return;
    }

    setAccessError(null);
    setAccessAllowed(true);
  }, [profile, examId]);

  // Fetch questions if access allowed
  useEffect(() => {
    if (!accessAllowed || !examId) return;

    setLoading(true);
    const token = localStorage.getItem("approvalToken");

    axios
      .get<{ success: boolean; data: Question[] }>(
        `https://digital-competency-platform-server.onrender.com/api/v1/questions/get-allQuestion/${examId}`,
        {
          headers: { Authorization: `${token}` },
        }
      )
      .then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          setQuestions(res.data.data);
          setTimer(res.data.data[0].duration || 60);
        } else {
          setAccessError("No questions found for this exam.");
          setShowAccessModal(true);
        }
      })
      .catch(() => {
        setAccessError("Failed to load questions.");
        setShowAccessModal(true);
      })
      .finally(() => setLoading(false));
  }, [accessAllowed, examId]);

  // Timer logic
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    setTimer(questions[currentIndex]?.duration || 60);

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          handleNextQuestion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, questions]);

  // Handle next question or submit
  const handleNextQuestion = useCallback(() => {
    if (selectedOption !== null) {
      setAnswers((prev) => [
        ...prev,
        {
          questionId: questions[currentIndex]._id,
          selectedOptionIndex: selectedOption,
        },
      ]);
    } else {
      setAnswers((prev) => [
        ...prev,
        {
          questionId: questions[currentIndex]._id,
          selectedOptionIndex: -1,
        },
      ]);
    }

    setSelectedOption(null);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      submitAnswers();
    }
  }, [currentIndex, questions, selectedOption]);

  // Submit answers to backend
  const submitAnswers = () => {
    const payload = {
      examId,
      answers,
    };

    const token = localStorage.getItem("approvalToken");

    axios
      .post<{ success: boolean; data: SubmitResponse }>(
        "https://digital-competency-platform-server.onrender.com/api/v1/results/submit",
        payload,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setSubmitResult(res.data.data);
          setShowResultModal(true);
        } else {
          alert("Submission failed. Please try again.");
        }
      })
      .catch(() => alert("Failed to submit exam. Please try again."));
  };

  // Access modal close handler
  const handleCloseAccessModal = () => {
    setShowAccessModal(false);
    navigate("/"); // Redirect to home or exams list on access error
  };

  // Result modal close handler
  const handleCloseResultModal = () => {
    setShowResultModal(false);
    navigate("/"); // Redirect after viewing result
  };

  // Download certificate handler
  const handleDownloadCertificate = () => {
    if (!submitResult) return;
    // Open certificate URL in a new tab
    window.open(submitResult.certificateUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  if (showAccessModal && accessError) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">
            Access Denied
          </h2>
          <p className="mb-6 text-gray-700">{accessError}</p>
          <button
            onClick={handleCloseAccessModal}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-xl font-semibold">No questions available.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-24">
        <h2 className="text-2xl font-bold mb-4">
          Question {currentIndex + 1} / {questions.length}
        </h2>

        <div className="mb-4 p-4 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-lg font-semibold">
            {currentQuestion.questionText}
          </p>
          <p className="text-sm italic text-gray-500">
            Competency: {currentQuestion.competency} | Level:{" "}
            {currentQuestion.level}
          </p>
        </div>

        <div className="grid gap-4 mb-6">
          {currentQuestion.options.map((option, idx) => (
            <label
              key={idx}
              className={`block cursor-pointer rounded-md border p-3 transition ${
                selectedOption === idx
                  ? "bg-emerald-500 text-white border-emerald-600"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              <input
                type="radio"
                name="option"
                value={idx}
                checked={selectedOption === idx}
                onChange={() => setSelectedOption(idx)}
                className="hidden"
              />
              {option}
            </label>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            Time left:{" "}
            <span
              className={`font-bold ${
                timer <= 10 ? "text-red-600" : "text-gray-900"
              }`}
            >
              {timer}s
            </span>
          </span>

          <button
            onClick={handleNextQuestion}
            className="px-6 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
            disabled={selectedOption === null}
          >
            {currentIndex + 1 === questions.length ? "Submit" : "Next"}
          </button>
        </div>
      </div>

      {/* Result Modal */}
      {showResultModal && submitResult && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Exam Result</h2>
            <p className="mb-2 text-lg">
              <span className="font-semibold">Score:</span>{" "}
              {submitResult.result.score.toFixed(2)}%
            </p>
            <p className="mb-2 text-lg">
              <span className="font-semibold">Certification Level:</span>{" "}
              {submitResult.certificationLevel}
            </p>
            <p
              className={`mb-6 text-xl font-semibold ${
                submitResult.result.passed ? "text-green-600" : "text-red-600"
              }`}
            >
              {submitResult.result.passed ? "Passed" : "Failed"}
            </p>

            {submitResult.certificateUrl && (
              <button
                onClick={handleDownloadCertificate}
                className="mb-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Download Certificate PDF
              </button>
            )}

            <button
              onClick={handleCloseResultModal}
              className="ms-3 px-6 py-2 bg-gray-400 rounded hover:bg-gray-500 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TestExam;
