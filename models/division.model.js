const mongoose = require('mongoose');

// Setup of a division schema
let divisionSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    credentials: [
        {
            _id: false,
            name: {
                type: String,
                required: true
            },
            login: {
                type: String,
                required: true
            },
            password: {
                type: String,
                required: true
            }
        }
    ]
});

module.exports = mongoose.model('Division', divisionSchema);