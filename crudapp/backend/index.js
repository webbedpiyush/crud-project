const express = require('express');
const app = express();
const port = 5000;
const mongoDB = require('./db');
mongoDB();
app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin','http://localhost:3000');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With , Content-Type, Accept'
  );
  next();
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use(express.json());
app.use('/api' , require("./routes/CreateUser"));
app.use('/api' , require("./routes/displayData"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



// const express = require('express')
// const app = express()
// const port = process.env.PORT || 5000
// const mongodb=require("./db");
// const cors = require('cors');
  
// mongodb();

// app.use(cors());
// app.use(express.json())

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.use('/api/auth', require('./Routes/Auth'));

// app.listen(port,()=>{
//   console.log(`Server running on ${port}`);   
// });