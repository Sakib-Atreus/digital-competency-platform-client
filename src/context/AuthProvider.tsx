import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define sub-types for your user state

interface UserMeta {
  // Define any properties from res.data.meta here, example:
  lastLogin?: string;
  // Add more meta fields as needed
}

interface UserData {
  id?: string;
  name?: string;
  email?: string;
  role?: string; // important for your logic
  // Add other user fields as needed
}

interface User {
  userMeta: UserMeta | null;
  userData: UserData | null;
  approvalToken: string;
  refreshToken: string;
}

type OTPToken = string;

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  otpToken: OTPToken | null;
  setOtpToken: React.Dispatch<React.SetStateAction<OTPToken | null>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("userData");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [otpToken, setOtpToken] = useState<OTPToken | null>(() => {
    const storedOTP = localStorage.getItem("OTPtoken");
    return storedOTP ? JSON.parse(storedOTP) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("userData", JSON.stringify(user));
    } else {
      localStorage.removeItem("userData");
    }
  }, [user]);

  useEffect(() => {
    if (otpToken) {
      localStorage.setItem("OTPtoken", JSON.stringify(otpToken));
    } else {
      localStorage.removeItem("OTPtoken");
    }
  }, [otpToken]);

  const logout = () => {
    setUser(null);
    setOtpToken(null);
    localStorage.removeItem("userData");
    localStorage.removeItem("OTPtoken");
    localStorage.removeItem("hasRedirected");
  };

  const values: AuthContextType = {
    user,
    setUser,
    otpToken,
    setOtpToken,
    logout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
