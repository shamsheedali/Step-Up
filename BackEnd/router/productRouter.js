import express from 'express';
import multer from 'multer'
import { addProduct, fetchProducts, getProduct, toggleProductStatus, editProduct, productCheckout } from '../controller/productController.js';
import verifyToken from '../middleware/middleware.js';

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } 
  }).array('images', 5);

router.post('/add_product', verifyToken, upload, addProduct);
router.get('/fetchProducts', fetchProducts);
router.get('/:id', getProduct);
router.patch('/toggle/:id', verifyToken, toggleProductStatus);
router.put('/:id', verifyToken, editProduct);
router.post('/product-checkout', verifyToken, productCheckout);

export default router;
