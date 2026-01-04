require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const app = express();
const monogoose = require('mongoose');
const dotenv = require("dotenv");
const path = require("path");
const config = require('./Config/db')
const {cloudconfig} = require('./Config/cloudinary');
dotenv.config({ quiet: true });
app.use(express.json());
app.use(cors());
//connect to database
config();
cloudconfig()

const PORT = process.env.PORT || 5000;

//api routes
app.use('/api/auth',require('./routes/User'));
app.use('/api/user',require('./routes/User'));
app.use('/api/ai',require('./routes/Chat'));
app.use('/api/Data',require('./routes/Location'));
app.use('/api/Gen',require('./routes/Seasonal'))
app.use('/api/Interaction',require('./routes/Interaction'))
//load Services
require('./utils/Crons')

//Server Runnning 
app.listen(PORT , ()=>{
    console.log(`Server is running on on http://localhost:${PORT} `)
})