import express from "express";
import { addReview, fetchReviews } from "../controller/reviewController.js";
import verifyToken from "../middleware/middleware.js";
import requireRole from "../middleware/requireRole.js";

const router = express.Router();

router.post("/addReview", verifyToken, requireRole("user"), addReview);
router.get("/:productId", fetchReviews);

export default router;
