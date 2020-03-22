let mongoose= require('mongoose');

//fach Schema

let fachSchema = mongoose.Schema({

    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true   
    },
    faktor:{
        type:String,
        required:true   
    },
    
});

let Fach = module.exports = mongoose.model('Fach', fachSchema);
    



