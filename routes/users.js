const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Bring in Article Model
let User = require('../models/user');
let Article = require('../models/article');
let Hausarbeit = require('../models/hausarbeit');

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














router.get('/all_schueler', function (req, res) {






    User.
        find({ type: 'schueler' }).
        exec(function (err, schuelers) {
            if (err) return console.log('4_iiiiiiiiiiii ' + err);

            if (schuelers) {

                if (err) return console.log('5_iiiiiiiiiiii ' + err);



                let length = schuelers.length;


                res.render('all_schueler', {
                    schuelers: schuelers,
                    length: length
                });




            } else {

                req.flash('danger', 'Es sind noch keine SuS registriert ');
                res.redirect('/');

            }

        });




});















// Login Form
router.get('/login', function (req, res) {
    res.render('login');
})



// Login Process Schueler
router.post('/login_s', function (req, res, next) {



    let query = { username: req.body.username.toString().toLowerCase() }
    User.findOne(query, function (err, user) {
        if (err) throw err;
        if (!user) {
            return done(null, false, { message: 'Unbekannte Kennung' });
        }


        if (user.type === 'lehrer') {

            req.flash('warning', 'Hier bist du falsch. Melde dich als "LehrerIn" an.');
            res.redirect('/users/login');




        } else {



            passport.authenticate('local', {
                successRedirect: '/',
                failureRedirect: '/users/login',
                failureFlash: true

            })(req, res, next);





        }






    });




});






router.post('/login_l', function (req, res, next) {





    let query = { username: req.body.username.toString().toLowerCase() }
    User.findOne(query, function (err, user) {
        if (err) throw err;
        if (!user) {
            return done(null, false, { message: 'Unbekannte Kennung' });
        }


        if (user.type === 'schueler') {


            req.flash('warning', 'Hier bist du falsch. Melde dich als "SchülerIn" an.');
            res.redirect('/users/login');




        } else {




            passport.authenticate('local', {
                successRedirect: '/',
                failureRedirect: '/users/login',
                failureFlash: true

            })(req, res, next);

        }

    });












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

















// Delete Article
router.delete('/:id', function (req, res) {

    console.log('ööö')


    //console.log('drinn')
    if (!req.user._id) {

        res.status(500).send();

    }



    User.findById(req.params.id, function (err, user) {


        console.log('ööö2 ' + user.name)



        Article.
            find({ lehrer: req.params.id }).
            exec(function (err, articles) {
                if (err) return console.log('8_iiiiiiiiiiii ' + err);



                articles.forEach(function (article) {





                    Hausarbeit.
                        find({ article: rarticle._id }).
                        exec(function (err, hausarbeits) {
                            if (err) return console.log('8_iiiiiiiiiiii ' + err);



                            hausarbeits.forEach(function (hausarbeit) {

                                Hausarbeit.remove({ _id: hausarbeit._id }, function (err) {
                                    if (err) {
                                        console.log(err);
                                    }

                                });

                            });


                        });















                    Article.remove({ _id: article._id }, function (err) {
                        if (err) {
                            console.log(err);
                        }

                    });

                });


            });



        Hausarbeit.
            find({ schueler: req.params.id }).
            exec(function (err, hausarbeits) {
                if (err) return console.log('8_iiiiiiiiiiii ' + err);



                hausarbeits.forEach(function (hausarbeit) {

                    Hausarbeit.remove({ _id: hausarbeit._id }, function (err) {
                        if (err) {
                            console.log(err);
                        }

                    });

                });






            });















        let query = { _id: req.params.id }

        User.remove(query, function (err) {
            if (err) {
                console.log(err);
            }
            res.send('success');
        });






    });

});






















module.exports = router;