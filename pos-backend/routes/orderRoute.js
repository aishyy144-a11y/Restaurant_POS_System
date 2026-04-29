const express = require("express");
const router = express.Router();

const { addOrder, getOrders, getOrderById, updateOrder } = require("../controllers/orderController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");

// Routes
router.post("/", isVerifiedUser, addOrder);
router.get("/", isVerifiedUser, getOrders);
router.get("/:id", isVerifiedUser, getOrderById);
router.put("/:id", isVerifiedUser, updateOrder);

module.exports = router;
