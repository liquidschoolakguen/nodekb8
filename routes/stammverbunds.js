const express = require('express');
const router = express.Router();
const path = require('path');

const fs = require('fs');






//User model
let User = require('../models/user');
let School = require('../models/school');
let Stammverbund = require('../models/stammverbund');
let Stamm = require('../models/stamm');


const multer = require("multer");


const upload = multer({
  dest: "../uploads"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});



// Edit article form
router.get('/add_stammverbund', ensureAuthenticated, function (req, res) {

  console.log('drin! eadd_stammverbund')




  User.
    findOne({ _id: req.user.id }).
    populate({
      path: 'school',
      populate: {
        path: 's_stamms'
      }
    }).
    exec(function (err2, user) {
      if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);





      console.log('i------------- ' + user.name);
      console.log('i------------- ' + user.school.name);


      res.render('add_stammverbund', {
        user: user
      })





    });






});









// Edit article form
router.get('/stammverbund_edit/:id', ensureAuthenticated, function (req, res) {

  console.log('drin! eadd_stammverbund')






  Stammverbund.
    findOne({ _id: req.params.id }).
    populate('school').
    exec(function (err2, stammverbund) {
      if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);





      console.log('i------------- ' + stammverbund.name);
      console.log('i------------- ' + stammverbund.school.name);



      var tt = [];

      var all_stamms = stammverbund.school.stamms;

      all_stamms.forEach(function (all_stamm) {

        var bingo = new Object();
        bingo.name = all_stamm;
        bingo.token = false;

        stammverbund.stamms.forEach(function (v_stamm) {
          // console.log('ein all-schüler: ' + all_schueler.name + ' / ' + all_schueler._id);


          if (all_stamm.toString() === v_stamm.toString()) {
            //console.log('ein arti-schüler: ' + arti_schueler.name + ' / ' + arti_schueler._id);

            bingo.token = true;
          }


        });


        tt.push(bingo)

      });






      res.render('stammverbund_edit', {
        stammverbund: stammverbund,
        stamms: tt
      })





    });






});









// get

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// post




// 
router.post("/add_stammverbund", upload.array("files"),
  (req, res) => {
    if (!req.user) {  //wer nicht angemeldet ist, kann nicht speichern
      req.flash('warning', 'Du bist nicht angemeldet');
      res.redirect('/');
      return
    }



    if (!req.body.stamms) { // Wenn man kein Stamms auswählt kann man (hier) nicht speichern
      req.flash('warning', 'Du hast keine Klassen ausgewählt. ');
      res.redirect('/');
      return
    }


 
    User.
      findOne({ _id: req.user.id }).
      populate({
        path: 'school',
        populate: {
          path: 's_stamms'
        }
      }).
      exec(function (err2, user) {
        if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);


        var jo = []
        var ii = 0;
        req.body.stamms.forEach(function (stamm_id) {//alle adressaten werden in einen Array gesteckt
          console.log('fifi:   ' + stamm_id);
          jo.push(stamm_id);
          ii++;
        });





        let stammverbund = new Stammverbund();
        stammverbund.name = req.body.name;
        //stammverbund.stamms = req.body.stamms;
        stammverbund.school = user.school;


        var benno = false
        user.school.s_stamms.forEach(function (stamm) {
          if (stamm === stammverbund.name) {
            console.log('den Namen gibbet schon als Stamm');
            benno = true
          }
        });

        if (benno) {
          req.flash('warning', 'Es existiert bereits eine Klasse mit diesem Namen');
          res.redirect('/');
          return;
        }



        Stammverbund.
          findOne({ name: stammverbund.name }).
          exec(function (err2, stammi) {

            if (stammi) {
              req.flash('warning', 'Es existiert bereits ein Klassenverbund mit diesem Namen');
              res.redirect('/');
              return;
            }

            stammverbund.save(function (err, saved_verbund) {

              if (err) {
                console.log(err);
                return;
              } else {

                School.findByIdAndUpdate(user.school._id,
                  { $push: { stammverbunds: saved_verbund } },
                  { safe: true, upsert: true },
                  function (err, updated_school) {
                    if (err) {
                      console.log(err);
                    } else {

                      Stamm.find().where('_id').in(jo).exec((err, stamms) => {

                        stamms.forEach(function (stamm) {
                          console.log('record :   ' + stamm.name);

                          Stammverbund.findByIdAndUpdate(saved_verbund._id,
                            { $push: { stamms: stamm } },
                            { safe: true, upsert: true },
                            function (err, uptdatedStammverbund) {
                              if (err) {
                                console.log(err);
                              } else {

                              }
                            }
                          )
                        })

                        req.flash('success', 'Verbund gespeichert');
                        res.redirect('/');

                        return

                      })
                    }
                  });
              }
            })
          })
      })
  })































// 
router.post("/edit_stammverbund/:id", upload.array("files"), (req, res) => {
  if (!req.user) {  //wer nicht angemeldet ist, kann nicht speichern
    req.flash('warning', 'Du bist nicht angemeldet');
    res.redirect('/');
    return
  }



  if (!req.body.stamms) { // Wenn man kein Stamms auswählt kann man (hier) nicht speichern
    req.flash('warning', 'Du hast keine Klassen ausgewählt. ');
    res.redirect('/');
    return
  }




  User.
    findOne({ _id: req.user.id }).
    populate('school').
    exec(function (err2, user) {
      if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);






      req.body.stamms.forEach(function (stamm) {//alle adressaten werden in einen Array gesteckt
        console.log('fifi:   ' + stamm);

      });


      console.log('req.body.name:   ' + req.body.name);


      let stammverbund = {};
      stammverbund.name = req.body.name;
      stammverbund.stamms = req.body.stamms;






      var benno = false
      user.school.stamms.forEach(function (stamm) {
        if (stamm === stammverbund.name) {
          console.log('den Namen gibbet schon als Stamm');
          benno = true
        }
      });

      if (benno) {
        req.flash('warning', 'Es existiert bereits eine Klasse mit diesem Namen');
        res.redirect('/');
        return;
      }



      Stammverbund.
        findOne({ name: stammverbund.name }).
        exec(function (err2, stammi) {

          if (stammi && req.params.id.toString() !== stammi._id.toString()) {
            req.flash('warning', 'Es existiert bereits ein Klassenverbund mit diesem Namen');
            res.redirect('/');
            return;
          }


          console.log('lalalalalalala');

          Stammverbund.update({ _id: req.params.id }, stammverbund, function (err, willi) {
            if (err) {
              console.log(err);
              return;
            } else {
              req.flash('success', 'Verbund gespeichert');
              res.redirect('/');
              return
            }


          })


        });

    })


})























































router.get('/stammverbunds/:id', function (req, res) {

  Stammverbund.
    findOne({ _id: req.params.id }).
    populate('stamms').
    exec(function (err2, stammverbund) {

      if (err2) return console.log('iiiiiiiiihhhiiiiiiiii ' + err2);
      if (!stammverbund) {

        console.log('Der Klassenverbund existiert nicht')
        req.flash('danger', 'Die Klassenverbund existiert nicht');
        res.redirect('/');
        return;

      }
      console.log('111:   ' + req.user.type)
      console.log('222:   ' + req.user.school)
      console.log('333:   ' + stammverbund.school)


      res.render('stammverbund', {
        stammverbund: stammverbund,

      })





    });

});


























// Delete Article
router.delete('/stammverbund/:id', function (req, res) {

  console.log('drinn')
  if (!req.user._id) {

    res.status(500).send();

  }

  Stammverbund.
    findOne({ _id: req.params.id }).
    populate('school').
    exec(function (err2, stammverbund) {

      if (req.user.type !== 'admin' || req.user.school.toString() !== stammverbund.school._id.toString()) {

        console.log('nicht berechtigt zum löschen');
        console.log('nicht berechtigt zum löschen ' + req.user.type);
        console.log('nicht berechtigt zum löschen ' + req.user.school.toString());
        console.log('nicht berechtigt zum löschen ' + stammverbund.school._id.toString());

        res.status(500).send();

      } else {

        console.log('-------- ' + stammverbund.name);
        console.log('-------- ' + stammverbund.school._id);

        var ooo = stammverbund.school._id
        console.log('-jjj--- ' + ooo);

        School.findOne({ _id: stammverbund.school._id }).
          exec(function (err2, school) {
            console.log('-bennobenno--- ' + school.name);

            let query = { _id: req.params.id }

            Stammverbund.remove(query, function (err) {
              if (err) {
                console.log(err);
              }


              school.stammverbunds.pull(stammverbund);
              school.save(function (err, updated_school) {

                if (err) {
                  console.log(err);
                  return;
                } else {
                  res.send('success');
                }

              })


            });

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
    res.redirect('/');
  }

}



module.exports = router;
