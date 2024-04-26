const express = require("express");
const sharePasswordsModel = require("../model/sharePasswordsModel.cjs");
const checkAuth = require("../middleware/checkAuth.cjs");
const router = express.Router();

//getAllSharePasswords
router.get("/", checkAuth, sharePasswordsModel.getAllSharePasswords); 


module.exports = router;