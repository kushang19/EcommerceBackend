import Cart from "../models/Cart.js";

// ✅ Get the user's cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.productId"
    );
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Convert the cart document to a plain JavaScript object
    const cartWithoutStock = cart.toObject();

    // Iterate through the items array and remove the stock property
    cartWithoutStock.items.forEach((item) => {
      if (item.productId && item.productId.stock !== undefined) {
        delete item.productId.stock;
      }
    });

    res.json(cartWithoutStock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({
        userId: req.user.id,
        items: [{ productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );
    await cart.save();

    res.json({ message: "Item removed from cart", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Clear cart after order
export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user.id });
    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Decrease Cart Item Quantity 
export const decreaseCartItemQuantity = async (req, res) => {
    try {
      const { productId } = req.params;
      const cart = await Cart.findOne({ userId: req.user.id });
  
      if (!cart) return res.status(404).json({ message: "Cart not found" });
  
      const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
  
      if (itemIndex === -1) return res.status(404).json({ message: "Item not found in cart" });
  
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
      } else {
        cart.items.splice(itemIndex, 1); // Remove item if quantity is 1
      }
  
      await cart.save();
      res.json({ message: "Item quantity updated", cart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  // ✅ Increase Cart Item Quantity 
  export const addSingleProductToCart = async (req, res) => {
    try {
      const { productId } = req.body;
      let cart = await Cart.findOne({ userId: req.user.id });
  
      if (!cart) {
        cart = new Cart({
          userId: req.user.id,
          items: [{ productId, quantity: 1 }],
        });
      } else {
        const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
  
        if (itemIndex > -1) {
          cart.items[itemIndex].quantity += 1;
        } else {
          cart.items.push({ productId, quantity: 1 });
        }
      }
  
      await cart.save();
      res.json({ message: "Product added to cart", cart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  
