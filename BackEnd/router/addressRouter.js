import express from 'express';
import verifyToken from '../middleware/middleware.js';
import {addAddress, fetchAddress, editAddress, deleteAddress} from '../controller/addressController.js'

const router = express.Router();

router.get('/get-alladdress', verifyToken, fetchAddress);
router.post('/add-address', verifyToken, addAddress);
router.post('/edit-address/:id', verifyToken, editAddress);
router.get('/delete-address/:id', verifyToken, deleteAddress);

export default router;