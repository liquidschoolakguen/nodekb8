let mongoose = require('mongoose');


let groupSchema = mongoose.Schema({

    name:{
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

    lehrer:{
        type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false
    },


    for_all:{
        type:String,
        required:false
    },


    articles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Article',
            required: false
        }
    ],





});





let Group = module.exports = mongoose.model('Group', groupSchema);




