const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');


// Bring in Article Model
let User = require('../models/user');
let Article = require('../models/article');
let Hausarbeit = require('../models/hausarbeit');
let School = require('../models/school');
let Stamm = require('../models/stamm');


router.get('/register_admin_first', function (req, res) {
    res.render('register/register_admin_first');
});


router.get('/add_school_first', function (req, res) {
    res.render('register_school/add_school_first');
});


router.get('/add_school_register_admin_first', function (req, res) {
    res.render('register/add_school_register_admin_first');
});



router.get('/register_liquid', function (req, res) {
    res.render('register_liquid');
});







router.get('/register_schueler_0', function (req, res) {

    School.
        find().
        exec(function (err2, schools) {
            if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);


            if (!schools) {
                res.redirect('/');
                return
            }


            res.render('register/register_schueler_0', {
                schools: schools,
            });
        });
});






router.get('/register_schueler_00', function (req, res) {

    res.render('register/register_schueler_00', {

    });

});



//das brauche ich nur, um veraltete SchülerUser zu generieren. Mit diesen teste ich dann die Upgrade-Methoden, die später auf sem Server zum Einsatz kommen
router.get('/register_schueler_dummy', function (req, res) {

    res.render('register/register_schueler_dummy', {

    });

});




router.get('/register_lehrer_00', function (req, res) {

    res.render('register/register_lehrer_00', {

    });

});



router.get('/register_admin_00', function (req, res) {

    res.render('register/register_admin_00', {

    });

});



router.get('/register_lehrer_0', function (req, res) {

    School.
        find().
        exec(function (err2, schools) {
            if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);


            if (!schools) {
                res.redirect('/');
                return
            }


            res.render('register/register_lehrer_0', {
                schools: schools,
            });
        });
});








router.post('/register_schueler_0', function (req, res) {
    const school_id = req.body.school;
    console.log('school_id:   ' + school_id);

    School.
        findOne({ _id: school_id }).
        populate('admin').
        exec(function (err2, school) {
            if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);

            if (!school) {


                res.redirect('/');

                return
            }

            res.render('register/register_schueler', {
                school: school,

            });


        });


});



router.post('/register_schueler_00', function (req, res) {
    const schueler_schluessel = req.body.schueler_schluessel.toLowerCase().trim();
    console.log('schueler_schluessel:   ' + schueler_schluessel);

    School.
        findOne({ schueler_schluessel: schueler_schluessel }).
        populate('s_stamms').
        exec(function (err2, school) {
            if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);

            if (!school) {

                req.flash('warning', 'Das ist kein gültiger Schulschlüssel. Frag deine Lehrerin nach dem Schlüssel.');
                res.render('register/register_schueler_00');
                return
            }


            req.flash('success', 'Super! Das war der richtige Schlüssel.');
            req.flash('success', 'Jetzt gebe deinen Vornamen ein, wähle deine Klasse aus und überlege dir ein Passwort, welches du dir gut merken kannst.');
            res.render('register/register_schueler', {
                school: school,

            });


        });


});









router.post('/register_lehrer_00', function (req, res) {
    const lehrer_schluessel = req.body.lehrer_schluessel.toLowerCase().trim();
    console.log('lehrer_schluessel:   ' + lehrer_schluessel);

    School.
        findOne({ lehrer_schluessel: lehrer_schluessel }).
        exec(function (err2, school) {
            if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);

            if (!school) {

                req.flash('warning', 'Das ist nicht der Lehrerschlüssel. Frag deinen Schuladmin nach dem Lehrerschlüssel.');
                res.render('register/register_lehrer_00');
                return
            }


            req.flash('success', 'Sehr gut! Das war der richtige Schlüssel.');
            req.flash('success', 'Jetzt kannst du dich auf ' + school.name + ' mit deiner Emailadresse (Kennung) registrieren.');
            res.render('register/register_lehrer', {
                school: school,

            });


        });


});










router.post('/register_admin_00', function (req, res) {
    const admin_schluessel = req.body.admin_schluessel.toLowerCase().trim();
    console.log('admin_schluessel:   ' + admin_schluessel);

    School.
        findOne({ admin_schluessel: admin_schluessel }).
        exec(function (err2, school) {
            if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);

            if (!school) {

                req.flash('warning', 'Das ist nicht der Adminschlüssel deiner Schule. Frag den Hauptadmin deiner Schule nach dem Adminschlüssel.');
                res.render('register/register_admin_00');
                return
            }


            req.flash('success', 'Sehr gut! Das war der richtige Schlüssel.');
            req.flash('success', 'Jetzt kannst du dich auf ' + school.name + ' als Administrator mit deiner Emailadresse (Kennung) registrieren.');
            res.render('register/register_admin', {
                school: school,

            });


        });


});









router.post('/register_lehrer_0', function (req, res) {
    const school_id = req.body.school;
    console.log('school_id:   ' + school_id);

    School.
        findOne({ _id: school_id }).
        populate('admin').
        exec(function (err2, school) {
            if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);

            if (!school) {


                res.redirect('/');

                return
            }

            res.render('register/register_schueler', {
                school: school,

            });


        });


});









// Register Process Lehrer
router.post('/register_liquid', function (req, res) {


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
        res.render('register_liquid_main', {
            errors: errors

        });
    } else {

        let query = { username: username.toString().toLowerCase().trim() }
        User.findOne(query, function (err, user) {
            if (err) throw err;
            if (user) {



                req.flash('warning', 'Die Kennung ' + user.name + ' ist bereits registriert');
                res.redirect('/users/register_admin_main');




            } else {

                let newUser = new User({
                    type: 'admin',
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
                                res.redirect('/');
                            }
                        });
                    });
                })

            }

        });

    }

});














// Register Process Lehrer
router.post('/register_admin_first', function (req, res) {


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
        res.render('register/register_admin_first', {
            errors: errors

        });
    } else {


        User.findOne({ username: username.toString().toLowerCase().trim() }).
            populate('school').
            exec(function (err, user) {
                if (err) throw err;
                if (user) {

                    if (user.complete_admin === '1') {

                        req.flash('warning', 'Die Kennung ' + user.name + ' ist bereits registriert');
                        res.redirect('/users/register_admin_first');

                    } else {

                        if (user.school) {
                            School.remove({ _id: user.school._id }, function (err) {
                                if (err) return console.log('i ' + err);
                            });
                        }


                        User.remove({ _id: user._id }, function (err) {
                            if (err) return console.log('i ' + err);

                            let newUser = new User({
                                type: 'admin',
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

                                            req.flash('success', 'Hallo ' + newUser.name + '. Du bist jetzt registriert, jetzt nur noch schnell einloggen...');
                                            res.redirect('/users/login_admin_first');
                                        }
                                    });
                                });
                            })

                        });

                    }


                } else {

                    let newUser = new User({
                        type: 'admin',
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




                                    req.flash('success', 'Hallo ' + newUser.name + '. Du bist jetzt registriert, jetzt nur noch schnell einloggen...');
                                    res.redirect('/users/login_admin_first');
                                }
                            });
                        });
                    })

                }

            });

    }

});













// Register 
router.post('/add_school_first', function (req, res, next) {

    var schulname = req.body.name.toString().toLowerCase().trim();
    schulname = schulname.replace(/ä/g, 'ae');
    schulname = schulname.replace(/ö/g, 'oe');
    schulname = schulname.replace(/ü/g, 'ue');
    schulname = schulname.replace(/ß/g, 'ss');
    schulname = schulname.replace(/[^a-zA-Z ]/g, '');
    schulname = schulname.split(' ').join('-');
    var schulplz = req.body.plz.toString().toLowerCase().trim()
    schulplz = schulplz.replace(/[^0-9]/g, '');
    console.log('schulname:    ' + schulname + '-' + schulplz)
    var all = schulname + '-' + schulplz

    School.findOne({ url: all }).
        exec(function (err, school) {
            if (err) throw err;
            if (school) {
                if (school.complete_school === '1') {
                    handleOldSchool(school, req, res, next);
                } else {
                    handleIncompleteSchool_2(school, req, res, next);
                }
            } else {
                let school = new School();
                school.name = req.body.name;
                school.plz = req.body.plz;
                school.ort = req.body.ort;
                school.url = all;
                school.complete_school = '2'
                school.save(function (err, scho) {
                    if (err) throw err;
                    handleNewSchool(scho, req, res, next);
                })
            }
        })
});













// Register Process Lehrer
router.post('/add_school_register_admin_first', function (req, res) {

    const admin_name = req.body.name;
    var admin_username = req.body.username.toString().toLowerCase().trim();
    const admin_password = req.body.password;
    const admin_password2 = req.body.password2;
    req.checkBody('name', 'Name wird benötigt').notEmpty();
    req.checkBody('username', 'Email wird benötigt').notEmpty();
    req.checkBody('password', 'Password wird benötigt').notEmpty();
    req.checkBody('password2', 'Passwörter stimmen nicht überein').equals(req.body.password);
    let errors = req.validationErrors();

    if (errors) {
        res.render('register/add_school_register_admin_first', {
            errors: errors
        });
    } else {
        User.findOne({ username: admin_username.toString().toLowerCase().trim() }).
            populate('school').
            exec(function (err, user) { // suche ob neuer firstAdmin bereitsexistiert
                if (err) throw err;
                if (user) {
                    req.flash('warning', 'Die Kennung ' + user.name + ' ist bereits registriert');
                    res.redirect('/users/add_school_register_admin_first');
                    return;
                } else {
                    User.findOne({ _id: req.user._id }).
                        populate('school').
                        exec(function (err, user) { //finde den schoolUser
                            if (err) throw err;

                            let updateSchool = {};
                            updateSchool.complete_school = '1';
                            updateSchool.created = Date.now();

                            School.findByIdAndUpdate(user.school._id, updateSchool, function (err, freshSchool) {
                                if (err) throw err;


                                console.log('i ' + freshSchool.name);

                                School.findOne({ _id: freshSchool._id }).
                                    populate('users').
                                    exec(function (err, newFreshSchool) {
                                        if (err) throw err;



                                        console.log('ii ' + newFreshSchool.name);


                                        newFreshSchool.admins.pull(user);
                                        newFreshSchool.save(function (err, scho) {
                                            if (err) throw err;


                                            console.log('School wurde auf COMPLETE gestellt und der schoolUser wurde aus dem school entfernt ');
                                            var pi_school = user.school;
                                            var pi = user._id;
                                            //der schoolUser wird ausgeloggt, um gleich gelöscht zu werden
                                            req.logout();

                                            User.remove({ _id: pi }, function (err) {
                                                if (err) return console.log('i ' + err);
                                                createAndBindRealFirstAdminUser(pi_school, admin_name, admin_username, admin_password, req, res)
                                            });

                                        })
                                    })


                            })
                        });
                }
            });
    }
});













function handleOldSchool(school, req, res, next) {
    req.flash('warning', school.name + ' ist bereits bei Liquidschool registriert.');
    req.flash('warning', 'Frage den Liquidschool-Schuladministrator an deiner Schule nach dem Adminschlüssel, mit dem du dich als weiterer Admin registrieren kannst. ');

    res.redirect('/users/add_school_first');
    return;

}


//Es gibt zwei Möglichkeiten wie man mit einer unvollständigen SchoolRegistrierung umgehen kann. 
// 1. Alles löschen und neu machen....
function handleIncompleteSchool(school, req, res, next) {
    User.findOne({ username: school.url }).
        populate('school').
        exec(function (err, user) {
            if (err) throw err;
            if (user) {
                if (user.school) {
                    School.remove({ _id: user.school._id }, function (err) {
                        if (err) return console.log('i ' + err);
                    });
                }
                User.remove({ _id: user._id }, function (err) {
                    if (err) return console.log('i ' + err);
                    schooli.save(function (err, scho) {
                        if (err) throw err;
                        console.log('deleteAndCreate:   ' + scho.url)
                        createAndBindUser(scho, '/', req, res, next)
                    })
                });
            } else {
                console.log('fff ehler Es kan nicht sein, dass es eine School gbt aber keinen entsprechenden temporären User')
            }
        });
}





//2. einfach die Registrierung zur Anmeldung umfunktionieren und die SchoolRegistrierung fortsetzen
function handleIncompleteSchool_2(school, req, res, next) {
    req.body.username = school.url;
    req.body.password = '12345';
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/register_school_first',
        failureFlash: true
    })(req, res, next);
}


















function handleNewSchool(school, req, res, next) {
    createAndBindUser(school, '/', req, res, next)
}






function createAndBindUser(school, redirect, req, res, next) {
    console.log('createAndBindUse ok')

    let newUser = new User({
        type: 'school',
        school: school,
        name: school.name,
        username: school.url,
        password: '12345',
        password_visible: '12345',
        logged: false


    });


    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            if (err) {
                console.log(err);
            }
            newUser.password = hash;
            newUser.save(function (err, us) {
                if (err) {
                    console.log(err);
                    return
                } else {

                    School.findByIdAndUpdate(school._id,
                        { $push: { admins: us } },
                        { safe: true, upsert: true },
                        function (err, uptdatedSchool) {
                            if (err) {
                                console.log(err);
                            } else {

                                /*                                 req.flash('success', 'Du bist registriert ' + newUser.name + '. Jetzt kannst du dich als Administrator auf Liquidschool anmelden.');
                                                                //y res.redirect('/users/login_admin');
                                                                res.redirect(redirect); */

                                req.body.username = newUser.username;
                                req.body.password = newUser.password_visible;

                                passport.authenticate('local', {
                                    successRedirect: '/',
                                    failureRedirect: '/users/register_school_first',
                                    failureFlash: true

                                })(req, res, next);

                            }
                        })
                }
            });
        });
    })











}









function createAndBindRealFirstAdminUser(school, name, username, password, req, res) {
    console.log('createAndBindRealFirstAdminUser ok')

    let newUser = new User({
        type: 'admin',
        school: school,
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
            newUser.save(function (err, us) {
                if (err) {
                    console.log(err);
                    return
                } else {

                    School.findByIdAndUpdate(school._id,
                        { $push: { admins: us } },
                        { safe: true, upsert: true },
                        function (err, uptdatedSchool) {
                            if (err) {
                                console.log(err);
                            } else {

                                req.flash('success', 'Du bist registriert ' + newUser.name + '. Jetzt kannst du dich als Administrator auf Liquidschool anmelden.');
                                res.redirect('/users/login_admin');
                                /* 
                                                                req.body.username = newUser.username;
                                                                req.body.password = newUser.password_visible;
                                
                                                                passport.authenticate('local', {
                                                                    successRedirect: '/',
                                                                    failureRedirect: '/users/login_admin_first',
                                                                    failureFlash: true
                                
                                                                })(req, res, next); */

                            }
                        })
                }
            });
        });
    })
}





// Register Process Lehrer
router.post('/register_admin', function (req, res) {



    School.
        findOne({ _id: req.body.school_id }).
        populate('admin').
        exec(function (err2, school) {
            if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);

            if (!school) {
                res.redirect('/');
                return
            }


            const name = req.body.name;
            var username = req.body.username.toString().toLowerCase().trim();
            const password = req.body.password;
            const password2 = req.body.password2;



            //console.log('  BENNO         k k k k k k             k k k k k k k k                    k k k k k k ');
            req.checkBody('username', 'Email wird benötigt').notEmpty();
            req.checkBody('password', 'Password wird benötigt').notEmpty();
            req.checkBody('password2', 'Passwörter stimmen nicht überein').equals(req.body.password);


            let errors = req.validationErrors();




            if (errors) {
                res.render('register/register_admin', {
                    errors: errors,
                    school: school

                });
            } else {


                User.
                    findOne({

                        $and: [
                            { username: username.toString().toLowerCase().trim() },
                            { school: school }
                        ]

                    }).
                    exec(function (err, user) {


                        if (err) throw err;

                        if (user) {



                            req.flash('danger', 'Die Kennung ' + user.name + ' ist bereits in ' + school.name + ' registriert');
                            req.flash('warning', 'Wenn du dich bereits registriert hast, musst du auf \'Administratoranmeldung\' klicken.');
                            res.render('register/register_admin', {
                                school: school

                            });




                        } else {

                            console.log('ok')

                            let newUser = new User({
                                type: 'admin',
                                school: school,
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
                                    newUser.save(function (err, us) {
                                        if (err) {
                                            console.log(err);
                                            return
                                        } else {



                                            School.findByIdAndUpdate(school._id,
                                                { $push: { admins: us } },
                                                { safe: true, upsert: true },
                                                function (err, uptdatedSchool) {
                                                    if (err) {
                                                        console.log(err);
                                                    } else {



                                                        req.flash('success', 'Du bist registriert ' + newUser.name + '. Jetzt kannst du dich als Administrator auf Liquidschool anmelden.');
                                                        res.redirect('/users/login_admin');


                                                    }
                                                })



                                        }
                                    });
                                });
                            })

                        }

                    });

            }



        });


});

























// Register Process LEHRER TEST
router.post('/register_lehrer', function (req, res) {


    School.
        findOne({ _id: req.body.school_id }).
        populate('admin').
        exec(function (err2, school) {
            if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);


            if (!school) {
                res.redirect('/');
                return
            }
            const name = req.body.name;
            var username = req.body.username.toString().toLowerCase().trim();
            const password = req.body.password;
            const password2 = req.body.password2;
            //console.log('  BENNO         k k k k k k             k k k k k k k k                    k k k k k k ');
            req.checkBody('username', 'Email wird benötigt').notEmpty();
            req.checkBody('password', 'Password wird benötigt').notEmpty();
            req.checkBody('password2', 'Passwörter stimmen nicht überein').equals(req.body.password);

            let errors = req.validationErrors();

            if (errors) {
                res.render('register/register_lehrer', {
                    errors: errors,
                    school: school

                });
            } else {

                User.
                    findOne({
                        $and: [
                            { username: username.toString().toLowerCase().trim() },
                            { school: school }
                        ]
                    }).
                    exec(function (err, user) {
                        if (err) throw err;
                        if (user) {
                            req.flash('danger', 'Die Email' + user.name + ' ist bereits in ' + school.name + ' registriert');
                            req.flash('warning', 'Wenn du dich bereits registriert hast, musst du auf \'Lehreranmeldung\' klicken.');
                            res.render('register/register_lehrer', {
                                school: school

                            });
                        } else {
                            let newUser = new User({
                                type: 'lehrer',
                                school: school,
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
                                    newUser.save(function (err, us) {
                                        if (err) {
                                            console.log(err);
                                            return
                                        } else {
                                            School.findByIdAndUpdate(school._id,
                                                { $push: { lehrers: us } },
                                                { safe: true, upsert: true },
                                                function (err, uptdatedSchool) {
                                                    if (err) {
                                                        console.log(err);
                                                    } else {
                                                        req.flash('success', 'Du bist registriert ' + newUser.name + '. Jetzt kannst du dich als Lehrkraft auf Liquidschool anmelden.');
                                                        res.redirect('/users/login_lehrer');
                                                    }
                                                })
                                        }
                                    });
                                });
                            })
                        }
                    });
            }
        });
});
















// Register Process SCHUELER TEST
router.post('/register_schueler', function (req, res) {
    School.
        findOne({ _id: req.body.school_id }).
        populate('s_stamms').
        exec(function (err2, school) {
            if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);
            if (!school) {
                res.redirect('/');
                return
            }

            Stamm.
                findOne({ _id: req.body.klasse }).
                exec(function (err2, stamm) {

                    if (!stamm) {
                        res.redirect('/');
                        return
                    }

                    var username = req.body.username;
                    const password = req.body.password;
                    const password2 = req.body.password2;
                    req.checkBody('username', 'Email wird benötigt').notEmpty();
                    req.checkBody('password', 'Password wird benötigt').notEmpty();
                    req.checkBody('password2', 'Passwörter stimmen nicht überein').equals(req.body.password);

                    let errors = req.validationErrors();
                    if (errors) {
                        res.render('register/register_schueler', {
                            errors: errors,
                            school: school
                        });
                        return;
                    }

                    User.
                        findOne({
                            $and: [
                                { username: username.toString().toLowerCase().trim() },
                                { school: school }
                            ]
                        }).
                        exec(function (err, user) {
                            if (err) throw err;
                            if (user) {
                                req.flash('danger', 'Der Name \'' + user.name + '\' ist bereits in ' + school.name + ' registriert');
                                req.flash('warning', 'Registrieren muss man sich nur einmal ganz zu Beginn. Wenn du dich bereits registriert hast, musst du auf \'Schüleranmeldung\' klicken.');
                                res.render('register/register_schueler', {
                                    school: school
                                });
                                return;
                            }
                            //console.log('ok')
                            let newUser = new User({
                                type: 'schueler',
                                school: school,
                                name: username,
                                username: username.toString().toLowerCase().trim(),
                                password: password,
                                password_visible: password,
                                schueler_stamm: stamm,
                                logged: false,
                                money: '0'

                            });

                            bcrypt.genSalt(10, function (err, salt) {
                                bcrypt.hash(newUser.password, salt, function (err, hash) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    newUser.password = hash;
                                    newUser.save(function (err, us) {
                                        if (err) {
                                            console.log(err);
                                            return
                                        } else {
                                            School.findByIdAndUpdate(school._id,
                                                { $push: { schuelers: us } },
                                                { safe: true, upsert: true },
                                                function (err, uptdatedSchool) {
                                                    if (err) {
                                                        console.log(err);
                                                    } else {

                                                        Stamm.findByIdAndUpdate(stamm._id,
                                                            { $push: { schuelers: us } },
                                                            { safe: true, upsert: true },
                                                            function (err, uptdatedStamm) {
                                                                if (err) {
                                                                    console.log(err);
                                                                } else {
                                                                    req.flash('success', 'Du bist registriert ' + newUser.name + '. Jetzt kannst du dich auf Liquidschool anmelden.');
                                                                    res.redirect('/users/login_schueler');
                                                                }
                                                            })

                                                    }
                                                })

                                        }
                                    });
                                });
                            })
                        });
                });
        });
});


















// Register Process SCHUELER TEST
router.post('/register_schueler_dummy', function (req, res) {


    var klasse = req.body.klasse;
    var username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;
    req.checkBody('username', 'Email wird benötigt').notEmpty();
    req.checkBody('password', 'Password wird benötigt').notEmpty();
    req.checkBody('password2', 'Passwörter stimmen nicht überein').equals(req.body.password);

    let errors = req.validationErrors();
    if (errors) {
        res.render('register_schueler_dummy', {
            errors: errors
        });
        return;
    }

    User.
        findOne({ username: username.toString().toLowerCase().trim() }).
        exec(function (err, user) {
            if (err) throw err;
            if (user) {
                req.flash('danger', 'Der Name' + user.name + ' ist bereits registriert');
                res.render('register_schueler_dummy', {
                });
                return;
            }
            //console.log('ok')
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

            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(newUser.password, salt, function (err, hash) {
                    if (err) {
                        console.log(err);
                    }
                    newUser.password = hash;
                    newUser.save(function (err, us) {
                        if (err) {
                            console.log(err);
                            return
                        } else {

                        }
                    });
                });
            })
        });


});















router.get('/all_schueler', function (req, res) {
    User.
        find({ type: 'schueler' }).
        populate('schueler_stamm').
        exec(function (err, schuelers) {
            if (err) return console.log('4_iiiiiiiiiiii ' + err);
            if (schuelers) {
                if (err) return console.log('5_iiiiiiiiiiii ' + err);
                let length = schuelers.length;
                res.render('show/all_schueler', {
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
        populate('school').
        exec(function (err, schuelers) {
            if (err) return console.log('4_iiiiiiiiiiii ' + err);

            if (schuelers) {

                if (err) return console.log('5_iiiiiiiiiiii ' + err);



                let length = schuelers.length;


                res.render('debug/4____4', {
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
router.get('/login_admin', function (req, res) {
    res.render('anmeldung/login_admin', {
    });
})







// Login Form
router.get('/login_school_first', function (req, res) {
    res.render('anmeldung/login_school_first', {
    });
})


// Login Form
router.get('/login_schueler', function (req, res) {
    res.render('anmeldung/login_schueler', {
    });
})




// Login Form
router.get('/login_lehrer', function (req, res) {
    res.render('anmeldung/login_lehrer', {
    });
})











// Login Process Schueler
router.post('/login_s', function (req, res, next) {


    const schueler_schluessel = req.body.schueler_schluessel.toLowerCase().trim();
    console.log('schueler_schluessel:   ' + schueler_schluessel);

    School.
        findOne({ schueler_schluessel: schueler_schluessel }).
        exec(function (err2, school) {


            if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);



            User.
                findOne({

                    $and: [
                        { username: req.body.username.toString().toLowerCase().trim() },
                        { school: school }
                    ]

                }).
                exec(function (err, user) {
                    if (err) throw err;



                    if (!user) {
                        req.flash('warning', 'Falsche Kennung.');
                        res.redirect('/users/login_schueler');
                    } else {


                        if (user.type !== 'schueler') {

                            req.flash('warning', 'Hier bist du falsch. Du versuchst dich als Schüler*in anzumelden');
                            res.redirect('/users/login_schueler');




                        } else {


                            // req.body.password = '123456'
                            passport.authenticate('local', {
                                successRedirect: '/',
                                failureRedirect: '/users/login_schueler',
                                failureFlash: true

                            })(req, res, next);





                        }



                    }


                });


        });




});








router.post('/login_l', function (req, res, next) {
    User.findOne({ username: req.body.username.toString().toLowerCase().trim() }).
        populate('school').
        exec(function (err, user) {
            if (err) return console.log('iiiiiiiiiiiiiiiiiii ' + err);
            if (!user) {
                req.flash('warning', 'Falsche Kennung.');
                res.redirect('/users/login_lehrer');
            } else {
                passport.authenticate('local', {
                    successRedirect: '/',
                    failureRedirect: '/users/login_lehrer',
                    failureFlash: true
                })(req, res, next);
            }

        });
});








router.post('/login_scho_first', function (req, res, next) {

    var schulname = req.body.username.toString().toLowerCase().trim();
    schulname = schulname.replace(/ä/g, 'ae');
    schulname = schulname.replace(/ö/g, 'oe');
    schulname = schulname.replace(/ü/g, 'ue');
    schulname = schulname.replace(/ß/g, 'ss');
    schulname = schulname.replace(/[^a-zA-Z ]/g, '');
    schulname = schulname.split(' ').join('-');

    var schulplz = req.body.password.toString().toLowerCase().trim()
    schulplz = schulplz.replace(/[^0-9]/g, '');
    console.log('schulname:    ' + schulname + '-' + schulplz)
    var all = schulname + '-' + schulplz







    User.findOne({ username: all }).
        populate('school').
        exec(function (err, user) {
            if (err) return console.log('iiiiiiiiiiiiiiiiiii ' + err);


            if (!user) {
                req.flash('warning', 'Falsche Kennung.');
                res.redirect('/users/login_school_first');
            } else {

                console.log('drinn:    ' + req.body.username + '-' + req.body.password)

                req.body.username = all;
                req.body.password = '12345'

                console.log('drinn2:    ' + req.body.username + '-' + req.body.password)

                passport.authenticate('local', {
                    successRedirect: '/',
                    failureRedirect: '/users/login_school_first',
                    failureFlash: true

                })(req, res, next);








            }

        });



});

















router.post('/login_a', function (req, res, next) {
    User.findOne({ username: req.body.username.toString().toLowerCase().trim() }).
        populate('school').
        exec(function (err, user) {
            if (err) return console.log('iiiiiiiiiiiiiiiiiii ' + err);
            if (!user) {
                req.flash('warning', 'Falsche Kennung.');
                res.redirect('/users/login_admin');
            } else {
                passport.authenticate('local', {
                    successRedirect: '/',
                    failureRedirect: '/users/login_admin',
                    failureFlash: true
                })(req, res, next);
            }

        });
});





















router.post('/login_li', function (req, res, next) {


    let query = { username: req.body.username.toString().toLowerCase().trim() }




    if (req.body.username !== 'mitat_akguen' || req.body.password !== 'unavejun93947') {


        req.flash('warning', 'Du bist kein LiquidBoy');
        res.redirect('/');


    } else {


        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/',
            failureFlash: true

        })(req, res, next);

    }






});


















router.get('/logout/:id', function (req, res) {



    User.findOne({ _id: req.params.id }).
        populate('school').
        exec(function (err, user) {
            if (err) return console.log('iiiiiiiiiiiiiiiiiii ' + err);





            let logoutUser = {};
            logoutUser.type = user.type;
            logoutUser.name = user.name;
            logoutUser.username = user.username;
            logoutUser.password = user.password;
            logoutUser.logged = false


            let query = { _id: req.params.id }

            User.update(query, logoutUser, function (err) {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    req.logout();
                    req.flash('success', 'Bis bald');
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
        req.flash('danger', 'Bitte anmelden');
        res.redirect('/');
    }

}













module.exports = router;