const { validationResult } = require("express-validator");
const CryptoJS = require("crypto-js");
const passwordModel = require("../schema/password.cjs");  

//getAllPasswords 
const getAllPasswords = async (req, res,next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors:'Input is invalid, title or password can not be empty'});
    }
  
    try {
      const userPasswords  = await passwordModel.find({ creator: req.user.id });  
      if (!userPasswords.length || userPasswords.length === 0 ){
        return res.status(400).json({errors:'User not found'});
      }
  
      const decryptedPasswords = userPasswords.map((userPassword) => {
        return {
          id: userPassword.id,
          creator: userPassword.creator,
          title: userPassword.title,
          password: CryptoJS.AES.decrypt(
            userPassword.password,
            'secret-key'
          ).toString(CryptoJS.enc.Utf8),
          createdAt: userPassword.createdAt,
          updatedAt: userPassword.updatedAt,
        };
      });
  
      res.json(decryptedPasswords);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "User passwords query faild" });
    }
  };
  

 // addPassword
  const addPassword = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Input is invalid, title or password can not be empty" });
    }

    password = req.body.password;
    title = req.body.title; 
    try {
        const user = await passwordModel.findOne({ title: title, creator: req.user.id }); 
         // check tittle if exist
        if (user) {
        return res.status(400).json({ error: 'Title already exist' });
        }
        encryptedPassword = CryptoJS.AES.encrypt(
        password,
        'secret-key'
      ).toString();
    } catch (error) {
      return res.status(500).json({ error: "Password encrypted failed" });
    }
    
  
    const newPassword = new passwordModel({
      title:title,
      password:encryptedPassword,
     creator:req.user.id
    });
  
    try {
      await newPassword.save();
    } catch (error) { 
      return res .status(500).json({ error: "New password add failed" });
    }
  
    res.json({
     id: newPassword.id,
      creator: newPassword.creator,
      title: newPassword.title,
      password: CryptoJS.AES.decrypt(
        newPassword.password,
        'secret-key'
      ).toString(CryptoJS.enc.Utf8),
      createdAt: newPassword.createdAt,
      updatedAt: newPassword.updatedAt,
    });
  };


// updatePassword
  const updatePassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Invalid inputs passed, check your data" });
    }

    title = req.params.title
    password = req.body.password
  
    let encryptedPassword;
    try {
        encryptedPassword = CryptoJS.AES.encrypt(
        password,
        'secret-key'
      ).toString();
    } catch (error) {
      return res.status(400).json({ error: "password encrypted failed" });
    }
  
    let existingPassword;
    try {
        existingPassword = await passwordModel.findOne({ title: title, creator: req.user.id }); 
        if (!existingPassword){
            return res.status(400).json({ error: "title and user not exist in database" });
        }
    } catch (error) {
      return res.status(500).json({ error: "title and user query failed" });
    }
  
    existingPassword.password = encryptedPassword;
  
    try {
      await existingPassword.save();
    } catch (error) {
      return res.status(500).json({ error: "New password update failed" });
    }
  
    res.json({
        id: existingPassword.id,
        creator: existingPassword.creator,
        title: existingPassword.title,
        password: CryptoJS.AES.decrypt(
          existingPassword.password,
          'secret-key'
        ).toString(CryptoJS.enc.Utf8),
        createdAt: existingPassword.createdAt,
        updatedAt: existingPassword.updatedAt,
    });
  };
  

//deletePassword
const deletePassword = async (req, res) => {
    title = req.params.title
    password = req.body.password

    let existingPassword;
    try {
        existingPassword = await passwordModel.findOne({ title: title, creator: req.user.id }); 
        if (!existingPassword){
            return res .status(500).json({ error: 'Title and user not exist in database' })
        }
    } catch (error) {
      return res .status(500).json({ error: 'Title and user query faild' });
    }
  
    try {
      const deletedPassword = await passwordModel.findOneAndDelete({ title: title, creator: req.user.id });
    } catch (error) {
      return res.status(500).json({ error: "Delete Failed" });
    }
  
    res.json({ message: "Succesfully deleted" });
  };

//fuzzyMatching
const fuzzyMatching = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: 'Input is invalid, service can not be empty' });
  }

  const service = req.params.service;

  try {
      const userPasswords = await passwordModel.find({
          $and: [
              {
                  $or: [
                      { title: { $regex: service, $options: 'i' } }
                  ]
              },
              { creator: req.user.id }
          ]
      });

      if (!userPasswords || userPasswords.length === 0) {
          return res.status(400).json({ errors: 'Service not found' });
      }

      const decryptedPasswords = userPasswords.map((userPassword) => ({
          id: userPassword.id,
          creator: userPassword.creator,
          title: userPassword.title,
          password: CryptoJS.AES.decrypt(
              userPassword.password,
              'secret-key'
          ).toString(CryptoJS.enc.Utf8),
          createdAt: userPassword.createdAt,
          updatedAt: userPassword.updatedAt,
      }));

      res.json(decryptedPasswords);

  } catch (error) {
      return res.status(500).json({ error: "Service query failed" });
  }
};

  
  module.exports = {
    getAllPasswords,
    addPassword,
    updatePassword,
    deletePassword,
    fuzzyMatching
  };