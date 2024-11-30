import express from "express";
import multer from "multer";
import {
  addProduct,
  fetchProducts,
  getProduct,
  toggleProductStatus,
  editProduct,
  productCheckout,
  fetchProductsWithLimit,
  getTopSellingProducts,
  uploadEditImage,
} from "../controller/productController.js";
import verifyToken from "../middleware/middleware.js";

const router = express.Router();
//For adding product
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
}).array("images", 5);

//For Editing product image
const uploadEdit = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, 
}).single("file"); 
//Router for image edit upload
router.post("/upload", uploadEdit, uploadEditImage);

router.post("/add_product", verifyToken, upload, addProduct);
router.get("/fetchProducts", fetchProducts);
//Pagination
router.get("/productLimit", fetchProductsWithLimit);
router.get("/:id", getProduct);
router.patch("/toggle/:id", verifyToken, toggleProductStatus);
router.put("/:id", verifyToken, editProduct);
router.post("/product-checkout", verifyToken, productCheckout);
router.get('/top-selling/products', getTopSellingProducts);

export default router;
