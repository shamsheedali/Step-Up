import React from "react";
import sneakersCategoryImg from "../../../assets/images/homepage/Sneakers Category img.jpg";
import footballCategoryImg from "../../../assets/images/homepage/Football Category img.jpg";
import basketballCategoryImg from "../../../assets/images/homepage/Basketball Category img.jpg";

const CategorySection = () => {
  return (
    <div>
      <div className="bg-[#fff] px-10 py-20 flex flex-col items-center">
        <h1 className="text-3xl font-clash-grotesk text-center">
          Step Into Style
        </h1>
        <div className="flex gap-[100px] mt-[3.75rem]">
          <img src={sneakersCategoryImg} alt="" className="w-[300px] object-cover" style={{ boxShadow: "5px 4px 8px #00000099" }} />
          <img src={footballCategoryImg} alt="" className="w-[300px] object-cover" style={{ boxShadow: "5px 4px 8px #00000099" }} />
          <img src={basketballCategoryImg} alt="" className="w-[300px] object-cover brightness-[0.9]" style={{ boxShadow: "5px 4px 8px #00000099" }} />
        </div>
        <button className="btn mx-auto mt-[3.75rem] px-14 bg-black text-white rounded-3xl">
          Show All
        </button>
      </div>
    </div>
  );
};

export default CategorySection;
