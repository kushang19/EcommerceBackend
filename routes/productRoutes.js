import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes (Anyone can access)
router.get("/", getAllProducts);          // Get all products
router.get("/:id", getProductById);       // Get product by ID

// Protected Routes (Only Admins can access)
router.post("/",verifyAdmin, createProduct);        // Create a product
router.put("/:id",verifyAdmin, updateProduct);     // Update product by ID
router.delete("/:id",verifyAdmin, deleteProduct);  // Delete product by ID

export default router;
