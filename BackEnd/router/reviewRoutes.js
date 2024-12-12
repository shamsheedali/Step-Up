import express from "express";
import { addReview, fetchReviews } from "../controller/reviewController.js";

const router = express.Router();

router.post("/addReview", addReview);
router.get("/:productId", fetchReviews);

export default router;
