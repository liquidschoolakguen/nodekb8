const express = require('express');
const router = express.Router();
const path = require('path');

const fs = require('fs');






//User model
let User = require('../models/user');
let Article = require('../models/article');
let Hausarbeit = require('../models/hausarbeit');
let School = require('../models/school');
let Stammverbund = require('../models/stammverbund');
let Stamm = require('../models/stamm');
let Disziplin = require('../models/disziplin');

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





// Add School
router.get('/add', ensureAuthenticated, function (req, res) {





  res.render('add_school', {
    title: 'Add School',



  })

});





// Add single_stamm
router.get('/add_single_stamm', ensureAuthenticated, function (req, res) {

  res.render('add_single_stamm', {
    title: 'Add Klasse',
  })

});




// Add single_stamm
router.get('/add_single_disziplin', ensureAuthenticated, function (req, res) {

  res.render('add_single_disziplin', {
    title: 'Add Disziplin',
  })

});














// Edit article form
router.get('/edit1/:id', ensureAuthenticated, function (req, res) {

  console.log('drin! edit 1')

  School.
    findOne({ _id: req.params.id }).
    populate('admin').
    populate('users').
    exec(function (err2, school) {
      if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);


      res.render('edit_school_stammdaten', {
        school: school

      });

    });

});






// Edit article form
router.get('/edit2/:id', ensureAuthenticated, function (req, res) {

  console.log('drin! edit 2')

  School.
    findOne({ _id: req.params.id }).
    populate('admin').
    populate('users').
    exec(function (err2, school) {
      if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);


      res.render('edit_school_schluessel', {
        school: school

      });

    });

});




// Edit article form
router.get('/edit3/:id', ensureAuthenticated, function (req, res) {

  console.log('drin! edit 3')

  School.
    findOne({ _id: req.params.id }).
    populate('admin').
    populate('users').
    exec(function (err2, school) {
      if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);



      res.render('edit_school_stamms', {
        school: school

      });

    });

});







// Edit article form
router.get('/edit4/:id', ensureAuthenticated, function (req, res) {

  console.log('drin! edit 4')

  School.
    findOne({ _id: req.params.id }).
    populate('admin').
    populate('users').
    exec(function (err2, school) {
      if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);


      res.render('edit_school_fachs', {
        school: school

      });

    });

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
      populate('school').
      exec(function (err2, user) {
        if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);






        req.body.stamms.forEach(function (stamm) {//alle adressaten werden in einen Array gesteckt
          console.log('fifi:   ' + stamm);

        });



        let stammverbund = new Stammverbund();
        stammverbund.name = req.body.name;
        stammverbund.stamms = req.body.stamms;
        stammverbund.school = user.school;




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

                    }
                  });




                req.flash('success', 'Verbund gespeichert');
                res.redirect('/');

                return


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
router.post("/add_single_stamm", upload.single("file"), (req, res) => {
  User.findOne({ _id: req.user._id }).
    populate('school').
    exec(function (err, user) {
      if (err) throw err;
      if (!user) {
        return
      }

      Stamm.findOne({ 
        $and: [
          {  name: req.body.name  },
          {  school: user.school  }
        ]
      }, function (err, gibbet_schon) {
        if (err) throw err;
        if (gibbet_schon) {
          req.flash('danger', 'Deine Schule hat bereits eine Klasse mit diesem Namen');
          res.redirect('/');
          return
        }

        let stamm = new Stamm();
        stamm.name = req.body.name;
        stamm.school = user.school;
        stamm.save(function (err, stammi) {
          user.school.s_stamms.push(stamm)
          user.school.save(function (err, updated_school) { })
        })

        req.flash('success', 'Klasse hinzugefügt');
        res.redirect('/');
      });
    })
})








// 
router.post("/add_single_disziplin", upload.single("file"), (req, res) => {
  User.findOne({ _id: req.user._id }).
    populate('school').
    exec(function (err, user) {
      if (err) throw err;
      if (!user) {
        return
      }

      Disziplin.findOne({ name: req.body.name }, function (err, gibbet_schon) {
        if (err) throw err;
        if (gibbet_schon) {
          req.flash('danger', 'Deine Schule hat bereits ein Unterrichtsfach mit diesem Namen');
          res.redirect('/');
          return
        }

        let disziplin = new Disziplin();
        disziplin.name = req.body.name;
        disziplin.school = user.school;
        disziplin.save(function (err, disziplini) {
          user.school.s_disziplins.push(disziplin)
          user.school.save(function (err, updated_school) { })
        })

        req.flash('success', 'Unterrichtsfach hinzugefügt');
        res.redirect('/');
      });
    })
})
























// 
router.post("/add", upload.single("file" /* name attribute of <file> element in your form */), (req, res) => {



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











    school.save(function (err, scho) {

      if (err) {
        console.log(err);
        return;
      } else {







        var mySet2 = new Set();
        req.body.fstamm.forEach(function (stamm) {
          if (stamm.trim()) {
            mySet2.add(stamm);
          }
        });

        mySet2.forEach(function (value) {
          let stamm = new Stamm();
          stamm.name = value;
          stamm.school = scho;
          stamm.save(function (err, sta) { })
        });





        var mySet = new Set();
        req.body.ffach.forEach(function (disziplin) {
          if (disziplin.trim()) {
            mySet.add(disziplin);
          }
        });

        mySet.forEach(function (value) {
          let disziplin = new Disziplin();
          disziplin.name = value;
          disziplin.school = scho;
          disziplin.save(function (err, fac) { })
        });





        let userB = {};
        userB.school = scho;


        User.findByIdAndUpdate(user._id, userB,
          function (err, uptdatedAdmin) {
            if (err) {
              console.log(err);
            } else {


              scho.users.push(uptdatedAdmin);
              scho.save(function (err, updated_school) { })


              Disziplin.
                find({ school: scho }).
                exec(function (err, disziplins) {

                  Stamm.
                    find({ school: scho }).
                    exec(function (err, stamms) {

                      disziplins.forEach(function (disziplin) {
                        console.log('Disziplin:::   ' + disziplin.name);
                        scho.s_disziplins.push(disziplin)
                        scho.save(function (err, updated_school) { })
                      })

                      stamms.forEach(function (stamm) {
                        console.log('Klassen (Fotzen):::   ' + stamm.name);
                        scho.s_stamms.push(stamm)
                        scho.save(function (err, updated_school) { })
                      })



                      req.flash('success', 'Fast geschafft. Nun braucht deine Schule noch drei Schlüssel, damit sie über Liquidschool erreichbar ist ');
                      res.redirect('add_2');

                    });
                });
            }
          });
      }
    })
  });









})











// 
router.post("/add_2", upload.single("file" /* name attribute of <file> element in your form */), (req, res) => {
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









});


























// Update submit POST route
router.post("/edit1/:id", upload.single("file" /* name attribute of <file> element in your form */), (req, res) => {

  let query = { _id: req.params.id }

  let school = {};
  school.name = req.body.name;
  school.plz = req.body.plz;
  school.ort = req.body.ort;

  School.update(query, school, function (err) {
    if (err) {
      console.log(err);
      return;
    } else {
      req.flash('success', 'Stammdaten geändert');
      res.redirect('/');
    }
  })

});






// Update submit POST route
router.post("/edit2/:id", upload.single("file" /* name attribute of <file> element in your form */), (req, res) => {

  let query = { _id: req.params.id }

  console.log('hhaalloo')
  console.log('hhaalloo: ' + req.params.id)



  let school = {};
  school.admin_schluessel = req.body.admin_schluessel.toLowerCase().trim();;
  school.lehrer_schluessel = req.body.lehrer_schluessel.toLowerCase().trim();;
  school.schueler_schluessel = req.body.schueler_schluessel.toLowerCase().trim();;

  School.update(query, school, function (err) {
    if (err) {
      console.log(err);
      return;
    } else {
      req.flash('success', 'Schulschlüssel geändert');
      res.redirect('/');
    }
  })

});









// Update submit POST route
router.post("/edit3/:id", upload.single("file" /* name attribute of <file> element in your form */), (req, res) => {

  let query = { _id: req.params.id }

  console.log('hhaalloo')
  console.log('hhaalloo: ' + req.params.id)

  let school = {};


  var mySet = new Set();
  var jo2 = []

  var ii = 0;
  req.body.fstamm.forEach(function (stamm) {
    if (stamm.trim()) {
      console.log('stamm        :      ' + ii + '        ' + stamm + '      ');
      //jo2.push(stamm);
      mySet.add(stamm);
    }
    ii++;
  });
  // console.log('pup2        :      ' + jo2.length);


  mySet.forEach(function (value) {
    // console.log(value);
    jo2.push(value);
  });

  school.stamms = jo2;







  School.update(query, school, function (err) {
    if (err) {
      console.log(err);
      return;
    } else {
      req.flash('success', 'Klassen geändert');
      res.redirect('/');
    }
  })

});















// Update submit POST route
router.post("/edit4/:id", upload.single("file" /* name attribute of <file> element in your form */), (req, res) => {

  let query = { _id: req.params.id }

  console.log('hhaalloo')
  console.log('hhaalloo: ' + req.params.id)

  let school = {};


  var mySet = new Set();
  var jo2 = []

  var ii = 0;
  req.body.ffach.forEach(function (fach) {
    if (fach.trim()) {
      console.log('fach        :      ' + ii + '        ' + fach + '      ');
      //jo2.push(fach);
      mySet.add(fach);

    }
    ii++;
  });
  //console.log('pup2        :      ' + jo2.length);

  mySet.forEach(function (value) {
    // console.log(value);
    jo2.push(value);
  });


  school.fachs = jo2;





  School.update(query, school, function (err) {
    if (err) {
      console.log(err);
      return;
    } else {
      req.flash('success', 'Klassen geändert');
      res.redirect('/');
    }
  })

});












router.get('/stamms/:id', function (req, res) {
  Stamm.
    findOne({ _id: req.params.id }).
    populate({
      path: 'school',
      populate: {
        path: 'users',
        populate: {
          path: 'lehrers_auftrags'
        }
      }
    }).
    exec(function (err2, stamm) {
      console.log('stamm:    ' + stamm.name)
      console.log('school:    ' + stamm.school.name)
      stamm.school.users.forEach(function (user) {
        console.log('user / type:    ' + user.name + ' / ' + user.type)

      });

      res.render('stamm', {
        stamm: stamm
      })
    });
});





router.get('/disziplins/:id', function (req, res) {
  Disziplin.
    findOne({ _id: req.params.id }).
    populate({
      path: 'school',
      populate: {
        path: 'users',
        populate: {
          path: 'lehrers_auftrags'
        }
      }
    }).
    exec(function (err2, disziplin) {
      console.log('disziplin:    ' + disziplin.name)
      console.log('school:    ' + disziplin.school.name)
      disziplin.school.users.forEach(function (user) {
        console.log('user / type:    ' + user.name + ' / ' + user.type)

      });

      res.render('disziplin', {
        disziplin: disziplin
      })
    });
});









router.get('/stammverbunds/:id', function (req, res) {

  Stammverbund.
    findOne({ _id: req.params.id }).
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








// Delete Stamm
router.delete('/stamm/:id', function (req, res) {

  console.log('drinn')
  if (!req.user._id) {

    res.status(500).send();

  }

  Stamm.
    findOne({ _id: req.params.id }).
    populate('school').
    exec(function (err2, stamm) {

      if (req.user.type !== 'admin' || req.user.school.toString() !== stamm.school._id.toString()) {

        console.log('nicht berechtigt zum löschen');
        console.log('nicht berechtigt zum löschen ' + req.user.type);
        console.log('nicht berechtigt zum löschen ' + req.user.school.toString());
        console.log('nicht berechtigt zum löschen ' + stamm.school._id.toString());

        res.status(500).send();

      } else {

        console.log('-------- ' + stamm.name);
        console.log('-------- ' + stamm.school._id);

        var ooo = stamm.school._id
        console.log('-jjj--- ' + ooo);

        School.findOne({ _id: stamm.school._id }).
          exec(function (err2, school) {
            console.log('-bennobenno--- ' + school.name);

            let query = { _id: req.params.id }

            Stamm.remove(query, function (err) {
              if (err) {
                console.log(err);
              }


              school.s_stamms.pull(stamm);
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








// Delete Stamm
router.delete('/disziplin/:id', function (req, res) {

  console.log('drinn')
  if (!req.user._id) {

    res.status(500).send();

  }

  Disziplin.
    findOne({ _id: req.params.id }).
    populate('school').
    exec(function (err2, disziplin) {

      if (req.user.type !== 'admin' || req.user.school.toString() !== disziplin.school._id.toString()) {

        console.log('nicht berechtigt zum löschen');
        console.log('nicht berechtigt zum löschen ' + req.user.type);
        console.log('nicht berechtigt zum löschen ' + req.user.school.toString());
        console.log('nicht berechtigt zum löschen ' + disziplin.school._id.toString());

        res.status(500).send();

      } else {

        console.log('-------- ' + disziplin.name);
        console.log('-------- ' + disziplin.school._id);

        var ooo = disziplin.school._id
        console.log('-jjj--- ' + ooo);

        School.findOne({ _id: disziplin.school._id }).
          exec(function (err2, school) {
            console.log('-bennobenno--- ' + school.name);

            let query = { _id: req.params.id }

            Disziplin.remove(query, function (err) {
              if (err) {
                console.log(err);
              }


              school.s_disziplins.pull(disziplin);
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
