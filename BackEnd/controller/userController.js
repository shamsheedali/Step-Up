import users from "../modal/userModal.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//USER-- SIGNUP
const signUp = async(req, res) => {
  try {
    const {username, email, password} = req.body;

    const user = await users.findOne({email});
    if(user){
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new users({
        username,
        email,
        password : hashedPassword
    })

    // Save user to database
    await newUser.save();

    //New User Token
    const token = jwt.sign(
        {
          id: newUser._id,
          email: newUser.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(201).json({ message: "Signup Successful", token, newUser })
      console.log("New User Signed In");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error SigningUp" });
  }
};

//USER--LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await users.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User Not Available" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    //updating isVerified
    await users.findOneAndUpdate({email}, {$set: {isVerified: true}});
    return res.status(200).json({ message: "Login Successful", token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//storing google user in db
const storeGoogleUser = async (req, res) => {
  try {
    const { uid, name, email, profileImage } = req.body;

    let user = await users.findOne({ email });

    if (user) {
      console.log("Existing user logged in:", user);
      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user: {
          googleID: user.googleID,
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
      return res.status(201).json({
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
    res.status(500).json({ success: false, message: "Failed to store or log in user" });
  }
};


export { signUp, login, storeGoogleUser };