const express = require('express');
const router = express.Router();
const path = require('path');

const fs = require('fs');






//User model
let User = require('../models/user');
let Article = require('../models/article');
let Hausarbeit = require('../models/hausarbeit');
let School = require('../models/school');


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




router.get('/add_2', ensureAuthenticated, function (req, res) {



  var admin_schluessel = makeid(10).toLowerCase()
  var lehrer_schluessel = makeid(6).toLowerCase()
  var schueler_schluessel = makeid(6).toLowerCase()








  School.findOne({ admin_schluessel: admin_schluessel }).
    exec(function (err2, school) {

      if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);
      if (!school) {
        n = -1
        console.log('Keine Schule hat diesen admin_schluessel')
      } else {
        console.log('Es existiert eine Schule mit diesem admin_schluessel. Ein neuer Schlüssel wird generiert.')
        admin_schluessel = makeid(10).toLowerCase()


        School.findOne({ admin_schluessel: admin_schluessel }).
          exec(function (err2, school) {
            console.log('äääää')

            if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);
            if (!school) {
              n = -1
              console.log('Keine Schule hat diesen admin_schluessel')
            } else {
              console.log('Es existiert eine Schule mit diesem admin_schluessel. Ein neuer Schlüssel wird generiert.')
              admin_schluessel = makeid(10).toLowerCase()



              School.findOne({ admin_schluessel: admin_schluessel }).
                exec(function (err2, school) {
                  console.log('äääää')

                  if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);
                  if (!school) {
                    n = -1
                    console.log('Keine Schule hat diesen admin_schluessel')
                  } else {
                    console.log('Es existiert eine Schule mit diesem admin_schluessel. Ein neuer Schlüssel wird generiert.')
                    admin_schluessel = makeid(10).toLowerCase()



                    School.findOne({ admin_schluessel: admin_schluessel }).
                      exec(function (err2, school) {
                        console.log('äääää')

                        if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);
                        if (!school) {
                          n = -1
                          console.log('Keine Schule hat diesen admin_schluessel')
                        } else {
                          console.log('Es existiert eine Schule mit diesem admin_schluessel. Ein neuer Schlüssel wird generiert.')
                          admin_schluessel = makeid(10).toLowerCase()


                        }
                      })
                  }
                })

            }
          })


      }
    })





    School.findOne({ lehrer_schluessel: lehrer_schluessel }).
      exec(function (err2, school) {
        if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);
        if (!school) {
          nn = -1
          console.log('Keine Schule hat diesen lehrer_schluessel')
        } else {
          console.log('Es existiert eine Schule mit diesem lehrer_schluessel. Ein neuer Schlüssel wird generiert.')
          lehrer_schluessel = makeid(6).toLowerCase()

          School.findOne({ lehrer_schluessel: lehrer_schluessel }).
          exec(function (err2, school) {
            if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);
            if (!school) {
              nn = -1
              console.log('Keine Schule hat diesen lehrer_schluessel')
            } else {
              console.log('Es existiert eine Schule mit diesem lehrer_schluessel. Ein neuer Schlüssel wird generiert.')
              lehrer_schluessel = makeid(6).toLowerCase()
    
              School.findOne({ lehrer_schluessel: lehrer_schluessel }).
              exec(function (err2, school) {
                if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);
                if (!school) {
                  nn = -1
                  console.log('Keine Schule hat diesen lehrer_schluessel')
                } else {
                  console.log('Es existiert eine Schule mit diesem lehrer_schluessel. Ein neuer Schlüssel wird generiert.')
                  lehrer_schluessel = makeid(6).toLowerCase()
        
                  School.findOne({ lehrer_schluessel: lehrer_schluessel }).
                  exec(function (err2, school) {
                    if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);
                    if (!school) {
                      nn = -1
                      console.log('Keine Schule hat diesen lehrer_schluessel')
                    } else {
                      console.log('Es existiert eine Schule mit diesem lehrer_schluessel. Ein neuer Schlüssel wird generiert.')
                      lehrer_schluessel = makeid(6).toLowerCase()
            
            
            
            
                    }
                  })


        
        
                }
              })



    
    
            }
          })




        }
      })






    School.findOne({ schueler_schluessel: schueler_schluessel }).
      exec(function (err2, school) {
        if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);
        if (!school) {
          nnn = -1
          console.log('Keine Schule hat diesen schueler_schluessel')
        } else {
          console.log('Es existiert eine Schule mit diesem scgueler_schluessel. Ein neuer Schlüssel wird generiert.')
          schueler_schluessel = makeid(6).toLowerCase()
          School.findOne({ schueler_schluessel: schueler_schluessel }).
          exec(function (err2, school) {
            if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);
            if (!school) {
              nnn = -1
              console.log('Keine Schule hat diesen schueler_schluessel')
            } else {
              console.log('Es existiert eine Schule mit diesem scgueler_schluessel. Ein neuer Schlüssel wird generiert.')
              schueler_schluessel = makeid(6).toLowerCase()
    
              School.findOne({ schueler_schluessel: schueler_schluessel }).
              exec(function (err2, school) {
                if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);
                if (!school) {
                  nnn = -1
                  console.log('Keine Schule hat diesen schueler_schluessel')
                } else {
                  console.log('Es existiert eine Schule mit diesem scgueler_schluessel. Ein neuer Schlüssel wird generiert.')
                  schueler_schluessel = makeid(6).toLowerCase()
        
                  School.findOne({ schueler_schluessel: schueler_schluessel }).
                  exec(function (err2, school) {
                    if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);
                    if (!school) {
                      nnn = -1
                      console.log('Keine Schule hat diesen schueler_schluessel')
                    } else {
                      console.log('Es existiert eine Schule mit diesem scgueler_schluessel. Ein neuer Schlüssel wird generiert.')
                      schueler_schluessel = makeid(6).toLowerCase()
            
            
                      
            
            
                    }
                  })
                  
        
        
                }
              })
              
    
    
            }
          })




        }
      })




  res.render('add_school_2', {
    title: 'Add School',
    admin_schluessel: admin_schluessel,
    lehrer_schluessel: lehrer_schluessel,
    schueler_schluessel: schueler_schluessel


  })









})





// Add Article
router.get('/add', ensureAuthenticated, function (req, res) {





  res.render('add_school', {
    title: 'Add School',
   


  })

});






// Add Article
router.get('/school_lookup', ensureAuthenticated, function (req, res) {



  res.render('school_lookup', {
    schools: null

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
















// get

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// post

































function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}











// 
router.post("/add", upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {








    User.findById(req.user._id, function (err, user) {

      if (err) throw err;
      if (!user) {


        return

      }




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














      let school = new School();
      school.name = req.body.name;
      school.plz = req.body.plz;
      school.ort = req.body.ort;

 /*      school.admin_schluessel = req.body.admin_schluessel.toLowerCase().trim();
      school.lehrer_schluessel = req.body.lehrer_schluessel.toLowerCase().trim();
      school.schueler_schluessel = req.body.schueler_schluessel.toLowerCase().trim(); */

      school.url = all;
      school.make_id = makeid(8);

      school.admin = user;


      console.log('school.make_id:   ' + school.make_id);



      var jo = []

      var ii = 0;
      req.body.ffach.forEach(function (fach) {
        if (fach.trim()) {
          console.log('fach        :      ' + ii + '        ' + fach + '      ');
          jo.push(fach);
        }
        ii++;
      });
      console.log('pup        :      ' + jo.length);

      school.fachs = jo;







      var jo2 = []

      var ii = 0;
      req.body.fstamm.forEach(function (stamm) {
        if (stamm.trim()) {
          console.log('stamm        :      ' + ii + '        ' + stamm + '      ');
          jo2.push(stamm);
        }
        ii++;
      });
      console.log('pup2        :      ' + jo2.length);




      school.stamms = jo2;





      school.save(function (err, scho) {

        if (err) {
          console.log(err);
          return;
        } else {



          let userB = {};
          userB.school = scho;




          User.findByIdAndUpdate(scho.admin._id, userB,
            function (err, uptdatedAdmin) {
              if (err) {
                console.log(err);
              } else {





                req.flash('success', 'Fast geschafft. Nun braucht deine Schule noch drei Schlüssel, damit sie über Liquidschool erreichbar ist ');
                res.redirect('add_2');


              }
            });



        }


      })








    });









  })














// 
router.post("/add_2", upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {




    User.findOne({ _id: req.user._id }).
        populate('school').
        exec(function (err, user) {
            if (err) return console.log('iiiiiiiiiiiiiiiiiii ' + err);

      if (!user) {


        return

      }










      let updateSchool = {};
 
      updateSchool.admin_schluessel = req.body.admin_schluessel.toLowerCase().trim();
      updateSchool.lehrer_schluessel = req.body.lehrer_schluessel.toLowerCase().trim();
      updateSchool.schueler_schluessel = req.body.schueler_schluessel.toLowerCase().trim();





      School.update({ _id: user.school._id }, updateSchool, function (err) {
        if (err) {
          console.log(err);
          return;
        } else {



                req.flash('success', 'Deine Schule ist ab sofort unter liquidschool.de  erreichbar');
                res.redirect('/');


        }


      })








    });









  })























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


          var ii = 0;
          req.body.schuelers.forEach(function (schueler) {

            console.log('schueler        :      ' + ii + '        ' + schueler + '      ');

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






/* 
// Delete Article
router.get('/searching', function (req, res) {


  console.log('drinn')



  var yo = []


  yo.push('Fotzenknecht')
  yo.push('Fotzenknechti')
  yo.push('Fotzenspecht')
  yo.push('Friedolin')

  res.send(yo);

})
 */




// Delete Article
router.delete('/:id', function (req, res) {


  console.log('drinn')
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
