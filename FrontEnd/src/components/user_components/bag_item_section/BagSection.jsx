import React from "react";
import img from "../../../assets/images/homepage/check.webp";
import { FiHeart } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";

const BagSection = () => {
  return (
    <div>
      <div className=" w-[720px] flex justify-between items-start py-3 border-b border-gray-400">
        <div className="flex flex-col gap-5">
          <img src={img} className="w-[150px] h-auto" />

          <div className="flex justify-between">
            <div className="flex items-center">
              <button className="btn">-</button>
              <h1 className="">3</h1>
              <button className="btn">+</button>
            </div>
            <div>
              <button className="btn">
                <FiHeart />
              </button>
            </div>
          </div>
        </div>
        <div className="relative right-28">
          <h1>New Balance 9060</h1>
          <h2>Men's Shoes</h2>
          <h2>Normal Variant</h2>
          <h2>
            Size <span className="underline">7</span>
          </h2>
        </div>
        <div className="flex">
          <h1>
            MRP:₹<span>8 695.00</span>
          </h1>
          <button className="btn"><RiDeleteBinLine /></button>
        </div>
      </div>
    </div>
  );
};

export default BagSection;
