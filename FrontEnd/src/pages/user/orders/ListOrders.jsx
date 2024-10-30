import React, { useEffect, useState } from "react";
import Navbar from "../../../components/user_components/navbar/Navbar";
import ProfileNavbar from "../../../components/user_components/profile_navbar/ProfileNavbar";
import { cancelOrder, getOrderProducts, getUserOrders } from "../../../api/order";
import { useSelector } from "react-redux";

const ListOrders = () => {
  const uid = useSelector((state) => state.user.uid);
  const [orders, setOrders] = useState([]);
  const [reRender, setReRender] = useState(false);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const allOrders = await getUserOrders(uid);
        console.log("Fetched orders:", allOrders);

        const ordersWithProducts = await Promise.all(
          allOrders.map(async (order) => {
            const { data } = await getOrderProducts(order._id);
            console.log("Products for order", order._id, data);

            return {
              ...order,
              items: data.items || [],
            };
          })
        );

        setOrders(ordersWithProducts);
        console.log("Updated orders with products:", ordersWithProducts);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    getOrders();
  }, [uid, reRender]);


  //delete order
  const handleCancelOrder = async(orderId) => {
    console.log(orderId)

    await cancelOrder(orderId);
    setReRender(true);
  }

  return (
    <div className="text-black min-h-screen h-fit">
      <Navbar />
      <ProfileNavbar />

      <div className="pt-8 px-36">
        <h1 className="text-2xl font-bold">Your Orders</h1>
        <hr />

        {orders.length === 0 && <p>No orders available.</p>}
        {orders.map((order) => (
          <div
            key={order._id}
            className="w-full flex flex-col py-3 border-b border-gray-400"
          >
            <p>Placed At: {new Date(order.placedAt).toLocaleDateString()}</p>
            <p>Total Amount: ₹{order.totalAmount}</p>
            <hr className="my-4" />

            {console.log("Order Object:", order)}
            {console.log("Is Array (order.items):", Array.isArray(order.items))}
            {console.log(
              "Items Length (order.items.items):",
              order.items?.items?.length || 0
            )}

            {/* Conditional rendering for items */}
            {Array.isArray(order.items?.items) &&
            order.items.items.length > 0 ? (
              order.items.items.map((item) => {
                console.log("Displaying item:", item.product);
                return (
                  <div
                    key={item._id}
                    className="flex justify-between items-center border-b border-gray-200 py-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          `data:image/jpeg;base64,${item.product?.images?.[0]}` ||
                          "https://via.placeholder.com/150"
                        }
                        alt={item.product?.productName || "Product Image"}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="text-md font-medium">
                          {item.product?.productName || "No product name"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.product?.category || "No category"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold">₹{item.product?.price}</p>
                      <p className="text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div>
                      <p>Subtotal: ₹{item.product?.price * item.quantity}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">No items found in this order.</p>
            )}

            <button className="btn mt-4 px-4 py-2 text-white bg-black rounded-lg  transition"
             onClick={() => handleCancelOrder(order._id)}>
              Cancel Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListOrders;
