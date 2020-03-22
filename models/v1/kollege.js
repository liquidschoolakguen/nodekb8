let mongoose = require('mongoose');

//kollege Schema

let kollegeSchema = mongoose.Schema({

    vorname: {
        type: String,
        required: true
    },
    nachname: {
        type: String,
        required: true
    },
    kuerzel: {
        type: String,
        required: false
    },
    strafpunkte: {
        type: Number,
        default: 0,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },
    
    
    created: {
        type: Date,
        required: true
    }


});





let Kollege = module.exports = mongoose.model('Kollege', kollegeSchema);




