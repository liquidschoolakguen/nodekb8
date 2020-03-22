let mongoose= require('mongoose');

//article Schema

let articleSchema = mongoose.Schema({

    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true   
    },
    klasse:{
        type:String,
        required:true   
    },
    fach:{
        type:String,
        required:true   
    },
    termin:{
        type:String,
        required:true   
    },
    body:{
        type:String,
        required:true   
    },
    material:{
        type:String,
        required:false   
    },
    link:{
        type:String,
        required:false   
    },

    lehrer:{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },

    created: {
        type:String,
        required:true   
    },



    schueler_token: {
        type:String,
        required:false   
    },



    

    
});





let Article = module.exports = mongoose.model('Article', articleSchema);
    



