import express from "express";
import { AddReview, getBookReviews, getAllReviews, deleteReview} from "../Controllers/review-controller.js";

const router= express.Router();

router.post("/add-review",AddReview);

router.get("/:title",getBookReviews);

router.get("/admin/all", getAllReviews);

router.delete("/admin/:reviewId", deleteReview);

export default router;