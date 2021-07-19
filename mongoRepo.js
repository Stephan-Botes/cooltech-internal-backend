const mongoose = require("mongoose");
require('dotenv').config();

// Setup of the uri link from the env file
const uri = process.env.DB_URI;
// const uri = 'mongodb+srv://stephan:pass123@cluster0.vrn0u.mongodb.net/CooltechDB?retryWrites=true&w=majority'

// Connection  created to the mongo db on the atlas account
exports.connect = () => {
    mongoose.Promise = global.Promise;

    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

// Condition that occurs on a failed established connection
    mongoose.connection.on('error', function() {
        console.log('Connection to Mongo established.');
        console.log('Could not connect to the database. Exiting now...');
        process.exit();
    });

// Condition that occurs once on a successfully established connection
    mongoose.connection.once('open', function() {
        console.log("Successfully connected to the mongo database");
    })
}