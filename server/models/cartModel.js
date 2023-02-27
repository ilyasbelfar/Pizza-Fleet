const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    cartItems: [
      {
        type: {
          pizza: { type: mongoose.Schema.Types.ObjectId, ref: "Pizza" },
          quantity: { type: Number, default: 1 },
          subTotal: { type: Number, default: 0 },
        },
        default: [],
      },
    ],
    shipping: { type: Number, default: 0 },
    totalToPay: { type: Number, default: 0 },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
    isCouponApplied: {
      type: Boolean,
      default: false,
    },
    discountedPrice: {
      type: Number,
      default: 0,
    },
    isGuestCart: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["purchased", "not purchased"],
      default: "not purchased",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", CartSchema);
