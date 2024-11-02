import express from 'express';
import {addToWishlist, fetchWishlist, removeFromWishlist} from '../controller/wihslistController.js'
const router = express.Router();

router.post('/addto-wishlist', addToWishlist);
router.get('/:id', fetchWishlist);
router.delete('/:userId/product/:productId', removeFromWishlist);

export default router;