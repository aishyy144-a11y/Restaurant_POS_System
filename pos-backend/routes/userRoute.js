const express = require("express");
const router = express.Router();
const { register, login, getUserData, logout, getAllUsers, deleteUser } = require("../controllers/userController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");

router.post("/register", register);
router.post("/login", login);
router.get("/all", isVerifiedUser, getAllUsers);
router.get("/", isVerifiedUser, getUserData); // 🔑 protect route
router.post("/logout", logout);
router.delete("/:id", isVerifiedUser, deleteUser);

module.exports = router;
