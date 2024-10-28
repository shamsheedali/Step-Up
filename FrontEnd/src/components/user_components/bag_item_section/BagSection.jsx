import React, { useEffect, useState } from "react";
import { FiHeart } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { updateQuantity } from "../../../features/bag/BagSlice";

const BagSection = ({
  img,
  name,
  category,
  managePrice,
  qty,
  stock,
  productId,
  removeProduct,
  onQuantityChange,
}) => {
  const quantities = useSelector((state) => state.bag.quantities[productId]);

  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(quantities || qty);
  const [maxStock, setMaxStock] = useState(10);
  const [price, setPrice] = useState(managePrice * quantity);

  useEffect(() => {
    if (stock >= 10) {
      setMaxStock(10);
    } else if (stock > 5 && stock <= 9) {
      setMaxStock(3);
    } else {
      setMaxStock(1);
    }
  }, [stock]);

  //use effect for dispaching and storing quantity info in redux
  useEffect(() => {
    dispatch(updateQuantity({productId, quantity}))

    setPrice(quantity * managePrice);
  }, [dispatch, productId, quantity])

  const handleQuantityInc = () => {
    setQuantity(quantity + 1);
    if (qty < stock) {
      onQuantityChange(productId, qty + 1); 
    }
  };
  
  const handleQuantityDec = () => {
    setQuantity(quantity - 1);
    if (qty > 1) {
      onQuantityChange(productId, qty - 1); 
    }
  }
  

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
                  disabled={quantity === 1}
                  onClick={handleQuantityDec}
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
                  disabled={quantity >= maxStock}
                  onClick={handleQuantityInc}
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
            Size<span className="underline ml-2">7</span>
          </h2>
        </div>
        <div className="flex">
          <h1>
            MRP : ₹ <span>{price}</span>
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
