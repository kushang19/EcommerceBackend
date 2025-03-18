 Add this script in your frontend checkout page:

 <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

===============================================================

Create a JavaScript function in your frontend to process payment:

const processPayment = async (amount) => {
  const response = await fetch("http://localhost:5000/api/payment/razorpay-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ amount }),
  });

  const order = await response.json();

  const options = {
    key: "YOUR_RAZORPAY_KEY_ID",
    amount: order.amount,
    currency: order.currency,
    name: "E-Commerce Store",
    description: "Test Transaction",
    order_id: order.id,
    handler: async function (response) {
      // Send payment details to backend for verification
      const verifyResponse = await fetch("http://localhost:5000/api/payment/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(response),
      });

      const verification = await verifyResponse.json();
      alert(verification.message);
    },
  };

  const razorpay = new Razorpay(options);
  razorpay.open();
};
