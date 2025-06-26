import React, { useState } from "react";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import "../styles/ChatPage.css";
import "../styles/ChatWindow.css";

const ChatPage = () => {
 
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="chat-page">
     
      <ChatList
        onSelectChat={setSelectedChat}
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
