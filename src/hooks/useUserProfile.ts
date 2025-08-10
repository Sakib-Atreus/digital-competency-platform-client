import axios from "axios";
import { useEffect, useState } from "react";

interface ExamProgress {
  currentStep: number;
  finalLevel: string | null;
  hasCompleted: boolean;
  retakesUsed: number;
  results: { scorePercent: number }[];
}

interface UserProfile {
  _id: string;
  name: string;
  examProgress: ExamProgress;
}

const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("approvalToken");
    axios
      .get("http://localhost:5000/api/v1/users/getProfile", {
        headers: { Authorization: `${token}` },
      })
      .then((res) => {
        if (res.data.success) {
          setProfile(res.data.data);
        }
      })
      .catch(() => {
        setProfile(null);
      });
  }, []);

  return profile;
};

export default useUserProfile;
