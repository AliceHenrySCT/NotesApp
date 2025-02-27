const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const noteRoutes = require('./routes/noteRoutes');
const connectDB = require('./config/db');

//Load environment variables
require('dotenv').config();

//Initialize the app
const app = express();

//Middleware
app.use(cors());
app.use(bodyParser.json());

//Connect to MongoDB
connectDB();

//Routes
app.use('/api/notes', noteRoutes);

//Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
