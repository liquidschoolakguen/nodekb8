let mongoose= require('mongoose');

//schueler_lerngruppe Schema

let schueler_lerngruppeSchema = mongoose.Schema({

    sl_schueler_id:{
        type:String,
        required:true
    },
    sl_lerngruppe_id:{
        type:String,
        required:true   
    }
   

    
});





let Schueler_Lerngruppe = module.exports = mongoose.model('Schueler_Lerngruppe', schueler_lerngruppeSchema);
    



