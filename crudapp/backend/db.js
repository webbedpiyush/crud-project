const config = require('./config');
const mongoose = require('mongoose');
const mongoURI = config.MONGO_URI;
  const mongoDB = async () => {
    try {
      await mongoose.connect(mongoURI);
      console.log('Connected!');
      let fetched_data = mongoose.connection.db.collection("food_items");
      let data= await fetched_data.find({}).toArray() 
      global.food_items = data;
      let fetched_data2 = mongoose.connection.db.collection("foodCategory");
      let catData= await fetched_data2.find({}).toArray() 
      global.foodCategory = catData;
      
    } catch (error) { 
      console.log('err: ', error);
    }
  };
module.exports = mongoDB;
