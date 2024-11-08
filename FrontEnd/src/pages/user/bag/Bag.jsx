import React, { useEffect, useState } from "react";
import Navbar from "../../../components/user_components/navbar/Navbar";
import BagSection from "../../../components/user_components/bag_item_section/BagSection";
import Footer from "../../../components/user_components/footer/Footer";
import { delFromBag, fetchBag } from "../../../api/bag";
import { useDispatch, useSelector } from "react-redux";
import { removeProduct, storeSubtotal } from "../../../features/bag/BagSlice";
import { Link } from "react-router-dom";

const DELIVERY_FEE = 100;

const Bag = () => {
  const { uid } = useSelector((state) => state.user);
  
  const { calculatedSubtotal } = useSelector((state) => state.bag.bags[uid] || { calculatedSubtotal: 0 });
  const quantities = useSelector((state) => state.bag.bags[uid]?.quantities || {});

  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getBag = async () => {
      setLoading(true);
      try {
        const { bagItems } = await fetchBag(uid);
        setProducts(bagItems.reverse());
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

  // Calculate subtotal whenever products change
  useEffect(() => {
    console.log("Quantities:", quantities); // Check quantities from Redux
    console.log("Products:", products);     // Check products array

    const calculatedSubtotal = products.reduce((acc, product) => {
      const quantity = quantities[product.productId] || 0; // Default to 0 if not found
      const itemTotal = product.price * quantity;
      console.log(`Product ID: ${product.productId}, Price: ${product.price}, Quantity: ${quantity}, Item Total: ${itemTotal}`);
      return acc + itemTotal;
    }, 0);

    console.log("Subtotal:", calculatedSubtotal); // Check the calculated subtotal
    dispatch(storeSubtotal({ userId: uid, subtotal: calculatedSubtotal }));
  }, [products, quantities, dispatch, uid]);

  // Function to update product quantity and trigger subtotal calculation
  const updateSubtotal = (productId, newQuantity) => {
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((product) =>
        product.productId === productId
          ? { ...product, quantity: newQuantity }
          : product
      );

      // Calculate the subtotal based on the updated products array
      const newSubtotal = updatedProducts.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0
      );

      // Dispatch the new subtotal immediately after calculation
      dispatch(storeSubtotal({ userId: uid , subtotal: newSubtotal }));

      return updatedProducts;
    });
  };

  const total = calculatedSubtotal + DELIVERY_FEE;

  //handle bag product deletation from child component with calback function
  const handleDeleteProduct = async (productId) => {
    try {
      await delFromBag(uid, productId);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.productId !== productId)
      );
      dispatch(removeProduct({ userId: uid, productId }));
      dispatch(storeSubtotal({ userId: uid , subtotal: calculatedSubtotal }));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="min-h-screen h-auto">
      <Navbar />
      <div className="pt-11 px-32">
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
                    managePrice={product.price}
                    qty={product.quantity}
                    stock={product.stock}
                    productId={product.productId}
                    removeProduct={handleDeleteProduct}
                    onQuantityChange={updateSubtotal}
                  />
                ))}
            </div>

            <div className="w-full flex flex-col gap-3">
              <h1 className="text-2xl mb-5">Summary</h1>

              <div className="flex justify-between">
                <h1>Subtotal</h1>
                <h1>₹{(calculatedSubtotal || 0).toFixed(2)}</h1>
              </div>
              <div className="flex justify-between">
                <h1>Estimated Delivery & Handling</h1>
                <h1>₹{DELIVERY_FEE.toFixed(2)}</h1>
              </div>
              <hr />
              <div className="flex justify-between">
                <h1>Total</h1>
                <h1>₹{total.toFixed(2)}</h1>
              </div>
              <hr />

              <Link to={"/bag/checkout"}>
                <button className="btn rounded-full mt-3 w-full bg-black text-white tracking-[1px]">
                  Checkout
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default Bag;
