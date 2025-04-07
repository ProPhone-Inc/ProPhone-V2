const express = require("express");
const router = express.Router();
const { register, login,sendMagicCode,forgetpassword, verifycode,registeruser,activateuser,deleteuser,banuser,resetpassword,adduser,fetchusers } = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/sendemail", sendMagicCode);
router.post("/forget-password", forgetpassword);
router.post("/verify-code", verifycode);
router.post("/register-user", registeruser);
router.post("/reset-password", resetpassword);
router.post("/add-user", adduser);
router.post("/ban-user", banuser);
router.post("/delete-user", deleteuser);
router.post("/activate-user", activateuser);
router.get("/fetch-users", fetchusers);

module.exports = router;
