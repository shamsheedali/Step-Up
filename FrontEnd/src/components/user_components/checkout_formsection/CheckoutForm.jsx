import React, { useEffect, useState } from "react";
import { getAddress, getDefaultAddress } from "../../../api/address";
import { IoCashOutline } from "react-icons/io5";
import { SiRazorpay } from "react-icons/si";
import { LuWallet } from "react-icons/lu";
import { useSelector } from "react-redux";

const CheckoutForm = () => {
  const uid = useSelector((state) => state.user.uid);

  const [address, setAddress] = useState([]);

  useEffect(() => {
    const getAllAddress = async () => {
        try {
          const { allAddress } = await getAddress(uid);
          const defaultAddress = await getDefaultAddress(uid); 
      
          console.log("All Addresses:", allAddress);
          console.log("Default Address:", defaultAddress);
      
          if (Array.isArray(defaultAddress) && defaultAddress.length > 0) {
            setAddress(defaultAddress[0]); 
          } else if (allAddress.length > 0) {
            setAddress(allAddress[0]);
          } else {
            setAddress(null);
          }
          
        } catch (error) {
          console.error("Error fetching addresses:", error);
        }
      };
      

    if (uid) {
      getAllAddress();
    }
  }, [uid]);

  return (
    <div className="w-[720px] mt-5">
      <h1 className="text-xl">Shipping Address</h1>
      <div className="flex">
        {!address ? (
          <p className="text-md">
            You currently don't have any saved delivery addresses. Add an
            address here to be pre-filled for quicker checkout.
          </p>
        ) : (
          <div className="flex mt-8 pb-2">
            <div>
              <h1 className="text-gray-500">{address.username}</h1>
              <h1 className="text-gray-500">{address.street}</h1>
              <h1 className="text-gray-500">{address.village}</h1>
              <h1 className="text-gray-500">
                {address.town}, <span>{address.postcode}</span>
              </h1>
              <h1 className="text-gray-500">{address.phonenumber}</h1>
            </div>
            <h3
              className="underline font-bold cursor-pointer"
              onClick={() => openEditModal(address._id)}
            >
              Edit
            </h3>
          </div>
        )}
      </div>

      <hr />

      {/* Code Section */}
      <h1 className="text-xl">Have a promo code?</h1>
      <div class="relative">
        <label
          htmlFor="promoCode"
          class="absolute -top-2 left-2 bg-white px-1 text-sm text-gray-500"
        >
          Promo
        </label>
        <input
          id="promoCode"
          name="promoCode"
          type="text"
          class="block w-full rounded-md border border-black px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black sm:text-sm"
          required
        />

        {/* Select payment type */}
        <h1 className="text-xl">How would you like to pay?</h1>
        <div className="w-[300px] h-[20px] px-4 py-6 rounded-lg text-lg justify-start gap-3 items-center border border-black flex cursor-pointer">
          <IoCashOutline />
          <h1>Cash on delivery</h1>
        </div>
        <div className="w-[300px] h-[20px] px-4 py-6 rounded-lg text-lg justify-start gap-3 items-center border border-black flex cursor-pointer">
          <SiRazorpay />
          <h1>Razor Pay</h1>
        </div>
        {/* <div className="w-[300px] h-[20px] px-4 py-6 rounded-lg text-lg justify-start gap-3 items-center border border-black flex cursor-pointer">
          <LuWallet />

          <h1>Wallet</h1>
        </div> */}

        <button className="btn rounded-full mt-3 w-full bg-black text-white tracking-[1px]">
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutForm;
