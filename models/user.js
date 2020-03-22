const mongoose = require('mongoose');

// User Schema
const UserSchema = mongoose.Schema({
    

    logged: {
        type: Boolean,
        required: true
    },

    type: {
        type: String,
        required: true
    },
    
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },


    password_visible: {
        type: String,
        required: false
    },
    
    
    klasse: {
        type: String,
        required: false
    },

    klasse2: {
        type: String,
        required: false
    },
    
    
    money: {
        type: Number,
        required: false
    }

}
);

const User = module.exports = mongoose.model('User', UserSchema);
