const express = require('express');
const router = express.Router();
const path = require('path');

const fs = require('fs');






//User model
let User = require('../models/user');
let Article = require('../models/article');
let Hausarbeit = require('../models/hausarbeit');
let Load = require('../models/load');


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


  //const file = `${__dirname}/uploads/image.png`;
  res.download(targetPath);
});

const upload = multer({
  dest: "../uploads"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});












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






  res.render('add_article_broadcast', {

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
    populate('uploads').
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
          sort({ name: 1 }).
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
                    //console.log('ein arti-schüler: ' + arti_schueler.name + ' / ' + arti_schueler._id);
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
    populate('uploads').
    exec(function (err, hausarbeit) {
      if (err) {

        console.log('2_iiiiiiiiiiii ' + err);

        req.flash('danger', 'Diese Hausarbeit existiert nicht. ');
        res.redirect('/');


        return

      }

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








function changeTimezone(date, ianatz) {

  // suppose the date is 12:00 UTC
  var invdate = new Date(date.toLocaleString('en-US', {
    timeZone: ianatz
  }));

  // then invdate will be 07:00 in Toronto
  // and the diff is 5 hours
  var diff = date.getTime() - invdate.getTime();

  // so 12:00 in Toronto is 17:00 UTC
  return new Date(date.getTime() + diff);

}




router.get('/article_schuelers/:id', function (req, res) {






  Article.
    findOne({ _id: req.params.id }).
    exec(function (err, article) {
      if (err) {

        console.log('4_iiiiiiiiiiii ' + err);

        req.flash('danger', 'Dieser Auftrag existiert nicht. ');
        res.redirect('/');


        return

      }

      if (article) {




        console.log('article.termin:     ' + article.termin);
        var tag = article.termin.substring(0, 2)
        var monat = article.termin.substring(3, 5)
        var jahr = article.termin.substring(6, 10)

        console.log('tag:     ' + tag);
        console.log('monat:   ' + monat);
        console.log('jahr:    ' + jahr);

        var termin = new Date(jahr, monat - 1, tag, 16);

        console.log('termin:    ' + termin);
        var jetzt = getMyNow();
        console.log('jeks:    ' + jetzt);









        // To calculate the time difference of two dates 
        var Difference_In_Time = termin.getTime() - jetzt.getTime();

        // To calculate the no. of days between two dates 
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

        console.log('  ');
        console.log('uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu    ' + article.title);

        console.log('Total number of days between dates   ' + Difference_In_Days);




        if (Difference_In_Days >= 0) {

          if (jetzt.getFullYear() === termin.getFullYear() &&
            jetzt.getMonth() === termin.getMonth() &&
            jetzt.getDate() === termin.getDate()) {

            article.termin = 'heute 16 Uhr'
          }
          if (jetzt.getFullYear() === termin.getFullYear() &&
            jetzt.getMonth() === termin.getMonth() &&
            jetzt.getDate() + 1 === termin.getDate()) {

            article.termin = 'morgen 16 Uhr'
          }
          if (jetzt.getFullYear() === termin.getFullYear() &&
            jetzt.getMonth() === termin.getMonth() &&
            jetzt.getDate() + 2 === termin.getDate()) {

            article.termin = 'übermorgen'
          }

          if (jetzt.getFullYear() === termin.getFullYear() &&
            jetzt.getMonth() === termin.getMonth() &&
            jetzt.getDate() + 3 === termin.getDate()) {

            article.termin = 'in 3 Tagen'
          }

          if (jetzt.getFullYear() === termin.getFullYear() &&
            jetzt.getMonth() === termin.getMonth() &&
            jetzt.getDate() + 4 === termin.getDate()) {

            article.termin = 'in 4 Tagen'
          }
          if (jetzt.getFullYear() === termin.getFullYear() &&
            jetzt.getMonth() === termin.getMonth() &&
            jetzt.getDate() + 5 === termin.getDate()) {

            article.termin = 'in 5 Tagen'
          }
          if (jetzt.getFullYear() === termin.getFullYear() &&
            jetzt.getMonth() === termin.getMonth() &&
            jetzt.getDate() + 6 === termin.getDate()) {

            article.termin = 'in 6 Tagen'
          }





        } else {
          ///Termin vorüber
          article.termin = 'abgelaufen'

        }




























        Hausarbeit.
          find({ article: req.params.id }).
          populate('schueler').
          populate('uploads').
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
                now: getMyNow(),
                article: article,
                hausarbeits: hausarbeits.reverse(),
                length: length,
                my_termin: termin

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
      if (err) {

        console.log('6_iiiiiiiiiiii ' + err);

        req.flash('danger', 'Dieser Auftrag existiert nicht. ');
        res.redirect('/');


        return

      }

      if (ha) {










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
    populate({
      path: 'article',
      populate: {
        path: 'lehrer',
        model: 'User'


      }


    }).
    populate('schueler').
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
      if (err) {

        console.log('7_iiiiiiiiiiii ' + err);

        req.flash('danger', 'Diese Hausarbeit existiert nicht. ');
        res.redirect('/');


        return

      }

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

























// 
router.post("/add_neu", upload.array("files"),
  (req, res) => {
    if (!req.user) {  //wer nicht angemeldet ist, kann nicht speichern
      req.flash('warning', 'Du bist nicht angemeldet');
      res.redirect('login');
      return
    }
/*     if (!req.body.body || req.body.body.length <= 8) {  //Wenn der Azftrag zu kurz ist, kann man nicht speichern
      req.flash('danger', 'Dein Auftrag ist leer oder viel zu kurz. Nochmal das Ganze.');
      res.redirect('add_article_klasse');
      return
    } */
    if (!req.body.schuelers) { // Wenn man kein SuS auswählt kann man (hier) nicht speichern
      req.flash('warning', 'Du hast keine Schüler*innen ausgewählt. So wird das nichts mit dem Auftrag. ');
      res.redirect('/');
      return
    }

    var jo = []
    var ii = 0;
    req.body.schuelers.forEach(function (schueler) {//alle adressaten werden in einen Array gesteckt
      jo.push(schueler);
      ii++;
    });



    let article = new Article();
    article.title = req.body.title;
    article.author = req.user._id
    article.shadow_klasse = req.body.klaas;
    article.fach = req.body.fach;
    article.termin = req.body.termin;
    article.body = req.body.body;
    article.lehrer = req.user._id;
    article.ha_gelb = '0';
    article.ha_gruen = '0'
    article.created_as_date = getMyNow();



    const start = getMyNow();
    var nau = ("00" + start.getDate()).slice(-2) + '.' + ("00" + (start.getMonth() + 1)).slice(-2) + '. ' + start.getHours() + '.' + ("00" + start.getMinutes()).slice(-2) + ' Uhr';
    article.created = nau;

    var tag = req.body.termin.substring(0, 2)
    var monat = req.body.termin.substring(3, 5)
    var jahr = req.body.termin.substring(6, 10)

    var d = new Date(jahr, monat - 1, tag, 16);
    var jetzt = getMyNow();
    var diffMs = (d - jetzt); // milliseconds between now & Christmas

    if (diffMs < 0) { //wenn der Termin in der Vergangenheit liegt, ist Schluss mit Speichern
      req.flash('danger', 'Die Abgabefrist deines Auftrags liegt in der Vergangenheit. Das ist nicht erlaubt. Ergibt ja auch keinen Sinn');
      res.redirect('add_article_klasse');
      return;
    }





    article.save(function (err, art) {

      if (err) {
        console.log(err);
        return;
      } else {


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




                      }

                    })


                }
              }
            )
          })


          if (req.files.length === 0) {


            req.flash('success', 'Auftrag wurde erteilt. Er wird jetzt den SuS angezeigt. Drücke auf den blauen "SuS"-Button deines Auftrags, um zu sehen welche SuS den Auftrag bearbeitet haben. ');
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
              fs.unlink(tempPath, err => {
                if (err) return handleError(err, res);


                req.flash('danger', 'Ein Dateityp wird nicht unterstützt.');




              });
            }


          })








          req.flash('success', 'Auftrag mit upload erteilt. Er wird jetzt den SuS angezeigt. Drücke auf den blauen "SuS"-Button deines Auftrags, um zu sehen welche SuS den Auftrag bearbeitet haben. ');
          res.redirect('/');

          return











        })






      }
    })

  }

)







  /
  router.post("/add_alt", upload.array("files" /* name attribute of <file> element in your form */),
    (req, res) => {
      if (!req.user) {  //wer nicht angemeldet ist, kann nicht speichern
        req.flash('warning', 'Du bist nicht angemeldet');
        res.redirect('login');
        return
      }
/*       if (!req.body.body || req.body.body.length <= 8) {  //Wenn der Azftrag zu kurz ist, kann man nicht speichern
        req.flash('danger', 'Dein Auftrag ist leer oder viel zu kurz. Nochmal das Ganze.');
        res.redirect('add_article_klasse');
        return
      } */









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
      article.created_as_date = getMyNow();

      const start = getMyNow();
      var nau = start.getDate() + '.' + start.getMonth() + '.' + start.getFullYear() + ', ' + start.getHours() + '.' + start.getMinutes() + ' Uhr';
      var nau = start.getDate() + '.' + start.getMonth() + '. (' + start.getHours() + ':' + start.getMinutes() + ')'

      article.created = nau;





      var tag = req.body.termin.substring(0, 2)
      var monat = req.body.termin.substring(3, 5)
      var jahr = req.body.termin.substring(6, 10)

      var d = new Date(jahr, monat - 1, tag, 16);
      var jetzt = getMyNow();
      var diffMs = (d - jetzt); // milliseconds between now & Christmas

      if (diffMs < 0) { //wenn der Termin in der Vergangenheit liegt, ist Schluss mit Speichern
        req.flash('danger', 'Die Abgabefrist deines Auftrags liegt in der Vergangenheit. Das ist nicht erlaubt. Ergibt ja auch keinen Sinn');
        res.redirect('add_article_klasse');
        return;
      }





      article.save(function (err, art) {

        if (err) {
          console.log(err);
          return;
        } else {







          if (req.files.length === 0) {


            req.flash('success', 'Auftrag wurde erteilt. Er wird jetzt den SuS angezeigt. Drücke auf den blauen "SuS"-Button deines Auftrags, um zu sehen welche SuS den Auftrag bearbeitet haben. ');
            res.redirect('/');

            return

          } else {






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
                fs.unlink(tempPath, err => {
                  if (err) return handleError(err, res);


                  req.flash('danger', 'Ein Dateityp wird nicht unterstützt.');




                });
              }


            })








            req.flash('success', 'Auftrag mit upload erteilt. Er wird jetzt den SuS angezeigt. Drücke auf den blauen "SuS"-Button deines Auftrags, um zu sehen welche SuS den Auftrag bearbeitet haben. ');
            res.redirect('/');

            return


          }









        }







      })

    }

  )











// post add (article)
router.post("/add_alt_alt", upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {


    if (!req.user) {

      req.flash('warning', 'Du bist nicht angemeldet');
      res.redirect('/');

      return


    }

    if (!req.body.body || req.body.body.length <= 8) {
      //console.log('............... ' + req.body.body.length);

      req.flash('danger', 'Dein Auftrag ist leer oder viel zu kurz. Nochmal das Ganze.');
      res.redirect('add_article_klasse');

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






        //console.log('-------------------------------------')

        // console.log(my_article);

        var tag = req.body.termin.substring(0, 2)
        var monat = req.body.termin.substring(3, 5)
        var jahr = req.body.termin.substring(6, 10)

        /*         console.log('tag:     ' + tag);
                console.log('monat:   ' + monat);
                console.log('jahr:    ' + jahr); */

        var d = new Date(jahr, monat - 1, tag, 16);

        // console.log('Date:    ' + d);
        var jetzt = getMyNow();
        // console.log('Date:    ' + jetzt);



        var today = jetzt
        var Christmas = d
        var diffMs = (Christmas - today); // milliseconds between now & Christmas


        if (diffMs >= 0) {





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
          article.created_as_date = getMyNow();

          const start = getMyNow();
          var nau = start.getDate() + '.' + start.getMonth() + '.' + start.getFullYear() + ', ' + start.getHours() + '.' + start.getMinutes() + ' Uhr';
          var nau = start.getDate() + '.' + start.getMonth() + '. (' + start.getHours() + ':' + start.getMinutes() + ')'

          article.created = nau;









          if (req.file) {


            const tempPath = req.file.path;
            const gigi = getMyNow().getTime() + "_" + req.file.originalname.toLowerCase();
            const gigi_sauber = gigi.split(' ').join('-');
            const targetPath = path.join(__dirname, "../uploads/" + gigi_sauber);
            console.log('bennoYYY ' + targetPath);

            const pipi = path.extname(req.file.originalname).toLowerCase()
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





                article.save(function (err, art) {

                  if (err) {
                    console.log(err);
                    return;
                  } else {



                    let load = new Load();
                    load.body = gigi_sauber;
                    load.extension = path.extname(gigi_sauber);
                    load.name = req.file.originalname;


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









                    load.save(function (err, loaded) {

                      if (err) {
                        console.log(err);
                        return;
                      } else {




                        Article.findByIdAndUpdate(art._id,
                          { $push: { uploads: loaded } },
                          { safe: true, upsert: true },
                          function (err, uptdatedArticle) {
                            if (err) {
                              console.log(err);
                            } else {




                              req.flash('success', 'Auftrag mit Upload erteilt. Er wird jetzt den SuS angezeigt. Drücke auf den blauen "SuS"-Button deines Auftrags, um zu sehen welche SuS den Auftrag bearbeitet haben. ');
                              res.redirect('/');



                            }
                          });




                      }
                    })





                  }
                })












              });
            } else {
              fs.unlink(tempPath, err => {
                if (err) return handleError(err, res);


                req.flash('danger', 'Dieser Dateityp wird nicht unterstützt.');
                res.redirect('/');



              });
            }



          } else {

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












        } else {
          ///zu spät










          req.flash('danger', 'Die Abgabefrist deines Auftrags liegt in der Vergangenheit. Das ist nicht erlaubt. Ergibt ja auch keinen Sinn');
          res.redirect('/');
          return;


        }













      }
    }
  }
);










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









  }



);

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


                  console.log('load:  :  :  '+load.body)



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

      var d = new Date(jahr, monat - 1, tag, 14);

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


        req.flash('danger', 'Der Schüler hat für die Nachbesserung nicht genug Zeit. Der Nachbesserungswunsch muss spätestens 2 Stunden vor Abgabefrist erfolgen. Alles andere wäre ja auch unfair.');
        res.redirect('/articles/article_schuelers/' + article);
        return;


      }


    })


  })






});


































// Update submit POST route
router.post("/edit/:id", upload.array("files" /* name attribute of <file> element in your form */),
  (req, res) => {
    if (!req.user) {  //wer nicht angemeldet ist, kann nicht speichern
      req.flash('warning', 'Du bist nicht angemeldet');
      res.redirect('login');
      return
    }
    /* if (!req.body.body || req.body.body.length <= 8) {  //Wenn der Azftrag zu kurz ist, kann man nicht speichern
      req.flash('danger', 'Dein Auftrag ist leer oder viel zu kurz. Nochmal das Ganze.');
      res.redirect('add_article_klasse');
      return
    }
 */


    var tag = req.body.termin.substring(0, 2)
    var monat = req.body.termin.substring(3, 5)
    var jahr = req.body.termin.substring(6, 10)

    var d = new Date(jahr, monat - 1, tag, 16);
    var jetzt = getMyNow();
    var diffMs = (d - jetzt); // milliseconds between now & Christmas


    if (diffMs < 0) { //wenn der Termin in der Vergangenheit liegt, ist Schluss mit Speichern
      req.flash('danger', 'Die Abgabefrist deines Auftrags liegt in der Vergangenheit. Das ist nicht erlaubt. Ergibt ja auch keinen Sinn');
      res.redirect('add_article_klasse');
      return;
    }



    if (req.body.shadow_klasse && !req.body.klasse) { //edit article neu

      if (!req.body.schuelers) { // Wenn man kein SuS auswählt kann man (hier) nicht speichern
        req.flash('warning', 'Du hast keine Schüler*innen ausgewählt. So wird das nichts mit dem Auftrag. ');
        res.redirect('/');
        return
      }

      var jo = []
      var ii = 0;
      req.body.schuelers.forEach(function (schueler) {
        jo.push(schueler);
        ii++;
      });


      Article.
        findOne({ _id: req.params.id }).
        populate('schuelers').
        populate('uploads').
        exec(function (err2, art) {
          if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);


          art.schuelers.forEach(function (schueler) {
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



            const start = getMyNow();




            var nau = ("00" + start.getDate()).slice(-2) + '.' + ("00" + (start.getMonth() + 1)).slice(-2) + '. ' + start.getHours() + '.' + ("00" + start.getMinutes()).slice(-2) + ' Uhr';


            article.created = nau;



            Article.update(query, article, function (err, artiii) {
              if (err) {
                console.log(err);
                return;
              } else {







                if (req.body.delete) {
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
                    fs.unlink(tempPath, err => {
                      if (err) return handleError(err, res);


                      req.flash('danger', 'Ein Dateityp wird nicht unterstützt.');




                    });
                  }


                })


















                req.flash('success', 'Auftrag mit upload erteilt. Er wird jetzt den SuS angezeigt. Drücke auf den blauen "SuS"-Button deines Auftrags, um zu sehen welche SuS den Auftrag bearbeitet haben. ');
                res.redirect('/');

                return






              }
            })

          })











        });





    } else if (!req.body.shadow_klasse && req.body.klasse) {
      console.log('ALT mmm');













      Article.
        findOne({ _id: req.params.id }).
        populate('schuelers').
        populate('uploads').
        exec(function (err2, art) {
          if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);




          let article = {};
          article.title = req.body.title;
          article.author = art.author;

          article.klasse = req.body.klasse;
          article.fach = req.body.fach;
          article.termin = req.body.termin;
          article.body = req.body.body;





          const start = getMyNow();

          var nau = ("00" + start.getDate()).slice(-2) + '.' + ("00" + (start.getMonth() + 1)).slice(-2) + '. ' + start.getHours() + '.' + ("00" + start.getMinutes()).slice(-2) + ' Uhr';

          article.created = nau;

          let query = { _id: req.params.id }
          Article.update(query, article, function (err, artiii) {
            if (err) {
              console.log(err);
              return;
            } else {







              if (req.body.delete) {
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
                  fs.unlink(tempPath, err => {
                    if (err) return handleError(err, res);


                    req.flash('danger', 'Ein Dateityp wird nicht unterstützt.');




                  });
                }


              })


















              req.flash('success', 'Auftrag mit upload erteilt. Er wird jetzt den SuS angezeigt. Drücke auf den blauen "SuS"-Button deines Auftrags, um zu sehen welche SuS den Auftrag bearbeitet haben. ');
              res.redirect('/');

              return






            }
          })

        })

















    } else {//(req.body.shadow_klasse && !req.body.klasse)
      console.log('FEHLER Sowohl Klasse als auc shadow_klasse scheinen leer zu sein!!!');
      console.log('arti.klasse  ' + arti.klasse);
      console.log('arti.shadow_klasse  ') + arti.shadow_klasse;

    }






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
    req.flash('danger', 'Bitte anmelden');
    res.redirect('/users/login');
  }

}



module.exports = router;
