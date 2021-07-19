const mongoose = require('mongoose');

// Setup of a ou schema
let ouSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    divisions: [
        {
            _id: false,
            division_id: {
                type: String,
                required: true
            }
        }
    ]
});

module.exports = mongoose.model('OU', ouSchema);