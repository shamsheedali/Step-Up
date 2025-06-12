import admins from "../modal/adminModal.js";
import users from "../modal/userModal.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import HttpStatus from "../utils/httpStatus.js";

//ADMIN--LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await admins.findOne({ email });

    if (!admin) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(HttpStatus.OK).json({ message: "Admin Login Successful", token });
  } catch (error) {
    console.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error While Admin Login" });
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

//BLOCK--USER
const blockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await users.findByIdAndUpdate(
      userId,
      { status: "blocked" },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

//UNBLOCK--USER
const unBlockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await users.findByIdAndUpdate(
      userId,
      { status: "active" }, 
      { new: true }
    );

    if (!updatedUser) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

export { login, fetchUsers, blockUser, unBlockUser };
