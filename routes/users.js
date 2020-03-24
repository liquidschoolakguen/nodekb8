const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Bring in Article Model
let User = require('../models/user');

// Register Form
router.get('/register_lehrer_sah', function (req, res) {
    res.render('register_lehrer');
});
router.get('/register_schueler', function (req, res) {
    res.render('register_schueler');
});



// Register Process Lehrer
router.post('/register_lehrer', function (req, res) {


    //console.log('lllll: '+req.body.username)
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('name', 'Name wird benötigt').notEmpty();
    req.checkBody('username', 'Email wird benötigt').notEmpty();
    req.checkBody('password', 'Password wird benötigt').notEmpty();
    req.checkBody('password2', 'Passwörter stimmen nicht überein').equals(req.body.password);

    let errors = req.validationErrors();

    if (errors) {
        res.render('register_lehrer_sah', {
            errors: errors

        });
    } else {

        let query = { username: username.toString().toLowerCase() }
        User.findOne(query, function (err, user) {
            if (err) throw err;
            if (user) {



                req.flash('warning', 'Die Kennung, ' + user.name + ' ist bereits registriert');
                res.redirect('/users/register_lehrer');




            } else {

                let newUser = new User({
                    type: 'lehrer',
                    name: name,
                    username: username.toString().toLowerCase(),
                    password: password,
                    logged: false

                });


                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(newUser.password, salt, function (err, hash) {
                        if (err) {
                            console.log(err);
                        }
                        newUser.password = hash;
                        newUser.save(function (err) {
                            if (err) {
                                console.log(err);
                                return
                            }
                            else {
                                req.flash('success', 'Du bist registriert, ' + newUser.name + '. Jetzt kannst du dich einloggen.');
                                res.redirect('/users/login');
                            }
                        });
                    });
                })

            }

        });

    }

});










// Register Process SCHUELER TEST
router.post('/register_schueler', function (req, res) {

    const username = req.body.username;
    const klasse = req.body.klasse;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('username', 'Email wird benötigt').notEmpty();
    req.checkBody('password', 'Password wird benötigt').notEmpty();
    req.checkBody('password2', 'Passwörter stimmen nicht überein').equals(req.body.password);


    let errors = req.validationErrors();




    if (errors) {
        res.render('register_schueler', {
            errors: errors

        });
    } else {

        let query = { username: username.toLowerCase() }
        User.findOne(query, function (err, user) {
            if (err) throw err;
            if (user) {



                req.flash('warning', 'Die Kennung, ' + user.name + ' ist bereits registriert');
                res.redirect('/users/register_schueler');




            } else {

                //console.log('username.toString().toLowerCase() '+username.toString().toLowerCase())

                let newUser = new User({
                    type: 'schueler',
                    name: username,
                    username: username.toString().toLowerCase(),
                    password: password,
                    password_visible: password,
                    klasse: klasse,
                    logged: false,
                    money: '0'

                });


                //console.log(klasse);
                if (klasse.includes('St. Pauli 5') || klasse.includes('St. Pauli 6') || klasse.includes('St. Pauli 7')) {
                    newUser.klasse2 = 'St. Pauli LB/WS 5-7'
                    console.log(newUser.klasse2);
                } else if (klasse.includes('St. Pauli 8') || klasse.includes('St. Pauli 9')) {
                    newUser.klasse2 = 'St. Pauli LB/WS 8-9'
                    console.log(newUser.klasse2);
                } else {
                    newUser.klasse2 = ''
                    console.log('nix');

                }


                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(newUser.password, salt, function (err, hash) {
                        if (err) {
                            console.log(err);
                        }
                        newUser.password = hash;
                        newUser.save(function (err) {
                            if (err) {
                                console.log(err);
                                return
                            }
                            else {
                                req.flash('success', 'Du bist registriert, ' + newUser.name + '. Jetzt kannst du dich einloggen.');
                                res.redirect('/users/login');
                            }
                        });
                    });
                })

            }

        });

    }

});











// Login Form
router.get('/login', function (req, res) {
    res.render('login');
})



// Login Process
router.post('/login', function (req, res, next) {

    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true

    })(req, res, next);

});



router.get('/logout/:id', function (req, res) {

    User.findById(req.params.id, function (err, user) {

        let query = { _id: req.params.id }

        if (err) {
            //console.log('wwwwww');
            console.log(err);
        }


        let logoutUser = {};
        logoutUser.type = user.type;
        logoutUser.name = user.name;
        logoutUser.username = user.username;
        logoutUser.password = user.password;
        logoutUser.logged = false



        User.update(query, logoutUser, function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                req.logout();
                req.flash('success', 'Du bist nun ausgeloggt');
                res.redirect('/');
            }

        })

    })


});
module.exports = router;