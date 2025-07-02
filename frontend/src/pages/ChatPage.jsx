import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import "../styles/ChatPage.css";
import "../styles/ChatWindow.css";

const ChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();

  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const fetchSelectedChat = async () => {
      if (chatId) {
        try {
          const res = await axios.get(`/api/chats/${chatId}`);
          setSelectedChat(res.data);
        } catch (error) {
          console.error("Failed to fetch chat:", error);
          setSelectedChat(null);
        }
      } else {
        setSelectedChat(null);
      }
    };

    fetchSelectedChat();
  }, [chatId]);

  
  const handleSelectChat = (chat) => {
    if (chat && chat._id) {
      navigate(`/chat/${chat._id}`);
    }
  };

  return (
    <div className="chat-page">
      <ChatList
        onSelectChat={handleSelectChat}
        selectedChat={selectedChat}
      />

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
