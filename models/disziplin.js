let mongoose= require('mongoose');

//fach Schema

let disziplinSchema = mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    color:{
        type:String,
        required:false
    },



    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    },





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
    },



    articles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Article',
            required: false
        }
    ],





    
});

let Disziplin = module.exports = mongoose.model('Disziplin', disziplinSchema);
    



