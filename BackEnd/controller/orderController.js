import Orders from "../modal/orderModal.js";
import Product from "../modal/productModal.js";
import Coupons from "../modal/couponModal.js";
import Wallet from "../modal/walletModal.js";
import HttpStatus from "../utils/httpStatus.js";

//Creating order
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

    const newOrder = new Orders({
      user,
      items,
      totalAmount,
      paymentMethod,
      paymentStatus,
      shippingAddress,
      discountApplied,
      razorpayPaymentId,
    });

    for (const item of items) {
      const quantity = Number(item.quantity);

      if (isNaN(quantity)) {
        throw new Error(
          `Invalid quantity for product ${item.product}: quantity must be a number.`
        );
      }

      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -quantity } },
        { new: true }
      );
    }

    const savedOrder = await newOrder.save();

    //coupon used by user
    await Coupons.findOneAndUpdate(
      { code: promo },
      { $push: { usedBy: user } }
    );

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
      .json({ message: "Failed to create order" });
  }
};

//Get specific user's order
const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.id;

    const limit = req.query.limit || 5;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;

    const orders = await Orders.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("items totalAmount status paymentMethod createdAt")
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

//Get ordered Products of order
const getOrderProducts = async (req, res) => {
  try {
    const { orderId } = req.params;
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

//Canceling order
const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const uid = req.params.uid;

    const order = await Orders.findByIdAndUpdate(
      orderId,
      { isCancelled: true, status: "Cancelled" },
      { new: true }
    );

    for (const item of order.items) {
      const quantity = Number(item.quantity);

      if (isNaN(quantity)) {
        throw new Error(
          `Invalid quantity for product ${item.product}: quantity must be a number.`
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
    console.log(error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error While Deleting order" });
  }
};

//Fetching all orders
const getAllOrders = async (req, res) => {
  try {
    const allOrders = await Orders.find();

    res.status(HttpStatus.OK).json({ allOrders });
  } catch (error) {
    console.log(error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error while fetching orders" });
  }
};

//orders with pagination (Admin)
const getOrdersPagination = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const totalOrders = await Orders.countDocuments({});
    const allOrders = await Orders.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(HttpStatus.OK).json({ allOrders, totalOrders });
  } catch (error) {
    console.log(error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error while fetching orders" });
  }
};

//change order status
const changeStatus = async (req, res) => {
  const { orderId, status } = req.query;

  try {
    const updatedOrder = await Orders.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (updatedOrder) {
      res
        .status(HttpStatus.OK)
        .json({ message: "Order status updated", updatedOrder });
    } else {
      res.status(HttpStatus.NOT_FOUND).json({ message: "Order not found" });
    }
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error updating order status", error });
  }
};

//CHANGE PAYMENT STATUS
const changePaymentStatus = async (req, res) => {
  const { orderId, paymentStatus } = req.query;
  try {
    const updatedOrder = await Orders.findByIdAndUpdate(
      orderId,
      { paymentStatus },
      { new: true }
    );

    if (updatedOrder) {
      res
        .status(HttpStatus.OK)
        .json({ message: "Payment Completed", updatedOrder });
    } else {
      res.status(HttpStatus.NOT_FOUND).json({ message: "Order not found" });
    }
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error updating payment status", error });
  }
};

//SALES-REPORT
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

//function for type of sorting
const getDailyRange = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);
  console.log("this", today, endOfDay);
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
};
