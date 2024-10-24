import React, { useState } from "react";
import Navbar from "../../../components/user_components/navbar/Navbar";
import SettingsSidebar from "../../../components/user_components/settings_sidebar/SettingsSidebar";

const DeliveryAddresses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="text-black font-clash-display h-screen">
      <Navbar />

      <div className="pt-14 px-36">
        <div className="flex gap-48">
          <SettingsSidebar />

          <div>
            <h1 className="text-2xl">Saved Delivery Addresses</h1>

            <p className="text-md">
              You currently don't have any saved delivery addresses.Add an
              address here to be pre-filled for quicker checkout
            </p>
            <button
              className="btn rounded-full w-[200px] text-white"
              onClick={openModal}
            >
              Add Address
            </button>
          </div>
        </div>
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
                  Add Address
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
              <div className="p-4 md:p-5 space-y-4 flex flex-col gap-7">
                <div class="relative">
                  <label
                    for="username"
                    class="absolute -top-2 left-2 bg-white px-1 text-sm text-gray-500"
                  >
                    Username*
                  </label>
                  <input
                    id="username"
                    type="text"
                    class="block w-full rounded-md border border-black px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                  />
                </div>
                <div class="relative">
                  <label
                    for="streetaddress"
                    class="absolute -top-2 left-2 bg-white px-1 text-sm text-gray-500"
                  >
                    Street Address*
                  </label>
                  <input
                    id="streetaddress"
                    type="text"
                    class="block w-full rounded-md border border-black px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                  />
                </div>
                <div class="relative">
                  <label
                    for="townorvillage"
                    class="absolute -top-2 left-2 bg-white px-1 text-sm text-gray-500"
                  >
                    Town/Village*
                  </label>
                  <input
                    id="townorvillage"
                    type="text"
                    class="block w-full rounded-md border border-black px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                  />
                </div>
                <div class="relative flex justify-between">
                  <div>
                    <label
                      for="townorcity"
                      class="absolute -top-2 left-2 bg-white px-1 text-sm text-gray-500"
                    >
                      Town/City*
                    </label>
                    <input
                      id="townorcity"
                      type="text"
                      class="block w-[200px] rounded-md border border-black px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      for="postcode"
                      class="absolute -top-2 left-[232px] bg-white px-1 text-sm text-gray-500"
                    >
                      Postcode*
                    </label>
                    <input
                      id="postcode"
                      type="number"
                      class="block w-[200px] rounded-md border border-black px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                    />
                  </div>
                </div>
                <div class="relative flex justify-between">
                  <div>
                    <label
                      for="state"
                      class="absolute -top-2 left-2 bg-white px-1 text-sm text-gray-500"
                    >
                      State*
                    </label>
                    <input
                      id="state"
                      type="text"
                      class="block w-[200px] rounded-md border border-black px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      for="countryorregion"
                      class="absolute -top-2 left-[232px] bg-white px-1 text-sm text-gray-500"
                    >
                      Country/Region*
                    </label>
                    <input
                      id="countryorregion"
                      type="text"
                      class="block w-[200px] rounded-md border border-black px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                    />
                  </div>
                </div>
                <div class="relative">
                  <label
                    for="phonenumber"
                    class="absolute -top-2 left-2 bg-white px-1 text-sm text-gray-500"
                  >
                    Phone Number*
                  </label>
                  <input
                    id="phonenumber"
                    type="text"
                    class="block w-full rounded-md border border-black px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                  />
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex items-center p-4 md:p-5 justify-end">
                <button
                  onClick={closeModal}
                  className="btn rounded-full text-white bg-black hover:bg-gray focus:ring-4 focus:outline-none focus:ring-black font-medium text-sm px-5 py-2.5 text-center"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DeliveryAddresses;
