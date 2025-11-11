import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import API from "../services/api";

export const AuthContext = createContext();

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const [socket, setSocket] = useState(null);

  // ✅ CHECK AUTH
  const checkAuth = async () => {
    try {
      const { data } = await API.post("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (err) {
      logout();
    }
  };

  // ✅ LOGIN / SIGNUP
  const login = async (state, credentials) => {
    try {
      const { data } = await API.post(`/api/auth/${state}`, credentials);

      if (data.success) {
        setAuthUser(data.user);       // ✅ FIXED
        connectSocket(data.user);     // ✅ FIXED

        API.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);

        toast.success(data.message);
        return true;
      }

      toast.error(data.message);
      return false;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };


  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUser([]);

    delete API.defaults.headers.common["token"];

    if (socket) {
      socket.disconnect();
      setSocket(null);
    }

    toast.success("Logged out successfully");
  };

  // ✅ UPDATE PROFILE
  const updateProfile = async (body) => {
    try {
      const { data } = await API.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ✅ SOCKET CONNECT
  const connectSocket = (user) => {
    if (!user || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: { userId: user._id },
    });

    newSocket.on("getOnlineUsers", (ids) => {
      setOnlineUser(ids);
    });

    setSocket(newSocket);
  };

  // ✅ RUN ON LOAD
  useEffect(() => {
    if (token) {
      API.defaults.headers.common["token"] = token;
      checkAuth();
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        axios,
        authUser,
        onlineUser,
        socket,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
