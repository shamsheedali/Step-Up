import Category from '../modal/categoryModal.js'; 

// ADD CATEGORY
const addCategory = async (req, res) => {
  try {
    const newCategory = new Category(req.body); //sending { name, description } in req.body
    await newCategory.save();
    res.status(201).json({message: "New Category Added", newCategory});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// FETCH ALL CATEGORIES
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ data: categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle Delete/Recover Category
const toggleCategoryStatus = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await Category.findById({_id: categoryId});

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
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
    res.status(500).json({ message: error.message });
  }
};

export { addCategory, getCategories, editCategory, toggleCategoryStatus };
