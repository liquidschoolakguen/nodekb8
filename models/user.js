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



    //veraltet
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


    schueler_stamm: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Stamm'
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


    //ich weiß nicht mehr wofür diese Verknüpfung gut ist. Vielleicht private, also lehrerbezogene Verbunds. Ergibt aber keinen Sinn
    stammverbunds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stammverbund'
    }],





    lehrers_groups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: false
    }],




}
);


UserSchema.methods.theName = function () {
    return this.name;
};


UserSchema.methods.getSchool_name = function () {


    console.log('ggg: ' +this.school._id)
    School.findOne({ _id: this.school._id }).
    exec(function (err, schoool) {
       if(schoool){
        console.log('...... ' +schoool)
        console.log('...... ' +schoool._id)
        console.log('...... ' +schoool.name)
        return schoool.name;
       }else{
        return 'nix';

        }
       
      


    });



};




const User = module.exports = mongoose.model('User', UserSchema);
