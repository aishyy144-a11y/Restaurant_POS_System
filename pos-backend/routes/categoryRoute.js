const express = require("express");
const categoryController = require("../controllers/categoryController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const upload = require("../middlewares/upload");

const router = express.Router();

router
  .route("/")
  .post(isVerifiedUser, upload.single("image"), categoryController.createCategory)
  .get(categoryController.getAllCategories);

router.route("/:id").delete(isVerifiedUser, categoryController.deleteCategory);

module.exports = router;
