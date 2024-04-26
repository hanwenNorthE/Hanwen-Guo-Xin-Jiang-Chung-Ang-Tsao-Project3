const userModel = require('../schema/user.cjs')
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs'); 
const { session } = require('express-session');

// signup
const signup = async (req, res) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors:'Input is invalid, username is empty or password less than 6'});
    } 

    const { username, password } = req.body;   
    let user ;
    try{
    user = await userModel.findOne({ username: username })
    } catch (error) {
        return res.status(400).json({ error: "Username check in API failed" });
    }

    
  if (user) {
    return res.status(400)
      .json({ error: "Username already exist" });
  } 

  let encryptedPassword;
  try {
    encryptedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return res.status(400).json({ error: error, message:"Sign up password encrypt failed" });
  } 

  const newUser = new userModel({
    username:username,
    password:encryptedPassword
  }) 
  
  try {
    await newUser.save();
  } catch (error) {
    console.log(errors.message)
    return res.status(400).json({ error: "Sign up failed" });
  }


    
  req.session.userID = newUser._id;
  req.session.cookie.expires = new Date(Date.now() +  300 * 60 * 1000 ); 
  
  const responseData = 
    {
      "_id": newUser._id,
      "username": newUser.username,
      "password": newUser.password,
      "friends":newUser.friends ,
      "createdAt": newUser.createdAt,
      "updatedAt": newUser.updatedAt, 
      "cookieId": req.session.userID,
      "cookieExpires": req.session.cookie.expires
  }

  res.json(responseData); 


}


// login 
const login = async (req, res) => { 
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors:'Input is invalid, username or password is empty'});
    } 

    const { username, password } = req.body;
    let user; 
    try{
        user = await userModel.findOne({ username: username }); 
    }catch(error){
        return res.status(400).json({ error: "Username validation failed during login" });
    } 

    if (!user){
        return res.status(400).json({ error: "Username not in database" });
    }

    let isValidPassword;
    try{
        isValidPassword = await bcrypt.compare(password, user.password);
    } catch{
        return res.status(400).json({ error: "Password validation failed during login" });
    }

    if (!isValidPassword){
        return res.status(400).json({ error: "Password not match" });
    }

    
    req.session.userID = user._id;
    req.session.cookie.expires = new Date(Date.now() +  300 * 60 * 1000 ); 
    
    const responseData = 
      {
        "_id": user._id,
        "username": user.username,
        "password": user.password,
        "friends":user.friends ,
        "createdAt": user.createdAt,
        "updatedAt": user.updatedAt, 
        "cookieId": req.session.userID,
        "cookieExpires": req.session.cookie.expires
    }

    
    res.json(responseData); 

    
    
  }


// getUser 
const getUser = async (req, res) => { 
    let user;
    try {
      username = req.body.username;
       user = await userModel.findOne({ username: username }).select("-password");
    } catch (error) {
      return res.status(500).json({ error: "Username check failed during get" });
    }
    if (!user){
      return res.status(400).json({ error: "Username not in database" });
    }
    res.json(user);
  };


  const updatePw = async (req, res) => {
    const { username, password } = req.body; 
  
    try {
      let user = await userModel.findOne({ username: username });
      if (!user) {
        return res.status(400).json({ error: "Username not found" });
      }
      const encryptedPassword = await bcrypt.hash(password, 12);
      user.password = encryptedPassword;
  
      await user.save(); 
      res.json({ message: "Password updated successfully" });
  
    } catch (error) {
      return res.status(500).json({ error: "Password update failed" });
    }
  };
  


//logout 
const logout = async (req, res) => {
  try {
      req.session.destroy((err) => {
          if (err) {
              res.status(500).send('Logout clear session failed');
          } else {
              res.send('Logout Succ');
          }
      });
  } catch (error) {
      res.status(500).send('Logout failed');
  }
};

module.exports = {signup
                  ,login
                  ,getUser 
                  // ,addMutualFriendship 
                  ,updatePw
                  ,logout
                  };


