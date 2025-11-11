import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { toast } from "react-hot-toast";
import API from "../services/api";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket } = useContext(AuthContext);

  // ✅ Get all users
  const getUsers = async () => {
    try {
      const { data } = await API.get("/api/messages/users");
      console.log(data);
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Get messages for selected user
  const getMessages = async () => {
    if (!selectedUser?._id) return;

    try {
      const { data } = await API.get(`/api/messages/${selectedUser._id}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Send message
  const sendMessage = async (messageData) => {
    try {
      const { data } = await API.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );

      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Listen for incoming messages
  const subscribeToMessage = () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);
        API.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        // update unseen count
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]:
            prev[newMessage.senderId] ? prev[newMessage.senderId] + 1 : 1
        }));
      }
    });
  };

  // ✅ Unsubscribe
  const unsubscribe = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessage();
    return () => unsubscribe();
  }, [socket, selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    getUsers,
    setMessages,
    sendMessage,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    getMessages
  };

  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  );
};
