import React, { useEffect, useState, useContext, useRef } from "react";
import { fetchMessages, sendMessage } from "../api/api";
import AuthContext from "../context/AuthContext";
import socket from "../utils/socket";
import "../styles/ChatWindow.css";

const ChatWindow = ({ chatId }) => {
  const { token, user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  console.log("ChatWindow rendered with chatId:", chatId);

  if (!chatId || chatId === "undefined") {
    return (
      <div className="chat-window-container no-chat-selected">
        <p>Please select a chat to start messaging.</p>
      </div>
    );
  }

  useEffect(() => {
    const loadMessages = async () => {
      try {
        console.log("Loading messages for chatId:", chatId);
        const { data } = await fetchMessages(chatId, token);
        console.log("Fetched messages:", data);
        if (!Array.isArray(data)) {
          console.error("Invalid messages format:", data);
          return;
        }
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    loadMessages();
  }, [chatId, token]);

  useEffect(() => {
    if (!chatId) return;

    console.log("Joining chat room:", chatId);
    socket.emit("joinChat", chatId);

    const handleReceiveMessage = (message) => {
      console.log("Received socket message:", message);
      if (!message._id) return;

      setMessages((prevMessages) => {
        if (prevMessages.some((msg) => msg._id === message._id)) {
          return prevMessages;
        }
        return [...prevMessages, message];
      });
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      console.log("Leaving chat room:", chatId);
      socket.off("receiveMessage", handleReceiveMessage);
      socket.emit("leaveChat", chatId);
    };
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatId) return;

    console.log("Sending message:", newMessage);

    try {
      const { data } = await sendMessage(chatId, newMessage, token);
      console.log("Message sent, response:", data);

      if (data && !messages.some((msg) => msg._id === data._id)) {
        setMessages((prevMessages) => [...prevMessages, data]);
        socket.emit("sendMessage", { ...data, chatId, senderId: user._id });
      }
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && newMessage.trim()) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-window-container">
      <ul className="chat-messages-list">
        {messages.length === 0 ? (
          <p className="no-messages-text">No messages yet. Say hi!</p>
        ) : (
          messages.map((msg) => (
            <li
              key={msg._id}
              className={`chat-message ${
                msg.sender?._id === user?._id ? "sent" : "received"
              }`}
            >
              <span className="chat-message-sender">
                {msg.sender?._id === user?._id ? "You" : msg.sender?.username}:
              </span>{" "}
              {msg.message}
            </li>
          ))
        )}
        <div ref={messagesEndRef} />
      </ul>
      <div className="chat-input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className="chat-input"
          autoFocus
        />
        <button
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          className="chat-send-button"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
