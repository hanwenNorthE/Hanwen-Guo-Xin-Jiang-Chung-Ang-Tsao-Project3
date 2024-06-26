const express = require("express");
const { check } = require("express-validator");
const userModel = require("../model/userModel.cjs");
const checkAuth = require("../middleware/checkAuth.cjs");
const router = express.Router();

//Router for signing up a new user
router.post(
  "/signup",
  [
    check("username").exists().not().isEmpty(),
    check("password").isLength({ min: 6 }),
  ],
  userModel.signup
);

//Router for loging in an existing user
router.post(
  "/login",
  [
    check("username").exists().not().isEmpty(),
    check("password").exists().not().isEmpty(),
  ],
  userModel.login
);

//router for getting user details
router.get("/getUser", checkAuth,userModel.getUser);

//router for update user login pw 
router.put("/updatePw", checkAuth,userModel.updatePw); 

// //router for adding a friend in order to share passwords
// router.post("/addMutualFriendship",checkAuth, userModel.addMutualFriendship ); 

// //share password

//router for logout
router.get("/logout", checkAuth,userModel.logout ); 
module.exports = router;