let mongoose = require('mongoose');

//article Schema

let articleSchema = mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    klasse: {
        type: String,
        required: false
    },
    fach: {
        type: String,
        required: true
    },
    termin: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    material: {
        type: String,
        required: false
    },
    link: {
        type: String,
        required: false
    },

    lehrer: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },

    created: {
        type: String,
        required: true
    },


    created_as_date: {
        type: Date,
        required: false,
        default: '2020-01-01'
    },




    schueler_token: {
        type: String,
        required: false
    },



    ha_gelb: {
        type: String,
        required: false

    },

    ha_gruen: {
        type: String,
        required: false


    },




    ha_grau: {
        type: String,
        required: false


    },


    schuelers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],


    shadow_klasse: {
        type: String,
        required: false
    },




    uploads: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Load',
          

        }

    ]





});





let Article = module.exports = mongoose.model('Article', articleSchema);




