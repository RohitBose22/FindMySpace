import { useState, useContext } from "react";
import { sendMessage } from "../api/api";
import AuthContext from "../context/AuthContext";
import socket from "../utils/socket";
import "../styles/MessageInput.css";

const MessageInput = ({ chatId, onMessageSent }) => {
  const { token, user } = useContext(AuthContext);
  const [message, setMessage] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !chatId || !token) {
      console.error("❌ Cannot send message: chatId or token is missing");
      return;
    }

    try {
      const { data } = await sendMessage(chatId, message, token);

      if (data && data._id) {
        onMessageSent(data);
        socket.emit("sendMessage", { ...data, chatId, senderId: user._id });
        setMessage("");
      }
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  };

  return (
    <form onSubmit={handleSendMessage}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        disabled={!chatId}
        autoComplete="off"
      />
      <button type="submit" disabled={!message.trim()}>
        Send
      </button>
    </form>
  );
};

export default MessageInput;
