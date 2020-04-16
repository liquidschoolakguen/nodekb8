let mongoose = require('mongoose');

//school Schema

let schoolSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    url: {
        type: String,
        required: false
    },

    make_id: {
        type: String,
        required: true
    },


    plz: {
        type: String,
        required: true
    },

    ort: {
        type: String,
        required: false
    },
    created: {
        type: String,
        required: false
    },


    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },


    admin_schluessel: {
        type: String,
        required: false
    },

    lehrer_schluessel: {
        type: String,
        required: false
    },
    
    schueler_schluessel: {
        type: String,
        required: false
    },

    users: [{
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





    stamms: [
        {
            type: String,
            required: false
        }
    ],

    fachs: [
        {
            type: String,
            required: false
        }
    ],


});





let School = module.exports = mongoose.model('School', schoolSchema);




