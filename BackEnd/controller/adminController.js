import admins from "../modal/adminModal.js";
import users from "../modal/userModal.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//ADMIN--LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await admins.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({ message: "Admin Login Successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error While Admin Login" });
  }
};

//GET--USERS
const fetchUsers = async (req, res) => {
  try {
    const allUsers = await users.find();
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

//BLOCK--USER
const blockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await users.findByIdAndUpdate(
      userId,
      { status: "blocked" },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//UNBLOCK--USER
const unBlockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await users.findByIdAndUpdate(
      userId,
      { status: "active" }, // Update the status to 'active'
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { login, fetchUsers, blockUser, unBlockUser };
