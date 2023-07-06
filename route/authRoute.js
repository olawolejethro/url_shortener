const express = require("express");
const { signUpUser, signInUser } = require("../controller/authController");
const router = express.Router();

router.post("/signup", signUpUser);
router.post("/login", signInUser);

module.exports = router;
