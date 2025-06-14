import express from 'express';
import verifyToken from '../middleware/middleware.js';
import {addAddress, fetchAddress, editAddress, deleteAddress, getDefault} from '../controller/addressController.js'
import requireRole from '../middleware/requireRole.js';

const router = express.Router();

router.get('/address/:id', verifyToken, requireRole("user"), fetchAddress);
router.post('/address/:id', verifyToken, requireRole("user"), addAddress);
router.put('/address/:id', verifyToken, requireRole("user"), editAddress);
router.delete('/address/:id', verifyToken, requireRole("user"), deleteAddress);
router.get('/default-address/:id', verifyToken, requireRole("user"), getDefault);

export default router;