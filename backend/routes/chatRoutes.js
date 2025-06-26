import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getChats, createChat } from "../controllers/chatController.js";

const router = express.Router();

router.get("/", protect, getChats);  
router.post("/", protect, createChat);  

export default router;
