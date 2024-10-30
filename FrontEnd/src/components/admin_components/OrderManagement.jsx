import React, { useEffect, useState } from "react";
import { getOrders } from "../../api/order";

const OrderManagement = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [openDropdowns, setOpenDropdowns] = useState({}); // Track open dropdowns by order ID

  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const getAllOrders = async () => {
      setLoading(true);
      const { allOrders } = await getOrders();
      setOrders(allOrders);
      setLoading(false);
    };
    getAllOrders();
  }, []);

  const toggleDropdown = (orderId) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  return (
    <div className="absolute top-14 right-0 w-[1110px]">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-[#1f2937]">
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
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Created At</th>
              <th scope="col" className="px-6 py-3">Payment Method</th>
              <th scope="col" className="px-6 py-3">Payment Status</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Details</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center">Loading...</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <div className="ps-3">
                      <div className="text-base font-semibold">{order?.shippingAddress?.username}</div>
                      <div className="font-normal text-gray-500">{order?.shippingAddress?.phonenumber}</div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    {new Date(order.placedAt).toDateString()}
                  </td>
                  <td className="px-6 py-4">{order.paymentMethod}</td>
                  <td className="px-6 py-4">{order.paymentStatus}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div
                        className={`h-2.5 w-2.5 rounded-full ${
                          order.status === "active" ? "bg-green-500" : "bg-red-500"
                        } me-2`}
                      ></div>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <h1 className=" underline text-green-400 cursor-pointer"
                    onClick={toggleModal}
                    >Details</h1>
                </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleDropdown(order._id)}
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      type="button"
                    >
                      Change Status
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
                        className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                      >
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                          <li>
                            <button
                              onClick={() => handleStatusChange(order._id, "Shipped")}
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Shipped
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleStatusChange(order._id, "Delivered")}
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              Delivered
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleStatusChange(order._id, "Cancelled")}
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
              ))
            )}
          </tbody>
        </table>
      </div>





       {/* Modal */}
       {isOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto h-full w-full bg-black bg-opacity-50">
    <div className="relative p-4 w-full max-w-2xl">
      {/* Modal container */}
      <div className="bg-white rounded-lg shadow dark:bg-gray-700 h-[80vh] overflow-y-auto">
        {/* Modal header with close button */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Order Details
          </h3>
          <button
            onClick={toggleModal}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
        </div>

        {/* Modal body - Empty for you to add content */}
        <div className="p-4 md:p-5 space-y-4">
          {orders.length === 0 && <p>No orders available.</p>}
          {orders.map((order) => (
            <div key={order._id} className="w-full flex flex-col py-3 border-b border-gray-400">
              <p>Placed At: {new Date(order.placedAt).toLocaleDateString()}</p>
              <p>Total Amount: ₹{order.totalAmount}</p>
              <hr className="my-4" />

              {/* Check if items exist and map through them */}
              {Array.isArray(order.items) && order.items.length > 0 ? (
                order.items.map((item) => (
                  <div key={item._id} className="flex justify-between items-center border-b border-gray-200 py-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="text-md font-medium">{item.product?.productName || "No product name"}</h3>
                        <p className="text-sm text-gray-500">{item.product?.category || "No category"}</p>
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
                ))
              ) : (
                <p className="text-gray-500">No items found in this order.</p>
              )}

              <button className="btn mt-4 px-4 py-2 text-white bg-black rounded-lg transition" onClick={() => handleCancelOrder(order._id)}>
                Cancel Order
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default OrderManagement;
