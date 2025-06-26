import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { sendMessage, getMessages } from "../controllers/messageController.js";

const router = express.Router();

router.route("/:chatId").get(protect, getMessages);
router.route("/").post(protect, sendMessage);

export default router;
