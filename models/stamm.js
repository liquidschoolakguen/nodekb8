let mongoose= require('mongoose');


let stammSchema = mongoose.Schema({

    name:{
        type:String,
        required:true
    },


    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    },



    verbund_token: {
        type: String,
        required: false
    },


    



    articles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Article',
            required: false
        }
    ],



    //die SchülerInnen, die sich in dieser Klasse angemeldet haben
    schuelers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false
        }
    ],







//für image
    body:{
        type:String,
        required:false
    },
    name:{
        type:String,
        required:false   
    },
    extension:{
        type:String,
        required:false   
    },
    type:{
        type:String,
        required:false   
    }





    
});

let Stamm = module.exports = mongoose.model('Stamm', stammSchema);
    



