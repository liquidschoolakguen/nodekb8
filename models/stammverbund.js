let mongoose = require('mongoose');

//lerngruppe Schema

let stammverbundSchema = mongoose.Schema({

    name:{
        type:String,
        required:true
    },



    stamms: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Stamm',
            required: false
        }
    ],


    school:{
        type: mongoose.Schema.Types.ObjectId,
            ref: "School",
            required: false
    },


/* 
    lehrer: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }, */


});





let Stammverbund = module.exports = mongoose.model('Stammverbund', stammverbundSchema);




