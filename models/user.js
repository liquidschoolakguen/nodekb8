const mongoose = require('mongoose');

// User Schema
const UserSchema = mongoose.Schema({


    logged: {
        type: Boolean,
        required: true
    },

    type: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },


    password_visible: {
        type: String,
        required: false
    },


    klasse: {
        type: String,
        required: false
    },

    klasse2: {
        type: String,
        required: false
    },

    klasse3: {
        type: String,
        required: false
    },

    klasse4: {
        type: String,
        required: false
    },




    money: {
        type: String,
        required: false
    },

    notenschnit_eg: {
        type: String,
        required: false
    },

    notenschnit_no: {
        type: String,
        required: false
    },

    ok_quote: {
        type: String,
        required: false
    },


    article_token: {
        type: String,
        required: false
    },


    default_klasse: {
        type: String,
        required: false
    },




    default_broadcast: {
        type: String,
        required: false
    },



    //das ist für user.type = schueler
    auftrags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    }],




    //das ist für user.type = lehrer; von welchem articles er author ist
    lehrers_auftrags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    }],




    lerngruppes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lerngruppe",
        required: false
    }],


    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    },



    stammverbunds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stammverbund'
    }],


}
);

const User = module.exports = mongoose.model('User', UserSchema);
