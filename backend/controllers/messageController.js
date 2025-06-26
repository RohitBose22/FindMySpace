import Message from "../models/Message.js";
import Chat from "../models/Chat.js";

export const sendMessage = async (req, res) => {
  try {
    const { chatId, message } = req.body;

    console.log("🔹 Incoming request to sendMessage:", {
      chatId,
      message,
      user: req.user._id,
    });

    const chatExists = await Chat.findById(chatId);
    if (!chatExists || !chatExists.users.includes(req.user._id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const newMessage = new Message({
      chat: chatId,
      sender: req.user._id,
      message,
    });

    await newMessage.save();

    const populatedMessage = await Message.findById(newMessage._id).populate(
      "sender",
      "username"
    );

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: newMessage._id,
    });


    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ message: "Error sending message", error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId }).populate(
      "sender",
      "username"
    );

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Error fetching messages" });
  }
};
