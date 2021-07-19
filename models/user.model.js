const mongoose = require('mongoose');

// Setup of a user schema
let userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: false,
        default: 'user'
    },
    ou: [
        {
            _id: false,
            ou_id: {
                type: String,
                required: true
            },
            division_id: {
                type: String,
                required: true
            }
        }
    ]
});

module.exports = mongoose.model('User', userSchema);