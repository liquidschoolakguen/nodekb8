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




    //veraltet
    klasse: {
        type: String,
        required: false
    },



    stamm: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Stamm'
    },

    stammverbund: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Stammverbund'
    },

    group: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Group'
    },
 



    //veraltet
    fach: {
        type: String,
        required: false
    },

    disziplin: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Disziplin'
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


articleSchema.set('autoIndex', false);
articleSchema.index({ created_as_date: -1 }); 


let Article = module.exports = mongoose.model('Article', articleSchema);




