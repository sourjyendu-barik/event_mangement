// Flow:
// User selects event + number of tickets
// Your backend calculates total price
// Your backend asks Razorpay:
// 👉 “Create a payment order for ₹500”
// Razorpay returns an order_id
// Frontend opens Razorpay payment popup using that order_id
// User pays (UPI/card/etc)
// Razorpay sends back:
// payment_id
// order_id
// signature (for security)
// Your backend verifies payment
// If verified ✅ → create booking + reduce tickets
// If failed ❌ → do nothing

// utils/razorpay.js

const Razorpay = require("razorpay");

// 👉 WHY we create this:
// This is like "connecting your app to Razorpay's system"
// Without this, your backend cannot:
// - create payment orders
// - talk to Razorpay servers

const razorpay = new Razorpay({
  key_id: process.env.key_id, // 👉 public identifier (like username)
  key_secret: process.env.key_secret, // 👉 secret key (like password, must be hidden)
});

module.exports = razorpay;
