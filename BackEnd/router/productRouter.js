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
  advancedFilter,
  getThreeNewArrivalProducts,
} from "../controller/productController.js";
import verifyToken from "../middleware/middleware.js";
import requireRole from "../middleware/requireRole.js";
import { cloudinary, storage } from "../cloudinary/config.js";

const router = express.Router();
//For adding product

//AWS-S3
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 5 * 1024 * 1024 },
// }).array("images", 5);

// //For Editing product image
// const uploadEdit = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 5 * 1024 * 1024 }, 
// }).single("file"); 

// For adding product (multiple images)
//Cloudinary
const upload = multer({
  storage: storage, 
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).array("images", 5);

// For editing product image (single image)
const uploadEdit = multer({
  storage: storage, 
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single("file");
//Router for image edit upload
router.post("/upload", uploadEdit, uploadEditImage);

router.post("/add_product", verifyToken, requireRole("admin"), upload, addProduct);
router.get("/fetchProducts", fetchProducts);
//Pagination
router.get("/productLimit", fetchProductsWithLimit);
//Advanced filter
router.get("/filter_products", advancedFilter);
router.get("/:id", getProduct);
router.patch("/toggle/:id", verifyToken, requireRole("admin"), toggleProductStatus);
router.put("/:id", verifyToken, requireRole("admin"), editProduct);
router.post("/product-checkout", productCheckout);
router.get('/top-selling/products', getTopSellingProducts);
//Three new Arrival product for homepage
router.get("/three/new-arrivals", getThreeNewArrivalProducts);

export default router;
