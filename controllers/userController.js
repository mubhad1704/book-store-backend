const User = require("../models/userModel");
const jwt = require('jsonwebtoken')

// Logic for register

exports.userRegister = async (req, res) => {
  console.log("Inside Register function");
  // res.send("Request Recieved")

  try {
    const { username, email, password } = req.body;
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      res.status(402).json("Email already exist");
    } else {
      const newUser = new User({ username, email, password });
      await newUser.save();
      res.status(200).json({ message: "Register Success", newUser });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

//Logic for login

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (password == existingUser.password) {
        const token = jwt.sign({userMail:existingUser.email, role:existingUser.role}, process.env.jwtKey)
        // console.log(token);
        
        res.status(200).json({message:"Login Success",existingUser,token});
      } else {
        res.status(401).json("Wrong password");
      }
    } 
    else {
      res.status(404).json("User not found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// Google login

exports.googleLogin = async (req, res)=>{
  console.log("Inside google login");
  const {username ,email,password,  profile} = req.body;
  try{
     const existingUser = await User.findOne({email});
  if(existingUser){
    const token = jwt.sign({userMail:existingUser.email, role:existingUser.role}, process.env.jwtKey)
    console.log(token);
    
    res.status(200).json({message:"Login Success",existingUser,token});
  }else{
    const newUser = new User({username, email, password, profile});
    await newUser.save();
    const token = jwt.sign({userMail:newUser.email, role:newUser.role}, process.env.jwtKey)
    console.log(token);
    
    res.status(200).json({message:"Login Success",existingUser:newUser,token});
  }
  }
 catch(err){
  res.status(500).json(err)
 }
}

exports.getUsers = async (req, res) => {
  console.log("Inside get allUsers");
  try {
    const allUsers = await User.find({role:{$ne:"Admin"}});
    res.status(200).json(allUsers);
  } catch (err) {
    res.status(500).json("Err" + err);
  }
};

// update admin details
exports.updateAdmin = async (req, res) => {
  console.log("Inside get admin");

  // get body
  const {username,password,bio,profile} = req.body
  // get email : payload\
  const email = req.payload
  // get role
  const role = req.role
  // update profile photo  : req.file
  const uploadedProfile = req.file? req.file.filename: profile

  try {
    const updateAdmin = await User.findOneAndUpdate({email},{username,email,password,profile:uploadedProfile,bio,role},{new:true});
    await updateAdmin.save()
    res.status(200).json({message:"Updated Successfully...",updateAdmin});
  } catch (err) {
    res.status(500).json("Err" + err);
  }
};

// ////// get adminn details
exports.getAdmin = async (req,res) =>{
  console.log("Inside get admin");
  try{
    const admin = await User.findOne({role:"Admin"})
    res.status(200).json(admin)
  }
  catch(err){
    res.status(500).json("Err"+err)
  }
}
// ////// get user details
exports.getUser = async (req,res) =>{
  console.log("Inside get User");
  try{
    const email = req.payload
    const user = await User.findOne({email})
    res.status(200).json(user)
  }
  catch(err){
    res.status(500).json("Err"+err)
  }
}


// update user details
exports.updateUser = async (req, res) => {
  console.log("Inside get User");

  // get body
  const {username,password,bio,profile} = req.body
  // get email : payload\
  const email = req.payload
  // get role
  const role = req.role
  // update profile photo  : req.file
  const uploadedProfile = req.file? req.file.filename: profile

  try {
    const updateUser = await User.findOneAndUpdate({email},{username,email,password,profile:uploadedProfile,bio,role},{new:true});
    await updateUser.save()
    res.status(200).json({message:"Updated Successfully...",updateUser});
  } catch (err) {
    res.status(500).json("Err" + err);
  }
};