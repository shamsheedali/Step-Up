import React, { useEffect, useState } from "react";
import { fetchWishlist, removeProduct } from "../../../api/wishlist";
import Navbar from "../../../components/user_components/navbar/Navbar";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToBag } from "../../../api/bag";
import { useNavigate } from "react-router-dom";
import { GoHeartFill } from "react-icons/go";
import { RiDeleteBinLine } from "react-icons/ri";

const Wishlist = () => {
  const { uid } = useSelector((state) => state.user);

  const offers = useSelector((state) => state.offers);

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getWishlist = async () => {
      setLoading(true);
      try {
        const { wishlistItems } = await fetchWishlist(uid);
        setProducts(wishlistItems.filter((item) => !item.isDeleted).reverse());
      } catch (error) {
        console.error("Error fetching Wishlist items:", error);
      } finally {
        setLoading(false);
      }
    };
    if (uid) {
      getWishlist();
    }
  }, [uid]);

  const navigate = useNavigate();

  //navigating to single product page
  const handleCardClick = (productID) => {
    navigate(`/wishlist/${productID}`);
  };

  //add to bag
  const handleAddToBag = async (productId) => {
    const product = products.find((product) => product.productId === productId);
    console.log(product);
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

  //Remove Product from wishlist
  const handleRemoveProduct = async (productId) => {
    try {
      await removeProduct(uid, productId);

      setProducts((prev) =>
        prev.filter((product) => product.productId !== productId)
      );
    } catch (error) {
      console.error("Failed to remove product from wishlist", error);
    }
  };

  // Calculate discounted price
  const getDiscountedPrice = (price, discount) => {

    return price - discount;
  };

  return (
    <div className="min-h-screen h-auto">
      <Navbar />
      <div className="relative mx-auto max-w-2xl px-8 py-14 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-20">
        {products?.length !== 0 && (
          <h2 className="absolute top-[40px] font-bold text-2xl">Wishlist</h2>
        )}

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {loading ? (
            <div className="w-[80vw] h-[50vh] flex justify-center items-center">
              <span className="loading loading-spinner loading-lg text-black"></span>
            </div>
          ) : products && products.length === 0 ? (
            <div className="w-[80vw] h-[50vh] font-bold flex justify-center items-center">
              <h1 className="text-2xl">Your Wishlist Is Empty!</h1>
            </div>
          ) : (
            products.map((product) => {
              const isOnOffer = offers && offers.hasOwnProperty(product.productId);
              const discount = isOnOffer ? offers[product.productId].discount : 0;
              const discountedPrice = isOnOffer
                ? getDiscountedPrice(product.price, discount)
                : product.price;

              return (
                <div
                  key={product.productId}
                  className="group cursor-pointer transition duration-500 ease-in-out hover:translate-y-[-10px] relative"
                >
                  <div onClick={() => handleCardClick(product.productId)}>
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                      <img
                        src={product.productImage}
                        alt={product.productName}
                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                      />
                    </div>
                    <h3 className="mt-4 text-sm text-gray-700">
                      {product.productName}
                    </h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      {isOnOffer ? (
                        <>
                          ₹{discountedPrice.toFixed(0)}{" "}
                          <span className="text-lg line-through text-gray-500">
                            ₹{product.price}
                          </span>
                        </>
                      ) : (
                        `₹${product.price}`
                      )}
                    </p>
                  </div>

                  {/* Wishlist remove button */}
                  <div
                    className="btn w-fit bg-black text-white p-3 text-xl absolute right-12 cursor-pointer transition duration-500 ease-in-out opacity-0 group-hover:opacity-100 group-hover:translate-y-[-20px] hover:scale-90 rounded-md"
                    onClick={() => handleRemoveProduct(product.productId)}
                  >
                    <RiDeleteBinLine />
                  </div>
                  <div
                    className="btn w-fit bg-black text-white p-3 text-xl absolute right-0 cursor-pointer transition duration-500 delay-150 ease-in-out opacity-0 group-hover:opacity-100 group-hover:translate-y-[-20px] hover:scale-90 rounded-md"
                    onClick={() => handleAddToBag(product.productId)}
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

export default Wishlist;
