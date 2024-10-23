import React from "react";
import ProductCard from "../product_card/ProductCard";

const NewArrival = () => {
  return (
    <div className="bg-[#fff] px-10 py-20 flex flex-col items-center">
      <h1 className="text-3xl font-clash-grotesk text-center">See What's New</h1>
      <div className="flex gap-[100px] mt-[4.75rem]">
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
      <button className="btn mx-auto mt-[4.75rem] px-14 bg-black text-white rounded-3xl">Show All</button>
    </div>
  );
};

export default NewArrival;
