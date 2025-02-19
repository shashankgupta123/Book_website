import express from "express";
import { getWeeklyIncome, getTotalIncome, getSalesByGenre, getReviewBycategory} from "../Controllers/graph.js"

const router = express.Router();

router.get("/weekly-income", getWeeklyIncome);
router.get("/total-income", getTotalIncome);
router.get("/sales-by-genre", getSalesByGenre);
router.get("/review-by-category", getReviewBycategory);

export default router;