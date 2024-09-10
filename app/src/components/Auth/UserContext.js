import React, { createContext, useContext, useState, useEffect } from "react";
import APIs, { endpoints } from "../../configs/APIs";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserInfo = async () => {
    sessionStorage.clear();
    const token = sessionStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await APIs.get(endpoints["user_token"], {
        headers: { Authorization: sessionStorage.getItem("token") },
      });
      setUserInfo(res.data);
    } catch (error) {
      console.error("Failed to fetch user info", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, loading, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
