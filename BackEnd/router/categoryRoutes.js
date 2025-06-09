import express from "express";
import {
  addCategory,
  getCategories,
  editCategory,
  toggleCategoryStatus,
  getTopSellingCategories,
} from "../controller/categoryController.js";
import verifyToken from "../middleware/middleware.js";
import requireRole from "../middleware/requireRole.js";

const router = express.Router();

// Routes for category management
router.post("/", verifyToken, requireRole("admin"), addCategory);
router.get("/", getCategories);
router.patch("/:id", verifyToken, requireRole("admin"), editCategory);
router.patch("/toggle/:id", verifyToken, requireRole("admin"), toggleCategoryStatus);
router.get('/top-selling/categories', getTopSellingCategories);

export default router;
