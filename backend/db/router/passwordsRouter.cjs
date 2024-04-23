const express = require("express");
const { check } = require("express-validator");
const passwordModel = require("../model/passwordsModel.cjs");
const checkAuth = require("../middleware/checkAuth.cjs");
const router = express.Router();

//getAllPasswords
router.get("/", checkAuth, 
passwordModel.getAllPasswords);  

//fuzzyMatching
router.get("/search/:service", 
    checkAuth, 
    [check("service").not().isEmpty()],
    passwordModel.fuzzyMatching);

//addPassword
router.post(
  "/add",
 checkAuth,
  [
    check("title").not().isEmpty(),
    check("password").isLength({ min: 6 }),
  ],
  passwordModel.addPassword
);


//updatePassword
router.patch(
  "/update/:title",
  checkAuth,
  [check("title").not().isEmpty()
  , check("password").isLength({ min: 6 })],
  passwordModel.updatePassword
);

//deletePassword
router.delete("/delete/:title", checkAuth,
 passwordModel.deletePassword);

module.exports = router;