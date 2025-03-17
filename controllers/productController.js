import Product from "../models/Product.js";

// ✅ Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, image } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      image,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product created successfully!", newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get a single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update a product by ID
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, image } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, stock, image },
      { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product updated successfully!", updatedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete a product by ID
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
