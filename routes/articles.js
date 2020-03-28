const express = require('express');
const router = express.Router();
const path = require('path');

const fs = require('fs');






//User model
let User = require('../models/user');
let Article = require('../models/article');
let Hausarbeit = require('../models/hausarbeit');



const multer = require("multer");

const handleError = (err, res) => {
  console.log(err);
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
  dest: "../uploads"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});











// Add Article
router.get('/add', ensureAuthenticated, function (req, res) {


  var today = new Date();
  var tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 3);


  const start = new Date();

  var nau = ("00" + tomorrow.getDate()).slice(-2) + '.' + ("00" + (tomorrow.getMonth() + 1)).slice(-2) + '.'



  res.render('add_article', {
    title: 'Add Articles',
    abgabe: nau
  })

});






// Add Article
router.get('/add_alt', ensureAuthenticated, function (req, res) {


  var today = new Date();
  var tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 3);


  const start = new Date();
  //var nau = start.getDate() + '.' + start.getMonth() + '.' + start.getFullYear() + ', ' + start.getHours() + '.' + start.getMinutes() + ' Uhr';
  var nau = tomorrow.getDate() + '.' + tomorrow.getMonth() + '.' + tomorrow.getFullYear()



  res.render('add_article_alt', {
    title: 'Add Articles',
    abgabe: nau
  })

});





















///------1 ersg die klasse

router.get('/add_article_klasse', ensureAuthenticated, function (req, res) {






  res.render('add_article_klasse', {

  })





});













// Edit article form
router.get('/edit/:id', ensureAuthenticated, function (req, res) {







  console.log('drin!')





  Article.
    findOne({ _id: req.params.id }).
    populate('schuelers').
    exec(function (err2, arti) {
      if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);

      if (arti.klasse && !arti.shadow_klasse) {


        console.log('ALT');
        res.render('edit_article_alt', {
          article: arti,
          schuelers: []
        });




      } else if (arti.shadow_klasse && !arti.klasse) {

        console.log('NEU');

        arti.schuelers.forEach(function (arti_schueler) {

          // console.log('ein arti-schüler: ' + arti_schueler.name + ' / '+arti_schueler._id);


        });
        console.log('- - - - - - - - - - - - - - - ');
        User.
          find({

            $or: [
              { klasse: arti.shadow_klasse },
              { klasse2: arti.shadow_klasse }
            ]

          }).
          exec(function (err2, all_schuelers) {
            if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);


            if (arti.author != req.user._id) {
              req.flash('danger', 'nicht autorisiert');
              res.redirect('/');
              return;

            } else {

              all_schuelers.forEach(function (all_schueler) {
                //all_schueler.article_token = false
                //console.log('ein all-schüler: ' + all_schueler.name + ' / '+all_schueler._id);
                arti.schuelers.forEach(function (arti_schueler) {
                  // console.log('ein all-schüler: ' + all_schueler.name + ' / ' + all_schueler._id);
                  if (all_schueler._id.toString() === arti_schueler._id.toString()) {
                    console.log('ein arti-schüler: ' + arti_schueler.name + ' / ' + arti_schueler._id);
                    all_schueler.article_token = true
                  }
                });
              });



              res.render('edit_article_neu', {
                article: arti,
                schuelers: all_schuelers
              });


            }

          });




      } else {
        console.log('FEHLER');
        console.log('arti.klasse  ' + arti.klasse);
        console.log('arti.shadow_klasse  ') + arti.shadow_klasse;

      }

    });

});












// Get Single hausarbeit
router.get('/hausarbeit/:id', function (req, res) {

  Hausarbeit.
    findOne({ _id: req.params.id }).
    populate('article').
    populate('schueler').
    exec(function (err, hausarbeit) {
      if (err) return console.log('2_iiiiiiiiiiii ' + err);

      if (hausarbeit) {
        //console.log('The author is %s', hausarbeit);




        res.render('korrektur', {
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
      if (err) return console.log('3_iiiiiiiiiiii ' + err);

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

            res.render('schueler', {
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













router.get('/article_schuelers/:id', function (req, res) {






  Article.
    findOne({ _id: req.params.id }).
    exec(function (err, article) {
      if (err) return console.log('4_iiiiiiiiiiii ' + err);

      if (article) {

        Hausarbeit.
          find({ article: req.params.id }).
          populate('schueler').
          exec(function (err, hausarbeits) {
            if (err) return console.log('5_iiiiiiiiiiii ' + err);

            if (hausarbeits) {
              //console.log('The hausarbeits is %s', hausarbeits);


              let schuelers = [];

              hausarbeits.forEach(function (hausarbeit) {
                //console.log('The hausarbeit is %s', hausarbeit);

                schuelers.push(hausarbeit.schueler);
              });

              let length = hausarbeits.length;


              res.render('article_schueler', {
                article: article,
                hausarbeits: hausarbeits.reverse(),
                length: length
              });
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
    populate('article').
    exec(function (err, ha) {
      if (err) return console.log('6_iiiiiiiiiiii ' + err);

      if (ha) {
        //console.log('The ha is %s', ha);


        //console.log('x nnnnn ' + ha.article.klasse);


        res.render('edit_hausarbeit', {
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
    populate('article').
    exec(function (err, ha) {
      if (err) return console.log('7_iiiiiiiiiiii ' + err);

      if (ha) {
        // console.log('The ha is %s', ha);


        //console.log('x nnnnn ' + ha.article.klasse);


        res.render('finished_hausarbeit', {
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
    populate('article').
    populate('schueler').
    exec(function (err, ha) {
      if (err) return console.log('7_iiiiiiiiiiii ' + err);

      if (ha) {
        // console.log('The ha is %s', ha);


        //console.log('x nnnnn ' + ha.article.klasse);


        res.render('finished_hausarbeit', {
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







// Bingo Article
router.post('/add_bingo_edit', ensureAuthenticated, function (req, res) {










  console.log('kkkkk')
  var today = new Date();
  var tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 3);


  const start = new Date();

  var nau = ("00" + tomorrow.getDate()).slice(-2) + '.' + ("00" + (tomorrow.getMonth() + 1)).slice(-2) + '.' + ','


  console.log('req.body.klasse: ' + req.body.klasse);

  User.
    find({

      $or: [
        { klasse: req.body.klasse },
        { klasse2: req.body.klasse }
      ]

    }).
    sort({name:1}).
    exec(function (err2, all_schuelers) {
      if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);













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

                console.log('schüler: ' + all_schueler.name);

                arti.schuelers.forEach(function (arti_schueler) {


                  if (all_schueler._id === arti_schueler._id) {

                    all_schueler.article_token = true
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
  var today = new Date();
  var tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 3);


  const start = new Date();

  var nau = ("00" + tomorrow.getDate()).slice(-2) + '.' + ("00" + (tomorrow.getMonth() + 1)).slice(-2) + '.'


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
      sort({name:1}).
      exec(function (err2, schuelers) {
        if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);


        schuelers.forEach(function (schueler) {

          console.log('schüler: ' + schueler.name);


        });


        res.render('add_article_neu', {
          schuelers: schuelers,
          abgabe: nau,
          klasse: req.body.klasse
        })





      });


  } else {

    res.render('add_article_alt', {

      abgabe: nau,
      klasse: req.body.klasse
    })



  }



});







// 
router.post("/add_neu", upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {





    if (!req.body.body || req.body.body.length <= 8) {
      //console.log('............... ' + req.body.body.length);

      req.flash('danger', 'Dein Auftrag ist leer oder viel zu kurz.');
      res.redirect('/articles/add');

    } else {














      var s00 = req.body.schueler_0
      var s01 = req.body.schueler_1
      var s02 = req.body.schueler_2
      var s03 = req.body.schueler_3
      var s04 = req.body.schueler_4
      var s05 = req.body.schueler_5
      var s06 = req.body.schueler_6
      var s07 = req.body.schueler_7
      var s08 = req.body.schueler_8
      var s09 = req.body.schueler_9
      var s10 = req.body.schueler_10
      var s11 = req.body.schueler_11
      var s12 = req.body.schueler_12
      var s13 = req.body.schueler_13
      var s14 = req.body.schueler_14
      var s15 = req.body.schueler_15
      var s16 = req.body.schueler_16
      var s17 = req.body.schueler_17
      var s18 = req.body.schueler_18
      var s19 = req.body.schueler_19
      var s20 = req.body.schueler_20
      var s21 = req.body.schueler_21
      var s22 = req.body.schueler_22
      var s23 = req.body.schueler_23
      var s24 = req.body.schueler_24
      var s25 = req.body.schueler_25
      var s26 = req.body.schueler_26
      var s27 = req.body.schueler_27
      var s28 = req.body.schueler_28
      var s29 = req.body.schueler_29
      var s30 = req.body.schueler_30


      var oo = []

      oo.push(s00);
      oo.push(s01);
      oo.push(s02);
      oo.push(s03);
      oo.push(s04);
      oo.push(s05);
      oo.push(s06);
      oo.push(s07);
      oo.push(s08);
      oo.push(s09);
      oo.push(s10);
      oo.push(s11);
      oo.push(s12);
      oo.push(s13);
      oo.push(s14);
      oo.push(s15);
      oo.push(s16);
      oo.push(s17);
      oo.push(s18);
      oo.push(s19);
      oo.push(s20);
      oo.push(s21);
      oo.push(s22);
      oo.push(s23);
      oo.push(s24);
      oo.push(s25);
      oo.push(s26);
      oo.push(s27);
      oo.push(s28);
      oo.push(s29);
      oo.push(s30);









      var id00 = req.body.id_0
      var id01 = req.body.id_1
      var id02 = req.body.id_2
      var id03 = req.body.id_3
      var id04 = req.body.id_4
      var id05 = req.body.id_5
      var id06 = req.body.id_6
      var id07 = req.body.id_7
      var id08 = req.body.id_8
      var id09 = req.body.id_9
      var id10 = req.body.id_10
      var id11 = req.body.id_11
      var id12 = req.body.id_12
      var id13 = req.body.id_13
      var id14 = req.body.id_14
      var id15 = req.body.id_15
      var id16 = req.body.id_16
      var id17 = req.body.id_17
      var id18 = req.body.id_18
      var id19 = req.body.id_19
      var id20 = req.body.id_20
      var id21 = req.body.id_21
      var id22 = req.body.id_22
      var id23 = req.body.id_23
      var id24 = req.body.id_24
      var id25 = req.body.id_25
      var id26 = req.body.id_26
      var id27 = req.body.id_27
      var id28 = req.body.id_28
      var id29 = req.body.id_29
      var id30 = req.body.id_30




      var ooId = []

      ooId.push(id00);
      ooId.push(id01);
      ooId.push(id02);
      ooId.push(id03);
      ooId.push(id04);
      ooId.push(id05);
      ooId.push(id06);
      ooId.push(id07);
      ooId.push(id08);
      ooId.push(id09);
      ooId.push(id10);
      ooId.push(id11);
      ooId.push(id12);
      ooId.push(id13);
      ooId.push(id14);
      ooId.push(id15);
      ooId.push(id16);
      ooId.push(id17);
      ooId.push(id18);
      ooId.push(id19);
      ooId.push(id20);
      ooId.push(id21);
      ooId.push(id22);
      ooId.push(id23);
      ooId.push(id24);
      ooId.push(id25);
      ooId.push(id26);
      ooId.push(id27);
      ooId.push(id28);
      ooId.push(id29);
      ooId.push(id30);





      var jo = []











      var sss = 0;
      oo.forEach(function (o) {

        if (typeof o === undefined) {


        } else {

          if (o === undefined) {



          } else {




            jo.push(ooId[sss])

          }


        }
        sss++;

      });





      jo.forEach(function (o) {

        // console.log('jjj:   ' + o);

      });








      //console.log('da is was');

      req.checkBody('title', 'Deine Hausaufgabe braucht einen Titel').notEmpty();
      req.checkBody('fach', 'Gebe eine Schulfach ein').not().equals('Wähle')
      req.checkBody('termin', 'Gebe einen Abgabetermin ein').notEmpty();
      req.checkBody('body', 'Du hast keinen AUftrag erteilt').notEmpty();

      // get Errrors
      let errors = req.validationErrors();

      if (errors) {
        res.render('add_article', {
          title: 'Add Article',
          errors: errors
        });
      } else {


        let article = new Article();
        article.title = req.body.title;
        article.author = req.user._id;
        //////////////////////////////////////////////////////////!!!!   ANDERS!
        article.shadow_klasse = req.body.klaas;
        /////////////////////////////////////////////////////////!!!!!
        article.fach = req.body.fach;
        article.termin = req.body.termin;
        article.body = req.body.body;
        article.lehrer = req.user._id;
        article.ha_gelb = '0';
        article.ha_gruen = '0'

        console.log('klaas:  ' + req.body.klaas)


        const start = new Date();

        var nau = ("00" + start.getDate()).slice(-2) + '.' + ("00" + (start.getMonth() + 1)).slice(-2) + '.' + ', ' + ("00" + start.getHours()).slice(-2) + '.' + ("00" + start.getMinutes()).slice(-2) + ' Uhr';

        article.created = nau;

        article.save(function (err, art) {

          if (err) {
            console.log(err);
            return;
          } else {
            // console.log('ADDED ' + art._id);
            //console.log('ADDED ' + article.lehrer);



            User.find().where('_id').in(jo).exec((err, schuelers) => {





              schuelers.forEach(function (schueler) {
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
                            /////
                            /*   console.log('mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm ')
                              console.log('bimmelbingo       '+uptdatedSchueler)
                              console.log('mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm ') */
                          }
                        });
                    }
                  });


              });//ende loop







              /// nach der loop


              Article.
                findOne({ _id: art._id }).
                populate('schuelers').
                exec(function (err2, arti) {
                  if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);


                  console.log('-------------------------------------');
                  console.log('-------------------------------------');
                  console.log('-------------------------------------');
                  console.log('-------------------------------------');
                  console.log('articleK: ' + arti);
                  console.log('-------------------------------------');
                  console.log('-------------------------------------');
                  console.log('-------------------------------------');
                  console.log('-------------------------------------');



                });


              schuelers.forEach(function (schueler) {


                User.
                  findOne({ _id: schueler._id }).
                  populate('auftrags').
                  exec(function (err2, schue) {
                    if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);



                    console.log('schuelersY: ' + schue);
                    console.log('-------------------------------------');





                  });




              });









            });


















            req.flash('success', 'Auftrag erteilt. Er wird jetzt den SuS angezeigt. Drücke auf den blauen "SuS"-Button deines Auftrags, um zu sehen welche SuS den Auftrag bearbeitet haben. ');
            res.redirect('/');
          }
        })
      }
    }
  }
);






// post add (article)
router.post("/add_alt", upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {


    if (!req.body.body || req.body.body.length <= 8) {
      //console.log('............... ' + req.body.body.length);

      req.flash('danger', 'Dein Auftrag ist leer oder viel zu kurz.');
      res.redirect('/articles/add');

    } else {




      //console.log('da is was');

      req.checkBody('title', 'Deine Hausaufgabe braucht einen Titel').notEmpty();
      req.checkBody('klasse', 'Gebe eine Klasse ein').not().equals('Wähle')
      req.checkBody('fach', 'Gebe eine Schulfach ein').not().equals('Wähle')
      req.checkBody('termin', 'Gebe einen Abgabetermin ein').notEmpty();
      req.checkBody('body', 'Du hast keinen AUftrag erteilt').notEmpty();

      // get Errrors
      let errors = req.validationErrors();

      if (errors) {
        res.render('add_article_alt', {
          title: 'Add Article',
          errors: errors
        });
      } else {


        let article = new Article();
        article.title = req.body.title;
        article.author = req.user._id;
        article.klasse = req.body.klasse;
        article.fach = req.body.fach;
        article.termin = req.body.termin;
        article.body = req.body.body;
        article.lehrer = req.user._id;
        article.ha_gelb = '0';
        article.ha_gruen = '0'


        const start = new Date();
        var nau = start.getDate() + '.' + start.getMonth() + '.' + start.getFullYear() + ', ' + start.getHours() + '.' + start.getMinutes() + ' Uhr';
        var nau = start.getDate() + '.' + start.getMonth() + '. (' + start.getHours() + ':' + start.getMinutes() + ')'

        article.created = nau;

        article.save(function (err) {

          if (err) {
            console.log(err);
            return;
          } else {
            //console.log('ADDED ' + article.author);
            //console.log('ADDED ' + article.lehrer);
            req.flash('success', 'Auftrag erteilt. Er wird jetzt den SuS angezeigt. Drücke auf den blauen "SuS"-Button deines Auftrags, um zu sehen welche SuS den Auftrag bearbeitet haben. ');
            res.redirect('/');
          }
        })
      }
    }
  }
);










// post add_hausarbeit
router.post("/add_hausarbeit", upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {


    if (typeof req.user === "undefined") {

      req.flash('warning', 'Du bist ausgeloggt. Um eine Hausarbeit zu abzuschicken, musst du eingeloggt sein');
      res.redirect('/');
      return;
    }




    if (!req.body.body || req.body.body.length <= 8) {
      //console.log('............... ' + req.body.body.length);

      req.flash('danger', 'Deine Hausarbeit ist leer oder viel zu kurz. So geht das nicht.');
      res.redirect('/');

    } else {
      //...

      //console.log('fast nix: ');





      Article.findById(req.body.article_id, function (err, article) {

        if (err) {
          //console.log('wwwERROR_______________________');
          console.log(err);

        } else {



          let hausarbeit = new Hausarbeit();
          hausarbeit.article = req.body.article_id;
          hausarbeit.schueler = req.user._id;
          hausarbeit.status = '1';
          hausarbeit.body = req.body.body;
          hausarbeit.reflexion_hilfe = req.body.reflexion_hilfe;
          hausarbeit.reflexion_schwer = req.body.reflexion_schwer;
          hausarbeit.reflexion_zeit = req.body.reflexion_zeit;
          hausarbeit.reflexion_text = req.body.reflexion_text;

          const start = new Date();
          var nau = ("00" + start.getDate()).slice(-2) + '.' + ("00" + (start.getMonth() + 1)).slice(-2) + '.' + ', ' + ("00" + start.getHours()).slice(-2) + '.' + ("00" + start.getMinutes()).slice(-2) + ' Uhr';

          hausarbeit.created = nau;


          hausarbeit.save(function (err) {

            if (err) {
              console.log(err);
              return;
            } else {




              console.log('article.ha_gelb  ' + article.ha_gelb)
              console.log('parseInt(article.ha_gelb) ' + parseInt(article.ha_gelb))

              var inte = parseInt(article.ha_gelb);
              inte += 1;

              tuString = inte.toString();
              console.log('tuString ergebnis ' + tuString)



              var art = {}
              art.ha_gelb = tuString



              Article.findOneAndUpdate({ _id: article._id }, art, { upsert: true }, function (err, doc) {
                if (err) return res.send(500, { error: err });

                console.log('ha_gelb NEU  ' + doc.ha_gelb)




              });






              req.flash('success', 'Super! Du hast deine Hausarbeit abgegeben. Solange deine Arbeit nicht überprüft wurde, kannst du sie noch ändern. ');
              res.redirect('/');
            }
          })





        }

      })







    }

  }



);






// Update submit POST route HAUSARBEIT
router.post('/edit_hausarbeit/:id', function (req, res) {

  //console.log(req.params.id);

  if (typeof req.user === "undefined") {

    req.flash('warning', 'Du bist ausgeloggt. Bitte logge dich ein, um deine Hausarbeit zu bearbeiten');
    res.redirect('/');
    return;
  }




  var query = { '_id': req.params.id };


  let hausarbeit = {};

  hausarbeit.body = req.body.body;
  hausarbeit.reflexion_hilfe = req.body.reflexion_hilfe;
  hausarbeit.reflexion_schwer = req.body.reflexion_schwer;
  hausarbeit.reflexion_zeit = req.body.reflexion_zeit;
  hausarbeit.reflexion_text = req.body.reflexion_text;



  Hausarbeit.findOneAndUpdate(query, hausarbeit, { upsert: true }, function (err, doc) {
    if (err) return res.send(500, { error: err });



    req.flash('success', 'Hausarbeit geändert');
    res.redirect('/');



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



              });





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









// Update submit POST route
router.post('/edit/:id', function (req, res) {








  if (!req.body.body || req.body.body.length <= 8) {
    //console.log('............... ' + req.body.body.length);

    req.flash('danger', 'Dein Auftrag ist leer oder viel zu kurz.');
    res.redirect('/articles/add');

  } else {

    if (req.body.shadow_klasse && !req.body.klasse) {







      var s00 = req.body.schueler_0
      var s01 = req.body.schueler_1
      var s02 = req.body.schueler_2
      var s03 = req.body.schueler_3
      var s04 = req.body.schueler_4
      var s05 = req.body.schueler_5
      var s06 = req.body.schueler_6
      var s07 = req.body.schueler_7
      var s08 = req.body.schueler_8
      var s09 = req.body.schueler_9
      var s10 = req.body.schueler_10
      var s11 = req.body.schueler_11
      var s12 = req.body.schueler_12
      var s13 = req.body.schueler_13
      var s14 = req.body.schueler_14
      var s15 = req.body.schueler_15
      var s16 = req.body.schueler_16
      var s17 = req.body.schueler_17
      var s18 = req.body.schueler_18
      var s19 = req.body.schueler_19
      var s20 = req.body.schueler_20
      var s21 = req.body.schueler_21
      var s22 = req.body.schueler_22
      var s23 = req.body.schueler_23
      var s24 = req.body.schueler_24
      var s25 = req.body.schueler_25
      var s26 = req.body.schueler_26
      var s27 = req.body.schueler_27
      var s28 = req.body.schueler_28
      var s29 = req.body.schueler_29
      var s30 = req.body.schueler_30

      var oo = []
      oo.push(s00);
      oo.push(s01);
      oo.push(s02);
      oo.push(s03);
      oo.push(s04);
      oo.push(s05);
      oo.push(s06);
      oo.push(s07);
      oo.push(s08);
      oo.push(s09);
      oo.push(s10);
      oo.push(s11);
      oo.push(s12);
      oo.push(s13);
      oo.push(s14);
      oo.push(s15);
      oo.push(s16);
      oo.push(s17);
      oo.push(s18);
      oo.push(s19);
      oo.push(s20);
      oo.push(s21);
      oo.push(s22);
      oo.push(s23);
      oo.push(s24);
      oo.push(s25);
      oo.push(s26);
      oo.push(s27);
      oo.push(s28);
      oo.push(s29);
      oo.push(s30);
      var id00 = req.body.id_0
      var id01 = req.body.id_1
      var id02 = req.body.id_2
      var id03 = req.body.id_3
      var id04 = req.body.id_4
      var id05 = req.body.id_5
      var id06 = req.body.id_6
      var id07 = req.body.id_7
      var id08 = req.body.id_8
      var id09 = req.body.id_9
      var id10 = req.body.id_10
      var id11 = req.body.id_11
      var id12 = req.body.id_12
      var id13 = req.body.id_13
      var id14 = req.body.id_14
      var id15 = req.body.id_15
      var id16 = req.body.id_16
      var id17 = req.body.id_17
      var id18 = req.body.id_18
      var id19 = req.body.id_19
      var id20 = req.body.id_20
      var id21 = req.body.id_21
      var id22 = req.body.id_22
      var id23 = req.body.id_23
      var id24 = req.body.id_24
      var id25 = req.body.id_25
      var id26 = req.body.id_26
      var id27 = req.body.id_27
      var id28 = req.body.id_28
      var id29 = req.body.id_29
      var id30 = req.body.id_30

      var ooId = []
      ooId.push(id00);
      ooId.push(id01);
      ooId.push(id02);
      ooId.push(id03);
      ooId.push(id04);
      ooId.push(id05);
      ooId.push(id06);
      ooId.push(id07);
      ooId.push(id08);
      ooId.push(id09);
      ooId.push(id10);
      ooId.push(id11);
      ooId.push(id12);
      ooId.push(id13);
      ooId.push(id14);
      ooId.push(id15);
      ooId.push(id16);
      ooId.push(id17);
      ooId.push(id18);
      ooId.push(id19);
      ooId.push(id20);
      ooId.push(id21);
      ooId.push(id22);
      ooId.push(id23);
      ooId.push(id24);
      ooId.push(id25);
      ooId.push(id26);
      ooId.push(id27);
      ooId.push(id28);
      ooId.push(id29);
      ooId.push(id30);

      var jo = []



      var sss = 0;
      oo.forEach(function (o) {
        if (typeof o === undefined) {
        } else {
          if (o === undefined) {
          } else {
            jo.push(ooId[sss])
          }
        }
        sss++;
      }); // jo hält die ids der aktivierten Checkboxes der SuS







      Article.
        findOne({ _id: req.params.id }).
        populate('schuelers').
        exec(function (err2, art) {
          if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);


/*           console.log('-------------------------------------');
          console.log('-------------------------------------');
          console.log('-------------------------------------');
          console.log('-------------------------------------');
          console.log('ALT arti: ' + art);
          console.log('-------------------------------------');
          console.log('-------------------------------------');
          console.log('-------------------------------------');
          console.log('-------------------------------------'); */


          art.schuelers.forEach(function (schueler) {
            console.log('record :   ' + schueler.name);


            Article.findByIdAndUpdate(art._id,
              { $pull: { schuelers: schueler } },
              { upsert: true, save: true },
              function (err, uptdatedArticle) {
                if (err) {
                  console.log(err);
                } else {

/*                   console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
                  console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
                  console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
                  console.log('uptdatedArticle ' + uptdatedArticle);
                  console.log('-------------------------------------');
                  console.log('-------------------------------------');
                  console.log('-------------------------------------');
                  console.log('-------------------------------------'); */

                  User.findByIdAndUpdate(schueler._id,
                    { $pull: { auftrags: art._id } },
                    { save: true, upsert: true },
                    function (err, uptdatedSchueler) {
                      if (err) { console.log(err);} 
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
                        if (err) { console.log(err)} 
                      });
                  }
                });


            });//ende loop







            /// nach der loop

/* 
            Article.
              findOne({ _id: art._id }).
              populate('schuelers').
              exec(function (err2, arti) {
                if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);


                console.log('-------------------------------------');
                console.log('-------------------------------------');
                console.log('-------------------------------------');
                console.log('-------------------------------------');
                console.log('articleK: ' + arti);
                console.log('-------------------------------------');
                console.log('-------------------------------------');
                console.log('-------------------------------------');
                console.log('-------------------------------------');



              });


            schuelers.forEach(function (schueler) {


              User.
                findOne({ _id: schueler._id }).
                populate('auftrags').
                exec(function (err2, schue) {
                  if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);



                  console.log('schuelersY: ' + schue);
                  console.log('-------------------------------------');

                });

            });
 */


          });


















          let query = { _id: req.params.id }


          Article.findById(req.params.id, function (err, articleX) {

            if (err) {
              //console.log('wwwwww');
              console.log(err);
            }


            let article = {};
            article.title = req.body.title;
            article.author = articleX.author;



            article.shadow_klasse = req.body.shadow_klasse;
            article.fach = req.body.fach;
            article.termin = req.body.termin;
            article.body = req.body.body;



            const start = new Date();




            var nau = ("00" + start.getDate()).slice(-2) + '.' + ("00" + (start.getMonth() + 1)).slice(-2) + '.' + ', ' + ("00" + start.getHours()).slice(-2) + '.' + ("00" + start.getMinutes()).slice(-2) + ' Uhr';


            article.created = nau;



            Article.update(query, article, function (err) {
              if (err) {
                console.log(err);
                return;
              } else {
                req.flash('success', 'Auftrag geändert');
                res.redirect('/');
              }
            })

          })















        });





      }else if (!req.body.shadow_klasse && req.body.klasse){
      console.log('ALT');



      let query = { _id: req.params.id }


      Article.findById(req.params.id, function (err, articleX) {

        if (err) {
          //console.log('wwwwww');
          console.log(err);
        }


        let article = {};
        article.title = req.body.title;
        article.author = articleX.author;



        article.klasse = req.body.klasse;
        article.fach = req.body.fach;
        article.termin = req.body.termin;
        article.body = req.body.body;



        const start = new Date();




        var nau = ("00" + start.getDate()).slice(-2) + '.' + ("00" + (start.getMonth() + 1)).slice(-2) + '.' + ', ' + ("00" + start.getHours()).slice(-2) + '.' + ("00" + start.getMinutes()).slice(-2) + ' Uhr';


        article.created = nau;



        Article.update(query, article, function (err) {
          if (err) {
            console.log(err);
            return;
          } else {
            req.flash('success', 'Auftrag geändert');
            res.redirect('/');
          }
        })

      })







    } else {//(req.body.shadow_klasse && !req.body.klasse)
      console.log('FEHLER');
      console.log('arti.klasse  ' + arti.klasse);
      console.log('arti.shadow_klasse  ') + arti.shadow_klasse;

    }




  }
});







// Delete Article
router.delete('/:id', function (req, res) {


  //console.log('drinn')
  if (!req.user._id) {

    res.status(500).send();

  }



  Article.findById(req.params.id, function (err, article) {
    if (article.author != req.user._id) {

      res.status(500).send();

    } else {





      Hausarbeit.
        find({ article: req.params.id }).
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

      Article.remove(query, function (err) {
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
    exec(function (err, article) {
      if (err) return console.log('1_iiiiiiiiiiii ' + err);

      if (article) {
        //console.log('The author is %s', article);

        var x = article.body.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
        //console.log('x nnnnn ' + article.lehrer.name);


        res.render('article', {
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
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }

}



module.exports = router;
