import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

// ✅ Place an order (Checkout)
export const placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const totalAmount = cart.items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);

    const newOrder = new Order({
      userId: req.user.id,
      items: cart.items,
      totalAmount,
    });

    await newOrder.save();
    await Cart.findOneAndDelete({ userId: req.user.id });

    res.status(201).json({ message: "Order placed successfully!", order: newOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get User Orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate("items.productId");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
