import React, { useEffect, useState } from "react";
import Navbar from "../../../components/user_components/navbar/Navbar";
import ProfileNavbar from "../../../components/user_components/profile_navbar/ProfileNavbar";
import {
  cancelOrder,
  getOrderProducts,
  getUserOrders,
} from "../../../api/order";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ListOrders = () => {
  const uid = useSelector((state) => state.user.uid);
  const [orders, setOrders] = useState([]);
  const [reRender, setReRender] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true);
        const allOrders = await getUserOrders(uid);

        const ordersWithProducts = await Promise.all(
          allOrders.reverse().map(async (order) => {
            const { data } = await getOrderProducts(order._id);
            return {
              ...order,
              items: data.items || [],
            };
          })
        );

        setOrders(ordersWithProducts);
        console.log("this", allOrders)
        setLoading(false);
        setReRender(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setReRender(false);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, [uid, reRender]);

  const handleCancelOrder = async (orderId, totalAmount, paymentMethod) => {
    await cancelOrder(orderId, uid);
    if (paymentMethod === "razorPay") {
      toast.success(`${totalAmount} Refunded to Your Wallet`);
    }
    setReRender(true);
  };

  return (
    <div className="text-black min-h-screen h-fit">
      <Navbar />
      <ProfileNavbar />

      <div className="pt-8 px-36">
        <h1 className="text-2xl font-bold">Your Orders</h1>
        <hr />

        {loading ? (
          <div className="w-full flex flex-col py-3 border-b border-gray-400">
            <div className="skeleton animate-pulse h-4 w-48 bg-gray-300 mt-3"></div>
            <div className="skeleton animate-pulse h-4 w-48 bg-gray-300 mt-3"></div>

            <div className="skeleton animate-pulse h-4 w-48 bg-gray-300 mt-3"></div>

            <div className="flex items-center">
              <div className="skeleton animate-pulse h-2.5 w-2.5 bg-gray-300 rounded-full me-2"></div>
              <div className="skeleton animate-pulse h-4 w-48 bg-gray-300 mt-3"></div>

            </div>
            <hr className="my-4" />

            <div className="flex justify-between items-center border-b border-gray-200 py-4">
              <div className="flex items-center gap-4">
                <div className="skeleton animate-pulse w-20 h-20 bg-gray-300 object-cover rounded-lg"></div>
                <div>
                  <div className="skeleton animate-pulse text-md w-[190px] h-4 bg-gray-300 font-medium"></div>
                  <div className="skeleton animate-pulse text-sm w-[150px] h-4 mt-2 bg-gray-300"></div>
                </div>
              </div>
              <div>
              <div className="skeleton animate-pulse text-sm w-[150px] h-4 bg-gray-300"></div>
              <div className="skeleton animate-pulse text-sm w-[150px] h-4 mt-2 bg-gray-300"></div>
              </div>
              <div>
              <div className="skeleton animate-pulse text-sm w-[150px] h-4 bg-gray-300"></div>
              </div>
            </div>
            <button className="skeleton animate-pulse h-12 mt-4 px-4 py-2 bg-gray-400 border-0 rounded-lg transition"></button>
          </div>
        ) : (
          <>
            {orders.length === 0 ? (
              <p>No orders available.</p>
            ) : (
              orders.map((order) => (
                <div
                  key={order._id}
                  className="w-full flex flex-col py-3 border-b border-gray-400"
                >
                  <p>
                    Placed At: {new Date(order.placedAt).toLocaleDateString()}
                  </p>
                  <p>Total Amount: ₹{Math.round(order.totalAmount)}</p>
                  <p>Payment Method: {order.paymentMethod}</p>
                  <div className="flex items-center">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        order.status === "Delivered"
                          ? "bg-green-500"
                          : order.status === "Cancelled"
                          ? "bg-red-500"
                          : order.status === "Shipped"
                          ? "bg-yellow-500"
                          : order.status === "Processing"
                          ? "bg-blue-500"
                          : ""
                      } me-2`}
                    ></div>
                    <p>{order.status}</p>
                  </div>
                  {order.isCancelled && (
                    <h1 className="mx-auto text-red-500 font-bold text-lg">
                      Order cancelled
                    </h1>
                  )}
                  <hr className="my-4" />

                  {/* Check if items exist and map through them */}
                  {Array.isArray(order.items) && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between items-center border-b border-gray-200 py-4"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={
                              `data:image/jpeg;base64,${item.product?.images[0]}` ||
                              "https://via.placeholder.com/150"
                            }
                            alt={item.product?.productName || "Product Image"}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div>
                            <h3 className="text-md w-[190px] font-medium">
                              {item.product?.productName || "No product name"}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {item.product?.category || "No category"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold">₹{item.price}</p>
                          <p className="text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div>
                          <p>Subtotal: ₹{item.price * item.quantity}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      No items found in this order.
                    </p>
                  )}

                  <button
                    className={`btn mt-4 px-4 py-2 ${
                      order.isCancelled ? "text-black" : "text-white"
                    } bg-black rounded-lg transition`}
                    onClick={() =>
                      handleCancelOrder(
                        order._id,
                        order.totalAmount,
                        order.paymentMethod
                      )
                    }
                    disabled={order.isCancelled}
                  >
                    {order.isCancelled ? "Order Cancelled" : "Cancel Order"}
                  </button>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ListOrders;
