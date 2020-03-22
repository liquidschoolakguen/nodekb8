let mongoose = require('mongoose');

//schueler Schema

let schuelerSchema = mongoose.Schema({

    vorname: {
        type: String,
        required: true
    },
    nachname: {
        type: String,
        required: true
    },
    codename: {
        type: String,
        required: false
    },
    geburtstag: {
        type: String,
        required: false
    },
    geburtsort: {
        type: String,
        required: false
    },
    stammgruppenid: {
        type: String,
        required: true
    },
    strafpunkte: {
        type: Number,
        default: 0,
        required: true
    },
    verwarnungen: {
        type: Number,
        default: 0,
        required: true
    },
    lerngruppes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lerngruppe",
            required: false
        }
    ],
    
    created: {
        type: Date,
        required: true
    }


});





let Schueler = module.exports = mongoose.model('Schueler', schuelerSchema);




