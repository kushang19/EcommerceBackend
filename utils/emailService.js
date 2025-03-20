import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or App Password
  },
});

// ✅ Send confirmation email function
export const sendOrderConfirmationEmail = async (userEmail, order) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Order Confirmation - E-Commerce Store",
    html: `
      <h3>Thank you for your order!</h3>
      <p>Your payment was successful. Here are your order details:</p>
      <ul>
        ${order.items
          .map(
            (item) => `<li>Product: ${item.productId}, Quantity: ${item.quantity}</li>`
          )
          .join("")}
      </ul>
      <p>Total Amount: ₹${order.totalAmount}</p>
      <p>Order ID: ${order.orderId}</p>
      <p>Payment ID: ${order.paymentId}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
