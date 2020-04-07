let mongoose = require('mongoose');

//school Schema

let schoolSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true
    },


    plz: {
        type: String,
        required: true
    },
    

    created: {
        type: String,
        required: true
    },


    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },




    lehrers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],


    
    lerngruppes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lerngruppe",
            required: false
        }
    ],




});





let School = module.exports = mongoose.model('School', schoolSchema);




