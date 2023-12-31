const mongoose = require('mongoose');
const mongoURI ='mongodb+srv://piyush1:WZaWx5WMFS4SaYp8@cluster0.vvles90.mongodb.net/crudProject?retryWrites=true&w=majority'

  const mongoDB = async () => {
    try {
      await mongoose.connect(mongoURI);
      console.log('Connected!');
      let fetched_data = mongoose.connection.db.collection("food_items");
      let data=await fetched_data.find({}).toArray() 
      console.log(data);
    } catch (error) {
      console.log('err: ', error);
    }
  };
module.exports = mongoDB;
