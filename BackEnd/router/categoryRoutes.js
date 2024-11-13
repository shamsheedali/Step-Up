import express from "express";
import {
  addCategory,
  getCategories,
  editCategory,
  toggleCategoryStatus,
  getTopSellingCategories,
} from "../controller/categoryController.js";
import verifyToken from "../middleware/middleware.js";

const router = express.Router();

// Routes for category management
router.post("/add", verifyToken, addCategory);
router.get("/get_categories", getCategories);
router.patch("/:id", verifyToken, editCategory);
router.patch("/toggle/:id", verifyToken, toggleCategoryStatus);
router.get('/top-selling/categories', getTopSellingCategories);

export default router;
