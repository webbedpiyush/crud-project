const config = require('../config');
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require('express-validator');
const zod = require('zod');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = config.JWT_SECRET;


const emailSchema = zod.string().email();
const nameSchema = zod.string().min(5);
const passwordSchema = zod.string().min(5);
const locationSchema = zod.string();

async function middlewareZod (req,res,next) {
  const userData = req.body.email;
  const userName = req.body.name;
  const userpassword = req.body.password;
  const userLocation = req.body.location;
  const safeEmail = emailSchema.safeParse(userData);
  const safeName = nameSchema.safeParse(userName);
  const safepassword = passwordSchema.safeParse(userpassword);
  const safeLocation = locationSchema.safeParse(userLocation);

  if(!(safeEmail.success) || !(safeName.success) || !(safepassword.success) || !(safeLocation.success)) {
    res.status(400).json({
      message:"wrong inputs"
    })
    return;
  }
  next();
} 

router.post('/createuser' ,
/*[
body('email').isEmail(),
body('name').isLength({min:5}),
body('password','Incorrect Password').isLength({min:5}) ]*/

middlewareZod ,async function(req,res) {

 /* const err = validationResult(req);
  if(!err.isEmpty()) {
    return res.status(400).json({ err: err.array() });
  }*/
  const salt = await bcrypt.genSalt(10);
  const secPassword = await bcrypt.hash(req.body.password , salt);
  try{
    await User.create({
      name:req.body.name,
      location:req.body.location,
      email:req.body.email,
      password:secPassword
    })
    res.json({
      message:'successful'
    })

  } catch(err){
    console.log(err);

    res.json({
      message:'Failed'
    });
  }
})

router.post('/loginuser' ,async function(req,res,next) {
    const userData = req.body.email;
    const userpassword = req.body.password;
    const safeEmail = emailSchema.safeParse(userData);
    const safepassword = passwordSchema.safeParse(userpassword);

  
    if(!(safeEmail.success) ||  !(safepassword.success) ) {
      res.status(400).json({
        message:"wrong inputs"
      })
      return;
    }
    next();
  } 
,async function(req,res) {
  let email = req.body.email;
  try{
    let userData = await User.findOne({email});
    if(!userData) {
      return res.status(400).json("Try logging in with correct credentials");
    }
    const pwdCompare = await bcrypt.compare(req.body.password , userData.password);
    if(!pwdCompare) {
      return res.status(400).json("Try logging in with correct credentials");
    }

    const data = {
      user: {
        id:userData.id
      }
    }

    const authToken = jwt.sign(data, jwtSecret);
    res.json({
      message:'successful',
      authToken:authToken
    })

  } catch(err){
    console.log(err);

    res.json({
      message:'Failed'
    });
  }
})


module.exports = router;