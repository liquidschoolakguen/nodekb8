let mongoose = require('mongoose');

//vorfall Schema

let vorfallSchema = mongoose.Schema({

 
    info: {
        type: String,
        required: false
    },

    schueler_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Schueler",
        required: false
    },
    vergehen_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vergehen",
        required: false
    },

    kollege_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Kollege",
        required: false
    },
    
    created: {
        type: Date,
        required: true
    }




});





let Vorfall = module.exports = mongoose.model('Vorfall', vorfallSchema);




