const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;
const studentRoutes = require('./routes/studentRoutes');
const dbconfig = require('./connection/db');



const app = express();
app.use(express.json());
app.use(cors());


app.use('/api/users', studentRoutes);

app.listen(port, ()=> console.log("server started",port))