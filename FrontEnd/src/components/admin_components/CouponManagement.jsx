import React, { useEffect, useState } from "react";
import { createCoupon, deleteCoupon, fetchCoupons } from "../../api/coupons";
import { fetchCategories } from "../../api/category";

const CouponManagement = () => {
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [couponId, setCouponId] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [addCouponData, setAddCouponData] = useState({
    couponName: "",
    couponCode: "",
    discountType: "",
    discountValue: "",
    minOrderAmount: "",
    maxDiscount: "",
    usageLimit: "",
    expirationDate: "",
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    if (type === "checkbox") {
      setAddCouponData((prevData) => ({ ...prevData, [name]: checked }));
    } else {
      setAddCouponData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleOptionModal = (id) => {
    setIsOptionModalOpen(!isOptionModalOpen);
    setCouponId(id);
  };

  useEffect(() => {
    const getCoupons = async () => {
      const allCoupons = await fetchCoupons();
      setCoupons(allCoupons);
    };
    getCoupons();
  }, []);

  //add coupon submit
  const handleCouponSubmit = async (e) => {
    e.preventDefault();

    const couponData = {
      name: addCouponData.couponName,
      code: addCouponData.couponCode,
      discountType: addCouponData.discountType,
      discountValue: addCouponData.discountValue,
      minimumPurchase: addCouponData.minOrderAmount,
      maxDiscount: addCouponData.maxDiscount,
      expiryDate: addCouponData.expirationDate,
    };

    const {coupon} = await createCoupon(couponData);
    toggleModal();
    setCoupons((prevCoupons) => [...prevCoupons, coupon]);
    setAddCouponData({
      couponName: "",
      couponCode: "",
      discountType: "",
      discountValue: "",
      minOrderAmount: "",
      maxDiscount: "",
      usageLimit: "",
      expirationDate: "",
    });
  };

  //delete coupon
  const handleDeleteCoupon = async(id) => {
    await deleteCoupon(id);
    setCoupons(coupons.filter(coupon => coupon._id !== id));
    toggleOptionModal();
  }

  return (
    <div className="absolute top-14 right-0 w-[1110px]">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex items-center px-9 justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-[#1f2937]">
          <h1 className="text-white text-2xl">Coupons</h1>
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="table-search-users"
              className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search for coupon"
            />
          </div>
          <button
            className="btn bg-blue-700 text-white hover:bg-blue-800 px-4 py-2 rounded-lg"
            onClick={toggleModal}
          >
            Add Coupon
          </button>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Code
              </th>
              <th scope="col" className="px-6 py-3">
                Discount Type
              </th>
              <th scope="col" className="px-6 py-3">
                Discount Value
              </th>
              <th scope="col" className="px-6 py-3">
                Mininum Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Max Discount
              </th>
              <th scope="col" className="px-6 py-3">
                Expiry Date
              </th>
              {/* <th scope="col" className="px-6 py-3">Min Purchase</th> */}
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr
                   key={coupon._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <div className="ps-3">
                      {/* <div className="text-base font-semibold">name</div> */}
                      <div className="font-normal">{coupon.name}</div>
                    </div>
                  </th>
                  <td className="px-6 py-4">{coupon.code}</td>
                  <td className="px-6 py-4">{coupon.discountType}</td>
                  <td className="px-6 py-4">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}%`
                      : coupon.discountValue}
                  </td>
                  <td className="px-6 py-4">{coupon.minimumPurchase}</td>
                  <td className="px-6 py-4">{coupon.usedCount}</td>
                  <td className="px-6 py-4">
                    {new Date(coupon.expiryDate).toDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div
                        className={`h-2.5 w-2.5 rounded-full ${
                          coupon.status ? "bg-green-500" : "bg-red-500"
                        } me-2`}
                      ></div>
                      {coupon.status ? "Active" : "In Active"}
                    </div>
                  </td>
                  <td className="px-6 py-4 flex">
                    <button onClick={() => toggleOptionModal(coupon._id)} className="underline text-blue-500" >Options</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Coupon Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50"
          onClick={toggleModal}
        >
          <div
            className="relative p-4 w-full max-w-md max-h-full bg-white rounded-lg shadow dark:bg-gray-700 h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add New Coupon
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 rounded-lg p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={toggleModal}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 8.293l5.646-5.647a.5.5 0 0 1 .708.708L10.707 9l5.647 5.646a.5.5 0 0 1-.708.708L10 9.707l-5.646 5.647a.5.5 0 0 1-.708-.708L9.293 9 3.646 3.354a.5.5 0 0 1 .708-.708L10 8.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCouponSubmit}>
              <div className="p-6 space-y-6">
                <div>
                  <label
                    htmlFor="couponName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Coupon Name
                  </label>
                  <input
                    type="text"
                    id="couponName"
                    name="couponName"
                    value={addCouponData.couponName}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="couponCode"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    id="couponCode"
                    name="couponCode"
                    value={addCouponData.couponCode}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="discountType"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Discount Type
                  </label>
                  <select
                    id="discountType"
                    value={addCouponData.discountType}
                    onChange={handleChange}
                    name="discountType"
                    required
                    className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  >
                    <option value="">Select Type</option>
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="discountValue"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Discount Value
                  </label>
                  <input
                    type="number"
                    id="discountValue"
                    value={addCouponData.discountValue}
                    onChange={handleChange}
                    name="discountValue"
                    required
                    className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="minOrderAmount"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Minimum Order Amount
                  </label>
                  <input
                    type="number"
                    id="minOrderAmount"
                    value={addCouponData.minOrderAmount}
                    onChange={handleChange}
                    name="minOrderAmount"
                    className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="maxDiscount"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Max Discount for %
                  </label>
                  <input
                    type="number"
                    id="maxDiscount"
                    value={addCouponData.maxDiscount}
                    onChange={handleChange}
                    name="maxDiscount"
                    className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="expirationDate"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    id="expirationDate"
                    value={addCouponData.expirationDate}
                    onChange={handleChange}
                    name="expirationDate"
                    required
                    className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end p-6 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  type="button"
                  className="text-gray-500 bg-transparent hover:bg-gray-200 rounded-lg px-5 py-2.5 text-sm dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={toggleModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-5 py-2.5 text-sm dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Add Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Option Modal */}
      {isOptionModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50"
          onClick={toggleOptionModal}
        >
          <div
            className="relative p-4 w-full max-w-md max-h-full bg-white rounded-lg shadow dark:bg-gray-700 h-[30vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                More Options
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 rounded-lg p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={toggleOptionModal}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 8.293l5.646-5.647a.5.5 0 0 1 .708.708L10.707 9l5.647 5.646a.5.5 0 0 1-.708.708L10 9.707l-5.646 5.647a.5.5 0 0 1-.708-.708L9.293 9 3.646 3.354a.5.5 0 0 1 .708-.708L10 8.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="flex justify-center items-center gap-10 h-[15vh]">
              <button className="btn">In Activate</button>
              <button className="btn bg-red-500 text-white hover:bg-red-700" onClick={() => handleDeleteCoupon(couponId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponManagement;
