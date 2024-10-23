import React from "react";
import Navbar from "../../../components/user_components/navbar/Navbar";
import SettingsSidebar from "../../../components/user_components/settings_sidebar/SettingsSidebar";

const DeliveryAddresses = () => {
  return (
    <div className="text-black font-clash-display h-screen">
      <Navbar />

      <div className="pt-14 px-36">
        <div className="flex gap-48">
          <SettingsSidebar />

          <div>
            <h1 className="text-2xl">Saved Delivery Addresses</h1>

            <p className="text-md">You currently don't have any saved delivery addresses.Add an address here to be pre-filled for quicker checkout</p>
            <button className="btn rounded-full w-[200px] text-white">
                Add Address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddresses;
