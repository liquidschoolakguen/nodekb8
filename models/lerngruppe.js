let mongoose = require('mongoose');

//lerngruppe Schema

let lerngruppeSchema = mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    type:{
        type:String,
        required:true
    },


    schuelers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false
        }
    ],

    school:{
        type: mongoose.Schema.Types.ObjectId,
            ref: "School",
            required: false
    },



});





let Lerngruppe = module.exports = mongoose.model('Lerngruppe', lerngruppeSchema);




