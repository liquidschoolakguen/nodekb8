const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function (passport) {

    // Local Strategy
    passport.use(new LocalStrategy(function (username, password, done) {

        // Match Username
        let query = { username: username }
        User.findOne(query, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'Unbekannte Kennung' });
            }

            // Match Password
            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {

                    let query = { _id: user._id }

                
    
                    let logoutUser = {};
                    logoutUser.type = user.type;
                    logoutUser.name = user.name;
                    logoutUser.username = user.username;
                    logoutUser.password = user.password;
                    logoutUser.logged = true
            
            
            
                    User.update(query, logoutUser, function (err) {
                        if (err) {
                            console.log(err);
                            return;
                        } else {
                           

                            return done(null, user)


                        }
            
                    })
                   
                } else {
                    return done(null, false, { message: 'Falsches Passwort. Wenn dir dein Passwort nicht mehr einfällt, musst du dich noch einmal registrieren. Schreibe dir das Passwort auf, damit du es nicht wieder vergisst.' });
                }
            });
        });
    }));


    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

}