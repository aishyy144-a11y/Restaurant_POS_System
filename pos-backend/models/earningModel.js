const mongoose = require("mongoose");

const earningSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    completedOrdersCount: {
      type: Number,
      default: 0,
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Earning", earningSchema);
