import Product from "../modal/productModal.js";
import Order from "../modal/orderModal.js";

const addProduct = async (req, res) => {
  try {
    console.log(req.files);
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
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if any files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }

    // Convert image buffers to base64
    const imagesBuffer = req.files.map((file) =>
      file.buffer.toString("base64")
    );

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
      images: imagesBuffer, // Store as an array of base64 strings
    });

    // Save the product in the database
    await newProduct.save();

    // Return success response
    res
      .status(201)
      .json({ message: "Product uploaded successfully!", product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error uploading product: " + err.message });
  }
};

const fetchProducts = async (req, res) => {
  try {
    const allProducts = await Product.find();
    res
      .status(200)
      .json({ message: "Successfully fetched Products", allProducts });
  } catch (error) {
    res.status(500).json({ message: "error fetching products", error });
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

    res.status(200).json({ products, totalProducts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

//get Single Product
const getProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const singleProduct = await Product.findById({ _id: id });
    if (!singleProduct) {
      return res.status(400).json({ message: "Product Not Found!" });
    }

    const relatedProductsData = await Product.find({
      category: singleProduct.category,
    }).limit(4);

    res
      .status(201)
      .json({ message: "Product Found", singleProduct, relatedProductsData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error While Fecthing Product" });
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
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(singleProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//TOGGLE PRODUCT STATUS ISDELETED TRUE / FALSE
const toggleProductStatus = async (req, res) => {
  const productID = req.params.id;
  try {
    const singleProduct = await Product.findById({ _id: productID });

    if (!singleProduct) {
      return res.status(400).json({ message: "Product not found" });
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
    res.status(500).json({ message: error.message });
  }
};

//Get Product for checkout
const productCheckout = async (req, res) => {
  try {
    const productIds = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: "Invalid product IDs" });
    }

    // Finding products with the specified IDs
    const products = await Product.find({ _id: { $in: productIds } });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "Products not found" });
    }

    // Send back the products with necessary details
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
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
      { $limit: 3 } 
    ]);

    const productIds = topProducts.map((product) => product._id);
    const products = await Product.find({ _id: { $in: productIds } })
      .select("productName price category images") // Select required fields
      .lean(); // Use lean to get plain JavaScript objects

    const populatedProducts = topProducts.map((topProduct) => {
      const product = products.find((p) => p._id.toString() === topProduct._id.toString());
      return {
        ...product,
        totalQuantitySold: topProduct.totalQuantitySold,
      };
    });

    res.status(200).json({ products: populatedProducts });
  } catch (error) {
    console.error("Error fetching top-selling products:", error);
    res.status(500).json({ error: "Failed to fetch top-selling products" });
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
};
