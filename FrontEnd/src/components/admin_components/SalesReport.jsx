import React, { useEffect, useState } from "react";
import { getOrders, salesReport } from "../../api/order";

const SalesReport = () => {
  const [selectedFilter, setSelectedFilter] = useState("Sort");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [totalSalesCount, setTotalSalesCount] = useState(0);
  const [overallOrderAmount, setOverallOrderAmount] = useState(0);
  const [overallDiscount, setOverallDiscount] = useState(0);
  const [orders, setOrders] = useState([]);

  // Function to calculate total sales, amount, and discount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch all orders using getOrders function
        const { allOrders } = await getOrders();
        setOrders(allOrders);

        // Perform calculations
        const totalCount = allOrders.length;
        const totalAmount = allOrders.reduce(
          (acc, order) => acc + order.amount,
          0
        );
        const totalDiscount = allOrders.reduce(
          (acc, order) => acc + order.discount,
          0
        );

        // Set calculated values
        setTotalSalesCount(totalCount);
        setOverallOrderAmount(totalAmount);
        setOverallDiscount(totalDiscount);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const filters = ["daily", "weekly", "monthly"];

  // Function to fetch report based on filter
  const handleFilterSelect = async (filter) => {
    setSelectedFilter(filter);
    toggleDropdown();

    const dateRange = { period: filter };
    try {
      const allReport = await salesReport(dateRange);
      setReports(allReport);
      console.log("report", reports);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  // Date filtering function
  const handleDateSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    const date = {
      startDate,
      endDate,
    };

    try {
      const allReport = await salesReport(date);
      setReports(allReport);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  return (
    <div className="absolute top-14 right-0 w-[1110px]">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg min-h-[30vh] h-fit">
        <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
          <div>
            <button
              id="dropdownRadioButton"
              onClick={toggleDropdown}
              className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            >
              <svg
                className="w-3 h-3 text-gray-500 dark:text-gray-400 me-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
              </svg>
              {selectedFilter}
              <svg
                className="w-2.5 h-2.5 ms-2.5"
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

            {dropdownOpen && (
              <div
                id="dropdownRadio"
                className="z-10 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 absolute"
              >
                <ul className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200">
                  {filters.map((filter) => (
                    <li key={filter}>
                      <div
                        onClick={() => handleFilterSelect(filter)}
                        className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                      >
                        <input
                          type="radio"
                          checked={selectedFilter === filter}
                          readOnly
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
                          {filter}
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={startDate}
              onChange={handleStartDateChange}
              className="px-2 bg-black py-1 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-white"
            />
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={endDate}
              onChange={handleEndDateChange}
              className="px-2 py-1 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black bg-black text-white"
            />
            <button
              type="submit"
              onClick={handleDateSubmit}
              className="py-1 px-3 bg-blue-700 text-white text-sm font-semibold rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-black"
            >
              Apply Date Range
            </button>
          </div>
        </div>

        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Total Sales Revenue
              </th>
              <th scope="col" className="px-6 py-3">
                Discount Applied
              </th>
              <th scope="col" className="px-6 py-3">
                Net Sales
              </th>
              <th scope="col" className="px-6 py-3">
                Number of Orders
              </th>
              <th scope="col" className="px-6 py-3">
                Total Items Sold
              </th>
            </tr>
          </thead>
          <tbody>
            {reports.dailyReport && reports.dailyReport.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No reports available.
                </td>
              </tr>
            ) : (
              reports.dailyReport &&
              reports.dailyReport.slice().reverse().map((report) => (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {new Date(report._id).toLocaleDateString("en-GB")}
                  </th>
                  <td className="px-6 py-4">{report.totalRevenue}</td>
                  <td className="px-6 py-4">{report.totalDiscount}</td>
                  <td className="px-6 py-4">{report.netSales}</td>
                  <td className="px-6 py-4">{report.orderCount}</td>
                  <td className="px-6 py-4">{report.itemsSold}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* cards */}
      <div className="flex justify-around mt-5">
  <div className="p-5 rounded-md text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    <h1>Total Sales Count</h1>
    <h2 className="text-white">
      {reports?.overallSummary?.orderCount || 0} Orders
    </h2>
  </div>
  <div className="p-5 rounded-md text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    <h1>Overall Order Amount</h1>
    <h2 className="text-white">₹{reports?.overallSummary?.totalRevenue || 0}</h2>
  </div>
  <div className="p-5 rounded-md text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    <h1>Overall Discount</h1>
    <h2 className="text-white">
      ₹{reports?.overallSummary?.totalDiscount || 0}
    </h2>
  </div>
</div>


      <div className="flex justify-center gap-5 mt-5">
        <button className="btn">Download PDF</button>
        <button className="btn">Download Excel</button>
      </div>
    </div>
  );
};

export default SalesReport;