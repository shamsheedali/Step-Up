import React, { useEffect, useState } from "react";
import Navbar from "../../../components/user_components/navbar/Navbar";
import ProfileNavbar from "../../../components/user_components/profile_navbar/ProfileNavbar";
import { fetchCoupons } from "../../../api/coupons";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const getCoupons = async () => {
      const allCoupons = await fetchCoupons();
      setCoupons(allCoupons);
    };
    getCoupons();
  }, []);

  return (
    <div className="text-black min-h-screen h-fit">
      <Navbar />
      <ProfileNavbar />

      <div className="pt-8 px-36">
        <h1 className="text-2xl font-bold">Your Coupons</h1>
        <hr />

        {/* Coupon Section */}

        <div className="flex gap-10 pt-12">
          {coupons.map((coupon) => (
            <div className="border border-black w-fit p-6 rounded-md text-center">
              <h2 className="text-lg font-bold">{coupon.name}</h2>
              <h1>
                {/* {coupon.discountValue} */}
                {coupon.discountType === "percentage" ? `${coupon.discountValue}` : `₹${coupon.discountValue}`}
                {coupon.discountType === "percentage" ? "%" : ""} OFF
              </h1>
              <h3 className="text-md underline">{coupon.description}</h3>
              <h3>code :- {coupon.code}</h3>
              <button className="bg-black text-white py-2 px-8 rounded-md">
                Copy Code
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Coupons;
