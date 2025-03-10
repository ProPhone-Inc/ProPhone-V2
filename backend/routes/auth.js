const express = require("express");
const router = express.Router();
const { register, login,sendMagicCode,forgetpassword, verifycode,registeruser,resetpassword } = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/sendemail", sendMagicCode);
router.post("/forget-password", forgetpassword);
router.post("/verify-code", verifycode);
router.post("/register-user", registeruser);
router.post("/reset-password", resetpassword);

module.exports = router;
