import React, { useEffect, useState, useContext } from "react";
import { fetchChats } from "../api/api";
import AuthContext from "../context/AuthContext";
import "../styles/ChatList.css";

const backendUrl = import.meta.env.VITE_API_BASE_URL;

const ChatList = ({ onSelectChat, selectedChat }) => {
  const { token, user } = useContext(AuthContext);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (!token) return;

    const loadChats = async () => {
      try {
        const response = await fetchChats(token);
        setChats(response?.data || []);
      } catch (error) {
        console.error("Error loading chats:", error);
      }
    };

    loadChats();
  }, [token]);

  if (!user) {
    return <p>Loading chats...</p>;
  }

  return (
    <div className="chat-list-container">
      <h2 className="chat-list-title">Chats</h2>
      {chats.length === 0 ? (
        <p>No chats available</p>
      ) : (
        <ul className="chat-list">
          {[...chats]
            .sort((a, b) => {
              const dateA = new Date(a?.latestMessage?.createdAt || 0);
              const dateB = new Date(b?.latestMessage?.createdAt || 0);
              return dateB - dateA;
            })
            .map((chat) => {
              const otherUser = chat.users.find(u => u._id !== user._id);
              const profileImage = otherUser?.profileImage
                ? (otherUser.profileImage.startsWith("http")
                    ? otherUser.profileImage
                    : `${backendUrl}/uploads/${otherUser.profileImage}`)
                : "/user-avatar.png";

              const isActive = selectedChat?._id === chat._id;

              return (
                <li
                  key={chat._id}
                  className={`chat-list-item ${isActive ? "active" : ""}`}
                  onClick={() => onSelectChat(chat)}
                >
                  <img
                    src={profileImage}
                    alt={otherUser?.username || "User"}
                    className="chat-user-avatar"
                  />
                  <div className="chat-info">
                    <span className="chat-username">
                      {otherUser?.username || "Unknown User"}
                    </span>
                    {chat.latestMessage?.message && (
                      <span className="chat-preview">
                        {chat.latestMessage.message.length > 30
                          ? chat.latestMessage.message.slice(0, 30) + "..."
                          : chat.latestMessage.message}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
};

export default ChatList;




