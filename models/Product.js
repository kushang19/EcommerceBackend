import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true }, // ✅ New sub-category field
    stock: { type: Number, required: true, default: 1 },
    image: { type: String, required: false }, // URL for product image
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
