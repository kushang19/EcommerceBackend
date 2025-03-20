import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import { sendOrderConfirmationEmail } from "../utils/emailService.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

dotenv.config();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create an order (Generate Razorpay Payment Link)
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const options = {
      amount: amount * 100, // Amount in paise (₹1 = 100 paise)
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Verify Payment Signature (After Successful Payment)

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
    } = req.body;

    // Verify Razorpay signature
    // const crypto = require("crypto");
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const calculatedSignature = hmac.digest("hex");

    if (calculatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed!" });
    }

    // Find the order and update it
    const order = await Order.findOne({ orderId: razorpay_order_id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentId = razorpay_payment_id;
    order.paymentStatus = "Paid";
    await order.save();

    res.json({ message: "Payment successful!", order });

    // ✅ Send email confirmation after payment is successful
    const user = await User.findById(order.userId);
    await sendOrderConfirmationEmail(user.email, order);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
