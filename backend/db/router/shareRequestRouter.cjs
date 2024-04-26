const express = require("express");
const ShareRequestModel = require("../model/shareRequestsModel.cjs");
const checkAuth = require("../middleware/checkAuth.cjs");
const router = express.Router();


router.post("/createRequest", checkAuth,ShareRequestModel.createRequest); 

router.get("/getRequest", checkAuth,ShareRequestModel.getRequest); 

//  'accepted', 'rejected'
router.put("/updateRequest/:result", checkAuth,ShareRequestModel.updateRequest);  

module.exports = router;