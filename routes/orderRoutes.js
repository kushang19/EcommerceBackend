import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { placeOrder, getUserOrders } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", verifyToken, placeOrder);
router.get("/", verifyToken, getUserOrders);

export default router;
