const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');






//User model
let User = require('../models/user');
let Article = require('../models/article');
let Hausarbeit = require('../models/hausarbeit');
let Load = require('../models/load');
let Stammverbund = require('../models/stammverbund');
let School = require('../models/school');
let Stamm = require('../models/stamm');
let Group = require('../models/group');
let Disziplin = require('../models/disziplin');


const multer = require("multer");

const handleError = (err, res) => {
  console.log(err);
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};


router.get('/download/:id', function (req, res) {

  //const targetPath = path.join(__dirname, "../uploads/image.png");

  //const targetPath = req.params.id;


  const targetPath = path.join(__dirname, "../uploads/" + req.params.id);


  Load.
    findOne({ body: req.params.id }).
    exec(function (err, load) {

      res.download(targetPath, load.name);
      return;

    })





  //const file = `${__dirname}/uploads/image.png`;

});

const upload = multer({
  dest: "../uploads",
  limits: { fieldSize: 250 * 1024 * 1024 }
});



router.get('/jjj/:id', function (req, res) {



  res.render('image_test', {
    tar: req.params.id

  })


});







//Koorigiert die Zeitverschiebung auf dem Server
function getMyNow() {
  var yes = new Date();

  var n = yes.getTimezoneOffset();


  if (n !== -120) {

    yes.setHours(yes.getHours() + 2)

    console.log('bimmelbingo')
  } else {

    // console.log('server')
  }

  return yes;
}




// Add Article
router.get('/add', ensureAuthenticated, function (req, res) {


  var today = getMyNow();
  var tomorrow = getMyNow();
  tomorrow.setDate(today.getDate() + 3);




  var nau = ("00" + tomorrow.getDate()).slice(-2) + '.' + ("00" + (tomorrow.getMonth() + 1)).slice(-2) + '.'



  res.render('add_article_alt', {
    title: 'Add Articles',
    abgabe: nau
  })

});






// Add Article
router.get('/add_alt', ensureAuthenticated, function (req, res) {


  var today = getMyNow();
  var tomorrow = getMyNow();
  tomorrow.setDate(today.getDate() + 3);


  //var nau = start.getDate() + '.' + start.getMonth() + '.' + start.getFullYear() + ', ' + start.getHours() + '.' + start.getMinutes() + ' Uhr';
  var nau = tomorrow.getDate() + '.' + tomorrow.getMonth() + '.' + tomorrow.getFullYear()



  res.render('add_article_alt', {
    title: 'Add Articles',
    abgabe: nau
  })

});







///------1 ersg die klasse

router.get('/add_article_broadcast', ensureAuthenticated, function (req, res) {


  User.
    findOne({ _id: req.user._id }).
    populate({
      path: 'school',
      populate: {
        path: 'stammverbunds'
      }
    }).
    exec(function (err, user) {


      if (!user) {
        console.log('bennj o  is krank!')
      } else {

        //console.log('stammverbund--- : ' + user);

        res.render('add_article_broadcast', {
          stammverbunds: user.school.stammverbunds
        })


      }
    });





});







///------1 ersg die klasse

router.get('/add_article_klasse', ensureAuthenticated, function (req, res) {

  User.
    findOne({ _id: req.user._id }).
    populate('school').
    exec(function (err, user) {

      if (!user) {
        console.log('bennj o  is krank!')
      } else {
        /* 
              console.log('bennj:  '+user.school.name)
              user.school.stamms.forEach(function (stamm) {
                 console.log('stamm: ' + stamm);
              });
        
         */
        res.render('add_article_klasse', {
          stamms: user.school.stamms
        })

      }
    });
});








router.get('/add_article_klasse_broadcast', ensureAuthenticated, function (req, res) {

  User.
    findOne({ _id: req.user._id }).
    populate('school').
    exec(function (err, user) {

      if (!user) {
        console.log('bennj o  is krank!')
      } else {
        School.
          findOne({ _id: user.school._id }).
          populate('stammverbunds').
          populate('s_stamms').
          exec(function (err, scho) {
            if (!scho) {
              console.log('bennj o  is krank!')
            } else {

              var jo = [];
              scho.s_stamms.forEach(function (stamm) {
                jo.push(stamm.name);
              });
              scho.stammverbunds.forEach(function (verbund) {
                jo.push(verbund.name);
              });
              res.render('change/add_article_klasse_broadcast', {
                alls: jo
              })
            }
          });
      }
    });
});








router.get('/n_auftrag', ensureAuthenticated, function (req, res) {


  User.
    findOne({ _id: req.user._id }).
    populate({
      path: 'school',
      populate: {
        path: 'groups',
        populate: {
          path: 'schuelers',
        }

      }
    }).
    populate({
      path: 'lehrers_groups',
      populate: {
        path: 'schuelers'
      }
    }).
    exec(function (err, user) {

      if (!user) {
        console.log('bennj o  is krank!')
      } else {
        School.
          findOne({ _id: user.school._id }).
          populate('stammverbunds').
          populate('s_stamms').
          exec(function (err, scho) {
            if (!scho) {
              console.log('bennj o  is krank!')
            } else {

              var jo = [];
              scho.s_stamms.forEach(function (stamm) {
                var bingo = new Object();
                bingo.name = stamm.name;
                bingo._id = stamm._id;
                bingo.typo = 'stamm'
                jo.push(bingo);
              });
              scho.stammverbunds.forEach(function (verbund) {
                var bingo = new Object();
                bingo.name = verbund.name;
                bingo._id = verbund._id;
                bingo.typo = 'verbund'
                jo.push(bingo);
              });



              var benno = user.school.groups;
              benno.push(...user.lehrers_groups);






              res.render('change/n_auftrag', {
                alls: jo,
                groups: benno

              })
            }
          });
      }
    });
});








router.get('/n_auftrag_', ensureAuthenticated, function (req, res) {

  User.findByIdAndUpdate(
    req.user._id,
    { default_klasse: req.body.klasse },
    function (err, result) {
      if (err) {
      } else {
      }

    });

  var today = getMyNow();
  var tomorrow = getMyNow();
  tomorrow.setDate(today.getDate() + 3);
  var nau = ("00" + tomorrow.getDate()).slice(-2) + '.' + ("00" + (tomorrow.getMonth() + 1)).slice(-2) + '.' + tomorrow.getFullYear()



  User.
    findOne({ _id: req.user._id }).
    populate({
      path: 'school',
      populate: {
        path: 's_disziplins'
      }
    }).
    populate({
      path: 'school',
      populate: {
        path: 's_stamms',
        populate: {
          path: 'schuelers',
        }
      }
    }).
    populate({
      path: 'school',
      populate: {
        path: 'stammverbunds'
      }
    }).
    populate({
      path: 'school',
      populate: {
        path: 'groups',
        populate: {
          path: 'schuelers',
        }

      }
    }).
    populate({
      path: 'lehrers_groups',
      populate: {
        path: 'schuelers'
      }
    }).
    exec(function (err, user) {
      if (err) throw err;


      //das hier ist besonders. der push in "benno" bewirkt auch einen push in user.school.groups. Verrückt
      var benno = user.school.groups;
      benno.push(...user.lehrers_groups);


      res.render('change/add_article_alt', {
        user: user,
        abgabe: nau,
        // groups: benno, //daher brauche ich benno garnicht, um die arrays zusammengeführt zu übergeben
      })
    });
});








// Edit article form
router.get('/edit/:id', ensureAuthenticated, function (req, res) {

  User.
    findOne({ _id: req.user._id }).
    populate({
      path: 'school',
      populate: {
        path: 's_disziplins'
      }
    }).
    populate({
      path: 'school',
      populate: {
        path: 's_stamms',
        populate: {
          path: 'schuelers',
        }
      }
    }).
    populate({
      path: 'school',
      populate: {
        path: 'stammverbunds'
      }
    }).
    populate({
      path: 'school',
      populate: {
        path: 'groups',
        populate: {
          path: 'schuelers',
        }

      }
    }).
    populate({
      path: 'lehrers_groups',
      populate: {
        path: 'schuelers'
      }
    }).
    exec(function (err, user) {
      if (err) throw err;


      //das hier ist besonders. der push in "benno" bewirkt auch einen push in user.school.groups. Verrückt
      var benno = user.school.groups;
      benno.push(...user.lehrers_groups);



      Article.
        findOne({ _id: req.params.id }).
        populate('schuelers').
        populate('uploads').
        populate('disziplin').
        populate('stamm').
        populate('stammverbund').
        exec(function (err2, arti) {
          if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);

          if (arti.schuelers.length === 0) { // keine schuelers // "alt"


            res.render('change/edit_article_complete', {
              user: user,
              article: arti,
              s_stamms: user.school.s_stamms
            });


          } else {

            var all_stamms = user.school.s_stamms;
            var his = arti.schuelers;
            all_stamms.forEach(function (stamm) {
              stamm.schuelers.forEach(function (user) {
                his.forEach(function (his_user) {
                  // console.log('ein all-schüler: ' + all_schueler.name + ' / ' + all_schueler._id);
                  if (user._id.toString() === his_user._id.toString()) {
                    //console.log('ein arti-schüler: ' + arti_schueler.name + ' / ' + arti_schueler._id);
                    user.article_token = true
                  }
                });

              });
            });



            res.render('change/edit_article_complete', {
              user: user,
              article: arti,
              s_stamms: all_stamms
            });


          }

        });

    });









});








// Get Single hausarbeit
router.get('/hausarbeit/:id', function (req, res) {

  Hausarbeit.
    findOne({ _id: req.params.id }).
    populate('schueler').
    populate('uploads').
    populate({
      path: 'article',
      populate: {
        path: 'stamm',
      }
    }).
    populate({
      path: 'article',
      populate: {
        path: 'stammverbund',
      }
    }).
    populate({
      path: 'article',
      populate: {
        path: 'disziplin',
      }
    }).
    exec(function (err, hausarbeit) {
      if (err) {

        console.log('2_iiiiiiiiiiii ' + err);

        req.flash('danger', 'Diese Hausarbeit existiert nicht. ');
        res.redirect('/');


        return

      }

      if (hausarbeit) {
        //console.log('The author is %s', hausarbeit);




        res.render('change/korrektur', {
          hausarbeit: hausarbeit,

        });
      } else {

        req.flash('danger', 'Deie Hausarbeit wurde gelöscht. Keine Überprüfung mehr möglich. ');
        res.redirect('/');

      }

    });





});









// Get Single Schueler
router.get('/schueler/:id', function (req, res) {

  User.
    findOne({ _id: req.params.id }).
    exec(function (err, user) {
      if (err) {

        console.log('3_iiiiiiiiiiii ' + err);

        req.flash('danger', 'Dieser Schüler existiert nicht. ');
        res.redirect('/');


        return

      }

      if (user) {
        //console.log('The author is %s', user);

        Hausarbeit.
          find({ schueler: req.params.id }).
          populate({
            path: 'article',
            populate: {
              path: 'lehrer'
            }
          }).
          exec(function (err, hausarbeits) {



            let articles = [{}]

            hausarbeits.forEach(function (hausarbeit) {
              //console.log('The status is %s', hausarbeit.status);
            });


            let lengthD = hausarbeits.length;
            //console.log('The lengthD is %s', lengthD);
            //console.log('The articles.length is %s', hausarbeits.length);

            res.render('show/schueler', {
              schueler: user,
              hausarbeits: hausarbeits,
              length: lengthD
            });



          });


      } else {

        req.flash('danger', 'Der Auftrag wurde gelöscht. Du musst diese Hausarbeit nicht mehr machen. ');
        res.redirect('/');

      }

    });





});




function myStringToDate(termin_string) {

  var tag = termin_string.substring(7, 9)
  var monat = termin_string.substring(10, 12)
  var jahr = termin_string.substring(13, 17)
  //console.log('tag   ' + tag);
  //console.log('monat   ' + monat);
  //console.log('jahr   ' + jahr);
  return new Date(jahr, monat - 1, tag, 16);

}


function getTimeString(termin_string) {
  var jetzt = getMyNow();


  var termin = myStringToDate(termin_string);



  if (jetzt.getFullYear() === termin.getFullYear() &&
    jetzt.getMonth() === termin.getMonth() &&
    jetzt.getDate() === termin.getDate()) {

    return 'heute 16 Uhr'
  }
  if (jetzt.getFullYear() === termin.getFullYear() &&
    jetzt.getMonth() === termin.getMonth() &&
    jetzt.getDate() + 1 === termin.getDate()) {

    return 'morgen 16 Uhr'
  }
  if (jetzt.getFullYear() === termin.getFullYear() &&
    jetzt.getMonth() === termin.getMonth() &&
    jetzt.getDate() + 2 === termin.getDate()) {

    return 'übermorgen'
  }

  if (jetzt.getFullYear() === termin.getFullYear() &&
    jetzt.getMonth() === termin.getMonth() &&
    jetzt.getDate() + 3 === termin.getDate()) {

    return 'in 3 Tagen'
  }

  if (jetzt.getFullYear() === termin.getFullYear() &&
    jetzt.getMonth() === termin.getMonth() &&
    jetzt.getDate() + 4 === termin.getDate()) {

    return 'in 4 Tagen'
  }
  if (jetzt.getFullYear() === termin.getFullYear() &&
    jetzt.getMonth() === termin.getMonth() &&
    jetzt.getDate() + 5 === termin.getDate()) {

    return 'in 5 Tagen'
  }
  if (jetzt.getFullYear() === termin.getFullYear() &&
    jetzt.getMonth() === termin.getMonth() &&
    jetzt.getDate() + 6 === termin.getDate()) {

    return 'in 6 Tagen'
  }





}





router.get('/article_schuelers/:id', function (req, res) {






  Article.
    findOne({ _id: req.params.id }).
    populate('schuelers').
    populate('stamm').
    populate({
      path: 'stammverbund',
      populate: {
        path: 'stamms'
      }
    }).
    exec(function (err, article) {
      if (err) {

        console.log('4_iiiiiiiiiiii ' + err);

        req.flash('danger', 'Dieser Auftrag existiert nicht. ');
        res.redirect('/');


        return

      }

      if (article) {


        if (isPossibleFrist(article.termin)) {
          article.termin = getTimeString(article.termin)
        } else {
          article.termin = 'abgelaufen'
        }







        let haus = []

        Hausarbeit.
          find({ article: req.params.id }).
          populate('schueler').
          populate('uploads').
          exec(function (err, hausarbeits) {
            if (err) return console.log('5_iiiiiiiiiiii ' + err);

            if (hausarbeits) {
              //console.log('The hausarbeits is %s', hausarbeits);



              var nu_hauses = []


              if (article.stamm) {

                User.
                  find({
                    $and: [
                      { type: 'schueler' },
                      { schueler_stamm: article.stamm }
                    ]
                  }).
                  sort({ name: 1 }).
                  exec(function (err2, all_schuelers) {
                    if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);


                    all_schuelers.forEach(function (sss) {
                      console.log('all_schueler is %s', sss.username);

                      var hat_arbeit = false
                      hausarbeits.forEach(function (h) {
                        console.log('hausarbeit is %s', h.schueler.username);

                        if (sss.username === h.schueler.username) {
                          nu_hauses.push(h)
                          hat_arbeit = true
                        }
                      });

                      if (!hat_arbeit) {
                        let hhh = new Hausarbeit();
                        hhh.schueler = sss;
                        hhh.status = '0';
                        nu_hauses.push(hhh)

                      }
                    });


                    let schuelers = [];
                    nu_hauses.forEach(function (hausarbeit) {
                      console.log('The Fotzi is %s', hausarbeit.schueler.name + '/' + hausarbeit.status);
                      schuelers.push(hausarbeit.schueler);
                    });

                    let length = nu_hauses.length;

                    res.render('change/article_schueler', {
                      now: getMyNow(),
                      article: article,
                      hausarbeits: nu_hauses,
                      length: length,
                      my_termin: myStringToDate(article.termin)

                    });
                  })






              } else if (article.stammverbund) {

                var jo2 = []

                article.stammverbund.stamms.forEach(function (stamm) {
                  console.log('verbund    ' + stamm.name);
                  jo2.push(stamm);
                })



                User.
                  find({
                    $and: [
                      { type: 'schueler' },
                      { schueler_stamm: { $in: jo2 } }
                    ]
                  }).
                  sort({ name: 1 }).
                  exec(function (err2, all_schuelers) {
                    if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);


                    all_schuelers.forEach(function (sss) {
                      console.log('all_schueler is %s', sss.username);

                      var hat_arbeit = false
                      hausarbeits.forEach(function (h) {
                        console.log('hausarbeit is %s', h.schueler.username);

                        if (sss.username === h.schueler.username) {
                          nu_hauses.push(h)
                          hat_arbeit = true
                        }
                      });

                      if (!hat_arbeit) {
                        let hhh = new Hausarbeit();
                        hhh.schueler = sss;
                        hhh.status = '0';
                        nu_hauses.push(hhh)

                      }
                    });


                    let schuelers = [];
                    nu_hauses.forEach(function (hausarbeit) {
                      console.log('The Fotzi is %s', hausarbeit.schueler.name + '/' + hausarbeit.status);
                      schuelers.push(hausarbeit.schueler);
                    });

                    let length = nu_hauses.length;

                    res.render('change/article_schueler', {
                      now: getMyNow(),
                      article: article,
                      hausarbeits: nu_hauses,
                      length: length,
                      my_termin: myStringToDate(article.termin)

                    });
                  })












              } else {
                console.log('Fotzen type')

                var all_schuelers = article.schuelers





                all_schuelers.forEach(function (sss) {
                  console.log('all_schueler is %s', sss.username);

                  var hat_arbeit = false
                  hausarbeits.forEach(function (h) {
                    console.log('hausarbeit is %s', h.schueler.username);

                    if (sss.username === h.schueler.username) {
                      nu_hauses.push(h)
                      hat_arbeit = true
                    }



                  });

                  if (!hat_arbeit) {


                    let hhh = new Hausarbeit();
                    hhh.schueler = sss;
                    hhh.status = '0';

                    nu_hauses.push(hhh)



                  }




                });





                let schuelers = [];

                nu_hauses.forEach(function (hausarbeit) {
                  console.log('The Fotzi is %s', hausarbeit.schueler.name + '/' + hausarbeit.status);

                  schuelers.push(hausarbeit.schueler);
                });

                let length = nu_hauses.length;




                res.render('change/article_schueler', {
                  now: getMyNow(),
                  article: article,
                  hausarbeits: nu_hauses,
                  length: length,
                  my_termin: myStringToDate(article.termin)


                });










              }








            } else {

              req.flash('danger', 'Der User wurde gelöscht.');
              res.redirect('/');

            }

          });








      } else {

        req.flash('danger', 'Der Artikel ist komischerweise gelöscht ');
        res.redirect('/');

      }

    });




});








// Load edit_hausarbeit form
router.get('/edit_hausarbeit/:id', ensureAuthenticated, function (req, res) {
  //console.log('x ' + req.params.id);







  Hausarbeit.
    findOne({
      $and: [
        { article: req.params.id },
        { schueler: req.user._id }
      ]
    }).
    populate({
      path: 'article',
      populate: {
        path: 'stamm',
      }
    }).
    populate({
      path: 'article',
      populate: {
        path: 'stammverbund',
      }
    }).
    populate({
      path: 'article',
      populate: {
        path: 'disziplin',
      }
    }).
    exec(function (err, ha) {
      if (err) {

        console.log('6_iiiiiiiiiiii ' + err);

        req.flash('danger', 'Dieser Auftrag existiert nicht. ');
        res.redirect('/');


        return

      }

      if (ha) {










        res.render('change/edit_hausarbeit', {
          hausarbeit: ha,

        });
      } else {

        req.flash('danger', 'Der Auftrag wurde gelöscht. Du musst diese Hausarbeit nicht mehr machen. ');
        res.redirect('/');

      }

    });







});








// Load edit_hausarbeit form
router.get('/finished_hausarbeit/:id', ensureAuthenticated, function (req, res) {
  //console.log('x ' + req.params.id);







  Hausarbeit.
    findOne({
      $and: [
        { article: req.params.id },
        { schueler: req.user._id }
      ]
    }).
    populate({
      path: 'article',
      populate: {
        path: 'lehrer',
        model: 'User'


      }
    }).
    populate('schueler').
    populate({
      path: 'article',
      populate: {
        path: 'stamm',
      }
    }).
    populate({
      path: 'article',
      populate: {
        path: 'stammverbund',
      }
    }).
    populate({
      path: 'article',
      populate: {
        path: 'disziplin',
      }
    }).
    exec(function (err, ha) {
      if (err) {

        console.log('7_iiiiiiiiiiii ' + err);

        req.flash('danger', 'Dieser Auftrag existiert nicht. ');
        res.redirect('/');


        return

      }

      if (ha) {
        // console.log('The ha is %s', ha);


        //console.log('x nnnnn ' + ha.article.klasse);


        res.render('show/finished_hausarbeit', {
          hausarbeit: ha,

        });
      } else {

        req.flash('danger', 'Der Auftrag wurde gelöscht. Diese Hausarbeit wird nicht mehr überprüft. ');
        res.redirect('/');

      }

    });







});








// Load edit_hausarbeit form
router.get('/hausarbeit_for_lehrer/:id', ensureAuthenticated, function (req, res) {
  //console.log('x ' + req.params.id);







  Hausarbeit.
    findOne({ _id: req.params.id }).
    populate({
      path: 'article',
      populate: {
        path: 'stamm',
      }
    }).
    populate({
      path: 'article',
      populate: {
        path: 'stammverbund',
      }
    }).
    populate({
      path: 'article',
      populate: {
        path: 'disziplin',
      }
    }).
    populate('schueler').
    exec(function (err, ha) {
      if (err) {

        console.log('7_iiiiiiiiiiii ' + err);

        req.flash('danger', 'Diese Hausarbeit existiert nicht. ');
        res.redirect('/');


        return

      }

      if (ha) {
        // console.log('The ha is %s', ha);


        //console.log('x nnnnn ' + ha.article.klasse);


        res.render('show/finished_hausarbeit', {
          hausarbeit: ha,

        });
      } else {

        req.flash('danger', 'Der Hausarbeit wurde gelöscht. ');
        res.redirect('/');

      }

    });







});






// get

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// post




//HIER STIMMT IRGENDWAS NICHT
// Bingo Article
router.post('/add_bingo_edit', ensureAuthenticated, function (req, res) {










  console.log('kkkkkÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄä')
  var today = getMyNow();
  var tomorrow = getMyNow();
  tomorrow.setDate(today.getDate() + 3);




  var nau = ("00" + tomorrow.getDate()).slice(-2) + '.' + ("00" + (tomorrow.getMonth() + 1)).slice(-2) + '.' + ','


  console.log('req.body.klasse: ' + req.body.klasse);

  User.
    find({

      $or: [
        { klasse: req.body.klasse },
        { klasse2: req.body.klasse }
      ]

    }).
    sort({ name: 1 }).
    exec(function (err2, all_schuelers) {
      if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);











      ///???

      Article.
        findOne({ _id: req.params.id }).
        populate('schuelers').
        exec(function (err2, arti) {
          if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);



          if (arti) {



            if (arti.author != req.user._id) {
              //console.log('redirect');
              req.flash('danger', 'nicht autorisiert');
              res.redirect('/');
              return;

            } else {







              all_schuelers.forEach(function (all_schueler) {

                all_schueler.article_token = false

                //console.log('schüler: ' + all_schueler.name);

                arti.schuelers.forEach(function (arti_schueler) {


                  if (all_schueler._id === arti_schueler._id) {

                    all_schueler.article_token = all_schueler._id
                  }

                });

              });



              res.render('edit_article_neu', {
                title: 'Auftrag gespeichert',
                article: arti,
                schuelers: all_schuelers,
                abgabe: nau
              });
















            }





          } else {



            req.flash('danger', 'Auftrag nicht gefunden');
            res.redirect('/');







          }








        });








    });










});








// Bingo Article
router.post('/add_bingo', ensureAuthenticated, function (req, res) {



  User.findByIdAndUpdate(
    req.user._id,
    { default_klasse: req.body.klasse },
    function (err, result) {
      if (err) {

      } else {

      }
    }





  );





  console.log('kkkkk')
  var today = getMyNow();
  var tomorrow = getMyNow();
  tomorrow.setDate(today.getDate() + 3);




  var nau = ("00" + tomorrow.getDate()).slice(-2) + '.' + ("00" + (tomorrow.getMonth() + 1)).slice(-2) + '.' + tomorrow.getFullYear()


  console.log('req.body.klasse: ' + req.body.klasse);
  console.log('req.body.speichertyp: ' + req.body.speichertyp);



  if (req.body.speichertyp === 'Für ausgewählte SuS') {

    User.
      find({

        $or: [
          { klasse: req.body.klasse },
          { klasse2: req.body.klasse }
        ]

      }).
      sort({ name: 1 }).
      exec(function (err2, schuelers) {
        if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);




        var packages = [];

        var package = {

          klasse_name: '',
          child: []


        }
        var last_klasse = ''

        schuelers.forEach(function (schueler) {

          //console.log('schüler: VVVV' );
          if (schueler.klasse2 === req.body.klasse) {//klassenübergreifende Gruppe wurde gewählt
            console.log('schüler: ' + schueler.name + '    ' + schueler.klasse);

            if (last_klasse !== schueler.klasse) {
              //last_klasse= schueler.klasse

            }

          }

        });







        User.
          findOne({ _id: req.user.id }).
          populate('school').
          exec(function (err2, user) {
            if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);


            console.log('i------------- ' + user.name);
            console.log('i------------- ' + user.school.name);


            res.render('add_article_neu', {
              user: user,
              schuelers: schuelers,
              abgabe: nau,
              klasse: req.body.klasse
            })

          });



      });


  } else {





    User.
      findOne({ _id: req.user.id }).
      populate('school').
      exec(function (err2, user) {
        if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);


        console.log('i------------- ' + user.name);
        console.log('i------------- ' + user.school.name);


        res.render('add_article_alt', {
          user: user,
          abgabe: nau,
          klasse: req.body.klasse
        })

      });








  }



});







// Bingo Article
router.post('/add_bingo_broadcast', ensureAuthenticated, function (req, res) {



  User.findByIdAndUpdate(
    req.user._id,
    { default_broadcast: req.body.broadcast },
    function (err, result) {
      if (err) {

      } else {

      }
    }





  );


  var today = getMyNow();
  var tomorrow = getMyNow();
  tomorrow.setDate(today.getDate() + 3);




  var nau = ("00" + tomorrow.getDate()).slice(-2) + '.' + ("00" + (tomorrow.getMonth() + 1)).slice(-2) + '.' + tomorrow.getFullYear()


  console.log('req.body.broadcast: ' + req.body.broadcast);






  res.render('add_article_alt', {

    abgabe: nau,
    klasse: req.body.broadcast
  })







});








// Bingo Article
router.post('/add_bingo_klasse_broadcast', ensureAuthenticated, function (req, res) {
  User.findByIdAndUpdate(
    req.user._id,
    { default_klasse: req.body.klasse },
    function (err, result) {
      if (err) {
      } else {
      }

    });

  var today = getMyNow();
  var tomorrow = getMyNow();
  tomorrow.setDate(today.getDate() + 3);

  var nau = ("00" + tomorrow.getDate()).slice(-2) + '.' + ("00" + (tomorrow.getMonth() + 1)).slice(-2) + '.' + tomorrow.getFullYear()
  User.
    findOne({ _id: req.user._id }).
    populate({
      path: 'school',
      populate: {
        path: 's_disziplins'
      }
    }).
    exec(function (err, user) {

      if (err) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);
      console.log('i------------- ' + user.name);
      console.log('i------------- ' + user.school.name);

      res.render('change/add_article_alt', {
        user: user,
        abgabe: nau,
        klasse: req.body.klasse_n
      })

    });
});








router.get('/add_with_group/:id', ensureAuthenticated, function (req, res) {



  var today = getMyNow();
  var tomorrow = getMyNow();
  tomorrow.setDate(today.getDate() + 3);
  var nau = ("00" + tomorrow.getDate()).slice(-2) + '.' + ("00" + (tomorrow.getMonth() + 1)).slice(-2) + '.' + tomorrow.getFullYear()

  User.
    findOne({ _id: req.user._id }).
    populate({
      path: 'school',
      populate: {
        path: 's_disziplins'
      }
    }).
    exec(function (err, user) {

      if (err) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);
      //console.log('i------------- ' + user.name);
      //console.log('i------------- ' + user.school.name);




      Group.findOne({ _id: req.params.id }, function (err, gefunden_group) {
        if (err) throw err;
        if (gefunden_group) {

          //console.log('gefunden_group: ' + gefunden_group.name);



          var bingo = new Object();
          bingo.name = gefunden_group.name;
          bingo._id = gefunden_group._id;
          bingo.typ = 'group';

          res.render('change/add_article_alt', {
            user: user,
            abgabe: nau,
            bingo: bingo
          })




        } else {

          console.log('FEHLER RR: ');

        }
      })



    });




});








// Bingo Article
router.post('/one', ensureAuthenticated, function (req, res) {

});










function isPossibleFrist(termin) {

  var tag = termin.substring(7, 9)
  var monat = termin.substring(10, 12)
  var jahr = termin.substring(13, 17)
  //console.log('tag   ' + tag);
  //console.log('monat   ' + monat);
  //console.log('jahr   ' + jahr);
  var d = new Date(jahr, monat - 1, tag, 16);
  var jetzt = getMyNow();
  var diffMs = (d - jetzt); // milliseconds between now & Christmas


  if (diffMs < 0) { //wenn der Termin in der Vergangenheit liegt, ist Schluss mit Speichern

    return false;
  } else {

    return true;

  }

}










function addGroup(article, req, res) {



  var jo = []
  var ii = 0;
  req.body.schuelers.forEach(function (user_id) {//alle adressaten werden in einen Array gesteckt
    console.log('fifi___:   ' + user_id);
    jo.push(user_id);
    ii++;
  });


  User.
    findOne({ _id: req.user.id }).
    populate({
      path: 'school',
      populate: {
        path: 'schuelers'
      }
    }).
    exec(function (err, user) {
      if (err) throw err;
      if (!user) {
        return
      }


      let group = new Group();
      console.log('req.body.for_all :   ' + req.body.for_all);

      group.name = 'einmalige Schülergruppe'; //anscheinend kann man eine leere group nur mit bezug zu anderen objekten nicht speichern 
      if (req.body.for_all === '1') {
        group.school = user.school;
        group.name = req.body.vorlage_name.trim()
      } else if (req.body.for_all === '2') {
        group.lehrer = user;
        group.name = req.body.vorlage_name.trim()
      } else {
        //nix
      }





      group.save(function (err, saved_group) {//es kann sein, dass hier bei for_all = 0 ein "lleren" group speichert, ist aber alles soweit richtig



        User.find().where('_id').in(jo).exec((err, users) => {

          users.forEach(function (user) {
            console.log('schülerName :   ' + user.name);

            Group.findByIdAndUpdate(saved_group._id,
              { $push: { schuelers: user } },
              { safe: true, upsert: true },
              function (err, uptdatedGroup) {
                if (err) {
                  console.log(err);
                } else {

                }
              }
            )
          })


          if (req.body.for_all === '1') {
            School.findByIdAndUpdate(user.school._id,
              { $push: { groups: saved_group } },
              { safe: true, upsert: true },
              function (err, updated_school) {
                if (err) {
                  console.log(err);
                } else {

                  handleSaveWithGroup(article, saved_group, req, res);

                }



              })


          } else if (req.body.for_all === '2') {

            User.findByIdAndUpdate(user._id,
              { $push: { lehrers_groups: saved_group } },
              { safe: true, upsert: true },
              function (err, updated_lehrer) {
                if (err) {
                  console.log(err);
                } else {

                  handleSaveWithGroup(article, saved_group, req, res);
                  return;

                }


              })






          } else {
            console.log('saved_group :   ' + saved_group.name);

            handleSaveWithGroup(article, saved_group, req, res);
            return;





          }


        });




      })

    })





}










// 
router.post("/add_group", (req, res) => {


  if (!req.user) {  //wer nicht angemeldet ist, kann nicht speichern
    req.flash('warning', 'Du bist nicht angemeldet');
    res.redirect('/');
    return
  }

  if (!req.body.schuelers) { // Wenn man kein Users auswählt kann man (hier) nicht speichern
    req.flash('warning', 'Du hast keine SchülerInnen ausgewählt. ');
    res.redirect('/');
    return
  }


  var jo = []
  var ii = 0;
  req.body.schuelers.forEach(function (user_id) {//alle adressaten werden in einen Array gesteckt
    console.log('fifi___:   ' + user_id);
    jo.push(user_id);
    ii++;
  });



  User.
    findOne({ _id: req.user.id }).
    populate({
      path: 'school',
      populate: {
        path: 'schuelers'
      }
    }).
    exec(function (err, user) {
      if (err) throw err;
      if (!user) {
        return
      }






      let group = new Group();



      group.name = 'einmalige Schülergruppe'; //anscheinend kann man eine leere group nur mit bezug zu anderen objekten nicht speichern 
      if (req.body.for_all === '1') {
        group.school = user.school;
      } else if (req.body.for_all === '2') {
        group.lehrer = user;

      } else {
        // console.log('req.body.for_all :   ' + req.body.for_all);  nix
      }





      group.save(function (err, saved_group) {//es kann sein, dass hier bei for_all = 0 ein "lleren" group speichert, ist aber alles soweit richtig



        User.find().where('_id').in(jo).exec((err, users) => {

          users.forEach(function (user) {
            console.log('schülerName :   ' + user.name);

            Group.findByIdAndUpdate(saved_group._id,
              { $push: { schuelers: user } },
              { safe: true, upsert: true },
              function (err, uptdatedGroup) {
                if (err) {
                  console.log(err);
                } else {

                }
              }
            )
          })


          if (req.body.for_all === '1') {
            School.findByIdAndUpdate(user.school._id,
              { $push: { groups: saved_group } },
              { safe: true, upsert: true },
              function (err, updated_school) {
                if (err) {
                  console.log(err);
                } else {


                }

                res.render('change/add_group_name', {
                  group_id: saved_group._id,
                })

                return
              })


          } else if (req.body.for_all === '2') {

            User.findByIdAndUpdate(user._id,
              { $push: { lehrers_groups: saved_group } },
              { safe: true, upsert: true },
              function (err, updated_lehrer) {
                if (err) {
                  console.log(err);
                } else {


                }

                res.render('change/add_group_name', {
                  group_id: saved_group._id,
                })
                return
              })






          } else {
            res.redirect('/articles/add_with_group/' + saved_group._id);
            return



          }


        });




      })




    })
})












// 
router.post("/add_group_name", (req, res) => {
  var name = req.body.name.trim();
  var group_id = req.body.group_id;


  if (!req.user) {  //wer nicht angemeldet ist, kann nicht speichern
    req.flash('warning', 'Du bist nicht angemeldet');
    res.redirect('/');
    return
  }



  User.
    findOne({ _id: req.user.id }).
    populate({
      path: 'school',
      populate: {
        path: 'schuelers'
      }
    }).
    exec(function (err, user) {
      if (err) throw err;
      if (!user) {
        return
      }




      Group.findOne({
        $or: [
          { $and: [{ name: name }, { school: user.school }] },
          { $and: [{ name: name }, { lehrer: user }] }
        ]
      }, function (err, gibbet_schon) {
        if (err) throw err;
        if (gibbet_schon) {
          req.flash('danger', 'Deine Schule hat bereits eine Schülergruppe mit diesem Namen');
          res.render('change/add_group_name', {
            group_id: group_id
          })
          return
        }


        console.log('lll :   ' + group_id)


        let groupi = {};
        groupi.name = name;

        Group.update({ _id: group_id }, groupi, function (err, groupiiii) {
          if (err) throw err;
          //console.log('lll :   ' + groupiiii._id)
          res.redirect('/articles/add_with_group/' + group_id);
          return

        })


      })

    })
})




















router.post("/add_alt", upload.array("files"), (req, res) => {
  if (!req.user) {  //wer nicht angemeldet ist, kann nicht speichern
    req.flash('warning', 'Du bist nicht angemeldet');
    res.redirect('/');
    return
  }

  if (!isPossibleFrist(req.body.termin)) {
    req.flash('danger', 'Die Abgabefrist liegt in der Vergangenheit. Der Auftrag wurde nicht erteilt');
    res.redirect('/');
    return;
  }



  //console.log(' req.body.body.length '+req.body.body.length)
  // console.log(' in Byte '+byteCount(req.body.body.length))

  //console.log(' req.body.body: '+req.body.body)
  if (req.body.body.length > 15700000) {  //wer nicht angemeldet ist, kann nicht speichern
    req.flash('danger', 'Der Auftrag hat einen zu großen Speicherbedarf. Binde weniger Bilder ein.');
    res.redirect('/');
    return
  }

  let article = new Article();

  constructArticle(article, req, res)


})





function constructArticle(article, req, res) {


  if (req.body.adressat === 'An Klasse') {
    console.log('hier: Adressat: Klasse');
    Stamm.findOne({ _id: req.body.stamm }, function (err, gefunden_stamm) {
      if (err) throw err;
      if (!gefunden_stamm) {
        console.log('fehler: ');
      }

      console.log('gefunden_stamm: ' + gefunden_stamm.name);
      article.stamm = gefunden_stamm;

      handleSave(article, req, res);

    })

  } else if (req.body.adressat === 'An mehrere Klassen') {
    console.log('hier: Mehrere Klassen');
    Stammverbund.findOne({ _id: req.body.stammverbund }, function (err, gefunden_stammverbund) {
      if (err) throw err;
      if (!gefunden_stammverbund) {
        console.log('fehler: ');
      }

      console.log('gefunden_stammverbund: ' + gefunden_stammverbund.name);
      article.stammverbund = gefunden_stammverbund;

      handleSave(article, req, res);


    })

  } else if (req.body.adressat === 'An Schülergruppe (Vorlage)') {
    console.log('hier: Schülergruppe (Vorlage)');


    Group.
      findOne({ _id: req.body.group }).
      populate('schuelers').
      exec(function (err, gefunden_group) {
        if (err) throw err;
        if (!gefunden_group) {
          console.log('fehler: ');
        }

        //console.log('gefunden_group: ' + gefunden_group.name);
        // article.group = gefunden_group;


        handleSaveWithGroup(article, gefunden_group, req, res);

      })


  } else if (req.body.adressat === 'An neue Schülergruppe') {
    console.log('hier: Neue Schülergruppe');


    addGroup(article, req, res);
    // article.group = gefunden_group;





  } else {
    console.log('FEHLER');
    //fehler
    return;
  }







}















function handleSave(article, req, res) {

  Disziplin.findOne({ _id: req.body.disziplin }, function (err, gefunden_disziplin) {
    if (err) throw err;
    if (!gefunden_disziplin) {
      console.log('fehler: ');
    }

    console.log('gefunden_disziplin: ' + gefunden_disziplin.name);
    article.disziplin = gefunden_disziplin;

    article.title = req.body.title;
    article.author = req.user._id;
    //article.klasse = req.body.klasse;
    article.fach = req.body.fach;
    article.termin = req.body.termin;
    article.body = req.body.body;
    article.lehrer = req.user._id;
    article.ha_gelb = '0';
    article.ha_gruen = '0'
    article.created_as_date = getMyNow();

    const start = getMyNow();
    var nau = start.getDate() + '.' + start.getMonth() + '.' + start.getFullYear() + ', ' + start.getHours() + '.' + start.getMinutes() + ' Uhr';
    var nau = start.getDate() + '.' + start.getMonth() + '. (' + start.getHours() + ':' + start.getMinutes() + ')'

    article.created = nau;





    console.log('hier: ----------------------------------------------');
    article.save(function (err, art) {

      if (err) {
        console.log(err);
        return;
      } else {

        User.findByIdAndUpdate(req.user.id,
          { $push: { lehrers_auftrags: art } },
          { safe: true, upsert: true },
          function (err, uptdatedSchueler) {
            if (err) throw err;

            Disziplin.findByIdAndUpdate(art.disziplin._id,
              { $push: { articles: art } },
              { safe: true, upsert: true },
              function (err, uptdatedStamm) {
                if (err) throw err;



                if (art.stamm) {
                  console.log('bereit stamm');
                  Stamm.findByIdAndUpdate(art.stamm._id,
                    { $push: { articles: art } },
                    { safe: true, upsert: true },
                    function (err, uptdatedStamm) {
                      if (err) throw err;

                    })



                } else if (art.stammverbund) {
                  console.log('bereit stammverbund');
                  Stammverbund.findByIdAndUpdate(art.stammverbund._id,
                    { $push: { articles: art } },
                    { safe: true, upsert: true },
                    function (err, uptdatedStammverbund) {
                      if (err) throw err;

                    })


                } else if (art.group) {
                  console.log('bereit group');
                  Group.findByIdAndUpdate(art.group._id,
                    { $push: { articles: art } },
                    { safe: true, upsert: true },
                    function (err, uptdatedGroup) {
                      if (err) throw err;

                    })


                } else {
                  console.log('fefe  fehler');


                }



              })

          });



        handleUploadAndExit(art, req, res)


      }
    })
  })


}








function handleSaveWithGroup(article, group, req, res) {

  Disziplin.findOne({ _id: req.body.disziplin }, function (err, gefunden_disziplin) {
    if (err) throw err;
    if (!gefunden_disziplin) {
      console.log('fehler: ');
    }

    console.log('gefunden_disziplin: ' + gefunden_disziplin.name);
    article.disziplin = gefunden_disziplin;

    article.title = req.body.title;
    article.author = req.user._id;
    //article.klasse = req.body.klasse;
    article.fach = req.body.fach;
    article.termin = req.body.termin;
    article.body = req.body.body;
    article.lehrer = req.user._id;
    article.ha_gelb = '0';
    article.ha_gruen = '0'
    article.created_as_date = getMyNow();

    const start = getMyNow();
    var nau = start.getDate() + '.' + start.getMonth() + '.' + start.getFullYear() + ', ' + start.getHours() + '.' + start.getMinutes() + ' Uhr';
    var nau = start.getDate() + '.' + start.getMonth() + '. (' + start.getHours() + ':' + start.getMinutes() + ')'

    article.created = nau;



    //console.log('hier: ' + article.body);
    article.save(function (err, art) {

      if (err) {
        console.log(err);
        return;
      } else {

        User.findByIdAndUpdate(req.user.id,
          { $push: { lehrers_auftrags: art } },
          { safe: true, upsert: true },
          function (err, uptdatedSchueler) {
            if (err) throw err;

            Disziplin.findByIdAndUpdate(art.disziplin._id,
              { $push: { articles: art } },
              { safe: true, upsert: true },
              function (err, uptdatedStamm) {
                if (err) throw err;


                console.log('bereit group');
                Group.findByIdAndUpdate(group._id,
                  { $push: { articles: art } },
                  { safe: true, upsert: true },
                  function (err, uptdatedGroup) {
                    if (err) throw err;

                    Group.
                      findOne({ _id: uptdatedGroup._id }).
                      populate('schuelers').
                      exec(function (err, gefunden_group) {

                        gefunden_group.schuelers.forEach(function (schueler) {
                          console.log('record :   ' + schueler.name);


                          Article.findByIdAndUpdate(art._id,
                            { $push: { schuelers: schueler } },
                            { safe: true, upsert: true },
                            function (err, uptdatedArticle) {
                              if (err) {
                                console.log(err);
                              } else {
                                User.findByIdAndUpdate(schueler._id,
                                  { $push: { auftrags: uptdatedArticle } },
                                  { safe: true, upsert: true },
                                  function (err, uptdatedSchueler) {
                                    if (err) {
                                      console.log(err);
                                    } else {

                                    }
                                  })
                              }
                            }
                          )
                        })
                      })

                    if (group.school) {
                      console.log('öffentliche Group');
                    } else if (group.lehrer) {
                      console.log('private Group');
                    } else {
                      console.log('junk Group');
                      Group.remove({ _id: group._id }, function (err) {
                        if (err) {
                          console.log(err);
                        }
                      });
                    }
                  })
              })
          });


        setTimeout(function () {// das hier verzögert die Weiterleitung auf index, da vorher die $push Verknüpfung der schuelers Zeit zu brauchen scheint
          //console.log('hhhaaalllooo')
          handleUploadAndExit(art, req, res)
        }, 300);


      }
    })
  })


}







//brauche ich für article edit_complete
function handleDeleteUpload(art, req, res) {
  /// es soll gelöscht werden
  art.uploads.forEach(function (load) {
    Load.remove({ _id: load._id }, function (err) { //löschen der LoadObjekte
      if (err) {
        console.log(err);
      }
    });
    const targetPath = path.join(__dirname, "../uploads/" + load.body); //Löschen aus dem filesystem
    fs.unlink(targetPath, err => {
      if (err) return handleError(err, res);
    });
  })
}







function handleUploadAndExit(art, req, res) {

  if (req.files.length === 0) {
    req.flash('success', 'Auftrag wurde erteilt. Er wird jetzt den SuS angezeigt.');
    res.redirect('/');
  } else {
    var ii = 0
    req.files.forEach(function (file) {

      const tempPath = file.path;
      const gigi = getMyNow().getTime() + "_" + file.originalname.toLowerCase();
      const gigi_sauber = gigi.split(' ').join('-');
      const targetPath = path.join(__dirname, "../uploads/" + gigi_sauber);
      //const targetPath = path.join(__dirname, "../uploads/" + req.user._id + "_" +path.extname(file.originalname).toLowerCase());

      const pipi = path.extname(file.originalname).toLowerCase()
      if (
        pipi == ".doc" || pipi == ".docx" || pipi == ".odt" || pipi == ".pdf" || pipi == ".rtf" || pipi == ".tex" ||
        pipi == ".txt" || pipi == ".wpd" || pipi == ".ai" || pipi == ".gif" || pipi == ".ico" || pipi == ".jpeg" ||
        pipi == ".jpg" || pipi == ".png" || pipi == ".ps" || pipi == ".psd" || pipi == ".svg" || pipi == ".tif" ||
        pipi == ".tiff" || pipi == ".ods" || pipi == ".xls" || pipi == ".xlsm" || pipi == ".xlsx" || pipi == ".key" ||
        pipi == ".odp" || pipi == ".pps" || pipi == ".ppt" || pipi == ".pptx"
      ) {

        console.log('klappt 0' + targetPath);
        fs.rename(tempPath, targetPath, err => {
          if (err) return handleError(err, res);

          console.log('klappt ' + targetPath);

          let load = new Load();
          load.body = gigi_sauber;
          load.extension = path.extname(gigi_sauber);
          load.name = file.originalname;
          console.log('klahhppt ' + load.body);

          if (
            pipi == ".doc" || pipi == ".docx" || pipi == ".odt" || pipi == ".pdf" || pipi == ".rtf" ||
            pipi == ".tex" || pipi == ".txt" || pipi == ".wpd"
          ) {
            load.type = '1'
          } else if (
            pipi == ".ai" || pipi == ".gif" || pipi == ".ico" || pipi == ".jpeg" || pipi == ".jpg" ||
            pipi == ".png" || pipi == ".ps" || pipi == ".psd" || pipi == ".svg" || pipi == ".tif" || pipi == ".tiff"
          ) {
            load.type = '2'
          } else if (
            pipi == ".ods" || pipi == ".xls" || pipi == ".xlsm" || pipi == ".xlsx"
          ) {
            load.type = '3'
          } else if (
            pipi == ".key" || pipi == ".odp" || pipi == ".pps" || pipi == ".ppt" || pipi == ".pptx"
          ) {

            load.type = '4'
          }

          load.save().then(function (loaded) {

            Article.findByIdAndUpdate(art._id,
              { $push: { uploads: loaded } },
              { safe: true, upsert: true },
              function (err, uptdatedArticle) {
                if (err) {
                  console.log(err);
                } else {

                }
              });
          })
        })

      } else {
        console.log('klappt nicht 0 ' + targetPath);
        fs.unlink(tempPath, err => {
          if (err) return handleError(err, res);
          console.log('klappt nicht' + targetPath);
          //weil dieser prozess so lange dauert, kann ma ihn nicht abfangen

        });
      }
      ii++;
    })

    req.flash('success', 'Auftrag erteilt. Er wird jetzt den SuS angezeigt.');
    res.redirect('/');
    return
  }
}





// post add_hausarbeit
router.post("/add_hausarbeit", upload.array("files"),
  (req, res) => {
    if (typeof req.user === "undefined") {
      req.flash('warning', 'Du bist ausgeloggt. Um eine Hausarbeit zu abzuschicken, musst du eingeloggt sein');
      res.redirect('/');
      return;
    }

    /*     if (!req.body.body || req.body.body.length <= 8) {
          req.flash('danger', 'Deine Hausarbeit ist leer oder viel zu kurz. So geht das nicht.');
          res.redirect('/');
          return;
        } */


    Article.findById(req.body.article_id, function (err, article) {

      if (err) {
        console.log(err);
      } else {

        if (!article) {

          req.flash('warning', 'Der Auftrag wurde gerade gelöscht. Du musst diese Hausarbeit nicht mehr abgeben');
          res.redirect('/');
          return;


        }


        const start = getMyNow();
        var tag = article.termin.substring(0, 2)
        var monat = article.termin.substring(3, 5)
        var jahr = article.termin.substring(6, 10)
        var termin = new Date(jahr, monat - 1, tag, 16);


        if (termin < start) {
          req.flash('danger', 'Zu spät. Die Frist für diesen Auftrag ist abgelaufen. Nun kannst du deine Hausarbeit nicht mehr abgeben ');
          res.redirect('/');
          return;
        }




        let hausarbeit = new Hausarbeit();
        hausarbeit.article = req.body.article_id;
        hausarbeit.schueler = req.user._id;
        hausarbeit.status = '1';
        hausarbeit.body = req.body.body;
        hausarbeit.reflexion_hilfe = req.body.reflexion_hilfe;
        hausarbeit.reflexion_schwer = req.body.reflexion_schwer;
        hausarbeit.reflexion_zeit = req.body.reflexion_zeit;
        hausarbeit.reflexion_text = req.body.reflexion_text;


        var nau = ("00" + start.getDate()).slice(-2) + '.' + ("00" + (start.getMonth() + 1)).slice(-2) + '. ' + start.getHours() + '.' + ("00" + start.getMinutes()).slice(-2) + ' Uhr';

        hausarbeit.created = nau;


        hausarbeit.save(function (err, ha) {


          if (err) {
            console.log(err);
            return;
          } else {








            if (req.files.length === 0) {


              req.flash('success', 'Sehr gut. Du hast deine Hausarbeit abgegeben. Bestimmt erhältst du bald eine Rückmeldung ');
              res.redirect('/');

              return

            }

            var ii = 0
            req.files.forEach(function (file) {

              console.log('______________________-' + ii);

              ii++;


              const tempPath = file.path;
              const gigi = getMyNow().getTime() + "_" + file.originalname.toLowerCase();
              const gigi_sauber = gigi.split(' ').join('-');
              const targetPath = path.join(__dirname, "../uploads/" + gigi_sauber);
              //const targetPath = path.join(__dirname, "../uploads/" + req.user._id + "_" +path.extname(file.originalname).toLowerCase());
              console.log('bennoYYY ' + targetPath);

              const pipi = path.extname(file.originalname).toLowerCase()
              if (
                pipi == ".doc" ||
                pipi == ".docx" ||
                pipi == ".odt" ||
                pipi == ".pdf" ||
                pipi == ".rtf" ||
                pipi == ".tex" ||
                pipi == ".txt" ||
                pipi == ".wpd" ||
                pipi == ".ai" ||
                pipi == ".gif" ||
                pipi == ".ico" ||
                pipi == ".jpeg" ||
                pipi == ".jpg" ||
                pipi == ".png" ||
                pipi == ".ps" ||
                pipi == ".psd" ||
                pipi == ".svg" ||
                pipi == ".tif" ||
                pipi == ".tiff" ||
                pipi == ".ods" ||
                pipi == ".xls" ||
                pipi == ".xlsm" ||
                pipi == ".xlsx" ||
                pipi == ".key" ||
                pipi == ".odp" ||
                pipi == ".pps" ||
                pipi == ".ppt" ||
                pipi == ".pptx"
              ) {



                fs.rename(tempPath, targetPath, err => {
                  if (err) return handleError(err, res);




                  let load = new Load();
                  load.body = gigi_sauber;
                  load.extension = path.extname(gigi_sauber);
                  load.name = file.originalname;


                  if (
                    pipi == ".doc" ||
                    pipi == ".docx" ||
                    pipi == ".odt" ||
                    pipi == ".pdf" ||
                    pipi == ".rtf" ||
                    pipi == ".tex" ||
                    pipi == ".txt" ||
                    pipi == ".wpd"

                  ) {
                    load.type = '1'
                  } else if (

                    pipi == ".ai" ||
                    pipi == ".gif" ||
                    pipi == ".ico" ||
                    pipi == ".jpeg" ||
                    pipi == ".jpg" ||
                    pipi == ".png" ||
                    pipi == ".ps" ||
                    pipi == ".psd" ||
                    pipi == ".svg" ||
                    pipi == ".tif" ||
                    pipi == ".tiff"

                  ) {

                    load.type = '2'

                  } else if (

                    pipi == ".ods" ||
                    pipi == ".xls" ||
                    pipi == ".xlsm" ||
                    pipi == ".xlsx"

                  ) {

                    load.type = '3'

                  } else if (

                    pipi == ".key" ||
                    pipi == ".odp" ||
                    pipi == ".pps" ||
                    pipi == ".ppt" ||
                    pipi == ".pptx"

                  ) {

                    load.type = '4'
                  }



                  load.save().then(function (loaded) {

                    Hausarbeit.findByIdAndUpdate(ha._id,
                      { $push: { uploads: loaded } },
                      { safe: true, upsert: true },
                      function (err, uptdatedHausaufgabe) {
                        if (err) {
                          console.log(err);
                        } else {

                        }
                      });
                  })




                })

              } else {
                fs.unlink(tempPath, err => {
                  if (err) return handleError(err, res);


                  req.flash('danger', 'Ein Dateityp wird nicht unterstützt.');




                });
              }


            })

















            req.flash('success', 'Super! Du hast deine Hausarbeit abgegeben. Solange deine Arbeit nicht überprüft wurde, kannst du sie noch ändern. ');
            res.redirect('/');
          }
        })













      }

    })









  });





// Update submit POST route HAUSARBEIT
router.post("/edit_hausarbeit/:id", upload.array("files"),
  (req, res) => {


    if (typeof req.user === "undefined") {
      req.flash('warning', 'Du bist ausgeloggt. Bitte logge dich ein, um deine Hausarbeit zu bearbeiten');
      res.redirect('/');
      return;
    }


    Article.findById(req.body.article_id, function (err, article) {

      if (err) {
        //console.log('wwwERROR_______________________');
        console.log(err);

      } else {

        if (!article) {

          req.flash('warning', 'Der Auftrag wurde gerade gelöscht. Du musst diese Hausarbeit nicht mehr abgeben');
          res.redirect('/');
          return;
        }

        const start = getMyNow();
        var tag = article.termin.substring(0, 2)
        var monat = article.termin.substring(3, 5)
        var jahr = article.termin.substring(6, 10)
        var termin = new Date(jahr, monat - 1, tag, 16);

        if (termin < start) {

          req.flash('danger', 'Zu spät. Die Frist für diesen Auftrag ist abgelaufen. Nun kannst du deine Hausarbeit nicht mehr ändern. Die Lehrer*in bekommt die alte Version. ');
          res.redirect('/');
          return;

        }



        Hausarbeit.
          findOne({ _id: req.params.id }).
          populate('uploads').
          exec(function (err10, haus) {
            if (err10) throw err10;

            if (!haus) {
              req.flash('warning', 'Deine Hausarbeit wurde gelöscht');
              res.redirect('/');
              return;
            }

            if (haus.status === '2') {
              req.flash('warning', 'Deine Hausarbeit kann nicht mehr geändert werden, da sie bereits von der Lehrkraft beurteilt wurde');
              res.redirect('/');
              return
            }



            var query = { '_id': req.params.id };
            let hausarbeit = {};

            hausarbeit.body = req.body.body;
            hausarbeit.reflexion_hilfe = req.body.reflexion_hilfe;
            hausarbeit.reflexion_schwer = req.body.reflexion_schwer;
            hausarbeit.reflexion_zeit = req.body.reflexion_zeit;
            hausarbeit.reflexion_text = req.body.reflexion_text;
            hausarbeit.status = '1';

            var nau = ("00" + start.getDate()).slice(-2) + '.' + ("00" + (start.getMonth() + 1)).slice(-2) + '. ' + start.getHours() + '.' + ("00" + start.getMinutes()).slice(-2) + ' Uhr';
            hausarbeit.created = nau;



            Hausarbeit.findOneAndUpdate(query, hausarbeit, { upsert: true }, function (err, doc) {
              if (err) return res.send(500, { error: err });





              if (req.body.delete) {
                /// es soll gelöscht werden



                haus.uploads.forEach(function (load) {


                  console.log('load:  :  :  ' + load.body)



                  Load.remove({ _id: load._id }, function (err) { //löschen der LoadObjekte
                    if (err) {
                      console.log(err);
                    }
                  });


                  const targetPath = path.join(__dirname, "../uploads/" + load.body); //Löschen aus dem filesystem
                  fs.unlink(targetPath, err => {
                    if (err) return handleError(err, res);






                  });

                })


              }








              var ii = 0
              req.files.forEach(function (file) {


                console.log('______________________-' + ii);

                ii++;







                const tempPath = file.path;
                const gigi = getMyNow().getTime() + "_" + file.originalname.toLowerCase();
                const gigi_sauber = gigi.split(' ').join('-');
                const targetPath = path.join(__dirname, "../uploads/" + gigi_sauber);
                //const targetPath = path.join(__dirname, "../uploads/" + req.user._id + "_" +path.extname(file.originalname).toLowerCase());
                console.log('bennoYYY ' + targetPath);

                const pipi = path.extname(file.originalname).toLowerCase()
                if (
                  pipi == ".doc" ||
                  pipi == ".docx" ||
                  pipi == ".odt" ||
                  pipi == ".pdf" ||
                  pipi == ".rtf" ||
                  pipi == ".tex" ||
                  pipi == ".txt" ||
                  pipi == ".wpd" ||
                  pipi == ".ai" ||
                  pipi == ".gif" ||
                  pipi == ".ico" ||
                  pipi == ".jpeg" ||
                  pipi == ".jpg" ||
                  pipi == ".png" ||
                  pipi == ".ps" ||
                  pipi == ".psd" ||
                  pipi == ".svg" ||
                  pipi == ".tif" ||
                  pipi == ".tiff" ||
                  pipi == ".ods" ||
                  pipi == ".xls" ||
                  pipi == ".xlsm" ||
                  pipi == ".xlsx" ||
                  pipi == ".key" ||
                  pipi == ".odp" ||
                  pipi == ".pps" ||
                  pipi == ".ppt" ||
                  pipi == ".pptx"
                ) {



                  fs.rename(tempPath, targetPath, err => {
                    if (err) return handleError(err, res);




                    let load = new Load();
                    load.body = gigi_sauber;
                    load.extension = path.extname(gigi_sauber);
                    load.name = file.originalname;


                    if (
                      pipi == ".doc" ||
                      pipi == ".docx" ||
                      pipi == ".odt" ||
                      pipi == ".pdf" ||
                      pipi == ".rtf" ||
                      pipi == ".tex" ||
                      pipi == ".txt" ||
                      pipi == ".wpd"

                    ) {
                      load.type = '1'
                    } else if (

                      pipi == ".ai" ||
                      pipi == ".gif" ||
                      pipi == ".ico" ||
                      pipi == ".jpeg" ||
                      pipi == ".jpg" ||
                      pipi == ".png" ||
                      pipi == ".ps" ||
                      pipi == ".psd" ||
                      pipi == ".svg" ||
                      pipi == ".tif" ||
                      pipi == ".tiff"

                    ) {

                      load.type = '2'

                    } else if (

                      pipi == ".ods" ||
                      pipi == ".xls" ||
                      pipi == ".xlsm" ||
                      pipi == ".xlsx"

                    ) {

                      load.type = '3'

                    } else if (

                      pipi == ".key" ||
                      pipi == ".odp" ||
                      pipi == ".pps" ||
                      pipi == ".ppt" ||
                      pipi == ".pptx"

                    ) {

                      load.type = '4'
                    }



                    load.save().then(function (loaded) {

                      Hausarbeit.findByIdAndUpdate(doc._id,
                        { $push: { uploads: loaded } },
                        { safe: true, upsert: true },
                        function (err, uptdatedArticle) {
                          if (err) {
                            console.log(err);
                          } else {

                          }
                        });
                    })




                  })

                } else {
                  fs.unlink(tempPath, err => {
                    if (err) return handleError(err, res);







                  });
                }







              })















              req.flash('success', 'Hausarbeit geändert');
              res.redirect('/');



            });


























          })





















      }


    });


























  });







// Update submit POST route HAUSARBEIT
router.post('/korrektur_hausarbeit/:id', function (req, res) {

  //console.log(req.params.id);
  if (typeof req.user === "undefined") {

    req.flash('warning', 'Du bist ausgeloggt. Bitte logge dich ein, um deine Korrektur zu senden');
    res.redirect('/');
    return;
  }






  var query = { '_id': req.params.id };


  let hausarbeit = {};

  hausarbeit.ergebnis_ok = req.body.ergebnis_ok;
  hausarbeit.ergebnis_dollar = req.body.ergebnis_dollar;
  hausarbeit.ergebnis_note = req.body.ergebnis_note;
  hausarbeit.ergebnis_text = req.body.ergebnis_text;
  hausarbeit.status = '2';


  Hausarbeit.findOneAndUpdate(query, hausarbeit, { upsert: true }, function (err, doc) {
    if (err) return res.send(500, { error: err });






    User.findById(doc.schueler, function (err, user) {

      if (err) throw err;
      if (user) {

        console.log('user.money ' + user.money)
        console.log('hausarbeit.ergebnis_dollar ' + hausarbeit.ergebnis_dollar)
        let opUser = {}

        if (hausarbeit.ergebnis_dollar != 'keine Auswahl') {

          opUser.money = parseInt(user.money) + parseInt(hausarbeit.ergebnis_dollar);

        } else {

          opUser.money = parseInt(user.money);
        }


        console.log('opUser.money  ' + opUser.money)


        console.log('doc.schueler ' + doc.schueler)
        //console.log('hausarbeit.schueler ' + hausarbeit.schueler )
        //hausarbeit.schueler

        User.update({ _id: doc.schueler }, opUser, function (err) {
          if (err) {
            console.log(err);
            return;
          } else {






            Article.findById(doc.article, function (err, articleX) {

              if (err) {
                //console.log('wwwwww');
                console.log(err);
              }






              /* 
                            console.log('article.ha_gelb  ' + articleX.ha_gelb)
                            console.log('parseInt(article.ha_gelb) ' + parseInt(articleX.ha_gelb))
              
                            var inte_gelb = parseInt(articleX.ha_gelb);
                            inte_gelb -= 1;
              
                            tuString_gelb = inte_gelb.toString();
                            console.log('tuString_gelb ergebnis ' + tuString_gelb)
              
              
              
              
                            var inte_gruen = parseInt(articleX.ha_gruen);
                            inte_gruen += 1;
              
                            tuString_gruen = inte_gruen.toString();
                            console.log('tuString_gruen ergebnis ' + tuString_gruen)
              
              
              
              
              
                            var art = {}
                            art.ha_gelb = tuString_gelb
                            art.ha_gruen = tuString_gruen
              
              
                            Article.findOneAndUpdate({ _id: articleX._id }, art, { upsert: true }, function (err, docX) {
                              if (err) return res.send(500, { error: err });
              
                              console.log('docX.ha_gelb NEU  ' + docX.ha_gelb)
                              console.log('docX.ha_gruen NEU  ' + docX.ha_gruen)
              
              
              
                            }); */





            });





















            req.flash('success', 'Sauber! Schnell alles wegkorrigiert. Da wird sich ' + user.name + ' aber freuen.');
            res.redirect('/articles/article_schuelers/' + doc.article);





          }
        })



      } else {



        req.flash('danger', 'fehler');
        res.redirect('/');


      }





    })






  });


});








// Update submit POST route HAUSARBEIT
router.post('/rueckgabe_hausarbeit/:id', function (req, res) {

  //console.log(req.params.id);
  if (typeof req.user === "undefined") {

    req.flash('warning', 'Du bist ausgeloggt. Bitte logge dich ein, um deine Korrektur zu senden');
    res.redirect('/');
    return;
  }







  Hausarbeit.findById(req.params.id, function (err, ha) {



    Article.findById(ha.article, function (err, article) {



      //console.log('-------------------------------------')

      // console.log(my_article);

      var tag = article.termin.substring(0, 2)
      var monat = article.termin.substring(3, 5)
      var jahr = article.termin.substring(6, 10)

      console.log('tag:     ' + tag);
      console.log('monat:   ' + monat);
      console.log('jahr:    ' + jahr);

      var d = new Date(jahr, monat - 1, tag, 14); //// Bei 14 heiß es 2 Stunden vor Abgabe ist keine Korrektur mehr möglich

      console.log('Date:    ' + d);
      var jetzt = getMyNow();
      console.log('Date:    ' + jetzt);



      var today = jetzt
      var Christmas = d
      var diffMs = (Christmas - today); // milliseconds between now & Christmas
      var diffDays = Math.floor(diffMs / 86400000); // days
      var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
      var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes


      console.log('diffMs:    ' + diffMs);

      if (diffMs >= 0) {




        var query = { '_id': req.params.id };


        let hausarbeit = {};

        hausarbeit.nachbessern_text = req.body.nachbessern_text;
        hausarbeit.nachbessern_option = req.body.nachbessern_option;

        hausarbeit.status = '3';


        Hausarbeit.findOneAndUpdate(query, hausarbeit, { upsert: true }, function (err, doc) {
          if (err) return res.send(500, { error: err });






          User.findById(doc.schueler, function (err, user) {

            if (err) throw err;
            if (user) {







              req.flash('success', 'Du hast die Hausarbeit von ' + user.name + ' zum Nachbessern zurückgesendet. Na, ob das noch mal was wird?');
              res.redirect('/articles/article_schuelers/' + doc.article);






            } else {



              req.flash('danger', 'fehler. Bitte Mithat Akgün kontaktieren');
              res.redirect('/');


            }




          })











        });






      } else {
        ///zu spät


        req.flash('danger', 'Dein Nachbesserungswunsch wurde nicht versendet. Der/die Schüler/in sollte mindestens 2 Stunden Zeit haben, um die Arbeit nachzubessern. Alles andere wäre ja auch unfair.');
        res.redirect('/articles/article_schuelers/' + article._id);
        return;


      }


    })


  })






});







function neuVerknüpfungStamm(req, res, main) {

  //alte article-stamm verknüpfung wird gelöscht
  Article.findByIdAndUpdate(req.params.id,
    { $unset: { stamm: 1 } },
    function (err, uptdatedArticle) {
      if (err) throw err;

      Stamm.findOne({ _id: main.stamm._id }).
        populate('articles').
        exec(function (err, oldStamm) {
          if (err) throw err;
          if (oldStamm) {
            console.log('alter Stamm   ' + oldStamm.name);
            oldStamm.articles.pull(main);
            oldStamm.save(function (err, scho) {
              if (err) throw err;


              //neue article-stamm verknüpfung wird erstellt
              Stamm.findOne({ _id: req.body.suv }, function (err, newStamm) {
                if (err) throw err;
                if (newStamm) {
                  console.log('neuer Stamm   ' + newStamm.name);
                  main.stamm = newStamm;
                  main.save(function (err, maino) {
                    if (err) throw err;
                    newStamm.articles.push(maino);
                    newStamm.save(function (err, scho) {
                      if (err) throw err;

                    });
                  })

                } else {
                  //ODER: neue article-stammverbund verknüpfung wird erstellt
                  Stammverbund.findOne({ _id: req.body.suv }, function (err, newStammverbund) {
                    if (err) throw err;
                    if (newStammverbund) {
                      console.log('neuer Stammverbund   ' + newStammverbund.name);
                      main.stammverbund = newStammverbund;
                      main.save(function (err, maino) {
                        if (err) throw err;
                        newStammverbund.articles.push(maino);
                        newStammverbund.save(function (err, scho) {
                          if (err) throw err;
                        });
                      })
                    } else {
                      //fehler: es gibt weder einen neuen stamm noch einen neuen stammverbund
                    }
                  })
                }
              })
            })
          }
        })
    })
}








function neuVerknüpfungStammverbund(req, res, main) {

  //alte article-stamm verknüpfung wird gelöscht
  Article.findByIdAndUpdate(req.params.id,
    { $unset: { stamm: 1 } },
    function (err, uptdatedArticle) {
      if (err) throw err;

      Stammverbund.findOne({ _id: main.stammverbund._id }).
        populate('articles').
        exec(function (err, oldStammverbund) {
          if (err) throw err;
          if (oldStammverbund) {
            console.log('alter Stammverbund   ' + oldStammverbund.name);
            oldStammverbund.articles.pull(main);
            oldStammverbund.save(function (err, scho) {
              if (err) throw err;


              //neue article-stamm verknüpfung wird erstellt
              Stammverbund.findOne({ _id: req.body.suv }, function (err, newStammverbund) {
                if (err) throw err;
                if (newStammverbund) {
                  console.log('neuer Stammverbund   ' + newStammverbund.name);
                  main.stammverbund = newStammverbund;
                  main.save(function (err, maino) {
                    if (err) throw err;
                    newStammverbund.articles.push(maino);
                    newStammverbund.save(function (err, scho) {
                      if (err) throw err;





                      if (main.disziplin) {
                        if (req.body.disziplin.toString() === main.disziplin._id.toString()) {
                          console.log('disziplin ist gleich geblieben   ');
                        } else {
                          neuVerknüpfungDisziplin(req, res, main)
                        }
                      } else {
                        console.log('ups ist neu   ');
                      }




                    });
                  })

                } else {
                  //ODER: neue article-stammverbund verknüpfung wird erstellt
                  Stamm.findOne({ _id: req.body.suv }, function (err, newStamm) {
                    if (err) throw err;
                    if (newStamm) {
                      console.log('neuer Stamm   ' + newStamm.name);
                      main.stamm = newStamm;
                      main.save(function (err, maino) {
                        if (err) throw err;
                        newStamm.articles.push(maino);
                        newStamm.save(function (err, scho) {
                          if (err) throw err;



                          if (main.disziplin) {
                            if (req.body.disziplin.toString() === main.disziplin._id.toString()) {
                              console.log('disziplin ist gleich geblieben   ');
                            } else {
                              neuVerknüpfungDisziplin(req, res, main)
                            }
                          } else {
                            console.log('ups ist neu   ');
                          }





                        });
                      })
                    } else {
                      //fehler: es gibt weder einen neuen stamm noch einen neuen stammverbund
                    }
                  })
                }
              })
            })
          }
        })
    })
}








function neuVerknüpfungDisziplin(req, res, main) {

  //alte article-disziplin verknüpfung wird gelöscht
  Article.findByIdAndUpdate(req.params.id,
    { $unset: { disziplin: 1 } },
    function (err, uptdatedArticle) {
      if (err) throw err;

      Disziplin.findOne({ _id: main.disziplin._id }).
        populate('articles').
        exec(function (err, oldDisziplin) {
          if (err) throw err;
          if (oldDisziplin) {
            console.log('alter Disziplin   ' + oldDisziplin.name);
            oldDisziplin.articles.pull(main);
            oldDisziplin.save(function (err, scho) {
              if (err) throw err;


              //neue article-disziplin verknüpfung wird erstellt
              Disziplin.findOne({ _id: req.body.disziplin }, function (err, newDisziplin) {
                if (err) throw err;
                if (newDisziplin) {
                  console.log('neuer Disziplin   ' + newDisziplin.name);
                  main.disziplin = newDisziplin;
                  main.save(function (err, maino) {
                    if (err) throw err;
                    newDisziplin.articles.push(maino);
                    newDisziplin.save(function (err, scho) {
                      if (err) throw err;

                    });
                  })

                } else {
                  //:fehler

                }
              })
            })
          }
        })
    })
}




function clearArticle(main, req, res) {

  clearArticle_Disziplin(main, req, res)


}






function clearArticle_Disziplin(main, req, res) {

  if (main.disziplin) {

    Article.findByIdAndUpdate(main._id,
      { $unset: { disziplin: 1 } },
      function (err, uptdatedArticle) {
        if (err) throw err;

        Disziplin.findOne({ _id: main.disziplin._id }).
          populate('articles').
          exec(function (err, oldDisziplin) {
            if (err) throw err;
            if (oldDisziplin) {
              console.log('alter Stamm   ' + oldDisziplin.name);
              oldDisziplin.articles.pull(main);
              oldDisziplin.save(function (err, scho) {


                clearArticle_Stamm(main, req, res)


              })
            }
          })
      })

  } else {

    clearArticle_Stamm(main, req, res)


  }

}












function clearArticle_Stamm(main, req, res) {
  if (main.stamm) {
    Article.findByIdAndUpdate(main._id,
      { $unset: { stamm: 1 } },
      function (err, uptdatedArticle) {
        if (err) throw err;

        Stamm.findOne({ _id: main.stamm._id }).
          populate('articles').
          exec(function (err, oldStamm) {
            if (err) throw err;
            if (oldStamm) {
              console.log('alter Stamm   ' + oldStamm.name);
              oldStamm.articles.pull(main);
              oldStamm.save(function (err, scho) {


                clearArticle_Stammverbund(main, req, res)


              })
            }
          })
      })


  } else {

    clearArticle_Stammverbund(main, req, res)

  }

}




function clearArticle_Stammverbund(main, req, res) {

  if (main.stammverbund) {
    Article.findByIdAndUpdate(main._id,
      { $unset: { stammverbund: 1 } },
      function (err, uptdatedArticle) {
        if (err) throw err;

        Stammverbund.findOne({ _id: main.stammverbund._id }).
          populate('articles').
          exec(function (err, oldStammverbund) {
            if (err) throw err;
            if (oldStammverbund) {
              console.log('alter Stamm   ' + oldStammverbund.name);
              oldStammverbund.articles.pull(main);
              oldStammverbund.save(function (err, scho) {

                clearArticle_Schuelers(main, req, res)

              })
            }
          })
      })

  } else {

    clearArticle_Schuelers(main, req, res)
  }

}


function clearArticle_Schuelers(main, req, res) {

  if (main.schuelers.length !== 0) {
    main.schuelers.forEach(function (schueler) {
      //console.log('record :   ' + schueler.name);
      Article.findByIdAndUpdate(main._id,
        { $pull: { schuelers: schueler } },
        { upsert: true, save: true },
        function (err, uptdatedArticle) {
          if (err) {
            console.log(err);
          } else {
            User.findByIdAndUpdate(schueler._id,
              { $pull: { auftrags: main._id } },
              { save: true, upsert: true },
              function (err, uptdatedSchueler) {
                if (err) { console.log(err); }



              });
          }
        });
    });// alte Verknüpfungen werden gelöst
    setTimeout(function () {// das hier verzögert die Weiterleitung, da vorher die $push Verknüpfung der schuelers Zeit zu brauchen scheint
      buildArticle(main, req, res)
    }, 300);
  } else {


    buildArticle(main, req, res)


  }

}





function buildArticle(main, req, res) {


  Article.
    findOne({ _id: main._id }).
    populate('schuelers').
    populate('stamm').
    populate('stammverbund').
    populate('disziplin').
    populate('uploads').
    exec(function (err2, main) {

      constructArticle(main, req, res);


    });







}














// Update submit POST route
router.post("/edit_complete/:id", upload.array("files" /* name attribute of <file> element in your form */),
  (req, res) => {



    if (!req.user) {  //wer nicht angemeldet ist, kann nicht speichern
      req.flash('warning', 'Du bist nicht angemeldet');
      res.redirect('login');
      return
    }

    if (!isPossibleFrist(req.body.termin)) {
      req.flash('danger', 'Die Abgabefrist deines Auftrags liegt in der Vergangenheit.');
      res.redirect('/');
      return
    }

    Article.
      findOne({ _id: req.params.id }).
      populate('schuelers').
      populate('stamm').
      populate('stammverbund').
      populate('disziplin').
      populate('uploads').
      exec(function (err2, main) {

       // console.log('______VORHER_______  ');
        //console.log(main);
        //console.log('   ');
        //console.log('   ');
        clearArticle(main, req, res)



        return;

        let article = {};
        article.title = req.body.title;
        article.author = main.author;

        article.termin = req.body.termin;
        article.body = req.body.body;

        const start = getMyNow();
        var nau = ("00" + start.getDate()).slice(-2) + '.' + ("00" + (start.getMonth() + 1)).slice(-2) + '. ' + start.getHours() + '.' + ("00" + start.getMinutes()).slice(-2) + ' Uhr';
        article.created = nau;


        if (main.stamm) {
          if (req.body.suv.toString() === main.stamm._id.toString()) {
            //console.log('klasse ist gleich geblieben   ');
          } else {
            neuVerknüpfungStamm(req, res, main)
          }


        } else if (main.stammverbund) {
          if (req.body.suv.toString() === main.stammverbund._id.toString()) {
            //console.log('verbund ist gleich geblieben   ');
          } else {
            neuVerknüpfungStammverbund(req, res, main)
          }
        }







        if (main.schuelers.length !== 0) {
          console.log('main.schuelers   ');





          var jo = []
          var ii = 0;
          req.body.schuelers.forEach(function (schueler) {
            jo.push(schueler);
            ii++;
          });




          main.schuelers.forEach(function (schueler) {
            //console.log('record :   ' + schueler.name);


            Article.findByIdAndUpdate(art._id,
              { $pull: { schuelers: schueler } },
              { upsert: true, save: true },
              function (err, uptdatedArticle) {
                if (err) {
                  console.log(err);
                } else {

                  User.findByIdAndUpdate(schueler._id,
                    { $pull: { auftrags: art._id } },
                    { save: true, upsert: true },
                    function (err, uptdatedSchueler) {
                      if (err) { console.log(err); }
                    });
                }
              });


          });// alte Verknüpfungen werden gelöst


          //neue Verknüpfungen
          User.find().where('_id').in(jo).exec((err, schuelers) => {

            schuelers.forEach(function (schueler) {
              //console.log('record :   ' + schueler.name);
              Article.findByIdAndUpdate(art._id,
                { $push: { schuelers: schueler } },
                { safe: true, upsert: true },
                function (err, uptdatedArticle) {
                  if (err) {
                    console.log(err);
                  } else {
                    User.findByIdAndUpdate(schueler._id,
                      { $push: { auftrags: uptdatedArticle } },
                      { safe: true, upsert: true },
                      function (err, uptdatedSchueler) {
                        if (err) { console.log(err) }







                      });
                  }
                });


            });//ende loop




          });









        }









        Article.update({ _id: req.params.id }, article, function (err, artiii) {
          if (err) {
            console.log(err);
            return;
          } else {


            if (req.files.length === 0) {
              setTimeout(function () {// das hier verzögert die Weiterleitung auf index, da vorher die $push Verknüpfung der schuelers Zeit zu brauchen scheint
                req.flash('success', 'Auftrag wurde erteilt. Er wird jetzt den SuS angezeigt.');
                res.redirect('/');
              }, 300);




            } else {

              handleDeleteUpload(main, req, res)

              handleUploadAndExit(main, req, res)


            }






          }

        })

      })

  });










// Delete Article
router.delete('/:id', function (req, res) {


  //console.log('drinn')
  if (!req.user._id) {

    res.status(500).send();

  }






  Article.
    findOne({ _id: req.params.id }).
    populate('lehrer').
    populate('schuelers').
    populate('uploads').
    exec(function (err, article) {

      if (article.author != req.user._id) {

        res.status(500).send();

      } else {




        if (article.stamm) {

          console.log('hat nen stamm');


          Stamm.findByIdAndUpdate(article.stamm._id,
            { $pull: { articles: article._id } },
            { save: true, upsert: true },
            function (err, uptdatedStamm) {
              if (err) { console.log(err); }
            });




        } else if (article.stammverbund) {

          console.log('hat nen stammverbund');

          Stammverbund.findByIdAndUpdate(article.stammverbund._id,
            { $pull: { articles: article._id } },
            { save: true, upsert: true },
            function (err, uptdatedStammverbund) {
              if (err) { console.log(err); }
            });


        } else {
          console.log('da stimmt was nicht');

        }






        article.uploads.forEach(function (load) {
          const targetPath = path.join(__dirname, "../uploads/" + load.body);


          fs.unlink(targetPath, err => {
            if (err) return handleError(err, res);



          });
        })



        Hausarbeit.
          find({ article: req.params.id }).
          exec(function (err, hausarbeits) {
            if (err) return console.log('8_iiiiiiiiiiii ' + err);



            hausarbeits.forEach(function (hausarbeit) {

              Hausarbeit.deleteOne({ _id: hausarbeit._id }, function (err) {
                if (err) {
                  console.log(err);
                }

              });

            });


          });


        let query = { _id: req.params.id }

        Article.deleteOne(query, function (err) {
          if (err) {
            console.log(err);
          }










          res.send('success');
        });





      }
    });

});








// Get Single Article
router.get('/:id', function (req, res) {

  Article.
    findOne({ _id: req.params.id }).
    populate('lehrer').
    populate('schuelers').
    populate('uploads').
    exec(function (err, article) {
      if (err) {

        console.log('1_iiiiiiiiiiii ' + err);

        req.flash('danger', 'Dieser Auftrag existiert nicht. ');
        res.redirect('/');


        return

      }

      if (article) {
        //console.log('The author is %s', article);

        var x = article.body
        //console.log('x nnnnn ' + article.lehrer.name);





        //console.log('x  ' + article.body);
        res.render('change/article', {
          article: article,
          x: x
        });
      } else {

        req.flash('danger', 'Der Auftrag wurde gelöscht. Du musst diese Hausarbeit nicht mehr machen. ');
        res.redirect('/');

      }

    });





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
