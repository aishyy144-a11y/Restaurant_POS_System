const Order = require("../models/orderModel");
const Category = require("../models/categoryModel");
const Dish = require("../models/dishModel");
const Table = require("../models/tableModel");
const createHttpError = require("http-errors");

const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // 1. Calculate Today's Earnings (Completed Orders)
    const todayEarningsAgg = await Order.aggregate([
      {
        $match: {
          $or: [
            { completedAt: { $gte: today } },
            { createdAt: { $gte: today }, orderStatus: "Completed", completedAt: { $exists: false } }
          ],
          orderStatus: "Completed",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$bills.totalWithTax" },
        },
      },
    ]);
    const todayEarnings = todayEarningsAgg.length > 0 ? todayEarningsAgg[0].total : 0;

    // 2. Calculate Yesterday's Earnings (for comparison)
    const yesterdayEarningsAgg = await Order.aggregate([
      {
        $match: {
          $or: [
            { completedAt: { $gte: yesterday, $lt: today } },
            { createdAt: { $gte: yesterday, $lt: today }, orderStatus: "Completed", completedAt: { $exists: false } }
          ],
          orderStatus: "Completed",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$bills.totalWithTax" },
        },
      },
    ]);
    const yesterdayEarnings = yesterdayEarningsAgg.length > 0 ? yesterdayEarningsAgg[0].total : 0;

    // Calculate Percentage Difference
    let earningsPercentage = 0;
    if (yesterdayEarnings === 0) {
        earningsPercentage = todayEarnings > 0 ? 100 : 0;
    } else {
        earningsPercentage = ((todayEarnings - yesterdayEarnings) / yesterdayEarnings) * 100;
    }


    // 3. Calculate In Progress Orders (Count)
    // User requested: "jo us din orders in progress ho" (orders in progress that day)
    // We assume this means orders created today that are in progress, or just all in progress.
    // Given the context of "Current Day", we stick to created today.
    const inProgressCount = await Order.countDocuments({
      createdAt: { $gte: today },
      orderStatus: "In Progress",
    });

    // Calculate Yesterday's Completed Orders Count for In Progress Percentage
    const yesterdayCompletedOrdersCount = await Order.countDocuments({
      $or: [
        { completedAt: { $gte: yesterday, $lt: today } },
        { createdAt: { $gte: yesterday, $lt: today }, orderStatus: "Completed", completedAt: { $exists: false } }
      ],
      orderStatus: "Completed",
    });
      
    let inProgressPercentage = 0;
    // Formula: (Current In Progress Count - Yesterday Completed Count) / Yesterday Completed Count * 100
    if (yesterdayCompletedOrdersCount === 0) {
        inProgressPercentage = inProgressCount > 0 ? 100 : 0;
    } else {
        inProgressPercentage = ((inProgressCount - yesterdayCompletedOrdersCount) / yesterdayCompletedOrdersCount) * 100;
    }

    // 4. Get Counts for Dashboard Items
    const categoriesCount = await Category.countDocuments();
    const dishesCount = await Dish.countDocuments();
    const tablesCount = await Table.countDocuments();
    const activeOrdersCount = await Order.countDocuments({ orderStatus: "In Progress" });

    // 5. Calculate Metrics based on Filter
    const { filter = 'day', date, month, year } = req.query;
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();
    let prevStartDate = new Date();
    let prevEndDate = new Date();

    if (filter === 'day') {
      // "Last 1 Day" / Today effectively
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      
      prevStartDate.setDate(startDate.getDate() - 1);
      prevStartDate.setHours(0, 0, 0, 0);
      prevEndDate.setDate(startDate.getDate() - 1);
      prevEndDate.setHours(23, 59, 59, 999);
    } 
    else if (filter === 'yesterday') {
      startDate.setDate(now.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(now.getDate() - 1);
      endDate.setHours(23, 59, 59, 999);

      prevStartDate.setDate(now.getDate() - 2);
      prevStartDate.setHours(0, 0, 0, 0);
      prevEndDate.setDate(now.getDate() - 2);
      prevEndDate.setHours(23, 59, 59, 999);
    }
    else if (filter === 'week') {
      // Last 7 Days
      startDate.setDate(now.getDate() - 7);
      prevStartDate.setDate(now.getDate() - 14);
      prevEndDate.setDate(now.getDate() - 7);
    }
    else if (filter === 'this_week') {
      // Monday to Sunday of current week
      const day = now.getDay(); // 0 (Sun) to 6 (Sat)
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
      startDate = new Date(now.setDate(diff));
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(); // up to now

      prevStartDate = new Date(startDate);
      prevStartDate.setDate(startDate.getDate() - 7);
      prevEndDate = new Date(endDate);
      prevEndDate.setDate(endDate.getDate() - 7);
    }
    else if (filter === 'month') {
        // Last 30 Days
      startDate.setDate(now.getDate() - 30);
      prevStartDate.setDate(now.getDate() - 60);
      prevEndDate.setDate(now.getDate() - 30);
    }
    else if (filter === 'this_month') {
        // 1st of current month to now
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date();

        prevStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        prevEndDate = new Date(now.getFullYear(), now.getMonth(), 0); // Last day of prev month
    }
    else if (filter === 'year') {
        // Last 365 days
      startDate.setFullYear(now.getFullYear() - 1);
      prevStartDate.setFullYear(now.getFullYear() - 2);
      prevEndDate.setFullYear(now.getFullYear() - 1);
    }
    else if (filter === 'this_year') {
        // Jan 1 to now
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date();
        
        prevStartDate = new Date(now.getFullYear() - 1, 0, 1);
        prevEndDate = new Date(now.getFullYear() - 1, 11, 31);
    }
    else if (filter === 'custom_date' && date) {
        // Specific Date
        startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        prevStartDate = new Date(startDate);
        prevStartDate.setDate(startDate.getDate() - 1);
        prevEndDate = new Date(endDate);
        prevEndDate.setDate(endDate.getDate() - 1);
    }
    else if (filter === 'custom_month' && month && year) {
        // Specific Month (1-12)
        const monthIndex = parseInt(month) - 1;
        startDate = new Date(year, monthIndex, 1);
        endDate = new Date(year, monthIndex + 1, 0);
        endDate.setHours(23, 59, 59, 999);

        prevStartDate = new Date(year, monthIndex - 1, 1);
        prevEndDate = new Date(year, monthIndex, 0);
        prevEndDate.setHours(23, 59, 59, 999);
    }
    else if (filter === 'custom_year' && year) {
        // Specific Year
        startDate = new Date(year, 0, 1);
        endDate = new Date(year, 11, 31, 23, 59, 59, 999);

        prevStartDate = new Date(year - 1, 0, 1);
        prevEndDate = new Date(year - 1, 11, 31, 23, 59, 59, 999);
    }

    // Helper to get stats for a range
    const getStatsForRange = async (start, end) => {
      // Revenue
      const revenueAgg = await Order.aggregate([
        {
          $match: {
            $or: [
              { completedAt: { $gte: start, $lte: end } },
              { createdAt: { $gte: start, $lte: end }, orderStatus: "Completed", completedAt: { $exists: false } }
            ],
            orderStatus: "Completed",
          },
        },
        { $group: { _id: null, total: { $sum: "$bills.totalWithTax" } } },
      ]);
      const revenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

      // Total Orders (Event Count)
      const totalOrders = await Order.countDocuments({
        createdAt: { $gte: start, $lte: end }
      });

      // Total Items Sold (Items Sold) - Sum of quantities
      const itemsSoldAgg = await Order.aggregate([
         {
          $match: {
            $or: [
              { completedAt: { $gte: start, $lte: end } },
              { createdAt: { $gte: start, $lte: end }, orderStatus: "Completed", completedAt: { $exists: false } }
            ],
            orderStatus: "Completed"
          }
         },
         { $unwind: "$items" },
         {
           $group: {
             _id: null,
             total: { $sum: "$items.quantity" }
           }
         }
      ]);
      const itemsSold = itemsSoldAgg.length > 0 ? itemsSoldAgg[0].total : 0;

      // Total Customers (Unique Names from Completed Orders)
      const customersAgg = await Order.aggregate([
        {
          $match: {
            $or: [
              { completedAt: { $gte: start, $lte: end } },
              { createdAt: { $gte: start, $lte: end }, orderStatus: "Completed", completedAt: { $exists: false } }
            ],
            orderStatus: "Completed"
          }
        },
        {
          $group: { _id: "$customerDetails.name" }
        },
        {
          $count: "count"
        }
      ]);
      const totalCustomers = customersAgg.length > 0 ? customersAgg[0].count : 0;

      return { revenue, totalOrders, itemsSold, totalCustomers };
    };

    const currentStats = await getStatsForRange(startDate, endDate);
    const prevStats = await getStatsForRange(prevStartDate, prevEndDate);

    const calculatePercentage = (curr, prev) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return ((curr - prev) / prev) * 100;
    };

    const metrics = {
      revenue: {
        value: currentStats.revenue.toFixed(2),
        percentage: calculatePercentage(currentStats.revenue, prevStats.revenue).toFixed(0) + "%",
        isIncrease: currentStats.revenue >= prevStats.revenue
      },
      itemsSold: { // Items Sold
        value: currentStats.itemsSold,
        percentage: calculatePercentage(currentStats.itemsSold, prevStats.itemsSold).toFixed(0) + "%",
        isIncrease: currentStats.itemsSold >= prevStats.itemsSold
      },
      totalCustomers: {
        value: currentStats.totalCustomers,
        percentage: calculatePercentage(currentStats.totalCustomers, prevStats.totalCustomers).toFixed(0) + "%",
        isIncrease: currentStats.totalCustomers >= prevStats.totalCustomers
      },
      eventCount: { // Total Orders
        value: currentStats.totalOrders,
        percentage: calculatePercentage(currentStats.totalOrders, prevStats.totalOrders).toFixed(0) + "%",
        isIncrease: currentStats.totalOrders >= prevStats.totalOrders
      }
    };

    res.status(200).json({
      success: true,
      data: {
        todayEarnings: todayEarnings.toFixed(2),
        earningsPercentage: earningsPercentage.toFixed(1),
        inProgressCount,
        inProgressPercentage: inProgressPercentage.toFixed(1),
        categoriesCount,
        dishesCount,
        tablesCount,
        activeOrdersCount,
        metrics
      },
    });
  } catch (error) {
    next(error);
  }
};

const getDishStats = async (req, res, next) => {
  try {
    const stats = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          orderCount: { $sum: "$items.quantity" }
        }
      },
      {
        $lookup: {
          from: "dishes",
          localField: "_id",
          foreignField: "name",
          as: "dishDetails"
        }
      },
      { $unwind: { path: "$dishDetails", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "categories",
          localField: "dishDetails.category",
          foreignField: "_id",
          as: "categoryDetails"
        }
      },
      { $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: { $ifNull: ["$dishDetails._id", "$_id"] },
          name: "$_id",
          orderCount: 1,
          image: "$dishDetails.image",
          price: "$dishDetails.price",
          category: { $ifNull: ["$categoryDetails.name", "Uncategorized"] }
        }
      },
      { $sort: { orderCount: -1 } }
    ]);

    res.status(200).json({
      status: "success",
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, getDishStats };
