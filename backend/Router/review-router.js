import express from "express";
import { AddReview, getBookReviews } from "../Controllers/review-controller.js";

const router= express.Router();

router.post("/add-review",AddReview);

router.get("/:title",getBookReviews);

export default router;