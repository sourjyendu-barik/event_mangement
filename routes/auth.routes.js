const express = require("express");
const router = express();

const { register, login, logout } = require("../controller/authController");

router.post("/signIn", register);
router.post("/login", login);
router.post("/logout", logout);
module.exports = router;
