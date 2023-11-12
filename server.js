const express = require('express');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;
const studentRoutes = require('./routes/studentRoutes');
const tutorRoutes = require('./routes/tutorRoutes');
const hiringRequestRoutes = require('./routes/hiringRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const dbconfig = require('./connection/db');
const initSocket = require('./sockets/socket'); 

const app = express();
const server = http.createServer(app);

const io = initSocket(server);

app.use(express.json());
app.use(cors());


app.use('/api/users', studentRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/hiringRequest', hiringRequestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/feedback', feedbackRoutes);

app.listen(port, ()=> console.log("server started",port))