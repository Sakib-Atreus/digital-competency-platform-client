import { useNavigate } from "react-router-dom";
import CommonWrapper from "../common/CommonWrapper";

const Home = () => {
  const navigate = useNavigate();

  return (
    <CommonWrapper>
      <div className="h-screen bg-gradient-to-br from-green-100 to-green-300 flex items-center justify-center px-4">
        <div className="max-w-3xl text-center p-8 bg-white bg-opacity-90 rounded-lg shadow-lg">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-900 mb-6">
            Welcome to Test School Competency Assessment Platform
          </h1>

          <p className="text-lg md:text-xl text-green-800 mb-8 leading-relaxed">
            Empower your skills by taking carefully designed competency exams. Track your progress,
            unlock new levels, and prove your expertise with confidence.
          </p>

          <button
            onClick={() => navigate("/test-exam")}
            className="inline-block px-8 py-3 bg-green-700 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-green-800 transition"
            aria-label="Go to available exams"
          >
            View Available Exams
          </button>
        </div>
      </div>
    </CommonWrapper>
  );
};

export default Home;
