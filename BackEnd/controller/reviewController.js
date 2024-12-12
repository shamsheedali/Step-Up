import Review from "../modal/reviewModel.js";
import HttpStatus from "../utils/httpStatus.js";

// Adding a review
const addReview = async (req, res) => {
  try {
    const { userId, productId, review, rating } = req.body;

    if (!userId || !productId || !review || !rating) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "All fields are required." });
    }

    const newReview = new Review({ userId, productId, review, rating });

    await newReview.save();

    res.status(HttpStatus.CREATED).json({ message: "Review added successfully!", review: newReview });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error. Please try again later." });
  }
};

// Fetching reviews for a product
const fetchReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Product ID is required." });
    }

    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });

    res.status(HttpStatus.OK).json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error. Please try again later." });
  }
};

export { addReview, fetchReviews };
