const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/userController"); // Nhập controller vừa bóc tách
const { verifyUser, verifyAdmin } = require("../middlewares/authenticate");

router.post("/register", userController.register);

router.post("/login", userController.login);

router.get("/", verifyUser, verifyAdmin, userController.getAllUsers);

module.exports = router;
