import React, { useEffect, useState } from "react";
import Navbar from "../../../components/user_components/navbar/Navbar";
import ProfileNavbar from "../../../components/user_components/profile_navbar/ProfileNavbar";
import {
  cancelOrder,
  changePaymentStatus,
  getOrderProducts,
  getUserOrders,
} from "../../../api/order";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { IoMdDownload, IoMdRefresh } from "react-icons/io";
import { handlePayment } from "../../../api/payment";
import { BiTimeFive } from "react-icons/bi";
import { IoIosCheckmarkCircle } from "react-icons/io";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ListOrders = () => {
  const { uid, username, email } = useSelector((state) => state.user);
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
        console.log("this", allOrders);
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

  //Cancel Order
  const handleCancelOrder = async (orderId, totalAmount, paymentMethod) => {
    await cancelOrder(orderId, uid);
    if (paymentMethod === "razorPay") {
      toast.success(`${Math.round(totalAmount)} Refunded to Your Wallet`);
    }
    setReRender(true);
  };

  //Retry Payment
  const handleRetryPayment = async (orderId, totalAmount, phonenumber) => {
    try {
      await handlePayment(username, email, totalAmount, phonenumber)
        .then(async (res) => {
          console.log("Success", orderId, res);
          await changePaymentStatus(orderId, "Completed");
          setReRender(true);
        })
        .catch(async (err) => {
          console.log("pending", err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    const order = orders.find((o) => o._id === orderId);
    const doc = new jsPDF();

    console.log("this is it!", order)
  
    // Header Section
    doc.setFontSize(18);
    doc.text("StepUp", 14, 20); 
    doc.setFontSize(12);
    doc.text("Address Line 1", 14, 28);
    doc.text("Address Line 2", 14, 34);
    doc.text("City, ZIP Code", 14, 40);
    doc.text("Phone: 123-456-7890", 14, 46);
    doc.text("Email: info@StepUp.com", 14, 52);
  
    // Invoice Title and Date
    doc.setFontSize(16);
    doc.text("Invoice", 150, 20);
    doc.setFontSize(10);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 150, 26);
    doc.text(`Invoice No: ${orderId}`, 150, 32);
  
    // Client Information Section
    doc.setFontSize(12);
    doc.text("Bill To:", 14, 70);
    doc.text(`Client Name: ${username || "John Doe"}`, 14, 76);
    doc.text(`Client Address: ${order.shippingAddress.postcode, order.shippingAddress.town || "123 Client St."}`, 14, 82);
    doc.text(`Client Email: ${email || "client@example.com"}`, 14, 88);
  
    // Order Summary
    doc.text("Order Summary", 14, 100);
    doc.text(`Placed At: ${new Date(order.placedAt).toLocaleDateString()}`, 14, 106);
    doc.text(`Payment Method: ${order.paymentMethod}`, 14, 112);
    doc.text(`Total Amount: ₹${Math.round(order.totalAmount)}`, 14, 118);
  
    // Itemized List Table
    const items = order.items || [
      { name: "Item 1", quantity: 1, price: 500 },
      { name: "Item 2", quantity: 2, price: 750 },
    ]; // Dummy items for placeholder
  
    const tableData = items.map((item, index) => [
      index + 1,
      item.product.productName,
      item.quantity,
      `₹${item.price.toFixed(2)}`,
      `₹${(item.quantity * item.price).toFixed(2)}`,
    ]);
  
    doc.autoTable({
      startY: 130,
      head: [["#", "Products", "Quantity", "Unit Price", "Total Price"]],
      body: tableData,
      theme: "grid",
    });
  
    // Total Amount
    doc.setFontSize(12);
    const finalY = doc.lastAutoTable.finalY + 10; // Position below the table
    doc.text(`Total: ₹${Math.round(order.totalAmount)}`, 150, finalY);
  
    // Footer
    doc.setFontSize(10);
    doc.text("Thank you for your business!", 14, finalY + 20);
    doc.text("If you have any questions, please contact us at support@StepUp.com", 14, finalY + 26);
  
    // Save PDF
    doc.save(`Invoice-${orderId}.pdf`);
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
                  id="invoice"
                  className="relative w-full flex flex-col py-3 border-b border-gray-400"
                >
                  <p>
                    Placed At: {new Date(order.placedAt).toLocaleDateString()}
                  </p>
                  <p>Total Amount: ₹{Math.round(order.totalAmount)}</p>
                  <div>
                    <p className="flex items-center">
                      Payment Method: {order.paymentMethod}
                      {" - "}
                      {order.paymentMethod === "razorPay" && (
                        <span
                          className={`px-3 py-1 rounded flex items-center gap-1 ${
                            order.paymentStatus === "Pending"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {"  "}
                          {order.paymentStatus === "Pending" ? (
                            <>
                              <BiTimeFive /> Pending
                            </>
                          ) : (
                            <>
                              <IoIosCheckmarkCircle /> {order.paymentStatus}
                            </>
                          )}
                        </span>
                      )}
                    </p>
                  </div>
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

                  {/* buttons */}
                  <div className="absolute right-0 flex flex-col gap-3">
                    {!order.isCancelled && (
                      <button
                        className="btn"
                        onClick={() => handleDownloadInvoice(order._id)}
                      >
                        <IoMdDownload /> Invoice
                      </button>
                    )}
                    {order.paymentMethod === "razorPay" &&
                    order.paymentStatus === "Pending" &&
                    !order.isCancelled ? (
                      <button
                        className="btn"
                        onClick={() =>
                          handleRetryPayment(
                            order._id,
                            order.totalAmount,
                            order.shippingAddress.phonenumber
                          )
                        }
                      >
                        <IoMdRefresh /> Retry Payment
                      </button>
                    ) : null}
                  </div>
                  <hr className="my-4" />

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
