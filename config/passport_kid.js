const LocalStrategy = require('passport-local').Strategy;
const Kid = require('../models/kid');
const config = require('./database');
const bcrypt = require('bcryptjs');

module.exports = function (passport) {

    // Local Strategy
    passport.use(new LocalStrategy(function (name, klasse, done) {

        // Match name
        let query = { name: name }
        Kid.findOne(query, function (err, kid) {
            if (err) throw err;
            if (!kid) {
                return done(null, false, { message: 'No Kid found' });
            } else {

                if (kid.klasse !== klasse) {
                    return done(null, false, { message: 'Wrong KLasse' });

                } else {
                    return done(null, kid)

                }

            }


        });
    }));


    passport.serializeKid(function (kid, done) {
        done(null, kid.id);
    });

    passport.deserializeKid(function (id, done) {
        Kid.findById(id, function (err, kid) {
            done(err, kid);
        });
    });




    

}