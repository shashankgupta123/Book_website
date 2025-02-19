import express from "express";
import {createCheckoutSession, 
    generateReceipt,
    getAllPurchases,
    getPurchaseById,
} from "../Controllers/purchase-Controller.js"

const router = express.Router();
router.post("/checkout", createCheckoutSession);
router.get("/receipt/:sessionId",generateReceipt);

router.get('/purchases',getAllPurchases);
router.get('/purchase/:id',getPurchaseById);

export default router;