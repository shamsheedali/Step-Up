import express from 'express';
import verifyToken from '../middleware/middleware.js';
import {addAddress, fetchAddress, editAddress, deleteAddress, getDefault} from '../controller/addressController.js'

const router = express.Router();

router.get('/get-alladdress/:id', verifyToken, fetchAddress);
router.post('/add-address/:id', verifyToken, addAddress);
router.post('/edit-address/:id', verifyToken, editAddress);
router.get('/delete-address/:id', verifyToken, deleteAddress);
router.get('/get-default/:id', verifyToken, getDefault);

export default router;