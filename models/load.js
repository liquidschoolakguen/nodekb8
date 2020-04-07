let mongoose= require('mongoose');

//article Schema

let loadSchema = mongoose.Schema({

    body:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true   
    },
    extension:{
        type:String,
        required:true   
    },
    type:{
        type:String,
        required:true   
    }





    
});





let Load = module.exports = mongoose.model('Load', loadSchema);
    



