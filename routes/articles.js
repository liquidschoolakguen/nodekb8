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






function getMyNow(){
  var yes  = new Date();

  var n = yes.getTimezoneOffset();
 

  if(n!==-120){

    yes.setHours(yes.getHours()+2)

    console.log('bimmelbingo')
  }else{

    console.log('server')
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
      if (err) return console.log('4_iiiiiiiiiiii ' + err);

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
                now : getMyNow(),
                article: article,
                hausarbeits: hausarbeits.reverse(),
                length: length,
                my_termin : termin
                
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


        schuelers.forEach(function (schueler) {

          //console.log('schüler: ' + schueler.name);


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
router.post("/add_neu", upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {





    if (!req.body.body || req.body.body.length <= 8) {
      //console.log('............... ' + req.body.body.length);

      req.flash('danger', 'Dein Auftrag ist leer oder viel zu kurz. Nochmal das Ganze.');
      res.redirect('add_article_klasse');





    } else {


      var jo = []


        //console.log('Willi wills wissen        :      '+req.body.schuelers);

        //console.log('Willi wills wissen []     :      '+req.body.schuelers[0]);


       var ii =0;
       req.body.schuelers.forEach(function (schueler) {
  
          console.log('schueler        :      '  +ii+ '        '+schueler+ '      '+req.body.id[ii]);
  
          jo.push(schueler);

          ii++;
        });

 




      //console.log('da is was');

      req.checkBody('title', 'Deine Hausaufgabe braucht einen Titel').notEmpty();
      req.checkBody('fach', 'Gebe eine Schulfach ein').not().equals('Wähle')
      req.checkBody('termin', 'Gebe einen Abgabetermin ein').notEmpty();
      req.checkBody('body', 'Du hast keinen AUftrag erteilt').notEmpty();

      // get Errrors
      let errors = req.validationErrors();

      if (errors) {
        res.render('add_article_neu', {
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

        console.log('datePicker ' + req.body.termin);

        article.termin = req.body.termin;
        article.body = req.body.body;
        article.lehrer = req.user._id;
        article.ha_gelb = '0';
        article.ha_gruen = '0'
        article.created_as_date = getMyNow();

        console.log('klaas:  ' + req.body.klaas)


        const start = getMyNow();

        var nau = ("00" + start.getDate()).slice(-2) + '.' + ("00" + (start.getMonth() + 1)).slice(-2) + '. ' + start.getHours() + '.' + ("00" + start.getMinutes()).slice(-2) + ' Uhr';

        article.created = nau;










        //console.log('-------------------------------------')

        // console.log(my_article);

        var tag = req.body.termin.substring(0, 2)
        var monat = req.body.termin.substring(3, 5)
        var jahr = req.body.termin.substring(6, 10)

        console.log('tag:     ' + tag);
        console.log('monat:   ' + monat);
        console.log('jahr:    ' + jahr);

        var d = new Date(jahr, monat - 1, tag, 16);

        console.log('Date:    ' + d);
        var jetzt = getMyNow();
        console.log('Date:    ' + jetzt);



        var today = jetzt
        var Christmas = d
        var diffMs = (Christmas - today); // milliseconds between now & Christmas
        var diffDays = Math.floor(diffMs / 86400000); // days
        var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
        var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes


        if (diffMs >= 0) {// wenn termin i der Zukunft liegt und nicht in der Vergangeheit













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


/*                     console.log('-------------------------------------');
                    console.log('-------------------------------------');
                    console.log('-------------------------------------');
                    console.log('-------------------------------------');
                    console.log('articleK: ' + arti);
                    console.log('-------------------------------------');
                    console.log('-------------------------------------');
                    console.log('-------------------------------------');
                    console.log('-------------------------------------'); */



                  });


                schuelers.forEach(function (schueler) {


                  User.
                    findOne({ _id: schueler._id }).
                    populate('auftrags').
                    exec(function (err2, schue) {
                      if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);



/*                       console.log('schuelersY: ' + schue);
                      console.log('-------------------------------------'); */





                    });




                });





              });






              req.flash('success', 'Auftrag erteilt. Er wird jetzt den SuS angezeigt. Drücke auf den blauen "SuS"-Button deines Auftrags, um zu sehen welche SuS den Auftrag bearbeitet haben. ');
              res.redirect('/');
            }
          })
















        } else {
          ///zu spät


          req.flash('danger', 'Die Abgabefrist deines Auftrags liegt in der Vergangenheit. Das ist nicht erlaubt. Ergibt ja auch keinen Sinn');
          res.redirect('add_article_klasse');
          return;


        }









      }
    }
  }
);






// post add (article)
router.post("/add_alt", upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {


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


          if (article) {

            const start = getMyNow();

            var tag = article.termin.substring(0, 2)
            var monat = article.termin.substring(3, 5)
            var jahr = article.termin.substring(6, 10)

            console.log('tag:     ' + tag);
            console.log('monat:   ' + monat);
            console.log('jahr:    ' + jahr);

            var termin = new Date(jahr, monat - 1, tag, 16);




            console.log('wwwjjjjjjjjjjjjjjjjj s    ' + start);
            console.log('wwwjjjjjjjjjjjjjjjjj a    ' + termin);






            if (termin >= start) { // wenn die HA rechtzeitig abgegeben wurde

              console.log('wwwERROR_______________________ok');






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


              hausarbeit.save(function (err) {

                if (err) {
                  console.log(err);
                  return;
                } else {




                  req.flash('success', 'Super! Du hast deine Hausarbeit abgegeben. Solange deine Arbeit nicht überprüft wurde, kannst du sie noch ändern. ');
                  res.redirect('/');
                }
              })








            } else {

              console.log('wwwERROR_______________________');


              req.flash('danger', 'Zu spät. Die Frist für diesen Auftrag ist abgelaufen. Nun kannst du deine Hausarbeit nicht mehr abgeben ');
              res.redirect('/');
              return;


            }











          } else {




            req.flash('warning', 'Der Auftrag wurde gerade gelöscht. Du musst diese Hausarbeit nicht mehr abgeben');
            res.redirect('/');



          }








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










  Article.findById(req.body.article_id, function (err, article) {

    if (err) {
      //console.log('wwwERROR_______________________');
      console.log(err);

    } else {


      if (article) {







        const start = getMyNow();

        var tag = article.termin.substring(0, 2)
        var monat = article.termin.substring(3, 5)
        var jahr = article.termin.substring(6, 10)

        console.log('tag:     ' + tag);
        console.log('monat:   ' + monat);
        console.log('jahr:    ' + jahr);

        var termin = new Date(jahr, monat - 1, tag, 16);




       // console.log('wwwjjjjjjjjjjjjjjjjj s    ' + start);
       // console.log('wwwjjjjjjjjjjjjjjjjj a    ' + termin);












        if (termin >= start) { // wenn die HA rechtzeitig abgegeben wurde

        //  console.log('wwwERROR_______________________ok');





          Hausarbeit.findById(req.params.id , function (err10, haus) {

            if (err10) throw err10;
            if (haus) {

              console.log('haus      haus     haus        ' + haus.body + '    |    '+haus.status);



                if(haus.status === '1' || haus.status === '3'  ){// Wenn der Status 1 ist, hat der Lehrer noch nicht korrigiert





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
        
        
        
                    req.flash('success', 'Hausarbeit geändert');
                    res.redirect('/');
        
        
        
                  });
        
        




                }else{



                  // lehrer hat bereits korrigiert/


                  req.flash('warning', 'Deine Hausarbeit kann nicht mehr geändert werden, da sie bereits von der Lehrkraft beurteilt wurde');
                  res.redirect('/');
      


                }







            }else{




              req.flash('warning', 'Deine Hausarbeit wurde gelöscht');
              res.redirect('/');
  






            }
          
          
          
          
          
          
          
          
          
          
          
          })






         








        } else {

          console.log('wwwERROR_______________________');

          req.flash('danger', 'Zu spät. Die Frist für diesen Auftrag ist abgelaufen. Nun kannst du deine Hausarbeit nicht mehr ändern. Die Lehrer*in bekommt die alte Version. ');
          res.redirect('/');
          return;


        }





















      } else {// kein article

        req.flash('warning', 'Der Auftrag wurde gerade gelöscht. Du musst diese Hausarbeit nicht mehr abgeben');
        res.redirect('/');



      }


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
        res.redirect('/articles/article_schuelers/' + req.params.id);
        return;


      }


    })


  })






});


































// Update submit POST route
router.post("/edit/:id", upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {











  if (!req.body.body || req.body.body.length <= 8) {
    //console.log('............... ' + req.body.body.length);

    req.flash('danger', 'Dein Auftrag ist leer oder viel zu kurz. Wem willst du hier eigentlich ein X für ein U vormachen?');
    res.redirect('/');

  } else {







    //console.log('-------------------------------------')

    // console.log(my_article);

    var tag = req.body.termin.substring(0, 2)
    var monat = req.body.termin.substring(3, 5)
    var jahr = req.body.termin.substring(6, 10)

    console.log('tag:     ' + tag);
    console.log('monat:   ' + monat);
    console.log('jahr:    ' + jahr);

    var d = new Date(jahr, monat - 1, tag, 16);

    console.log('Date:    ' + d);
    var jetzt = getMyNow();
    console.log('Date:    ' + jetzt);



    var today = jetzt
    var Christmas = d
    var diffMs = (Christmas - today); // milliseconds between now & Christmas
    var diffDays = Math.floor(diffMs / 86400000); // days
    var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes


    if (diffMs >= 0) {



























      if (req.body.shadow_klasse && !req.body.klasse) {




        var jo = []


        //console.log('Willi wills wissen        :      '+req.body.schuelers);

        //console.log('Willi wills wissen []     :      '+req.body.schuelers[0]);


       var ii =0;
       req.body.schuelers.forEach(function (schueler) {
  
          console.log('schueler        :      '  +ii+ '        '+schueler+ '      ');
  
          jo.push(schueler);

          ii++;
        });







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
              //console.log('record :   ' + schueler.name);


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



              Article.update(query, article, function (err) {
                if (err) {
                  console.log(err);
                  return;
                } else {







                  req.flash('success', 'Auftrag geändert. So ist er auch gleich viel hübscher anzusehen. ');
                  res.redirect('/');
                }
              })

            })















          });





      } else if (!req.body.shadow_klasse && req.body.klasse) {
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



          const start = getMyNow();




          var nau = ("00" + start.getDate()).slice(-2) + '.' + ("00" + (start.getMonth() + 1)).slice(-2) + '. ' + start.getHours() + '.' + ("00" + start.getMinutes()).slice(-2) + ' Uhr';


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
        console.log('FEHLER Sowohl Klasse als auc shadow_klasse scheinen leer zu sein!!!');
        console.log('arti.klasse  ' + arti.klasse);
        console.log('arti.shadow_klasse  ') + arti.shadow_klasse;

      }




    } else {
      ///zu spät


      req.flash('danger', 'Die Abgabefrist deines Auftrags liegt in der Vergangenheit. Das ist nicht erlaubt. Ergibt ja auch keinen Sinn.');
      res.redirect('/');
      return;


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
