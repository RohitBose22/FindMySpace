import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

import Message from "./models/Message.js";
import Chat from "./models/Chat.js";

dotenv.config();

const app = express();
const server = http.createServer(app);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
  req.io = io;
  next();
});

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("sendMessage", async (data) => {
    try {
      const { chatId, message, senderId } = data;

   
      const newMessage = new Message({
        chat: chatId,
        sender: senderId,
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


      socket.to(chatId).emit("receiveMessage", populatedMessage);

 
      socket.emit("messageSent", populatedMessage);
    } catch (error) {
      console.error("Error saving/sending message in socket:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


