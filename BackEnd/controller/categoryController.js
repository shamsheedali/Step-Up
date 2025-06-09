import Category from '../modal/categoryModal.js'; 
import Product from "../modal/productModal.js";
import Order from "../modal/orderModal.js";
import HttpStatus from '../utils/httpStatus.js';

// ADD CATEGORY
const addCategory = async (req, res) => {
  try {
    const newCategory = new Category(req.body); //sending { name, description } in req.body
    await newCategory.save();
    res.status(HttpStatus.CREATED).json({message: "New Category Added", newCategory});
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// FETCH ALL CATEGORIES
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ data: categories });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// EDIT CATEGORY
const editCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      req.body,
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: "Category not found" });
    }

    res.json(updatedCategory);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// Toggle Delete/Recover Category
const toggleCategoryStatus = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await Category.findById({_id: categoryId});

    if (!category) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: "Category not found" });
    }

    // Toggle the isDeleted field
    const newStatus = !category.isDeleted;

    // Update the category
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { isDeleted: newStatus },
      { new: true } // Return the updated category
    );

    res.json({
      message: newStatus ? "Category deleted successfully" : "Category recovered successfully",
      updatedCategory
    });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

//TOP SELLING CATEGORIES
const getTopSellingCategories = async (req, res) => {
  try {
    const topCategories = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products", 
          localField: "items.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.category", 
          totalQuantitySold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: 3 }, 
    ]);

    res.status(HttpStatus.OK).json({ categories: topCategories });
  } catch (error) {
    console.error("Error fetching top-selling categories:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to fetch top-selling categories" });
  }
};


export { addCategory, getCategories, editCategory, toggleCategoryStatus, getTopSellingCategories };
