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
  //var nau = start.getDate() + '.' + start.getMonth() + '.' + start.getFullYear() + ', ' + start.getHours() + '.' + start.getMinutes() + ' Uhr';
  var nau = tomorrow.getDate() + '.' + tomorrow.getMonth() + '.' + tomorrow.getFullYear()



  res.render('add_article', {
    title: 'Add Articles',
    abgabe: nau
  })

});












// Edit article form
router.get('/edit/:id', ensureAuthenticated, function (req, res) {
  Article.findById(req.params.id, function (err, article) {
    // stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]

    //console.log('im edit article');
    //console.log(article);
    if (article.author != req.user._id) {
      //console.log('redirect');
      req.flash('danger', 'nicht autorisiert');
      res.redirect('/');
      return;

    } else {




      //console.log('ok');

      res.render('edit_article', {
        title: 'Auftrag gespeichert',
        article: article
      });


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
                hausarbeits: hausarbeits,
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
    findOne({_id: req.params.id}).
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





// post add (article)
router.post("/add", upload.single("file" /* name attribute of <file> element in your form */),
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
        res.render('add_article', {
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
          var nau = start.getDate() + '.' + start.getMonth() + '.' + start.getFullYear() + ', ' + start.getHours() + '.' + ("00" + start.getMinutes()).slice(-2); + ' Uhr';

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





        }

      })







    }

  }



);








// Update submit POST route HAUSARBEIT
router.post('/edit_hausarbeit/:id', function (req, res) {

  //console.log(req.params.id);






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
        console.log('hausarbeit.ergebnis_dollar ' + hausarbeit.ergebnis_dollar )
        let opUser = {}

        if(hausarbeit.ergebnis_dollar!='keine Auswahl'){

          opUser.money = parseInt(user.money) + parseInt(hausarbeit.ergebnis_dollar);

        }else {

          opUser.money = parseInt(user.money);
        }
       

        console.log('opUser.money  ' + opUser.money  )


        console.log('doc.schueler ' + doc.schueler)
        //console.log('hausarbeit.schueler ' + hausarbeit.schueler )
        //hausarbeit.schueler

        User.update({_id: doc.schueler}, opUser, function (err) {
          if (err) {
            console.log(err);
            return;
          } else {


            req.flash('success', 'Hausarbeit korrigiert');
            res.redirect('/');


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
    



    var nau = start.getDate() + '.' + start.getMonth() + '.' + start.getFullYear() + ', ' + start.getHours() + '.' + ("00" + start.getMinutes()).slice(-2); + ' Uhr';


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
