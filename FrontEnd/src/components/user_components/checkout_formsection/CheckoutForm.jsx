import React, { useEffect, useState } from "react";
import {
  addAddress,
  editAddress,
  getAddress,
  getDefaultAddress,
} from "../../../api/address";
import { IoCashOutline } from "react-icons/io5";
import { SiRazorpay } from "react-icons/si";
import { LuWallet } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { productCheckout } from "../../../api/product";
import { createOrder } from "../../../api/order";
import { clearBag } from "../../../api/bag";
import { emptyBag } from "../../../features/bag/BagSlice";

const CheckoutForm = () => {
  const uid = useSelector((state) => state.user.uid);
  const itemsIds = useSelector((state) => state.bag.bags[uid]?.quantities || {});
  const { calculatedSubtotal } = useSelector((state) => state.bag.bags[uid] || { calculatedSubtotal: 0 });

  const dispatch = useDispatch();

  const [allAddresses, setAllAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [addressChanged, setAddressChanged] = useState(false);

  const [disableButton, setDisableButton] = useState(true);
  const [addressId, setAddressId] = useState("");
  const [checkoutProducts, setCheckoutProducts] = useState([]);

  const [formValues, setFormValues] = useState({
    username: "",
    street: "",
    village: "",
    town: "",
    postcode: "",
    state: "",
    country: "",
    phonenumber: "",
  });

  const [editFormValues, setEditFormValues] = useState({
    username: "",
    street: "",
    village: "",
    town: "",
    postcode: "",
    state: "",
    country: "",
    phonenumber: "",
  });

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;

    setEditFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setDisableButton(false);
  };

  //add allAddresses moda
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  //edit allAddresses modal
  const openEditModal = (id) => {
    setIsEditModalOpen(true);
    setAddressId(id);
    const addressToEdit = allAddresses.find((addres) => addres._id === id);
    setEditFormValues(addressToEdit);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setDisableButton(true);
  };

  //ADDING Address FORM SUBMIT
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const data = {
      username: formValues.username,
      street: formValues.street,
      village: formValues.village,
      town: formValues.town,
      postcode: formValues.postcode,
      state: formValues.state,
      country: formValues.country,
      phonenumber: formValues.phonenumber,
      defaultAddress: formValues.defaultAddress,
    };
    try {
      const { newAddress } = await addAddress(data, uid);
      setSelectedAddress(newAddress);
      setAddressChanged(true);
      setFormValues({
        username: "",
        street: "",
        village: "",
        town: "",
        postcode: "",
        state: "",
        country: "",
        phonenumber: "",
      });
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  //EDITING allAddresses FORM SUBMIT
  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    const data = {
      username: editFormValues.username,
      street: editFormValues.street,
      village: editFormValues.village,
      town: editFormValues.town,
      postcode: editFormValues.postcode,
      state: editFormValues.state,
      country: editFormValues.country,
      phonenumber: editFormValues.phonenumber,
    };
    try {
      await editAddress(data, addressId);
      setAddressChanged(true);
      closeEditModal();
    } catch (error) {
      console.log(error);
      closeEditModal();
    }
  };

  // Function to handle single selection
  const handlePaymentSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        if (addressChanged) {
          return;
        }
        const { allAddress } = await getAddress(uid);
        const defaultAddress = await getDefaultAddress(uid);
        setAllAddresses(allAddress);
        setSelectedAddress(defaultAddress || allAddress[0]);
        setAddressChanged(false);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    if (uid) {
      fetchAddresses();
    }
  }, [uid, addressChanged]);

  //SUBMITTING PLACE ORDER
  const handlePlaceOrder = async() => {
    const productIds = Object.keys(itemsIds)
    const quantities = Object.values(itemsIds)
    const {products} = await productCheckout(productIds);
    setCheckoutProducts(products);

    console.log("check",products)
    const orderDetails = {
      user: uid,
      items: checkoutProducts.map((product, index) => ({
        product: product._id, 
        quantity: quantities[index] 
      })),
      totalAmount: calculatedSubtotal,
      paymentMethod: selectedPaymentMethod,
      shippingAddress: selectedAddress,
    };

    const response = await createOrder(orderDetails);
    if(response){
      dispatch(emptyBag({userId : uid}))
      await clearBag(uid);
    }
  }

  return (
    <div className="w-[720px] mt-5">
      <h1 className="text-xl">Shipping Address</h1>

      <select
        value={selectedAddress ? selectedAddress._id : ""}
        onChange={(e) =>
          setSelectedAddress(
            allAddresses.find((addr) => addr._id === e.target.value)
          )
        }
        className="block w-full mt-2 border border-black rounded-md"
      >
        <option value="" disabled>
          Select a delivery Address
        </option>
        {allAddresses.map((allAddresses) => (
          <option key={allAddresses._id} value={allAddresses._id}>
            {allAddresses.username} - {allAddresses.street}, {allAddresses.town}
            , {allAddresses.postcode}
          </option>
        ))}
      </select>
      <div className="flex">
        {!allAddresses ? (
          <p className="text-md">
            You currently don't have any saved delivery addresses. Add an
            Address here to be pre-filled for quicker checkout.
          </p>
        ) : (
          <div className="flex mt-3 pb-2">
            {selectedAddress && (
              <div className="mt-4">
                <h1 className="text-gray-500">{selectedAddress.username}</h1>
                <h1 className="text-gray-500">{selectedAddress.street}</h1>
                <h1 className="text-gray-500">{selectedAddress.village}</h1>
                <h1 className="text-gray-500">
                  {selectedAddress.town}{" "}
                  <span> {selectedAddress.postcode}</span>
                </h1>
                <h1 className="text-gray-500">{selectedAddress.phonenumber}</h1>
              </div>
            )}
          </div>
        )}
      </div>
      <h3
        className="btn text-white mb-3 font-bold cursor-pointer"
        onClick={() => openModal()}
      >
        Add new Address
      </h3>

      <hr />

      {/* Code Section */}
      <h1 className="text-xl">Have a promo code?</h1>
      <div class="relative">
        <label
          htmlFor="promoCode"
          class="absolute -top-2 left-2 bg-white px-1 text-sm text-gray-500"
        >
          Promo
        </label>
        <input
          id="promoCode"
          name="promoCode"
          type="text"
          class="block w-full rounded-md border border-black px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black sm:text-sm"
          required
        />

        {/* Select payment type */}
        <h1 className="text-xl">How would you like to pay?</h1>
        <div className="flex gap-4 mt-4">
          {/* Cash on Delivery */}
          <div
            onClick={() => handlePaymentSelect("cashOnDelivery")}
            className={`w-[200px] p-4 rounded-lg border cursor-pointer flex items-center gap-2 ${
              selectedPaymentMethod === "cashOnDelivery"
                ? "bg-black text-white"
                : "border-gray-300"
            }`}
          >
            <IoCashOutline />
            <h1>Cash on Delivery</h1>
          </div>

          {/* Razorpay */}
          <div
            onClick={() => handlePaymentSelect("razorPay")}
            className={`w-[200px] p-4 rounded-lg border cursor-pointer flex items-center gap-2 ${
              selectedPaymentMethod === "razorPay"
                ? "bg-black text-white"
                : "border-gray-300"
            }`}
          >
            <SiRazorpay />
            <h1>Razor Pay</h1>
          </div>

          {/* Wallet */}
          <div
            onClick={() => handlePaymentSelect("wallet")}
            className={`w-[200px] p-4 rounded-lg border cursor-pointer flex items-center gap-2 ${
              selectedPaymentMethod === "wallet"
                ? "bg-black text-white"
                : "border-gray-300"
            }`}
          >
            <LuWallet />
            <h1>Wallet</h1>
          </div>
        </div>

        <button className="btn rounded-full mt-3 mb-6 w-full bg-black text-white tracking-[1px]"
        onClick={handlePlaceOrder}>
          Place Order
        </button>
      </div>

      {/* Modal structure */}
      {isModalOpen && (
        <>
          {/* Overlay to dim background */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
          <div
            id="medium-modal"
            tabIndex="-1"
            className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex justify-center items-center"
            onClick={closeModal}
          >
            <div
              className="relative w-full h-[80vh] overflow-y-auto max-w-lg max-h-full bg-white rounded-3xl shadow p-6"
              onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside modal content
            >
              {/* Modal content */}
              <div className="flex items-center justify-between p-4 md:p-5">
                <h3 className="text-xl font-medium text-black dark:text-black">
                  Add allAddresses
                </h3>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-black bg-transparent hover:bg-gray-200 hover:text-black rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-black dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              {/* Modal body */}
              <form action="" onSubmit={handleFormSubmit}>
                <div className="p-4 md:p-5 space-y-4 flex flex-col gap-7">
                  <div class="relative">
                    <label
                      htmlFor="username"
                      class="absolute -top-2 left-2 bg-white px-1 text-sm text-gray-500"
                    >
                      Username*
                    </label>
                    <input
                      id="username"
                      name="username"
                      value={formValues.username}
                      onChange={handleInputChange}
                      type="text"
                      class="block w-full rounded-md border border-black px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                      required
                    />
                  </div>
                  <div class="relative">
                    <label
                      htmlFor="streetaddress"
                      class="absolute -top-2 left-2 bg-white px-1 text-sm text-gray-500"
                    >
                      Street allAddresses*
                    </label>
                    <input
                      id="streetaddress"
                      name="street"
                      value={formValues.street}
                      onChange={handleInputChange}
                      type="text"
                      class="block w-full rounded-md border border-black px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                      required
                    />
                  </div>
                  <div class="relative">
                    <label
                      htmlFor="townorvillage"
                      class="absolute -top-2 left-2 bg-white px-1 text-sm text-gray-500"
                    >
                      Town/Village*
                    </label>
                    <input
                      id="townorvillage"
                      name="village"
                      value={formValues.village}
                      onChange={handleInputChange}
                      type="text"
                      class="block w-full rounded-md border border-black px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                    />
                  </div>
                  <div class="relative flex justify-between">
                    <div>
                      <label
                        htmlFor="townorcity"
                        class="absolute -top-2 left-2 bg-white px-1 text-sm text-gray-500"
                      >
                        Town/City*
                      </label>
                      <input
                        id="townorcity"
                        name="town"
                        value={formValues.town}
                        onChange={handleInputChange}
                        type="text"
                        class="block w-[200px] rounded-md border border-black px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="postcode"
                        class="absolute -top-2 left-[232px] bg-white px-1 text-sm text-gray-500"
                      >
                        Postcode*
                      </label>
                      <input
                        id="postcode"
                        name="postcode"
                        value={formValues.postcode}
                        onChange={handleInputChange}
                        type="number"
                        class="block w-[200px] rounded-md border border-black px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div class="relative flex justify-between">
                    <div>
                      <label
                        htmlFor="state"
                        class="absolute -top-2 left-2 bg-white px-1 text-sm text-gray-500"
                      >
                        State*
                      </label>
                      <input
                        id="state"
                        name="state"
                        value={formValues.state}
                        onChange={handleInputChange}
                        type="text"
                        class="block w-[200px] rounded-md border border-black px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="countryorregion"
                        class="absolute -top-2 left-[232px] bg-white px-1 text-sm text-gray-500"
                      >
                        Country/Region*
                      </label>
                      <input
                        id="countryorregion"
                        name="country"
                        value={formValues.country}
                        onChange={handleInputChange}
                        type="text"
                        class="block w-[200px] rounded-md border border-black px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                      />
                    </div>
                  </div>
                  <div class="relative">
                    <label
                      htmlFor="phonenumber"
                      class="absolute -top-2 left-2 bg-white px-1 text-sm text-gray-500"
                    >
                      Phone Number*
                    </label>
                    <input
                      id="phonenumber"
                      name="phonenumber"
                      value={formValues.phonenumber}
                      onChange={handleInputChange}
                      type="text"
                      class="block w-full rounded-md border border-black px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Modal footer */}
                <div className="flex items-center p-4 md:p-5 justify-end">
                  <button
                    // onClick={handleFormSubmit}
                    type="submit"
                    className="btn rounded-full text-white bg-black hover:bg-gray focus:ring-4 focus:outline-none focus:ring-black font-medium text-sm px-5 py-2.5 text-center"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Edit Modal structure */}
      {isEditModalOpen && (
        <>
          {/* Overlay to dim background */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
          <div
            id="medium-modal"
            tabIndex="-1"
            className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex justify-center items-center"
            onClick={closeEditModal}
          >
            <div
              className="relative w-full h-[80vh] overflow-y-auto max-w-lg max-h-full bg-white rounded-3xl shadow p-6"
              onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside modal content
            >
              {/* Modal content */}
              <div className="flex items-center justify-between p-4 md:p-5">
                <h3 className="text-xl font-medium text-black dark:text-black">
                  Edit allAddresses
                </h3>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="text-black bg-transparent hover:bg-gray-200 hover:text-black rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-black dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              {/* Modal body */}
              <form action="">
                <div className="p-4 md:p-5 space-y-4 flex flex-col gap-7">
                  <div class="relative">
                    <label
                      htmlFor="username"
                      class="absolute -top-2 left-2 bg-white px-1 text-sm text-gray-500"
                    >
                      Username*
                    </label>
                    <input
                      id="username"
                      name="username"
                      value={editFormValues.username}
                      onChange={handleEditInputChange}
                      type="text"
                      class="block w-full rounded-md border border-black px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                      required
                    />
                  </div>
                  <div class="relative">
                    <label
                      htmlFor="streetaddress"
                      class="absolute -top-2 left-2 bg-white px-1 text-sm text-gray-500"
                    >
                      Street allAddresses*
                    </label>
                    <input
                      id="streetaddress"
                      name="street"
                      value={editFormValues.street}
                      onChange={handleEditInputChange}
                      type="text"
                      class="block w-full rounded-md border border-black px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                      required
                    />
                  </div>
                  <div class="relative">
                    <label
                      htmlFor="townorvillage"
                      class="absolute -top-2 left-2 bg-white px-1 text-sm text-gray-500"
                    >
                      Town/Village*
                    </label>
                    <input
                      id="townorvillage"
                      name="village"
                      value={editFormValues.village}
                      onChange={handleEditInputChange}
                      type="text"
                      class="block w-full rounded-md border border-black px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                    />
                  </div>
                  <div class="relative flex justify-between">
                    <div>
                      <label
                        htmlFor="townorcity"
                        class="absolute -top-2 left-2 bg-white px-1 text-sm text-gray-500"
                      >
                        Town/City*
                      </label>
                      <input
                        id="townorcity"
                        name="town"
                        value={editFormValues.town}
                        onChange={handleEditInputChange}
                        type="text"
                        class="block w-[200px] rounded-md border border-black px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="postcode"
                        class="absolute -top-2 left-[232px] bg-white px-1 text-sm text-gray-500"
                      >
                        Postcode*
                      </label>
                      <input
                        id="postcode"
                        name="postcode"
                        value={editFormValues.postcode}
                        onChange={handleEditInputChange}
                        type="number"
                        class="block w-[200px] rounded-md border border-black px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div class="relative flex justify-between">
                    <div>
                      <label
                        htmlFor="state"
                        class="absolute -top-2 left-2 bg-white px-1 text-sm text-gray-500"
                      >
                        State*
                      </label>
                      <input
                        id="state"
                        name="state"
                        value={editFormValues.state}
                        onChange={handleEditInputChange}
                        type="text"
                        class="block w-[200px] rounded-md border border-black px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="countryorregion"
                        class="absolute -top-2 left-[232px] bg-white px-1 text-sm text-gray-500"
                      >
                        Country/Region*
                      </label>
                      <input
                        id="countryorregion"
                        name="country"
                        value={editFormValues.country}
                        onChange={handleEditInputChange}
                        type="text"
                        class="block w-[200px] rounded-md border border-black px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                      />
                    </div>
                  </div>
                  <div class="relative">
                    <label
                      htmlFor="phonenumber"
                      class="absolute -top-2 left-2 bg-white px-1 text-sm text-gray-500"
                    >
                      Phone Number*
                    </label>
                    <input
                      id="phonenumber"
                      name="phonenumber"
                      value={editFormValues.phonenumber}
                      onChange={handleEditInputChange}
                      type="text"
                      class="block w-full rounded-md border border-black px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Modal footer */}
                <div className="flex items-center p-4 md:p-5 justify-end">
                  {/* <button
                    onClick={handleDeleteAddress}
                    className="btn mr-2 rounded-full text-white bg-black hover:bg-gray focus:ring-4 focus:outline-none focus:ring-black font-medium text-sm px-5 py-2.5 text-center"
                  >
                    Delete
                  </button> */}
                  <button
                    onClick={handleEditFormSubmit}
                    className="btn rounded-full text-white bg-black hover:bg-gray focus:ring-4 focus:outline-none focus:ring-black font-medium text-sm px-5 py-2.5 text-center"
                    disabled={disableButton}
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckoutForm;
