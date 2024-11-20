import users from "../modal/userModal.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import HttpStatus from "../utils/httpStatus.js";

//USER-- SIGNUP
const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await users.findOne({ email });
    if (user) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "User already exists" });
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
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(HttpStatus.CREATED).json({ message: "Signup Successful", token, newUser });
    console.log("New User Signed In");
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
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "User Not Available" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    //updating isVerified
    await users.findOneAndUpdate({ email }, { $set: { isVerified: true } });
    return res.status(HttpStatus.OK).json({ message: "Login Successful", token, user });
  } catch (error) {
    console.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};

//storing google user in db
const storeGoogleUser = async (req, res) => {
  try {
    const { uid, name, email, profileImage } = req.body;

    let user = await users.findOne({ email });

    if (user) {
      console.log("Existing user logged in:", user);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "User logged in successfully",
        user: {
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
      console.log("New Google user created and logged in.");
      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: "New user registered and logged in",
        user: {
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

    if (!user) return res.status(HttpStatus.BAD_REQUEST).json({ message: "User not found!" });

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
      return res.status(HttpStatus.BAD_REQUEST).send("Current password is incorrect");
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
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error saving the new password');
  }
};


export { signUp, login, storeGoogleUser, updateUserData, changePassword };
