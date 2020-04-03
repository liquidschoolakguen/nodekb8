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
    var username = req.body.username.toString().toLowerCase().trim();
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

        let query = { username: username.toString().toLowerCase().trim() }
        User.findOne(query, function (err, user) {
            if (err) throw err;
            if (user) {



                req.flash('warning', 'Die Kennung ' + user.name + ' ist bereits registriert');
                res.redirect('/users/register_lehrer');




            } else {

                let newUser = new User({
                    type: 'lehrer',
                    name: name,
                    username: username,
                    password: password,
                    password_visible: password,
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

    var username = req.body.username;
    const klasse = req.body.klasse;
    const password = req.body.password;
    const password2 = req.body.password2;
    console.log('           k k k k k k             k k k k k k k k                    k k k k k k ');
    req.checkBody('username', 'Email wird benötigt').notEmpty();
    req.checkBody('password', 'Password wird benötigt').notEmpty();
    req.checkBody('password2', 'Passwörter stimmen nicht überein').equals(req.body.password);


    let errors = req.validationErrors();




    if (errors) {
        res.render('register_schueler', {
            errors: errors

        });
    } else {

        let query = { username: username.toString().toLowerCase().trim() }
        User.findOne(query, function (err, user) {
            if (err) throw err;
            if (user) {



                req.flash('warning', 'Die Kennung ' + user.name + ' ist bereits registriert');
                res.redirect('/users/register_schueler');




            } else {

                //console.log('username.toString().toLowerCase() '+username.toString().toLowerCase())

                let newUser = new User({
                    type: 'schueler',
                    name: username,
                    username: username.toString().toLowerCase().trim(),
                    password: password,
                    password_visible: password,
                    klasse: klasse,
                    logged: false,
                    money: '0'

                });






                if (klasse.includes('St. Pauli')) {


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

                    newUser.klasse3 = 'alle SuS von St. Pauli'
                    newUser.klasse4 = 'alle SuS der gesamten STS am Hafen'


                } else if (klasse.includes('Neustadt')) {

                    newUser.klasse2 = ''
                    newUser.klasse3 = 'alle SuS der Neustadt'
                    newUser.klasse4 = 'alle SuS der gesamten STS am Hafen'

                } else if (klasse.includes('Oberstufe')) {


                    newUser.klasse2 = ''
                    newUser.klasse3 = 'alle SuS der Oberstufe'
                    newUser.klasse4 = 'alle SuS der gesamten STS am Hafen'


                } else{

                    newUser.klasse2 = ''
                    newUser.klasse3 = ''
                    console.log('FE  HEHEHE LER');
                    newUser.klasse4 = 'alle SuS der gesamten STS am Hafen'

                }


                //console.log(klasse);



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







router.get('/4____4', function (req, res) {






    User.
        find({ type: 'lehrer' }).
        exec(function (err, schuelers) {
            if (err) return console.log('4_iiiiiiiiiiii ' + err);

            if (schuelers) {

                if (err) return console.log('5_iiiiiiiiiiii ' + err);



                let length = schuelers.length;


                res.render('4____4', {
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



    let query = { username: req.body.username.toString().toLowerCase().trim() }
    User.findOne(query, function (err, user) {
        if (err) throw err;
        if (!user) {
            req.flash('warning', 'Falsche Kennung.');
            res.redirect('/users/login');
        } else {


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



        }


    });




});






router.post('/login_l', function (req, res, next) {

 //console.log('wwwwww          '+req.body.username.toString().toLowerCase().trim());



    let query = { username: req.body.username.toString().toLowerCase().trim() }
    User.findOne(query, function (err, user) {
        if (err) throw err;
        if (!user) {
            req.flash('warning', 'Falsche Kennung.');
            res.redirect('/users/login');
        } else {


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














// Edit article form
router.get('/edit/:id', ensureAuthenticated, function (req, res) {



    User.
        findOne({ _id: req.params.id }).
        exec(function (err2, usa) {
            if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);


            console.log('NEU');







            res.render('edit_user', {
                usa: usa,

            });








        });

});









router.post('/edit/:id', function (req, res) {





    console.log('ALT');



    let query = { _id: req.params.id }






    let user = {};
    user.username = req.body.username;



    User.update(query, user, function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'User geändert');
            res.redirect('/users/4____4');
        }
    })













});











// Access Control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }

}













module.exports = router;