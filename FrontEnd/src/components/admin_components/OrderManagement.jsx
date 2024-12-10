import React, { useEffect, useState } from "react";
import {
  cancelOrder,
  changeStatus,
  getOrderProducts,
  getOrders,
  orderLimit,
} from "../../api/order";
import { fetchProducts } from "../../api/product";
import { fetchUsers } from "../../api/admin";
import Pagination from "../user_components/pagination/Pagination";
import { toast } from "react-toastify";
import { fetchCategories } from "../../api/category";
import { IoMdDownload, IoMdRefresh } from "react-icons/io";
import { BiTimeFive } from "react-icons/bi";
import { IoIosCheckmarkCircle } from "react-icons/io";

const OrderManagement = () => {
  const [loading, setLoading] = useState(false);
  const [reRender, setReRender] = useState(false);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openDropdowns, setOpenDropdowns] = useState({});

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;
  const [totalOrders, setTotalOrders] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrderProducts, setSelectedOrderProducts] = useState([]);

  //ids
  const [orderId, setOrderId] = useState("");
  const [userId, setUserId] = useState("");

  const [orderCancelDisable, setOrderCancelDisable] = useState(false);
  const [orderStatus, setOrderStatus] = useState("");

  const toggleModal = (orderId, userId, isCancelled, orderStatus) => {
    setIsOpen(!isOpen);
    setOrderId(orderId);
    setUserId(userId);
    setOrderCancelDisable(isCancelled);
    setOrderStatus(orderStatus);
  };

  useEffect(() => {
    const getAllOrders = async () => {
      setLoading(true);
      const { allOrders, totalOrders } = await orderLimit(
        currentPage,
        entriesPerPage
      );
      const allUsers = await fetchUsers();
      setUsers(allUsers);
      setOrders(allOrders);
      setTotalOrders(totalOrders);
      setLoading(false);
    };
    getAllOrders();
    setReRender(false);
  }, [reRender, currentPage]);

  useEffect(() => {
    const getAllProducts = async () => {
      const { allProducts } = await fetchProducts();
      const { data } = await fetchCategories();
      setCategories(data);
      setProducts(allProducts);
    };
    getAllProducts();
  }, []);

  //get details of order
  const handleShowDetails = (order) => {
    const orderProductIds = order.items.map((item) => item.product);
    const orderProducts = products.filter((product) =>
      orderProductIds.includes(product._id)
    );

    // Map with quantities
    const orderProductsWithQty = orderProducts.map((product) => ({
      ...product,
      quantity: order.items.find((item) => item.product === product._id)
        .quantity,
    }));

    setSelectedOrderProducts(orderProductsWithQty);
  };

  const toggleDropdown = (orderId) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  //change status
  const handleStatusChange = async (orderId, status) => {
    await changeStatus(orderId, status);
    toggleDropdown(orderId);
    setReRender(true);
  };

  //cancel order
  const handleCancelOrder = async (orderId, uid) => {
    await cancelOrder(orderId, uid);
    toggleModal();
    setReRender(true);
  };

  return (
    <div className="absolute top-14 right-0 w-[1110px]">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 py-4 px-5 bg-white dark:bg-[#1f2937]">
          <h1 className="text-white text-2xl">Orders</h1>
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              id="table-search-orders"
              className="block p-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search for orders"
            />
          </div>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Ordered At
              </th>
              <th scope="col" className="px-6 py-3">
                Total Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Payment Method
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Details
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const username =
                  users.find((user) => user._id === order.user)?.username ||
                  "User not found";

                return (
                  <tr
                    key={order._id}
                    className={`border-b ${
                      order.isCancelled ? "bg-[#853c3c]" : "bg-gray-800"
                    }  dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600`}
                  >
                    <th
                      scope="row"
                      className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <div className="ps-3">
                        <div className="text-base font-semibold">
                          {username}
                        </div>
                        <div className="font-normal text-gray-500">
                          {order._id}
                        </div>
                      </div>
                    </th>
                    <td className="px-6 py-4">
                      {new Date(order.placedAt).toDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center text-black">
                      <h1
                        className={`${
                          order.paymentStatus === "Pending"
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                      >
                        {order.paymentMethod}
                      </h1>
                    </td>
                    <td className="px-6 py-4">
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
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <h1
                        className="underline text-green-400 cursor-pointer"
                        onClick={() => {
                          toggleModal(
                            order._id,
                            order.user,
                            order.isCancelled,
                            order.status
                          );
                          handleShowDetails(order);
                        }}
                      >
                        Details
                      </h1>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleDropdown(order._id)}
                        className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
                          order.isCancelled || order.status === "Delivered"
                            ? "hidden"
                            : ""
                        }`}
                        type="button"
                      >
                        Status
                        <svg
                          className="w-2.5 h-2.5 ms-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 10 6"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 4 4 4-4"
                          />
                        </svg>
                      </button>

                      {/* Dropdown menu */}
                      {openDropdowns[order._id] && (
                        <div
                          id="dropdown"
                          className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-30 dark:bg-gray-700"
                        >
                          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                            <li>
                              <button
                                onClick={() =>
                                  handleStatusChange(order._id, "Processing")
                                }
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                Processing
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() =>
                                  handleStatusChange(order._id, "Shipped")
                                }
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                Shipped
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() =>
                                  handleStatusChange(order._id, "Delivered")
                                }
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                Delivered
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() =>
                                  handleStatusChange(order._id, "Cancelled")
                                }
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                Cancelled
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <Pagination
          className="mx-auto"
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalEntries={totalOrders}
          entriesPerPage={entriesPerPage}
        />
      </div>

      {/* New Modal */}
{isOpen && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div
      className="bg-transparent w-[80%] md:w-[60%] lg:w-[50%] h-[80%] rounded-lg overflow-hidden shadow-lg relative"
      style={{ width: "75%" }}
    >
      <div className="flex h-full">
        {/* Left section */}

        {(() => {
          const order = orders.find((order) => order._id === orderId);
          return (
            <>
              <div className="bg-gray-700 text-[#cccccc] w-[50%] h-full p-10 text-md relative rounded-s-lg overflow-auto">
                <h1 className="text-2xl mb-3">Order Details</h1>
                <h1>OrderId: {order._id}</h1>
                <h1>
                  Order Date:{" "}
                  {new Date(order.placedAt).toLocaleDateString()}
                </h1>
                <div>
                  <h1>Delivery Address:</h1>
                  <div className="pl-5 border-b border-black w-fit">
                    <p>
                      {order.shippingAddress.postcode},{" "}
                      {order.shippingAddress.street}
                    </p>
                    <p>{order.shippingAddress.town}</p>
                    <p>{order.shippingAddress.phonenumber}</p>
                  </div>
                </div>
                <h1 className="mt-3">
                  Total Amount: ₹{order.totalAmount}
                </h1>
                <p className="flex items-center">
                  Payment Method: {order.paymentMethod}
                  {" - "}
                  {(order.paymentMethod === "razorPay" ||
                    order.paymentMethod === "Wallet") && (
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
              </div>

              {/* Line Divider */}
              <div className="w-[2px] h-auto bg-black rounded-md"></div>

              {/* Right section */}
              <div className="bg-gray-700 text-[#cccccc] w-[50%] h-full pt-10 p-4 relative rounded-e-lg overflow-auto">
                {/* Close Button */}
                <button
                  onClick={toggleModal}
                  className="absolute right-3 top-3 text-white bg-black hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
                <h1 className="text-2xl mb-3">Product Details</h1>
                <div className="h-[250px] px-[12px] overflow-y-auto border-b border-black">
                  {Array.isArray(selectedOrderProducts) &&
                  selectedOrderProducts.length > 0 ? (
                    selectedOrderProducts.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between items-center py-4"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={
                              item.images[0] ||
                              "https://via.placeholder.com/150"
                            }
                            alt={item.productName || "Product Image"}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div>
                            <h3 className="text-md w-[190px] font-medium">
                              {item.productName || "No product name"}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {categories.find(
                                (category) =>
                                  category._id === item.category
                              )?.name || ""}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold">₹{item.price}</p>
                          <p className="text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No products found.</p>
                  )}
                </div>
                <div className="flex justify-between px-4 pt-3">
                  <h1>Grand Total :</h1>
                  <h1 className="font-bold">₹{order.totalAmount}</h1>
                </div>

                <button
                  className={`btn py-2 absolute bottom-5 w-[94%] tracking-widest ${
                    order.isCancelled ? "text-black" : "text-white"
                  } bg-black rounded-lg transition`}
                  onClick={() => handleCancelOrder(orderId, userId)}
                  disabled={orderCancelDisable}
                >
                  {orderStatus === "Delivered"
                    ? "Return Order"
                    : "Cancel Order"}
                </button>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default OrderManagement;
