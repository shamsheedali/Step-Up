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

  const { calculatedSubtotal } = useSelector(
    (state) => state.bag.bags[uid] || { calculatedSubtotal: 0 }
  );
  const quantities = useSelector(
    (state) => state.bag.bags[uid]?.quantities || {}
  );

  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getBag = async () => {
      setLoading(true);
      try {
        const { bagItems } = await fetchBag(uid);
        console.log("bagItems", bagItems);
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
  const offers = useSelector((state) => state.offers);

  useEffect(() => {
    console.log("Quantities:", quantities);
    console.log("Products:", products);

    // Calculate subtotal based on products and quantities
    const calculatedSubtotal = products.reduce((acc, product) => {
      const quantity = quantities[product.productId] || 0;

      // Get the discount from offers (if available)
      const productOffer = offers[product.productId];
      const discount = productOffer ? productOffer.discount : 0;

      // Calculate item total with discount applied, if any
      const priceAfterDiscount =
        discount > 0 ? product.price * (1 - discount / 100) : product.price;

      const itemTotal = priceAfterDiscount * quantity;

      console.log(
        `Product ID: ${product.productId}, Original Price: ${product.price}, Discount: ${discount}, Quantity: ${quantity}, Item Total: ${itemTotal}`
      );
      return acc + itemTotal;
    }, 0);

    console.log("Subtotal:", calculatedSubtotal);
    dispatch(storeSubtotal({ userId: uid, subtotal: calculatedSubtotal }));
  }, [products, quantities, dispatch, uid, offers]);

  // Function to update product quantity and recalculate subtotal
  const updateSubtotal = (productId, newQuantity) => {
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((product) => {
        if (product.productId === productId) {
          // Get the discount from offers (if available)
          const productOffer = offers[product.productId];
          const discount = productOffer ? productOffer.discount : 0;

          // Calculate price with discount, if any
          const priceAfterDiscount =
            discount > 0 ? product.price * (1 - discount / 100) : product.price;

          return { ...product, quantity: newQuantity, priceAfterDiscount };
        }
        return product;
      });

      // Recalculate the subtotal with the updated product list
      const newSubtotal = updatedProducts.reduce(
        (acc, product) =>
          acc +
          (product.priceAfterDiscount || product.price) *
            (product.quantity || 0),
        0
      );

      // Dispatch the new subtotal to Redux
      dispatch(storeSubtotal({ userId: uid, subtotal: newSubtotal }));

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
      dispatch(storeSubtotal({ userId: uid, subtotal: calculatedSubtotal }));
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
                products.map(
                  (product) =>
                    !product.isDeleted && (
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
                    )
                )}
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
