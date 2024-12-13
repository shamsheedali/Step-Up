import express from 'express';
import verifyToken from '../middleware/middleware.js';
import {addAddress, fetchAddress, editAddress, deleteAddress, getDefault} from '../controller/addressController.js'
import requireRole from '../middleware/requireRole.js';

const router = express.Router();

router.get('/get-alladdress/:id', verifyToken, requireRole("user"), fetchAddress);
router.post('/add-address/:id', verifyToken, requireRole("user"), addAddress);
router.post('/edit-address/:id', verifyToken, requireRole("user"), editAddress);
router.get('/delete-address/:id', verifyToken, requireRole("user"), deleteAddress);
router.get('/get-default/:id', verifyToken, requireRole("user"), getDefault);

export default router;