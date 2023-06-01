const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Connected to MongoDB Cloud");
    })
    .catch((error) => {
        console.log(error);
    });