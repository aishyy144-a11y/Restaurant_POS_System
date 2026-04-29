const Dish = require("../models/dishModel");

// Create Dish
exports.createDish = async (req, res, next) => {
  try {
    console.log("Create Dish Body:", req.body); // Debug log
    const { name, price, category, description, isAvailable, qtyUnit } = req.body;
    let image = "";
    if (req.file) {
      image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }
    const dish = await Dish.create({
      name,
      price,
      category,
      description,
      isAvailable,
      image,
      qtyUnit: qtyUnit,
    });
    res.status(201).json({
      status: "success",
      data: {
        dish,
      },
    });
  } catch (error) {
    console.error("Error in createDish:", error);
    next(error);
  }
};

// Delete Dish
exports.deleteDish = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Dish.findByIdAndDelete(id);
    res.status(200).json({
      status: "success",
      message: "Dish deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Update Dish
exports.updateDish = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { price } = req.body;
    
    // We only update price for now based on requirement, but let's allow other fields too if passed
    const updatedDish = await Dish.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedDish) {
      return res.status(404).json({
        status: "fail",
        message: "No dish found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        dish: updatedDish,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get All Dishes
exports.getAllDishes = async (req, res, next) => {
  try {
    const dishes = await Dish.find().populate("category");
    res.status(200).json({
      status: "success",
      results: dishes.length,
      data: {
        dishes,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get Dishes by Category
exports.getDishesByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const dishes = await Dish.find({ category: categoryId });
    res.status(200).json({
      status: "success",
      results: dishes.length,
      data: {
        dishes,
      },
    });
  } catch (error) {
    next(error);
  }
};
