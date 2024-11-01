import express from 'express';
import {createTransaction} from '../controller/paymentController.js'
const router = express.Router();

router.post('/createTransaction', createTransaction);


export default router;