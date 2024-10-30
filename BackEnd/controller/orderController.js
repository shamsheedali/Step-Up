import Orders from "../modal/orderModal.js";

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
        path: "items.product", // populate the 'product' field in each item
        model: "Product", // reference to the Product model
        select: "productName price category images" // specify which fields to include from Product
      })
      .exec();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const orderWithFirstImage = {
        ...order._doc,
        items: order.items.map((item) => ({
          ...item._doc,
          product: {
            ...item.product._doc,
            image: item.product.images ? item.product.images[0] : null,
          },
        })),
      };
  
      res.status(200).json({ items: orderWithFirstImage });
  } catch (error) {
    console.error("Error fetching order products:", error);
    res.status(500).json({ message: "Failed to fetch order products" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    console.log(orderId)

    const order = await Orders.findByIdAndDelete({_id: orderId});
    res.status(200).json({message: "Order Deleted!"});
  } catch (error) {
    console.log(error)
    res.status(400).json({messsage: "Error While Deleting order"});
  }
}

export { createOrder, getUserOrders, getOrderProducts,cancelOrder };
