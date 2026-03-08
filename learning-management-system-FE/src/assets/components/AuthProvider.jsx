import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [percent, setPercent] = useState("")
  const [personalInfo, setPersonalInfo] = useState(null);
  const [academicInfo, setAcademicInfo] = useState(null);
  const [programInfo, setProgramInfo] = useState(null);
  const [documents, setDocuments] = useState(null);

  // --- Sync with localStorage ---
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // --- Login helper ---
  const login = ({ token, user }) => {
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        login,
        logout,
        personalInfo,
        setPersonalInfo,
        academicInfo,
        setAcademicInfo,
        programInfo,
        setProgramInfo,
        documents,
        setDocuments,
        percent,
        setPercent
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
