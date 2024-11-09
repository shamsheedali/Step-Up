import React, { useEffect, useState } from "react";
import Navbar from "../../../components/user_components/navbar/Navbar";
import ProfileNavbar from "../../../components/user_components/profile_navbar/ProfileNavbar";
import { getUserWallet } from "../../../api/wallet";
import { useSelector } from "react-redux";

const Wallet = () => {
  const uid = useSelector((state) => state.user.uid);
  const [wallet, setWallet] = useState([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const getWallet = async () => {
      const { transactions } = await getUserWallet(uid);
      const totalBalance = transactions.reduce((acc, transaction) => {
        if (transaction.type === "Credit") {
          return acc + transaction.amount;
        } else if (transaction.type === "Debit") {
          return acc - transaction.amount;
        }
        return acc; 
      }, 0);  
      setBalance(totalBalance);
      console.log("Trax", totalBalance);
      setWallet(transactions);
    };
    getWallet();
  }, []);

  return (
    <div className="text-black min-h-screen h-fit">
      <Navbar />
      <ProfileNavbar />

      <div className="pt-8 px-36">
        <h1 className="text-2xl font-bold">Your Wallet</h1>
        <hr />

        {wallet.length === 0 ? (
          <p>No data available.</p>
        ) : (
          <div>
            <h2 className="text-lg">
              Your Balance : <span>₹{Math.round(balance)}</span>
            </h2>

            {/* table */}
            <div>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3">
                        D/C
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {wallet &&
                      wallet.map((data) => (
                        <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            {data.description}
                          </th>
                          <td className="px-6 py-4">
                            {new Date(data.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">{data.type}</td>
                          <td className="px-6 py-4">₹{Math.round(data.amount)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
