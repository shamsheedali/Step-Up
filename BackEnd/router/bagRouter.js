import express from 'express';
import {addToBag, fetchBag, deleteProductFromBag, clearBag} from '../controller/bagController.js'
const router = express.Router();

router.post('/', addToBag);
router.get('/:id', fetchBag);
router.delete('/:userId/product/:productId', deleteProductFromBag);
router.delete('/clear-bag/:id', clearBag);

export default router;