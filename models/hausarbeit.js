let mongoose = require('mongoose');

//hausarbeit Schema

let hausarbeitSchema = mongoose.Schema({

    schueler:{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },

    article:{
        type: mongoose.Schema.Types.ObjectId, ref: 'Article'
    },

    status: {
        type: String,
        required: false

    },

    created: {
        type: String,
        required: false

    },

    body: {
        type: String,
        required: false

    },

    reflexion_hilfe: {

        type: String,
        required: false

    },

    reflexion_schwer: {

        type: String,
        required: false

    },

    reflexion_zeit: {

        type: String,
        required: false

    },

    reflexion_text: {

        type: String,
        required: false

    },


    ergebnis_ok: {

        type: String,
        required: false

    },

    ergebnis_dollar: {

        type: String,
        required: false

    },
    ergebnis_note: {

        type: String,
        required: false

    },

    ergebnis_text: {

        type: String,
        required: false

    }








});





let Hausarbeit = module.exports = mongoose.model('Hausarbeit', hausarbeitSchema);




