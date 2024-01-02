const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require('express-validator');

router.post('/createuser' ,[
body('email').isEmail(),
body('name').isLength({min:5}),
body('password','Incorrect Password').isLength({min:5}) ]
,async function(req,res) {

  const err = validationResult(req);
  if(!err.isEmpty()) {
    return res.status(400).json({ err: err.array() });
  }

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