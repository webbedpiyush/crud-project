const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require('express-validator');
const zod = require('zod');

const emailSchema = zod.string().email();
const nameSchema = zod.string().min(5);
const passwordSchema = zod.string().min(5);
const locationSchema = zod.string();

async function middlewareZod (req,res,next) {
  const userEmail = req.body.email;
  const userName = req.body.name;
  const userpassword = req.body.password;
  const userLocation = req.body.location;
  const safeEmail = emailSchema.safeParse(userEmail);
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

  try{
    await User.create({
      name:req.body.name,
      location:req.body.location,
      email:req.body.email,
      password:req.body.password
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

module.exports = router;