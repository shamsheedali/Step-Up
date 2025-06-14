import Orders from "../modal/orderModal.js";
import Product from "../modal/productModal.js";
import Coupons from "../modal/couponModal.js";
import Wallet from "../modal/walletModal.js";
import Users from "../modal/userModal.js"; // Added import
import HttpStatus from "../utils/httpStatus.js";
import mongoose from "mongoose";

// Generate random 8-character alphanumeric ID
const generateUniqueOrderId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Creating order
const createOrder = async (req, res) => {
  try {
    const {
      user,
      items,
      totalAmount,
      paymentMethod,
      paymentStatus,
      shippingAddress,
      discountApplied,
      razorpayPaymentId,
      promo,
    } = req.body;

    // Validate required fields
    if (!user || !items?.length || !totalAmount || !paymentMethod || !shippingAddress) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Missing required fields" });
    }

    // Validate items
    for (const item of items) {
      if (!item.product || !item.price || !item.quantity || item.quantity < 1) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "Invalid item data: product, price, and quantity are required" });
      }
    }

    // Validate shippingAddress
    if (
      !shippingAddress.street ||
      !shippingAddress.village ||
      !shippingAddress.town ||
      !shippingAddress.postcode ||
      !shippingAddress.phonenumber
    ) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Incomplete shipping address" });
    }

    // Validate paymentMethod and paymentStatus
    const validPaymentMethods = ["cashOnDelivery", "razorPay", "Wallet"];
    const validPaymentStatuses = ["Pending", "Completed", "Refunded"];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Invalid payment method" });
    }
    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Invalid payment status" });
    }

    // Generate uniqueOrderId for new orders
    let uniqueOrderId = await generateUniqueOrderId();
    while (await Orders.findOne({ uniqueOrderId })) {
      uniqueOrderId = await generateUniqueOrderId();
    }

    const newOrder = new Orders({
      user,
      items,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentStatus || "Pending",
      shippingAddress,
      discountApplied: discountApplied || 0,
      razorpayPaymentId,
      uniqueOrderId,
    });

    for (const item of items) {
      const quantity = Number(item.quantity);

      if (isNaN(quantity)) {
        throw new Error(
          `Invalid quantity for product ${item.product}: quantity must be a number`
        );
      }

      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: `Product not found: ${item.product}` });
      }

      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -quantity } },
        { new: true }
      );
    }

    const savedOrder = await newOrder.save();

    // Coupon used by user
    if (promo) {
      const coupon = await Coupons.findOneAndUpdate(
        { code: promo },
        {
          $push: { usedBy: user },
          $inc: { usedCount: 1 },
        },
        { new: true }
      );
      if (!coupon) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: "Invalid coupon code" });
      }
    }

    if (newOrder.paymentMethod === "Wallet") {
      const transaction = {
        description: "Amount debited due to payment",
        type: "Debit",
        amount: newOrder.totalAmount,
      };

      await Wallet.findOneAndUpdate(
        { userId: user },
        { $push: { transactions: transaction } },
        { upsert: true, new: true }
      );
    }

    res
      .status(HttpStatus.CREATED)
      .json({ message: "Order created successfully", order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to create order", error: error.message });
  }
};

// Get specific user's order
const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Invalid user ID" });
    }

    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const orders = await Orders.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "items.product",
        select: "productName price category images",
      })
      .exec();

    if (orders.length === 0) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "No orders found for this user" });
    }

    const totalOrders = await Orders.countDocuments({ user: userId });

    res.status(HttpStatus.OK).json({ allOrders: orders, totalOrders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error, please try again later" });
  }
};

// Get ordered products of order
const getOrderProducts = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Invalid order ID" });
    }

    const order = await Orders.findById(orderId)
      .populate({
        path: "items.product",
        model: "Product",
        select: "productName price category images",
      })
      .exec();

    if (!order) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Order not found" });
    }

    res.status(HttpStatus.OK).json(order);
  } catch (error) {
    console.error("Error fetching order products:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to fetch order products" });
  }
};

// Canceling order
const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const uid = req.params.uid;

    if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(uid)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Invalid order or user ID" });
    }

    const order = await Orders.findByIdAndUpdate(
      orderId,
      { isCancelled: true, status: "Cancelled" },
      { new: true }
    );

    if (!order) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Order not found" });
    }

    for (const item of order.items) {
      const quantity = Number(item.quantity);

      if (isNaN(quantity)) {
        throw new Error(
          `Invalid quantity for product ${item.product}: quantity must be a number`
        );
      }

      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: +quantity } },
        { new: true }
      );
    }

    if (
      ["razorPay", "Wallet"].includes(order.paymentMethod) &&
      ["Completed", "Refunded"].includes(order.paymentStatus)
    ) {
      const transaction = {
        description: "Amount Returned Due to Order Cancellation",
        type: "Credit",
        amount: order.totalAmount,
      };

      await Wallet.findOneAndUpdate(
        { userId: uid },
        { $push: { transactions: transaction } },
        { upsert: true, new: true }
      );

      await Orders.findByIdAndUpdate(orderId, {
        paymentStatus: "Refunded",
      });
    }

    res.status(HttpStatus.OK).json({ message: "Order Deleted!" });
  } catch (error) {
    console.error("Error canceling order:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error while deleting order" });
  }
};

// Return order
const returnOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const uid = req.params.uid;

    if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(uid)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Invalid order or user ID" });
    }

    const order = await Orders.findByIdAndUpdate(
      orderId,
      { isReturned: true, status: "Returned" },
      { new: true }
    );

    if (!order) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Order not found" });
    }

    for (const item of order.items) {
      const quantity = Number(item.quantity);

      if (isNaN(quantity)) {
        throw new Error(
          `Invalid quantity for product ${item.product}: quantity must be a number`
        );
      }

      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: +quantity } },
        { new: true }
      );
    }

    if (
      ["razorPay", "Wallet"].includes(order.paymentMethod) &&
      ["Completed", "Refunded"].includes(order.paymentStatus)
    ) {
      const transaction = {
        description: "Amount Returned Due to Order Return",
        type: "Credit",
        amount: order.totalAmount,
      };

      await Wallet.findOneAndUpdate(
        { userId: uid },
        { $push: { transactions: transaction } },
        { upsert: true, new: true }
      );

      await Orders.findByIdAndUpdate(orderId, {
        paymentStatus: "Refunded",
      });
    }

    res.status(HttpStatus.OK).json({ message: "Order Returned!" });
  } catch (error) {
    console.error("Error returning order:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error while returning order" });
  }
};

// Fetching all orders
const getAllOrders = async (req, res) => {
  try {
    const allOrders = await Orders.find();

    res.status(HttpStatus.OK).json({ allOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error while fetching orders" });
  }
};

// Orders with pagination (Admin)
const getOrdersPagination = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const totalOrders = await Orders.countDocuments({});
    const allOrders = await Orders.find({})
      .populate("user", "username _id") // Added population
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(HttpStatus.OK).json({ allOrders, totalOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error while fetching orders" });
  }
};

// Search orders by order ID or username
const searchOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const searchKey = req.query.searchKey?.trim() || "";

    let query = {};

    if (searchKey) {
      // Build query conditions
      const conditions = [];

      // Search by uniqueOrderId
      conditions.push({ uniqueOrderId: { $regex: searchKey, $options: "i" } });

      // Search by _id if valid ObjectId
      if (mongoose.Types.ObjectId.isValid(searchKey)) {
        conditions.push({ _id: new mongoose.Types.ObjectId(searchKey) });
      }

      // Search by username
      const users = await Users.find(
        { username: { $regex: searchKey, $options: "i" } },
        "_id"
      );
      if (users.length > 0) {
        const userIds = users.map((user) => user._id);
        conditions.push({ user: { $in: userIds } });
      }

      query = { $or: conditions };
    }

    const allOrders = await Orders.find(query)
      .populate("user", "username _id")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Orders.countDocuments(query);

    res.status(HttpStatus.OK).json({ allOrders, totalOrders });
  } catch (error) {
    console.error("Error searching orders:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error while searching orders" });
  }
};

// Change order status
const changeStatus = async (req, res) => {
  const { orderId, status } = req.query;

  try {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Invalid order ID" });
    }

    const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled", "Returned"];
    if (!validStatuses.includes(status)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Invalid status" });
    }

    const updatedOrder = await Orders.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate("user", "username _id");

    if (updatedOrder) {
      res
        .status(HttpStatus.OK)
        .json({ message: "Order status updated", updatedOrder });
    } else {
      res.status(HttpStatus.NOT_FOUND).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error("Error updating status:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error updating order status" });
  }
};

// Change payment status
const changePaymentStatus = async (req, res) => {
  const { orderId, paymentStatus } = req.query;

  try {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Invalid order ID" });
    }

    const validPaymentStatuses = ["Pending", "Completed", "Refunded"];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Invalid payment status" });
    }

    const updatedOrder = await Orders.findByIdAndUpdate(
      orderId,
      { paymentStatus },
      { new: true }
    );

    if (updatedOrder) {
      res
        .status(HttpStatus.OK)
        .json({ message: "Payment status updated", updatedOrder });
    } else {
      res.status(HttpStatus.NOT_FOUND).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error("Error updating payment status:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error updating payment status" });
  }
};

// Sales report
const salesReport = async (req, res) => {
  try {
    let { startDate, endDate, period } = req.body;

    if (period === "daily") {
      ({ startDate, endDate } = getDailyRange());
    } else if (period === "weekly") {
      ({ startDate, endDate } = getWeeklyRange());
    } else if (period === "monthly") {
      ({ startDate, endDate } = getMonthlyRange());
    } else {
      startDate = new Date(startDate);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(endDate);
      endDate.setHours(23, 59, 59, 999);
    }

    const dailyReport = await Orders.aggregate([
      {
        $match: {
          placedAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$placedAt" } },
          totalRevenue: { $sum: "$totalAmount" },
          totalDiscount: { $sum: "$discountApplied" },
          netSales: {
            $sum: { $subtract: ["$totalAmount", "$discountApplied"] },
          },
          orderCount: { $sum: 1 },
          itemsSold: { $sum: { $sum: "$items.quantity" } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const overallSummary = await Orders.aggregate([
      {
        $match: {
          placedAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalDiscount: { $sum: "$discountApplied" },
          netSales: {
            $sum: { $subtract: ["$totalAmount", "$discountApplied"] },
          },
          orderCount: { $sum: 1 },
        },
      },
    ]);

    res.status(HttpStatus.OK).json({
      dailyReport,
      overallSummary: overallSummary.length > 0 ? overallSummary[0] : {},
    });
  } catch (error) {
    console.error("Error fetching sales report:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

// Function for type of sorting
const getDailyRange = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);
  return { startDate: today, endDate: endOfDay };
};

const getWeeklyRange = () => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - 6);
  startOfWeek.setHours(0, 0, 0, 0);
  return { startDate: startOfWeek, endDate: today };
};

const getMonthlyRange = () => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const startOfMonth = new Date(today);
  startOfMonth.setDate(today.getDate() - 29);
  startOfMonth.setHours(0, 0, 0, 0);
  return { startDate: startOfMonth, endDate: today };
};

export {
  createOrder,
  getUserOrders,
  getOrderProducts,
  cancelOrder,
  getAllOrders,
  changeStatus,
  salesReport,
  changePaymentStatus,
  getOrdersPagination,
  returnOrder,
  searchOrders,
};