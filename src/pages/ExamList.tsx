import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Exam {
  _id: string;
  title: string;
}

const ExamsList: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("approvalToken");
    axios
      .get<{ success: boolean; data: Exam[] }>(
        `${import.meta.env.VITE_BASE_URL}/exams/all`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setExams(res.data.data);
        } else {
          setError("Failed to fetch exams");
        }
      })
      .catch(() => setError("Failed to fetch exams"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-lg font-medium text-gray-700 animate-pulse">
          Loading exams...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-lg font-medium text-red-600">{error}</p>
      </div>
    );
  }

  if (exams.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-lg font-medium text-gray-700">No exams available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 mt-20 bg-white rounded-lg shadow-lg my-32">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-[#37B874] border-b-4 border-[#66e1a0] pb-4">
        Available Exams
      </h1>
      <ul className="space-y-5">
        {exams.map((exam) => (
          <li
            key={exam._id}
            onClick={() => navigate(`/test-exam/${exam._id}`)}
            className="cursor-pointer p-6 bg-indigo-50 rounded-lg border border-indigo-200 shadow-sm hover:shadow-md hover:bg-indigo-100 transition duration-300 ease-in-out"
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                navigate(`/test-exam/${exam._id}`);
              }
            }}
          >
            <h2 className="text-2xl font-semibold text-indigo-900">
              {exam.title || "Untitled Exam"}
            </h2>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExamsList;
