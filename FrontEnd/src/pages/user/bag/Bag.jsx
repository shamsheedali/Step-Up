import React, { useEffect, useState } from "react";
import Navbar from "../../../components/user_components/navbar/Navbar";
import BagSection from "../../../components/user_components/bag_item_section/BagSection";
import Footer from "../../../components/user_components/footer/Footer";
import { delFromBag, fetchBag } from "../../../api/bag";
import { useSelector } from "react-redux";

const Bag = () => {
  const { uid } = useSelector((state) => state.user);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getBag = async () => {
      setLoading(true);
      try {
        const { bagItems } = await fetchBag(uid);
        setProducts(bagItems);
      } catch (error) {
        console.error("Error fetching bag items:", error);
      } finally {
        setLoading(false);
      }
    };
    if (uid) {
      getBag();
    }
  }, [uid]);

  //handle bag product deletation from child component with calback function
  const handleDeleteProduct = async (productId) => {
    try {
      await delFromBag(uid, productId);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.productId !== productId)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="min-h-screen h-auto">
      <Navbar />
      <div className="pt-11 px-32 ">
        {loading ? (
          <div className="w-full h-[75vh] flex justify-center items-center">
            <span className="loading loading-spinner loading-lg text-black"></span>
          </div>
        ) : products && products.length === 0 ? (
          <div className="w-full h-[75vh] font-bold flex justify-center items-center">
            <h1 className="text-2xl">Your Bag Is Empty!</h1>
          </div>
        ) : (
          <div className="flex gap-10">
            <div>
              <h1 className="text-3xl font-bold">Bag</h1>

              {products &&
                products.map((product) => (
                  <BagSection
                    key={product.productId}
                    img={product.productImage}
                    name={product.productName}
                    category={product.category}
                    price={product.price}
                    qty={product.quantity}
                    productId={product.productId}
                    removeProduct={handleDeleteProduct}
                  />
                ))}
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
        )}
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default Bag;
