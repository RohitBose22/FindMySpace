import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchChatById } from "../api/api";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import AuthContext from "../context/AuthContext";
import "../styles/ChatPage.css";
import "../styles/ChatWindow.css";

const ChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const fetchSelectedChat = async () => {
      if (chatId && token) {
        try {
          console.log("Fetching chat details for chatId:", chatId);
          const res = await fetchChatById(chatId, token);
          console.log("Fetched chat data:", res.data);
          setSelectedChat(res.data);
        } catch (error) {
          console.error("Failed to fetch chat:", error);
          setSelectedChat(null);
        }
      } else {
        console.log("No chatId or token available, clearing selectedChat");
        setSelectedChat(null);
      }
    };

    fetchSelectedChat();
  }, [chatId, token]);

  const handleSelectChat = (chat) => {
    if (chat && chat._id) {
      console.log("Chat clicked:", chat);
      navigate(`/chat/${chat._id}`);
    }
  };

  useEffect(() => {
    console.log("Current selectedChat state:", selectedChat);
  }, [selectedChat]);

  return (
    <div className="chat-page">
      <ChatList onSelectChat={handleSelectChat} selectedChat={selectedChat} />
      {selectedChat ? (
        <ChatWindow chatId={selectedChat._id} />
      ) : (
        <div className="chat-window no-chat">
          <p>Please select a chat to start messaging.</p>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
