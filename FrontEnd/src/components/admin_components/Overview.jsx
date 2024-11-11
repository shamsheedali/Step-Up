import React, { useEffect, useState } from "react";
import { IoMdPricetag } from "react-icons/io";
import { BsFillBarChartFill } from "react-icons/bs";
import { TiShoppingCart } from "react-icons/ti";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import { useSelector } from "react-redux";
import { getOrders } from "../../api/order";

// Register components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

const Overview = () => {
  const [totalSalesCount, setTotalSalesCount] = useState(0);
  const [overallOrderAmount, setOverallOrderAmount] = useState(0);
  const [overallDiscount, setOverallDiscount] = useState(0);
  const [revenueData, setRevenueData] = useState([]);
  const [costData, setCostData] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { allOrders } = await getOrders();

        // Perform calculations
        const totalCount = allOrders.length;
        const totalAmount = allOrders.reduce((acc, order) => acc + order.totalAmount, 0);
        const totalDiscount = allOrders.reduce((acc, order) => acc + order.discountApplied, 0);

        setTotalSalesCount(totalCount);
        setOverallOrderAmount(totalAmount);
        setOverallDiscount(totalDiscount);

        // Calculate monthly revenue and costs
        const monthlyData = allOrders.reduce((acc, order) => {
          const month = new Date(order.placedAt).toLocaleString("default", { month: "short" });
          
          if (!acc[month]) {
            acc[month] = { revenue: 0, cost: 0 };
          }

          acc[month].revenue += order.totalAmount;
          acc[month].cost += 100; // Assuming 'cost' field exists in each order

          return acc;
        }, {});

        // Set labels, revenueData, and costData for the chart
        const chartLabels = Object.keys(monthlyData);
        const chartRevenueData = chartLabels.map(month => monthlyData[month].revenue);
        const chartCostData = chartLabels.map(month => monthlyData[month].cost);

        setLabels(chartLabels);
        setRevenueData(chartRevenueData);
        setCostData(chartCostData);

      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const lineChartData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Revenue",
        data: [5000, 7000, 8000, 6500, 9000, 12000],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "#cddf73",
        borderWidth: 2,
        tension: 0.3, // Smooths the line curve
      },
      {
        label: "Cost",
        data: [3000, 4000, 5000, 4500, 6000, 7500],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "#8c74c5",
        borderWidth: 2,
        tension: 0.3, // Smooths the line curve
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Revenue and Cost Over Time",
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide x-axis grid lines
        },
      },
      y: {
        grid: {
          display: false, // Hide y-axis grid lines
        },
      },
    },
  };

  return (
    <div className="absolute top-14 right-0 w-[1110px] h-[91vh]">
      <div className="flex p-5 gap-3">
        <div className="w-[70%] flex flex-col gap-5">
          {/* Left side */}
          <div className="flex justify-between">
            <div className="px-12 py-6 rounded-md font-bold flex flex-col gap-3 bg-[#DAEAF0]">
              <div className="flex items-center gap-2">
                <IoMdPricetag className="bg-white text-4xl rounded-md p-1" />
                <h2>Total Sales</h2>
              </div>
              <h1>₹{Math.round(overallOrderAmount)}</h1>
            </div>
            <div className="px-12 py-6 rounded-md font-bold flex flex-col gap-3 bg-[#cddf73]">
              <div className="flex items-center gap-2">
                <BsFillBarChartFill className="bg-white text-4xl rounded-md p-1" />
                <h2>Total Profit</h2>
              </div>
              <h1>₹{Math.round(overallOrderAmount - overallDiscount)}</h1>
            </div>
            <div className="px-12 py-6 rounded-md font-bold flex flex-col gap-3 bg-[#8c74c5]">
              <div className="flex items-center gap-2">
                <TiShoppingCart className="bg-white text-4xl rounded-md p-1" />
                <h2>Total Orders</h2>
              </div>
              <h1>{totalSalesCount}</h1>
            </div>
          </div>

          {/* Chart */}
          <div className="flex justify-center items-center w-full h-full bg-white p-5 rounded-lg shadow-md">
            <Line data={lineChartData} options={chartOptions} />
          </div>

          {/* Top selling products */}
          <div>
            <h1>Top Selling Products</h1>
            {/* You can add details of top-selling products here */}
          </div>
        </div>
        <div className="bg-blue-500 w-[30%]">{/* Right side content */}</div>
      </div>
    </div>
  );
};

export default Overview;
