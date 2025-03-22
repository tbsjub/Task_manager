// import { v4 as uuidv4 } from 'uuid';
// import cors from 'cors';

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mysqlPool = require('./config/db')


//confugure dotenv
dotenv.config();

//rest object
const app = express();


//middleware
app.use(express.json());

//routes
app.use(cors());  // Enable CORS for all routes
app.use('/api/v1/tasks', require('./routes/taskManagerRoutes'))

//PORT
const PORT = process.env.PORT || 3000;

//conditionally listens
mysqlPool.query('SELECT 1').then(() => {
  //mysql
  console.log("MySQL connected");

  //listens
  app.listen(PORT, () =>
  {
    console.log("successfull");
  });
}).catch((error) => {
  console.log(error);
  process.exit(1);
})

// Centralized error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });