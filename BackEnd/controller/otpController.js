import nodemailer from "nodemailer";
import users from "../modal/userModal.js";
import dotenv from "dotenv";
import HttpStatus from "../utils/httpStatus.js";

dotenv.config();

let givenOtp;

const sentOtpEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
    };

    // await transporter.sendMail(mailOptions);
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Email sent: " + info.response);
    });
    givenOtp = otp;
    console.log("OTP", givenOtp);
  } catch (error) {
    console.log(error);
  }
};

//verify otp
const verifyOtp = async (req, res) => {
  const { otpValue, userDetails } = req.body;
  try {
    if (givenOtp === otpValue) {
      const user = await users.findOneAndUpdate(
        { email: userDetails.email },
        { $set: { isVerified: true } },
        {new: true}
      );
      res.status(HttpStatus.OK).json({ message: "OTP Matched", user });
    } else {
      res.status(HttpStatus.BAD_REQUEST).jsonc({ message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error While matching OTP" });
  }
};

export { sentOtpEmail, verifyOtp };
