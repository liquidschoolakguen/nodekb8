let mongoose= require('mongoose');

//lerngruppe Schema

let lerngruppeSchema = mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    schuelers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Schueler",
            required: false
        }
    ],

    created: {
        type: Date,
        required: true
    }

    
});





let Lerngruppe = module.exports = mongoose.model('Lerngruppe', lerngruppeSchema);
    



