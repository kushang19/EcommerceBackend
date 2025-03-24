import Product from "../models/Product.js";

// ✅ Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, stock, image, ratings, brand } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      subCategory,
      stock,
      image,
      ratings,
      brand

    });

    await newProduct.save();
    res.status(201).json({ message: "Product created successfully!", newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all products
// export const getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// ✅ Get products by category or sub-category
export const getProducts = async (req, res) => {
  try {
    const { category, subCategory, minPrice, maxPrice, brand, minRating, ratings, page, limit } = req.query;

    let filter = {};

    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (ratings) filter.ratings = ratings;
    if (brand) filter.brand = brand;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (minRating) filter.ratings = { $gte: Number(minRating) };

    // ✅ Add Pagination
    const pageNumber = Number(page) || 1;  // Default: Page 1
    const pageSize = Number(limit) || 10;  // Default: 10 items per page
    const skip = (pageNumber - 1) * pageSize;

    const products = await Product.find(filter)
      .skip(skip)
      .limit(pageSize);

    const totalProducts = await Product.countDocuments(filter);

    res.json({
      totalProducts,
      page: pageNumber,
      totalPages: Math.ceil(totalProducts / pageSize),
      products
    });

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
    const { name, description, price, category, subCategory, stock, image } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, subCategory, stock, image },
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
