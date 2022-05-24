const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const regController = require("../controller/register");
router.post("/register", regController.register);
router.post("/verifyotp" , regController.verifyotp)
router.post("/login", regController.login);
router.get("/logout", auth ,regController.logout);
router.post("/resendotp" ,regController.resendotp);
router.post("/forgotverifyotp" ,regController.forgotverifyotp);
router.post("/fresendotp" ,regController.fresendotp);
router.post("/forgotpasswordotp" ,regController.forgotpasswordotp);
router.post("/changepassword" ,regController.changepassword);

module.exports = router;