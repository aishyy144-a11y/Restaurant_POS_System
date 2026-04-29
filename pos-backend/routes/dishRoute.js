const express = require("express");
const dishController = require("../controllers/dishController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const upload = require("../middlewares/upload");

const router = express.Router();

router
  .route("/")
  .post(isVerifiedUser, upload.single("image"), dishController.createDish)
  .get(dishController.getAllDishes);

router.route("/:id")
  .delete(isVerifiedUser, dishController.deleteDish)
  .put(isVerifiedUser, dishController.updateDish);

router.route("/category/:categoryId").get(dishController.getDishesByCategory);

module.exports = router;
