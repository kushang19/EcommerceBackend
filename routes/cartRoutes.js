import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getCart, addToCart, removeFromCart, clearCart,decreaseCartItemQuantity, addSingleProductToCart } from "../controllers/cartController.js";

const router = express.Router();

router.get("/", verifyToken, getCart);
router.post("/add", verifyToken, addToCart);
router.delete("/remove/:productId", verifyToken, removeFromCart);
router.delete("/clear", verifyToken, clearCart);
router.put("/decrease/:productId", verifyToken, decreaseCartItemQuantity);
router.post("/add-single", verifyToken, addSingleProductToCart);

export default router;
