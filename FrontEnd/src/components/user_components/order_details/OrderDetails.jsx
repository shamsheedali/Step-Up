import React, { useEffect, useState } from "react";
import {
  cancelOrder,
  getOrderProducts,
  getUserOrders,
} from "../../../api/order";
import { fetchCategories } from "../../../api/category";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { IoMdDownload, IoMdRefresh } from "react-icons/io";
import { BiTimeFive } from "react-icons/bi";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { toast } from "react-toastify";

const OrderDetails = ({ id }) => {
  const { uid, username, email } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reRender, setReRender] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true);
        const { allOrders } = await getUserOrders(uid);
        const { data: categoryData } = await fetchCategories();
        setCategories(categoryData);
        const ordersWithProducts = await Promise.all(
          allOrders.reverse().map(async (order) => {
            const { data: productData } = await getOrderProducts(order._id);
            return {
              ...order,
              items: productData.items || [],
            };
          })
        );
        setOrders(ordersWithProducts);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
        setReRender(false);
      }
    };

    getOrders();
  }, [uid, reRender]);

  //Cancel Order
  const handleCancelOrder = async (
    orderId,
    totalAmount,
    paymentMethod,
    paymentStatus
  ) => {
    if (order.status === "Delivered") {
      toast.success("Requested to Return Order");
      return;
    }
    await cancelOrder(orderId, uid);
    if (
      ["razorPay", "Wallet"].includes(order.paymentMethod) &&
      ["Completed", "Refunded"].includes(order.paymentStatus)
    ) {
      toast.success(`${Math.round(totalAmount)} Refunded to Your Wallet`);
    }
    setReRender(true);
  };

  //Download invoice
  const handleDownloadInvoice = async (orderId) => {
    const order = orders.find((o) => o._id === orderId);
    const doc = new jsPDF();

    // Header Section
    doc.setFontSize(18);
    doc.text("StepUp", 14, 20);
    doc.setFontSize(12);
    doc.text("Address Line 1", 14, 28);
    doc.text("Address Line 2", 14, 34);
    doc.text("City, ZIP Code", 14, 40);
    doc.text("Phone: 123-456-7890", 14, 46);
    doc.text("Email: info@StepUp.com", 14, 52);

    // Title and Date
    doc.setFontSize(16);
    doc.text("Invoice", 170, 20, { align: "right" });
    doc.setFontSize(10);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 170, 26, {
      align: "right",
    });
    doc.text(`Invoice No: ${orderId}`, 170, 32, { align: "right" });

    // User Information Section
    doc.setFontSize(12);
    doc.text("Bill To:", 14, 70);
    doc.text(`Client Name: ${username || "John Doe"}`, 14, 76);
    doc.text(
      `Client Address: ${order.shippingAddress.postcode}, ${
        order.shippingAddress.town || "123 Client St."
      }`,
      14,
      82
    );
    doc.text(`Client Email: ${email || "client@example.com"}`, 14, 88);

    // Order Summary
    doc.text("Order Summary", 14, 100);
    doc.text(
      `Placed At: ${new Date(order.placedAt).toLocaleDateString()}`,
      14,
      106
    );
    doc.text(`Payment Method: ${order.paymentMethod}`, 14, 112);
    doc.text(`Total Amount: ${Math.round(order.totalAmount)}`, 14, 118);

    const items = order.items || [
      { product: { productName: "Item 1" }, quantity: 1, price: 500 },
      { product: { productName: "Item 2" }, quantity: 2, price: 750 },
    ];

    const tableData = items.map((item, index) => [
      index + 1,
      item.product.productName,
      item.quantity,
      `${item.price.toFixed(2)}`,
      `${(item.quantity * item.price).toFixed(2)}`,
    ]);

    const discount = order.discountApplied || 0;
    const deliveryCharge = 100;

    if (discount > 0) {
      tableData.push(["", "Discount", "", "", `-${discount.toFixed(2)}`]);
    }

    if (deliveryCharge > 0) {
      tableData.push([
        "",
        "Delivery Charge",
        "",
        "",
        `${deliveryCharge.toFixed(2)}`,
      ]);
    }

    // const totalAmount = Math.round(
    //   order.totalAmount - discount + deliveryCharge
    // );
    tableData.push(["", "Total", "", "", `${order.totalAmount.toFixed(2)}`]);

    doc.autoTable({
      startY: 130,
      head: [["No", "Products", "Quantity", "Unit Price", "Total Price"]],
      body: tableData,
      theme: "grid",
    });

    doc.setFontSize(10);
    const pageWidth = doc.internal.pageSize.getWidth();
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text("Thank you for your business!", pageWidth / 2, finalY, {
      align: "center",
    });
    doc.text(
      "If you have any questions, please contact us at support@StepUp.com",
      pageWidth / 2,
      finalY + 6,
      { align: "center" }
    );

    doc.save(`Invoice-${orderId}.pdf`);
  };

  const order = orders.find((order) => order._id === id);
  console.log("order", order);

  if (loading)
    return (
      <div className="skeleton animate-pulse bg-gray-400 w-[100%] h-[450px]"></div>
    );
  if (!order) return <p>Order not found.</p>;

  return (
    <div>
      <div
        className="flex rounded-lg"
        style={{ boxShadow: "5px 4px 8px #00000099" }}
      >
        {/* Left section */}
        <div className="bg-[#c4c4c4] w-[50%] h-[450px] p-10 text-md relative rounded-s-lg">
          <h1 className="text-2xl mb-3">Order Details</h1>
          <h1>OrderId: {order._id}</h1>
          <h1>Order Date: {new Date(order.placedAt).toLocaleDateString()}</h1>
          <div>
            <h1>Delivery Address:</h1>
            <div className="pl-5 border-b border-black w-fit">
              <p>
                {order.shippingAddress.postcode}, {order.shippingAddress.street}
              </p>
              <p>{order.shippingAddress.town}</p>
              <p>{order.shippingAddress.phonenumber}</p>
            </div>
          </div>
          <h1 className="mt-3">Total Amount: ₹{order.totalAmount}</h1>
          <p className="flex items-center">
            Payment Method: {order.paymentMethod}
            {" - "}
            {(order.paymentMethod === "razorPay" || order.paymentMethod === "Wallet") && (
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

          <h1 className="flex items-center">
            Status:
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
              } ms-2 me-1`}
            ></div>{" "}
            {order.status}
          </h1>

          {!order.isCancelled && (
            <button
              className="btn py-2 absolute bottom-5 w-[80%] text-white bg-black"
              onClick={() => handleDownloadInvoice(order._id)}
            >
              <IoMdDownload /> Invoice
            </button>
          )}
        </div>

        {/* line */}
        <div className="w-[2px] h-auto bg-black rounded-md"></div>

        {/* Right section */}
        <div className="bg-[#c4c4c4] w-[50%] h-[450px] pt-10 p-4 relative rounded-e-lg">
          <h1 className="text-2xl mb-3">Product Details</h1>
          <div className="h-[250px] px-[12px] overflow-y-auto border-b border-black">
            {order.items.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center py-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      item.product?.images[0] ||
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
                      {categories.find(
                        (category) => category._id === item.product?.category
                      )?.name || ""}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold">₹{item.price}</p>
                  <p className="text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between px-4 pt-3">
            <h1>Grand Total :</h1>
            <h1 className="font-bold">₹{order.totalAmount}</h1>
          </div>

          <button
            className={`btn py-2 absolute bottom-5 w-[94%] tracking-widest ${
              order.isCancelled ? "text-black" : "text-white"
            } bg-black rounded-lg transition`}
            onClick={() =>
              handleCancelOrder(
                order._id,
                order.totalAmount,
                order.paymentMethod,
                order.paymentStatus
              )
            }
            disabled={order.isCancelled}
          >
            {order.status === "Delivered"
              ? "Request Return"
              : order.isCancelled
              ? "Order Cancelled"
              : "Cancel Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
