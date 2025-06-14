import users from "../modal/userModal.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import HttpStatus from "../utils/httpStatus.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

//USER-- SIGNUP
const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await users.findOne({ email });
    if (user) {
      if (!user.isVerified) {
        await users.deleteOne({ email });
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "User already exists" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new users({
      username,
      email,
      password: hashedPassword,
      googleID: null,
    });

    // Save user to database
    await newUser.save();

    //New User Token
    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        role: "user",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res
      .status(HttpStatus.CREATED)
      .json({ message: "Signup Successful", token, newUser });
  } catch (error) {
    console.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
  }
};

//USER--LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await users.findOne({ email });
    if (!user) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "User Not Available" });
    }

    if (user.isVerified === false) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: "Account not verified try sign up again!" });
    }

    if (user.status === "blocked") {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: "Your Account is Blocked!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: "user",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    //updating isVerified
    await users.findOneAndUpdate({ email }, { $set: { isVerified: true } });
    return res
      .status(HttpStatus.OK)
      .json({ message: "Login Successful", token, user });
  } catch (error) {
    console.error(error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

//storing google user in db
const storeGoogleUser = async (req, res) => {
  try {
    const { uid, name, email, profileImage } = req.body;

    let user = await users.findOne({ email });

    if (user) {
      if (user.status === "blocked") {
        return res
          .status(HttpStatus.FORBIDDEN)
          .json({ message: "Your Account is Blocked!" });
      }
      //New User Token While Login
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: "user",
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "User logged in successfully",
        token,
        user: {
          uid: user._id,
          googleID: user.googleID || undefined,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
        },
      });
    } else {
      // New user registration (signup scenario)
      const newUser = new users({
        googleID: uid,
        username: name,
        email,
        profileImage,
      });

      await newUser.save();
      //Finding this _id and sending to frontend
      const user = await users.findOne({ email });
      //New User Token While Signup
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: "user",
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: "New user registered and logged in",
        token,
        user: {
          uid: user._id,
          googleID: newUser.googleID,
          username: newUser.username,
          email: newUser.email,
          profileImage: newUser.profileImage,
        },
      });
    }
  } catch (error) {
    console.error("Error storing or logging in Google user:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to store or log in user" });
  }
};

//UPDATE USER--USERNAME AND EMAIL
const updateUserData = async (req, res) => {
  const { username, email, _id } = req.body;
  try {
    const user = await users.findOne({ _id });

    if (!user)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "User not found!" });

    const updatedUser = await users.findByIdAndUpdate(
      _id,
      {
        $set: {
          username,
          email,
        },
      },
      { new: true }
    );

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Your profile has been successfully updated!",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
  }
};

//CHANGE USER PASSWORD
const changePassword = async (req, res) => {
  const { password, newPassword, _id } = req.body;

  try {
    const user = await users.findById(_id);

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send("Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    const updatedUser = await users.findByIdAndUpdate(
      _id,
      { $set: { password: hashedPassword } },
      { new: true }
    );

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Password changed successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send("Error saving the new password");
  }
};

//Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await users.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    //Random 6-digit verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const hashedCode = crypto
      .createHash("sha256")
      .update(verificationCode)
      .digest("hex");
    const codeExpiry = Date.now() + 3600000; // 1 hour

    user.resetPasswordCode = hashedCode;
    user.resetPasswordExpiry = codeExpiry;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Verification Code",
      text: `Your password reset verification code is: ${verificationCode}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Email sent: " + info.response);
    });

    console.log("Verification Code: - ", verificationCode);

    res.status(HttpStatus.OK).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error(error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

//FORGOT PASSWORD VERIFICATION
const forgotPasswordVerify = async (req, res) => {
  const { email, code, password } = req.body;
  try {
    const user = await users.findOne({ email });
    if (!user) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "User not found" });
    }

    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

    console.log(
      user.resetPasswordCode,
      user.resetPasswordExpiry,
      user.resetPasswordCode !== hashedCode,
      user.resetPasswordExpiry < Date.now()
    );
    if (
      user.resetPasswordCode !== hashedCode ||
      user.resetPasswordExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.status(HttpStatus.OK).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

//GET--USERS
const fetchUsers = async (req, res) => {
  try {
    const allUsers = await users.find().select('-password');
    res.json(allUsers);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error fetching users", error });
  }
};

export {
  signUp,
  login,
  storeGoogleUser,
  updateUserData,
  changePassword,
  forgotPassword,
  forgotPasswordVerify,
  fetchUsers,
};
