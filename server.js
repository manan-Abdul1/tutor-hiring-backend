//--------------- Import ---------------
const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const fileUpload = require('express-fileupload');

//--------------- Configure Env ---------------
require('dotenv').config();

//--------------- Database Connection ---------------
require('./connections/db_connection');

//--------------- Middleware ---------------
server.use(express.static('public'));
server.use('/banner', express.static('public/banner/')); // route for accessing profile images
server.use(bodyParser.json({ limit: '50mb' }));
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
server.use(express.json());
server.use(cors({
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    origin: '*'
}))
server.use(fileUpload({
    useTempFiles: false,
    tempFileDir: 'public'
}))

//--------------- Controller ---------------
const userController = require('./controllers/user');
const experienceController = require('./controllers/experience');
const likeProfileController = require('./controllers/profile_like');
const reviewController = require('./controllers/review');


// User Routes
server.use(userController);
// Experience Routes
server.use(experienceController);
// Like Profile Routes
server.use(likeProfileController);
// Review Routes
server.use(reviewController);

//--------------- PORT Setting ---------------
server.listen(process.env.PORT, console.log("Running at PORT: " + process.env.PORT));