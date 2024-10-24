import React from "react";
import Navbar from "../../../components/user_components/navbar/Navbar";
import BagSection from "../../../components/user_components/bag_item_section/BagSection";
import Footer from "../../../components/user_components/footer/Footer";

const Bag = () => {
  return (
    <div className="min-h-screen h-auto">
      <Navbar />
      <div className="pt-11 px-32 flex gap-10">
        <div>
          <h1 className="text-3xl font-bold">Bag</h1>

          <BagSection />
          <BagSection />
        </div>


        <div className="w-full flex flex-col gap-3">
        <h1 className="text-2xl mb-5">Summary</h1>

          <div className="flex justify-between">
            <h1>Subtotal</h1>
            <h1>₹56 285.00</h1>
          </div>
          <div className="flex justify-between">
            <h1>Estimated Delivery & Handling</h1>
            <h1>₹1 250.00</h1>
          </div>
          <hr />
          <div className="flex justify-between">
            <h1>Total</h1>
            <h1>₹57 535.00</h1>
          </div>
          <hr />

          <button className="btn rounded-full mt-3">Checkout</button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Bag;
