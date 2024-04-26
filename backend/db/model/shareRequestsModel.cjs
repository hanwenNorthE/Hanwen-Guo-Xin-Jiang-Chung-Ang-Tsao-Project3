const userModel = require('../schema/user.cjs')
const requestModel = require('../schema/shareRequests.cjs')
const passwordsModel = require('../schema/password.cjs')
const sharePasswordModel = require('../schema/sharePasswords.cjs')
const CryptoJS = require("crypto-js");

//createRequest
// req.body.shareUser - userB username  request with frontend
const createRequest = async (req, res) => {
    userB = req.body.shareUser

    if (!userB) {
        return res.status(400).json({ error: "Get share User failed" });
    }

    try {
        existingUser = await userModel.findOne({ username: userB }).select("-password");
    } catch (error) {
        return res.status(500).json({ error: "Username check failed during get" });
    }

    // Return an error message if the target user does not exist
    if (!existingUser) {
        return res.status(400).json({ error: "Target user does not exist" });
    }

    const userAId = req.user.id;

    const existingRequest = await requestModel.findOne({ toUser: userAId, fromUser: existingUser._id  });
    const existingRequestReverse = await requestModel.findOne({ toUser:  existingUser._id, fromUser: userAId  }); 
   
    if (existingRequest || existingRequestReverse) {
        return res.status(400).json({ error: "A request from one of the users already exists" });
    }

    try {
        const usernameA = await userModel.findOne({ _id: userAId }).select('username');
        const usernameB = await userModel.findOne({ _id: existingUser._id }).select('username');


        // create request
        const newRequest = new requestModel({
            fromUser:userAId,
            fromUsername:usernameA.username,
            toUser: existingUser._id, 
            toUsername: usernameB.username,
            creator: userAId 
        }) 
        await newRequest.save();
        res.json(newRequest); 
    } catch (error) {
        res.status(500).json({ error: 'Create new request failed' });
    }
};


// userB to check share request from others 
const getRequest = async (req, res) => {
    const userId = req.user.id;

    try {
        const pendingRequests = await requestModel.find({ toUser: userId, status: "pending" });

        // If there are no matching requests, return an error message
        if (pendingRequests.length === 0) {
            return res.status(404).json({ error: "No requests found for the specified user" });
        }

        res.json(pendingRequests);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Get request failed' });
    }
};


//updateRequest with accept or decline   
// req.body.userRequest : user ID who start request sent form frontend
const updateRequest = async (req, res) => {
    const userReceiveID  = req.user.id;
    const userRequestID = req.body.userRequest;
    const status  = req.params.result;
 

    const usernameReceive = await userModel.findOne({ _id: userReceiveID }).select('username');
    const usernameRequest = await userModel.findOne({ _id: userRequestID }).select('username');
  
    
    try {
        // Find
        const request = await requestModel.findOne({ toUser: userReceiveID, creator: userRequestID ,status: "pending" });

        // If the request does not exist, return an error message
        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }

        request.status = status;
        
        // Save the updated request
        await request.save();

         // add to share passward; 
        if (request.status === 'accepted') {
            try { 
                // userReceiveID - userRequestID
                const passwordsRequest = await passwordsModel.find({ creator: userRequestID });
                
                if(passwordsRequest.length === 0) {
                    return res.status(200).json({ message: 'Passwords shared successfully, but userRequest has not added any passwords yet' });
                }
                
                const sharePasswordsReceive = passwordsRequest.map(password => ({
                    username:usernameRequest.username,
                    userID:userRequestID,
                    title: password.title,
                    password: CryptoJS.AES.decrypt(
                        password.password ,
                        'secret-key'
                    ).toString(CryptoJS.enc.Utf8)
                }));
                

                await sharePasswordModel.create({sharePasswords: sharePasswordsReceive, creator: userReceiveID });
        
                // userRequestID - userReceiveID 
                const passwordsReceive = await passwordsModel.find({ creator: userReceiveID });
                if(!passwordsReceive){
                    return res.status(200).json({ message: 'Passwords shared successfully , userRequest have not add password yet' });
                }
                const sharePasswordsRequest= passwordsReceive.map(password => ({
                    username:usernameReceive.username,
                    userID:userReceiveID,
                    title: password.title,
                    password: CryptoJS.AES.decrypt(
                        password.password ,
                        'secret-key'
                      ).toString(CryptoJS.enc.Utf8)
                }));
             
                await sharePasswordModel.create({sharePasswords: sharePasswordsRequest, creator: userRequestID });
             
                return res.status(200).json({ message: 'Request status updated successfully, Passwords shared successfully, use get to show ' });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }

};






module.exports = {createRequest
    ,getRequest
    ,updateRequest 
    };

