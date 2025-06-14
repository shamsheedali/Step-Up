import admins from "../modal/adminModal.js";
import users from "../modal/userModal.js";
import Product from "../modal/productModal.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import HttpStatus from "../utils/httpStatus.js";

// ADMIN--LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await admins.findOne({ email });

    if (!admin) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Invalid Password" });
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

    return res
      .status(HttpStatus.OK)
      .json({ message: "Admin Login Successful", token });
  } catch (error) {
    console.error(error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error While Admin Login" });
  }
};

// GET--USERS--PAGINATED
const fetchUsersPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const allUsers = await users
      .find()
      .select("-password")
      .skip(skip)
      .limit(limit);
    const totalUsers = await users.countDocuments();

    res.json({ allUsers, totalUsers });
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching users", error });
  }
};

// FETCH USERS
const fetchUsers = async (req, res) => {
  try {
    const allUsers = await users.find().select("-password");
    res.json(allUsers);
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching users", error });
  }
};

// BLOCK--USER
const blockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await users.findByIdAndUpdate(
      userId,
      { status: "blocked" },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "User not found" });
    }

    // Emit userBanned event via Socket.IO
    const io = req.app.get("io");
    const connectedUsers = req.app.get("connectedUsers");
    const socketId = connectedUsers.get(userId);

    if (socketId) {
      io.to(socketId).emit("userBanned", { message: "You have been banned" });
    }

    res.json(updatedUser);
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// UNBLOCK--USER
const unBlockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await users.findByIdAndUpdate(
      userId,
      { status: "active" },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const searchUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const searchKey = req.query.searchKey || "";

    const query = {
      $or: [
        { username: { $regex: searchKey, $options: "i" } },
        { email: { $regex: searchKey, $options: "i" } },
      ],
    };

    const allUsers = await users
      .find(query)
      .select("-password")
      .skip(skip)
      .limit(limit);
    const totalUsers = await users.countDocuments(query);

    res.json({ allUsers, totalUsers });
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error searching users", error });
  }
};

const searchProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const searchKey = req.query.searchKey || "";

    const query = {
      $or: [
        { name: { $regex: searchKey, $options: "i" } },
        { description: { $regex: searchKey, $options: "i" } },
      ],
    };

    const products = await Product.find(query).skip(skip).limit(limit);
    const totalProducts = await Product.countDocuments(query);

    res.json({ products, totalProducts });
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error searching products", error });
  }
};

export {
  login,
  fetchUsers,
  blockUser,
  unBlockUser,
  searchUsers,
  searchProducts,
  fetchUsersPagination,
};