const express = require("express");
const axios = require('axios')
const router = express.Router();
const User = require("../models/User");
const zod = require('zod');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;

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

// Get logged in User details, Login Required.
router.post('/getuser', fetch, async (req, res) => {
  try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password") // -password will not pick password from db.
      res.send(user)
  } catch (error) {
      console.error(error.message)
      res.send("Server Error")

  }
})

router.post('/getlocation', async (req, res) => {
  try {
      let lat = req.body.latlong.lat
      let long = req.body.latlong.long
      console.log(lat, long)
      let location = await axios
          .get("https://api.opencagedata.com/geocode/v1/json?q=" + lat + "+" + long + "&key=74c89b3be64946ac96d777d08b878d43")
          .then(async res => {
              // console.log(`statusCode: ${res.status}`)
              console.log(res.data.results)
              // let response = stringify(res)
              // response = await JSON.parse(response)
              let response = res.data.results[0].components;
              console.log(response)
              let { village, county, state_district, state, postcode } = response
              return String(village + "," + county + "," + state_district + "," + state + "\n" + postcode)
          })
          .catch(error => {
              console.error(error)
          })
      res.send({ location })

  } catch (error) {
      console.error(error.message)
      res.send("Server Error")

  }
})


module.exports = router;