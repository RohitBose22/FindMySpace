import express from "express";
import {
  getProperties,
  createProperty,
  deleteProperty,
  getPropertyById,
} from "../controllers/propertyController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getProperties);
router.get("/:id", getPropertyById);

router.post("/", protect, upload.array("images", 10), createProperty);

router.delete("/:id", protect, deleteProperty);

export default router;
