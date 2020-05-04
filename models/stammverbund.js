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



    articles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Article',
            required: false
        }
    ],



});





let Stammverbund = module.exports = mongoose.model('Stammverbund', stammverbundSchema);




