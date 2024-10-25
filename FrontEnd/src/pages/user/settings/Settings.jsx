import React, { useEffect, useState } from "react";
import Navbar from "../../../components/user_components/navbar/Navbar";
import SettingsSidebar from "../../../components/user_components/settings_sidebar/SettingsSidebar";
import { useDispatch, useSelector } from "react-redux";
import { changePassword, updateUserData } from "../../../api/users";
import { setUser } from "../../../features/users/UserSlice";
import { toast } from "react-toastify";

const Settings = () => {
  const { username, email, uid } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    username: username,
    email: email,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isFormChanged, setIsFormChanged] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const hasFormChanged =
      formValues.username !== username || formValues.email !== email;
      setIsFormChanged(hasFormChanged);
  }, [formValues, username, email]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setError('');
  };

  //Form submit of username and email
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      _id: uid,
      username: formValues.username,
      email: formValues.email,
    };
    try {
      const { user } = await updateUserData(userData);
      console.log("success", user);
      setFormValues({
        username: user.username,
        email: user.email,
      });
      dispatch(setUser({ username: user.username, email: user.email }));
      toast.success("Your profile has been successfully updated!");
    } catch (error) {
      console.log(error);
    }
  };

  //Password form validation
  const validate = () => {
    if (passwordData.currentPassword.length < 6) {
      setError("Incorrect Password");
      return false;
    } else if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New password and confirmation do not match");
      return false;
    }
    return true;
  };

  //Form submit of New password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const data = {
      password: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
      _id: uid,
    };
    if (validate()) {
      await changePassword(data);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      closeModal();
    }
  };

  return (
    <div className="text-black font-clash-display h-screen">
      <Navbar />

      <div className="pt-14 px-36">
        <div className="flex gap-48">
          <SettingsSidebar />

          <div className="flex flex-col gap-7 w-[300px]">
            <h1 className="text-2xl">Account Details</h1>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
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
                  name="username"
                  value={formValues.username}
                  onChange={handleInputChange}
                  class="block w-full rounded-md border border-black px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                />
              </div>

              <div class="relative">
                <label
                  for="email"
                  class="absolute -top-2 left-2 bg-white px-1 text-sm text-gray-500"
                >
                  Email*
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleInputChange}
                  class="block w-full rounded-md border border-black px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                />
              </div>

              <label htmlFor="">Password</label>
              <div className="flex justify-between relative bottom-3">
                <input
                  type="password"
                  value={"123456789"}
                  className="border-none focus:border-none active:border-none disabled"
                />
                <h3 className="underline font-bold cursor-pointer" onClick={openModal}>
                  Edit
                </h3>
              </div>

              <div className="flex justify-end">
                <button
                  className="btn rounded-full w-[100px] text-white"
                  disabled={!isFormChanged}
                >
                  Save
                </button>
              </div>
            </form>
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
              className="relative w-full max-w-lg max-h-full bg-white rounded-3xl shadow p-6"
              onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside modal content
            >
              {/* Modal content */}
              <div className="flex items-center justify-between p-4 md:p-5">
                <h3 className="text-xl font-medium text-black dark:text-black">
                  Edit Password
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
              <form onSubmit={handlePasswordSubmit}>
                <div className="p-4 md:p-5 space-y-4 flex flex-col gap-7">
                  <div class="relative">
                    <label
                      htmlFor="CurrentPassword"
                      class="absolute -top-2 left-2 bg-white px-1 text-sm text-gray-500"
                    >
                      Current Password*
                    </label>
                    <input
                      id="CurrentPassword"
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      class="block w-full rounded-md border border-black px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                      required
                    />
                  </div>
                  <div class="relative">
                    <label
                      htmlFor="NewPassword"
                      class="absolute -top-2 left-2 bg-white px-1 text-sm text-gray-500"
                    >
                      New Password*
                    </label>
                    <input
                      id="NewPassword"
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      class="block w-full rounded-md border border-black px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                      required
                    />
                  </div>
                  <div class="relative">
                    <label
                      htmlFor="ConfirmPassword"
                      class="absolute -top-2 left-2 bg-white px-1 text-sm text-gray-500"
                    >
                      Confirm New Password*
                    </label>
                    <input
                      id="ConfirmPassword"
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      class="block w-full rounded-md border border-black px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                      required
                    />
                  </div>
                </div>

                {error ? (
                  <p className="text-red-500 text-center">{error}</p>
                ) : (
                  ""
                )}
                {/* Modal footer */}
                <div className="flex items-center p-4 md:p-5 justify-end">
                  <button
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
    </div>
  );
};

export default Settings;
