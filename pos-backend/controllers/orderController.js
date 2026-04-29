const createHttpError = require("http-errors");
const Order = require("../models/orderModel");
const Earning = require("../models/earningModel");
const { default: mongoose } = require("mongoose");

const User = require("../models/userModel");

const addOrder = async (req, res, next) => {
  try {
    const orderData = req.body;
    // If user is authenticated and is a waiter, add their ID and Name
    if (req.user && req.user.id) {
        orderData.waiterId = req.user.id;
        
        // Fetch waiter name from User model if not in req.user
        const waiter = await User.findById(req.user.id).select("name");
        if (waiter) {
            orderData.waiterName = waiter.name;
        }
    }
    const order = new Order(orderData);
    await order.save();
    res
      .status(201)
      .json({ success: true, message: "Order created!", data: order });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const order = await Order.findById(id);
    if (!order) {
      const error = createHttpError(404, "Order not found!");
      return next(error);
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    let query = {};
    
    // If user is a waiter, only show their orders
    if (req.user && req.user.role && req.user.role.trim().toLowerCase() === 'waiter') {
        query.waiterId = req.user.id;
    }

    const orders = await Order.find(query).populate("table").sort({ createdAt: -1 });
    res.status(200).json({ data: orders });
  } catch (error) {
    next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const updateData = { orderStatus };
    if (orderStatus === "Completed") {
      updateData.completedAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!order) {
      const error = createHttpError(404, "Order not found!");
      return next(error);
    }

    // If order is completed, update daily earnings
    if (orderStatus === "Completed") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        await Earning.findOneAndUpdate(
            { date: today },
            { 
                $inc: { totalEarnings: order.bills.totalWithTax, completedOrdersCount: 1 },
                $push: { orders: order._id }
            },
            { upsert: true, new: true }
        );
    }

    res
      .status(200)
      .json({ success: true, message: "Order updated", data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = { addOrder, getOrderById, getOrders, updateOrder };
