import React, { useEffect, useState } from "react";
import { fetchProducts } from "../../../api/product";
import { useNavigate } from "react-router-dom";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { addToBag } from "../../../api/bag";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setOffer } from "../../../features/offers/OfferSlice";

const ProductGrid = ({ products, loading, offers }) => {


  const dispatch = useDispatch();
    useEffect(() => {
      if (offers && offers.isActive && offers.endDate < new Date()) {
        console.log("this should not work")
        offers.productsIncluded.forEach((productId) => {
          dispatch(
            setOffer({
              productId,
              discount: offers.discount, 
            })
          );
        });
      }
    }, [dispatch, offers]);

  const { uid } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const handleCardClick = (productID) => {
    navigate(`/products/${productID}`);
  };

  // Add to bag function
  const handleAddToBag = async (productId) => {
    const product = products.find((product) => product._id === productId);
    if (product.stock < 2) {
      return toast.warning("Product Out Of Stock");
    }
    const data = {
      userId: uid,
      productId,
    };
    try {
      await addToBag(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to calculate the discounted price
  const getDiscountedPrice = (price, discount) => {
    return price - (price * (discount / 100));
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {loading ? (
            <div className="w-[50vw] h-[50vh] flex justify-center items-center">
              <span className="loading loading-spinner loading-lg text-black"></span>
            </div>
          ) : (
            products
              .filter((product) => !product.isDeleted)
              .map((product) => {
                // Check if the product has an active offer
                const isOnOffer = offers && offers.productsIncluded.includes(product._id);
                const discount = isOnOffer ? offers.discount : 0;
                const discountedPrice = isOnOffer
                  ? getDiscountedPrice(product.price, discount)
                  : product.price;

                return (
                  <div
                    key={product._id}
                    className="group cursor-pointer transition duration-500 ease-in-out hover:translate-y-[-10px] relative"
                  >
                    <div onClick={() => handleCardClick(product._id)}>
                      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                        <img
                          src={`data:image/jpeg;base64,${product.images[0]}`} // Display the first image
                          alt={product.productName}
                          className="h-full w-full object-cover object-center group-hover:opacity-75"
                        />
                      </div>
                      <h3 className="mt-4 text-sm text-gray-700">
                        {product.productName}
                      </h3>

                      {/* Display price with discount */}
                      <p className="mt-1 text-lg font-medium text-gray-900">
                        {isOnOffer ? (
                          <span className="text-black">
                            ₹{discountedPrice.toFixed(0)}
                          </span>
                        ) : (
                          `₹${product.price}`
                        )}
                        {isOnOffer && (
                          <span className="ml-2 text-sm line-through text-gray-500">
                            ₹{product.price}
                          </span>
                        )}
                      </p>
                    </div>

                    <div
                      className="btn w-fit bg-black text-white p-3 text-xl absolute right-0 cursor-pointer transition duration-500 ease-in-out opacity-0 group-hover:opacity-100 group-hover:translate-y-[-20px] hover:scale-90 rounded-md"
                      onClick={() => handleAddToBag(product._id)}
                    >
                      <HiOutlineShoppingBag />
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
