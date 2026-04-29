const Category = require("../models/categoryModel");
const Dish = require("../models/dishModel");

// Create Category
exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    let image = "";
    if (req.file) {
      image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const category = await Category.create({ name, image });
    res.status(201).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (error) {
    console.error("Error in createCategory:", error);
    next(error);
  }
};

// Get All Categories
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      status: "success",
      results: categories.length,
      data: {
        categories,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete Category
exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    await Dish.deleteMany({ category: id });
    res.status(200).json({
      status: "success",
      message: "Category and associated dishes deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
