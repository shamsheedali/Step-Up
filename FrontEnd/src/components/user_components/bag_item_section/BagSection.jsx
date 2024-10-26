import React, { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { delFromBag } from "../../../api/bag";
import { useSelector } from "react-redux";

const BagSection = ({
  img,
  name,
  category,
  price,
  qty,
  productId,
  removeProduct,
}) => {
  const { uid } = useSelector((state) => state.user);

  const [quantity, setQuantity] = useState(qty);

  const handleDeleteFromBag = async () => {
    removeProduct(productId);
  };
  return (
    <div>
      <div className=" w-[720px] flex justify-between items-start py-3 border-b border-gray-400">
        <div className="flex flex-col gap-5">
          <img
            src={`data:image/jpeg;base64,${img}`} // Display the first image
            className="w-[150px] h-auto"
          />

          <div className="flex justify-between">
            <div className="flex items-center">
              <div class="inline-flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  class="px-4 py-2 text-sm font-medium text-black bg-white border border-black border-r-0 rounded-s-full hover:bg-gray-300 hover:rounded-e-full"
                  onClick={() => setQuantity((pre) => pre - 1)}
                >
                  -
                </button>
                <h1
                  type="button"
                  class="px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border-t border-b border-gray-900"
                >
                  {quantity}
                </h1>
                <button
                  type="button"
                  class="px-4 py-2 text-sm font-medium text-black bg-white border border-black border-l-0 rounded-e-full hover:bg-gray-300 hover:rounded-s-full"
                  onClick={() => setQuantity((pre) => pre + 1)}
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <button className="ml-3 px-3 py-3 text-sm font-medium text-black bg-white border border-black rounded-full hover:bg-gray-300">
                <FiHeart />
              </button>
            </div>
          </div>
        </div>
        <div className="relative right-24">
          <h1 className="w-[190px]">{name}</h1>
          <h2 className="text-gray-500">{category}</h2>
          <h2 className="text-gray-500">Normal Variant</h2>
          <h2>
            Size <span className="underline">7</span>
          </h2>
        </div>
        <div className="flex">
          <h1>
            MRP:₹<span>{price}</span>
          </h1>
          <button className="ml-3 mb-3 px-3 py-3 text-sm font-medium text-black bg-white border border-black rounded-full hover:bg-gray-300" onClick={handleDeleteFromBag}>
            <RiDeleteBinLine />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BagSection;
