import express from "express";
import {
  addCategory,
  getCategories,
  editCategory,
  toggleCategoryStatus,
} from "../controller/categoryController.js";
import verifyToken from "../middleware/middleware.js";

const router = express.Router();

// Routes for category management
router.post("/add", verifyToken, addCategory);
router.get("/get_categories", verifyToken, getCategories);
router.patch("/:id", verifyToken, editCategory);
router.patch("/toggle/:id", verifyToken, toggleCategoryStatus);
export default router;
