const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post('/createuser' , async function(req,res) {
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