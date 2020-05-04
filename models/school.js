let mongoose = require('mongoose');

//school Schema

let schoolSchema = mongoose.Schema({


    /* 
        customer_mail: {
            type: String,
            required: true
        }, */


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


    url: { //schul_id
        type: String,
        required: true
    },

    complete_school: {
        type: String,
        required: false
    },





    created: {
        type: Date,
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


    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    lehrers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    schuelers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],




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




    groups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: false
    }],







});





let School = module.exports = mongoose.model('School', schoolSchema);




