import Product from "../modal/productModal.js";
import Order from "../modal/orderModal.js";
import HttpStatus from "../utils/httpStatus.js";
import uploadImageToS3 from "../aws/awsConfig.js";
import mongoose from "mongoose";

// const addProduct = async (req, res) => {
//   try {
//     const {
//       name,
//       description,
//       price,
//       category,
//       brand,
//       sizes,
//       newArrival,
//       stock,
//     } = req.body;

//     if (!name || !price || !category || !brand || !stock) {
//       return res
//         .status(HttpStatus.BAD_REQUEST)
//         .json({ error: "Missing required fields" });
//     }

//     // Check if any files were uploaded
//     if (!req.files || req.files.length === 0) {
//       return res
//         .status(HttpStatus.BAD_REQUEST)
//         .json({ error: "No images uploaded" });
//     }

//     // Convert image buffers to base64
//     const imagesBuffer = req.files.map((file) =>
//       file.buffer.toString("base64")
//     );

//     const parsedSizes = JSON.parse(sizes);

//     const newProduct = new Product({
//       productName: name,
//       description,
//       price,
//       category,
//       brand,
//       sizes: parsedSizes,
//       newArrival: newArrival === "true",
//       stock,
//       images: imagesBuffer, // Store as an array of base64 strings
//     });

//     // Save the product in the database
//     await newProduct.save();

//     // Return success response
//     res
//       .status(201)
//       .json({ message: "Product uploaded successfully!", product: newProduct });
//   } catch (err) {
//     console.error(err);
//     res
//       .status(HttpStatus.INTERNAL_SERVER_ERROR)
//       .json({ error: "Error uploading product: " + err.message });
//   }
// };

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      brand,
      sizes,
      newArrival,
      stock,
    } = req.body;

    if (!name || !price || !category || !brand || !stock) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "Missing required fields" });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "No images uploaded" });
    }

    // Get Cloudinary URLs from req.files
    const uploadedImagesUrls = req.files.map((file) => file.path); // `path` contains the Cloudinary URL

    const parsedSizes = JSON.parse(sizes);

    const newProduct = new Product({
      productName: name,
      description,
      price,
      category,
      brand,
      sizes: parsedSizes,
      newArrival: newArrival === "true",
      stock,
      images: uploadedImagesUrls, // Cloudinary URLs
    });

    await newProduct.save();

    res
      .status(201)
      .json({ message: "Product uploaded successfully!", product: newProduct });
  } catch (err) {
    console.error(err);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error uploading product: " + err.message });
  }
};

const fetchProducts = async (req, res) => {
  try {
    const allProducts = await Product.find();
    res
      .status(HttpStatus.OK)
      .json({ message: "Successfully fetched Products", allProducts });
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "error fetching products", error });
  }
};

//FETCHING PRODUCT WITH PAGINATION
const fetchProductsWithLimit = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments({});
    const products = await Product.find({}).skip(skip).limit(limit);

    res.status(HttpStatus.OK).json({ products, totalProducts });
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching products", error });
  }
};

//Advanced Filter
const advancedFilter = async (req, res) => {
  try {
    const { search, categories, sortBy, page = 1, limit = 8 } = req.query;

    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const skip = (pageInt - 1) * limitInt;

    const filterCriteria = { isDeleted: false };

    if (search) {
      filterCriteria.productName = { $regex: search, $options: "i" };
    }

    if (categories) {
      const categoryArray = categories
        .split(",")
        .map((category) => new mongoose.Types.ObjectId(category));
      filterCriteria.category = { $in: categoryArray };
    }

    let sortCriteria = {};
    if (sortBy) {
      switch (sortBy) {
        case "lowToHigh":
          sortCriteria = { price: 1 };
          break;
        case "highToLow":
          sortCriteria = { price: -1 };
          break;
        case "aToZ":
          sortCriteria = { productName: 1 };
          break;
        case "zToA":
          sortCriteria = { productName: -1 };
          break;
        case "newArrival":
          sortCriteria = { createdAt: -1 };
          break;
        default:
          sortCriteria = {};
      }
    }
    const totalProducts = await Product.countDocuments(filterCriteria);
    const products = await Product.find(filterCriteria)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limitInt);

    res.status(HttpStatus.OK).json({ products, totalProducts });
  } catch (error) {
    console.log(error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching products", error });
  }
};

//get Single Product
const getProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const singleProduct = await Product.findById({ _id: id });
    if (!singleProduct) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Product Not Found!" });
    }

    const relatedProductsData = await Product.find({
      category: singleProduct.category,
    }).limit(4);

    res
      .status(201)
      .json({ message: "Product Found", singleProduct, relatedProductsData });
  } catch (error) {
    console.log(error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error While Fecthing Product" });
  }
};

//EDIT PRODUCT
const editProduct = async (req, res) => {
  const productID = req.params.id;
  try {
    const singleProduct = await Product.findByIdAndUpdate(productID, req.body, {
      new: true,
    });

    if (!singleProduct) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Product not found" });
    }

    res.json(singleProduct);
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

//STORE EDIT IMAGE IN CLOUDINARY
const uploadEditImage = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "No image uploaded" });
    }

    // Get the Cloudinary URL from req.file
    const uploadedImageUrl = req.file.path; // Cloudinary URL

    res.status(HttpStatus.OK).json({
      message: "Image uploaded successfully",
      url: uploadedImageUrl,
    });
  } catch (err) {
    console.error(err);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error uploading image: " + err.message });
  }
};

//TOGGLE PRODUCT STATUS isDELETED TRUE / FALSE
const toggleProductStatus = async (req, res) => {
  const productID = req.params.id;
  try {
    const singleProduct = await Product.findById({ _id: productID });

    if (!singleProduct) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Product not found" });
    }

    const newStatus = !singleProduct.isDeleted;

    const updatedProduct = await Product.findByIdAndUpdate(
      productID,
      { isDeleted: newStatus },
      { new: true }
    );

    res.json({
      message: newStatus ? "Product Unpublished" : "Product Published",
      updatedProduct,
    });
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

//Get Product for checkout
const productCheckout = async (req, res) => {
  try {
    const productIds = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Invalid product IDs" });
    }

    // Finding products with the specified IDs
    const products = await Product.find({ _id: { $in: productIds } });

    if (!products || products.length === 0) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Products not found" });
    }

    // Send back the products with necessary details
    res.status(HttpStatus.OK).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

//TOP SELLING PRODUCTS
const getTopSellingProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalQuantitySold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: 3 },
    ]);

    const productIds = topProducts.map((product) => product._id);
    const products = await Product.find({ _id: { $in: productIds } })
      .select("productName price category images")
      .lean();

    const populatedProducts = topProducts.map((topProduct) => {
      const product = products.find(
        (p) => p._id.toString() === topProduct._id.toString()
      );
      return {
        ...product,
        totalQuantitySold: topProduct.totalQuantitySold,
      };
    });

    res.status(HttpStatus.OK).json({ products: populatedProducts });
  } catch (error) {
    console.error("Error fetching top-selling products:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to fetch top-selling products" });
  }
};

//THREE NEW ARRIVAL PRODUCTS FOR HOMEPAGE
const getThreeNewArrivalProducts = async (req, res) => {
  try {
    const newArrivals = await Product.find({
      newArrival: true,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(3);

    res.status(HttpStatus.OK).json({ products: newArrivals });
  } catch (error) {
    console.error("Error fetching new arrival products:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to fetch new arrival products" });
  }
};

export {
  addProduct,
  fetchProducts,
  getProduct,
  toggleProductStatus,
  editProduct,
  productCheckout,
  fetchProductsWithLimit,
  getTopSellingProducts,
  uploadEditImage,
  advancedFilter,
  getThreeNewArrivalProducts,
};
