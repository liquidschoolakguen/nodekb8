let mongoose= require('mongoose');

//vergehen Schema

let vergehenSchema = mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:false   
    },
    gewicht:{
        type:Number,
        default:1,
        required:true   
    },
    created: {
        type: Date,
        required: true
    }

    
});





let Vergehen = module.exports = mongoose.model('Vergehen', vergehenSchema);
    



