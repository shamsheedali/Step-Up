import Orders from "../modal/orderModal.js";
import Product from "../modal/productModal.js";

const createOrder = async (req, res) => {
  try {
    console.log("backend", req.body);
    const { user, items, totalAmount, paymentMethod, shippingAddress } =
      req.body;

    const newOrder = new Orders({
      user,
      items,
      totalAmount,
      paymentMethod,
      shippingAddress,
    });

    const savedOrder = await newOrder.save();
    res
      .status(201)
      .json({ message: "Order created successfully", order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.id;

    const orders = await Orders.find({ user: userId })
      .populate("items totalAmount status paymentMethod createdAt") // Populate product details in items array
      .exec();

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

const getOrderProducts = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Orders.findById(orderId)
      .populate({
        path: "items.product", // Populate the product field in items
        model: "Product",
        select: "productName price category images",
      })
      .exec();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order products:", error);
    res.status(500).json({ message: "Failed to fetch order products" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    console.log(orderId);

    const order = await Orders.findByIdAndDelete({ _id: orderId });
    res.status(200).json({ message: "Order Deleted!" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ messsage: "Error While Deleting order" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const allOrders = await Orders.find();

    res.status(200).json({ allOrders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while fetching orders" });
  }
};

const changeStatus = async (req, res) => {
  const { orderId, status } = req.query;

  try {
    const updatedOrder = await Orders.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (updatedOrder) {
      res.status(200).json({ message: "Order status updated", updatedOrder });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error });
  }
};

export {
  createOrder,
  getUserOrders,
  getOrderProducts,
  cancelOrder,
  getAllOrders,
  changeStatus,
};
