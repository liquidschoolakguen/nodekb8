let mongoose = require('mongoose');

//school Schema

let schoolSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    plz: {
        type: String,
        required: true
    },

    ort: {
        type: String,
        required: false
    },

 




    admin_schluessel: {
        type: String,
        required: false
    },

    lehrer_schluessel: {
        type: String,
        required: false
    },
    
    schueler_schluessel: {
        type: String,
        required: false
    },





    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],


    lerngruppes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lerngruppe",
            required: false
        }
    ],


  /*   stamms: [
        {
            type: String,
            required: false
        }
    ],


    fachs: [
        {
            type: String,
            required: false
        }
    ],
 */



    s_stamms: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Stamm',
            required: false
        }
    ],


    s_disziplins: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Disziplin',
            required: false
        }
    ],






    stammverbunds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stammverbund',
        required: false
    }],





});





let School = module.exports = mongoose.model('School', schoolSchema);




