import React from "react";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || ""); 

  useEffect(() => {
    if (token) {
      fetch("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user); 
          } else {
            console.error("Invalid user data:", data);
            logout();
          }
        })
        .catch(() => {
          console.error("Invalid token, logging out...");
          logout();
        });
    }
  }, [token]);
  

  const login = (token, userData) => {
    localStorage.setItem("token", token); 
    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token"); 
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;


