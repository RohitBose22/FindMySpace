import Chat from "../models/Chat.js";

export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ users: req.user._id })
      .populate("users", "username email profileImage") 
      .populate({
        path: "messages",
        select: "message sender createdAt",
        options: { sort: { createdAt: -1 } },
      })
      .populate({
        path: "latestMessage",
        populate: { path: "sender", select: "username email profileImage" }, 
      })
      .lean();

    
    const validChats = chats.filter(chat => chat.users.length > 1);

    
    const userIdStr = req.user._id.toString();
    const chatsWithOtherUser = validChats.map(chat => {
      const otherUser = chat.users.find(u => u._id.toString() !== userIdStr);

      return {
        ...chat,
        otherUser: otherUser ? {
          _id: otherUser._id,
          username: otherUser.username,
          email: otherUser.email,
          profileImage: otherUser.profileImage || "", 
        } : null,
      };
    });

    res.json(chatsWithOtherUser);
  } catch (error) {
    console.error("❌ Error fetching chats:", error);
    res.status(500).json({ message: "Error fetching chats" });
  }
};

export const createChat = async (req, res) => {
  const { ownerId } = req.body;

  try {
    let chat = await Chat.findOne({
      users: { $all: [req.user._id, ownerId] },
    }).lean();

    if (!chat) {
      chat = await Chat.create({
        users: [req.user._id, ownerId].sort(),
        messages: [],
      });
    }

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Error creating chat" });
  }
};
