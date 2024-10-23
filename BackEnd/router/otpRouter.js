import express from 'express';
import { sentOtpEmail,verifyOtp } from '../controller/otpController.js';


const router = express.Router();

router.post('/send_otp', async(req, res) => {
    const {email} = req.body;
    const otp = Math.floor(1000 + Math.random() * 9000);

    try {
        await sentOtpEmail(email, otp);
        res.status(200).json({ message: 'OTP sent successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send OTP.' });
    }
});

router.post('/verify_otp', verifyOtp);

export default router;