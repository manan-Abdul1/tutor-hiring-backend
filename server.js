const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;
const studentRoutes = require('./routes/studentRoutes');
const tutorRoutes = require('./routes/tutorRoutes');
const hiringRequestRoutes = require('./routes/hiringRoutes');
const dbconfig = require('./connection/db');

const app = express();
app.use(express.json());
app.use(cors());


app.use('/api/users', studentRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/hiringRequest', hiringRequestRoutes);

app.listen(port, ()=> console.log("server started",port))