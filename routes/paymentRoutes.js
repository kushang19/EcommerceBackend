import express from "express";
import { createRazorpayOrder, verifyRazorpayPayment } from "../controllers/paymentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create Razorpay order
router.post("/razorpay-order", verifyToken, createRazorpayOrder);

// ✅ Verify Razorpay payment
router.post("/verify-payment", verifyToken, verifyRazorpayPayment);

export default router;