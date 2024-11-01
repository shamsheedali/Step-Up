import React, { useEffect, useState } from "react";
import {
  addProduct,
  editProduct,
  fetchProducts,
  toggleProductState,
} from "../../api/product";
import { fetchCategories } from "../../api/category";
import { toast } from "react-toastify";

const ProductManagement = () => {
  const wordLength = 3;
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productID, setProductID] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVariantModalOpen, setVariantIsModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isChanged, setIsChanged] = useState(false);
  const [addProductData, setAddProductData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    brand: "",
    sizes: [],
    newArrival: false,
    images: [],
  });

  // Function to reset the form data
  const resetForm = () => {
    setAddProductData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      brand: "",
      sizes: [],
      newArrival: false,
      images: [],
    });
    setSelectedImages([]);
  };

  const getProducts = async () => {
    try {
      setLoading(true);
      const { allProducts } = await fetchProducts();
      setLoading(false);
      if (allProducts) {
        setProducts(allProducts);
        setLoading(false);
      } else {
        console.log("No data found");
      }
    } catch (error) {
      console.error("Error fetching Products", error);
      setLoading(false);
    }
  };

  //fetching products
  useEffect(() => {
    getProducts();
  }, [isChanged]);

  //fetcing categories
  useEffect(() => {
    const getCategories = async () => {
      const { data } = await fetchCategories();
      setCategories(data);
    };
    getCategories();
  }, []);

  // Function to toggle add Product the modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Function to toggle add variant the modal
  const toggleVariantModal = () => {
    setVariantIsModalOpen(!isVariantModalOpen);
  };

  const toggleEditModal = (id) => {
    setEditModalOpen(!isEditModalOpen);
    setProductID(id);

    if (!isEditModalOpen) {
      const productToEdit = products.find((product) => product._id === id);
      setAddProductData({
        name: productToEdit.productName,
        description: productToEdit.description,
        price: productToEdit.price,
        stock: productToEdit.stock,
        category: productToEdit.category,
        brand: productToEdit.brand,
        size: productToEdit.size === true ? true : false,
        newArrival: productToEdit.newArrival === true ? true : false,
        images: productToEdit.images,
      });
    } else {
      setAddProductData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        brand: "",
        sizes: [],
        newArrival: false,
        images: [],
      });
    }
  };

  //size changes
  const handleSizeChange = (event) => {
    const { value, checked } = event.target;
    const newSize = { name: value, inStock: checked };

    setAddProductData((prevState) => {
      const sizeExists = prevState.sizes.some((size) => size.name === value);

      if (checked && !sizeExists) {
        return {
          ...prevState,
          sizes: [...prevState.sizes, newSize],
        };
      } else if (!checked) {
        return {
          ...prevState,
          sizes: prevState.sizes.filter((size) => size.name !== value),
        };
      }
      return prevState;
    });
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    if (type === "checkbox") {
      setAddProductData((prevData) => ({ ...prevData, [name]: checked }));
    } else {
      setAddProductData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // Function to handle image selection
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files); // Convert file list to an array

    if (selectedImages.length + files.length > 5) {
      toast.error("You can only select up to 5 images.");
      return;
    }

    setSelectedImages(files);
  };

  // Function to remove an image from preview
  const removeImage = (indexToRemove) => {
    setSelectedImages((prevImages) => {
      const newImages = prevImages.filter(
        (_, index) => index !== indexToRemove
      );

      // Update addProductData.images as well
      setAddProductData((prevData) => ({
        ...prevData,
        images: newImages,
      }));

      return newImages; // Return the new images array
    });
  };

  //Adding Product
  const handleaddProductSubmit = async (e) => {
    setLoading(true);
    if (selectedImages.length > 5) {
      alert("You cannot upload more than 5 images.");
      setLoading(false);
      return;
    }
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", addProductData.name);
    formData.append("description", addProductData.description);
    formData.append("price", addProductData.price);
    formData.append("stock", addProductData.stock);
    formData.append("category", addProductData.category);
    formData.append("brand", addProductData.brand);
    formData.append("sizes", JSON.stringify(addProductData.sizes));
    formData.append("newArrival", addProductData.newArrival);

    selectedImages.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await addProduct(formData); // Sending FormData instead of JSON object
      setLoading(false);
      resetForm();
      toggleModal();
      setIsChanged(!isChanged);
    } catch (error) {
      console.log("Error while adding product", error);
      setLoading(false);
    }
  };

  //edit Product
  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(addProductData);
      await editProduct(productID, addProductData);
      resetForm();
      toggleEditModal();
      setIsChanged(!isChanged);
    } catch (error) {
      console.log(error);
    }
  };

  //Delete Product
  const handleProductDelete = async (productID) => {
    const { updatedProduct } = await toggleProductState(productID);
    setProducts((prev) => [...prev, updatedProduct]);
    setIsChanged(!isChanged);
  };

  console.log("this",addProductData);

  return (
    <div>
      <div className="absolute top-14 right-0 w-[1110px]">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <div className="flex items-center px-9 justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-[#1f2937]">
            <h1 className="text-white text-2xl">Products</h1>
            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="table-search-users"
                className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search for products"
              />
            </div>
            <button
              className="btn bg-blue-700 text-white hover:bg-blue-800 px-4 py-2 rounded-lg"
              onClick={toggleModal}
            >
              Add Product
            </button>
          </div>

          {/* Table */}
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Product Details
                </th>
                <th scope="col" className="px-6 py-3">
                  Category
                </th>
                <th scope="col" className="px-6 py-3">
                  Brand
                </th>
                <th scope="col" className="px-6 py-3">
                  Price
                </th>
                <th scope="col" className="px-6 py-3">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Variant
                </th>
                <th scope="col" className="px-6 py-3">
                  Edit
                </th>
                <th scope="col" className="px-6 py-3">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    <span className="loading loading-spinner loading-lg"></span>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    key={product._id}
                  >
                    <th
                      scope="row"
                      className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <img
                        className="w-10 h-10 rounded-full"
                        src={
                          product.images.length > 0
                            ? `data:image/jpeg;base64,${product.images[0]}`
                            : ""
                        } // Display the first image or a placeholder if no images are available
                        alt={product.productName}
                      />
                      <div className="ps-3">
                        <div className="text-base font-semibold">
                          <h1>
                            {product.productName.length > wordLength
                              ? `${product.productName
                                  .split(" ")
                                  .slice(0, wordLength)
                                  .join(" ")}...`
                              : product.productName}
                          </h1>
                        </div>
                      </div>
                    </th>
                    <td className="px-6 py-4">{categories.name}</td>
                    <td className="px-6 py-4">{product.brand}</td>
                    <td className="px-6 py-4">{product.price}</td>
                    <td className="px-6 py-4">{product.stock}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div
                          className={`h-2.5 w-2.5 rounded-full ${
                            product.isDeleted ? "bg-red-500" : "bg-green-500"
                          } me-2`}
                        ></div>
                        {product.isDeleted ? "Unpublished" : "Published"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="font-medium text-green-600 dark:text-green-600 cursor-pointer hover:underline"
                        onClick={toggleVariantModal}
                      >
                        Add Variant
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="font-medium text-green-600 dark:text-green-600 cursor-pointer hover:underline"
                        onClick={() => toggleEditModal(product._id)}
                      >
                        Edit
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-medium ${
                          product.isDeleted ? "text-green-600" : "text-red-600"
                        } cursor-pointer hover:underline`}
                        onClick={() => handleProductDelete(product._id)}
                      >
                        {product.isDeleted ? "Recover" : "Delete"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Add Product Modal */}
          {isModalOpen && (
            <div
              id="crud-modal"
              tabIndex="-1"
              aria-hidden="true"
              className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
            >
              <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 overflow-y-auto max-h-[80vh]">
                  <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Create New Product
                    </h3>
                    <button
                      type="button"
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={toggleModal}
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
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>
                  {/* Modal body */}
                  <form
                    className="p-4 md:p-5"
                    onSubmit={handleaddProductSubmit}
                  >
                    <div className="grid gap-4 mb-4 grid-cols-2">
                      <div className="col-span-2">
                        <label
                          htmlFor="name"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={addProductData.name}
                          onChange={handleChange}
                          id="name"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Type product name"
                          required
                        />
                      </div>

                      <div className="col-span-2">
                        <label
                          htmlFor="description"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Description
                        </label>
                        <textarea
                          name="description"
                          id="description"
                          value={addProductData.description}
                          onChange={handleChange}
                          rows="3"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Add a short description"
                          required
                        ></textarea>
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label
                          htmlFor="price"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Price
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={addProductData.price}
                          onChange={handleChange}
                          id="price"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="₹2999"
                          required
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label
                          htmlFor="stock"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Stock
                        </label>
                        <input
                          type="number"
                          name="stock"
                          id="stock"
                          value={addProductData.stock}
                          onChange={handleChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Enter stock"
                          required
                        />
                      </div>

                      <div className="col-span-2">
                        <label
                          htmlFor="category"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Category
                        </label>
                        <select
                          name="category"
                          value={addProductData.category}
                          onChange={handleChange}
                          id="category"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          required
                        >
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                              {category.isDeleted ? "" : category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-2">
                        <label
                          htmlFor="brand"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Brand
                        </label>
                        <input
                          type="text"
                          name="brand"
                          value={addProductData.brand}
                          onChange={handleChange}
                          id="brand"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Enter product Brand"
                          required
                        />
                      </div>

                      {/* SIZE */}
                      {/* Add Sizes Selection */}
                      <div className="col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Sizes
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            "UK 6",
                            "UK 6.5",
                            "UK 7",
                            "UK 7.5",
                            "UK 8",
                            "UK 8.5",
                            "UK 9",
                            "UK 9.5",
                            "UK 10",
                            "UK 11",
                            "UK 12",
                          ].map((size, index) => (
                            <div key={index} className="flex items-center">
                              <input
                                type="checkbox"
                                name="sizes"
                                value={size}
                                onChange={handleSizeChange}
                                id={`size-${size}`}
                                className="mr-2"
                              />
                              <label
                                htmlFor={`size-${size}`}
                                className="text-sm font-medium text-gray-900 dark:text-white"
                              >
                                {size}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <hr />
                      <div className="col-span-2">
                        <label className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          <input
                            type="checkbox"
                            name="newArrival"
                            value={addProductData.newArrival}
                            onChange={handleChange}
                            id="newArrival"
                            className="mr-2"
                          />
                          New Arrival
                        </label>
                      </div>

                      <div className="col-span-2">
                        <label
                          htmlFor="images"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Upload Images
                        </label>
                        <input
                          type="file"
                          name="images"
                          id="images"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        />
                        {/* Preview images */}
                        {selectedImages.length >= 5 ? (
                          <h1 className="text-red-300">
                            Only 5 Images Are Allowed
                          </h1>
                        ) : (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {selectedImages.map((image, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={URL.createObjectURL(image)} // Create a preview URL for the image
                                  alt="Preview"
                                  className="w-20 h-20 object-cover rounded-md"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                                >
                                  X
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn bg-blue-700 text-white hover:bg-blue-800 px-4 py-2 rounded-lg"
                    >
                      {loading ? "Adding Product..." : "Add Product"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Add Variant Modal */}
          {isVariantModalOpen && (
            <div
              id="crud-modal"
              tabIndex="-1"
              aria-hidden="true"
              className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
            >
              <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 overflow-y-auto max-h-[80vh]">
                  <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Add Variant
                    </h3>
                    <button
                      type="button"
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={toggleVariantModal}
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
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>
                  {/* Modal body */}
                  <form className="p-4 md:p-5">
                    <div className="grid gap-4 mb-4 grid-cols-2">
                      <div className="col-span-2">
                        <label
                          htmlFor="name"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Type product name"
                          required
                        />
                      </div>

                      <div className="col-span-2">
                        <label
                          htmlFor="description"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Description
                        </label>
                        <textarea
                          name="description"
                          id="description"
                          rows="3"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Add a short description"
                          required
                        ></textarea>
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label
                          htmlFor="price"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Price
                        </label>
                        <input
                          type="number"
                          name="price"
                          id="price"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="₹2999"
                          required
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label
                          htmlFor="stock"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Stock
                        </label>
                        <input
                          type="number"
                          name="stock"
                          id="stock"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Enter stock"
                          required
                        />
                      </div>

                      <div className="col-span-2">
                        <label
                          htmlFor="images"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Upload Images
                        </label>
                        <input
                          type="file"
                          name="images"
                          id="images"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        />
                        {/* Preview images */}
                        {selectedImages.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {selectedImages.map((image, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={URL.createObjectURL(image)}
                                  alt="Preview"
                                  className="w-20 h-20 object-cover rounded-md"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                                >
                                  X
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn bg-green-700 text-white hover:bg-green-800 px-4 py-2 rounded-lg"
                    >
                      Add Variant
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Edit Product Modal */}
          {isEditModalOpen && (
            <div
              id="crud-modal"
              tabIndex="-1"
              aria-hidden="true"
              className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
            >
              <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 overflow-y-auto max-h-[80vh]">
                  <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Edit Product
                    </h3>
                    <button
                      type="button"
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={toggleEditModal}
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
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>
                  {/* Modal body */}
                  <form
                    className="p-4 md:p-5"
                    onSubmit={handleEditProductSubmit}
                  >
                    <div className="grid gap-4 mb-4 grid-cols-2">
                      <div className="col-span-2">
                        <label
                          htmlFor="name"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={addProductData.name}
                          onChange={handleChange}
                          id="name"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Type product name"
                          required
                        />
                      </div>

                      <div className="col-span-2">
                        <label
                          htmlFor="description"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Description
                        </label>
                        <textarea
                          name="description"
                          id="description"
                          value={addProductData.description}
                          onChange={handleChange}
                          rows="3"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Add a short description"
                          required
                        ></textarea>
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label
                          htmlFor="price"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Price
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={addProductData.price}
                          onChange={handleChange}
                          id="price"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="₹2999"
                          required
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label
                          htmlFor="stock"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Stock
                        </label>
                        <input
                          type="number"
                          name="stock"
                          id="stock"
                          value={addProductData.stock}
                          onChange={handleChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Enter stock"
                          required
                        />
                      </div>

                      <div className="col-span-2">
                        <label
                          htmlFor="category"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Category
                        </label>
                        <input
                          type="text"
                          name="category"
                          value={addProductData.category}
                          onChange={handleChange}
                          id="category"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Enter product category"
                          required
                        />
                      </div>

                      <div className="col-span-2">
                        <label
                          htmlFor="brand"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Brand
                        </label>
                        <input
                          type="text"
                          name="brand"
                          value={addProductData.brand}
                          onChange={handleChange}
                          id="brand"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Enter product Brand"
                          required
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          <input
                            type="checkbox"
                            name="newArrival"
                            value={addProductData.newArrival}
                            onChange={handleChange}
                            id="newArrival"
                            className="mr-2"
                            checked={addProductData.newArrival}
                          />
                          New Arrival
                        </label>
                      </div>

                      <div className="col-span-2">
                        <label
                          htmlFor="images"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Upload Images
                        </label>
                        <input
                          type="file"
                          name="images"
                          id="images"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        />
                        {/* Preview images */}
                        {selectedImages.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {selectedImages.map((image, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={URL.createObjectURL(image)} // Create a preview URL for the image
                                  alt="Preview"
                                  className="w-20 h-20 object-cover rounded-md"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                                >
                                  X
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn bg-blue-700 text-white hover:bg-blue-800 px-4 py-2 rounded-lg"
                    >
                      {loading ? "Updating Product..." : "Update Product"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
