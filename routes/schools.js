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


const upload = multer({
  dest: "../uploads"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});






router.get('/add_school_a_s', ensureAuthenticated, function (req, res) {
  res.render('register_school/add_school_a_s', {
  })
})






router.get('/add_school_l_s', ensureAuthenticated, function (req, res) {
  res.render('register_school/add_school_l_s', {
  })
})



router.get('/add_school_s_s', ensureAuthenticated, function (req, res) {
  res.render('register_school/add_school_s_s', {
  })
})






// Add School
router.get('/add', ensureAuthenticated, function (req, res) {
  res.render('add_school', {
    title: 'Add School',

  })
});







// add Klassen
router.get('/add_school_stamms', ensureAuthenticated, function (req, res) {
  res.render('register_school/add_school_stamms', {
  })
});

// add Unterrichtsfächer
router.get('/add_school_disziplins', ensureAuthenticated, function (req, res) {
  res.render('register_school/add_school_disziplins', {
  })
});

// add
router.get('/add_school_logo', ensureAuthenticated, function (req, res) {
  res.render('register_school/add_school_logo', {
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


      res.render('change/edit_school_stammdaten', {
        school: school

      });

    });

});



/* 


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

 */











// Edit article form
router.get('/edit_school_a_s/:id', ensureAuthenticated, function (req, res) {

  console.log('drin! edit 2')

  School.
    findOne({ _id: req.params.id }).
    populate('admin').
    populate('users').
    exec(function (err2, school) {
      if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);


      res.render('change/edit_school_a_s', {
        school: school

      });

    });

});



// Edit article form
router.get('/edit_school_l_s/:id', ensureAuthenticated, function (req, res) {

  console.log('drin! edit 2')

  School.
    findOne({ _id: req.params.id }).
    populate('admin').
    populate('users').
    exec(function (err2, school) {
      if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);


      res.render('change/edit_school_l_s', {
        school: school

      });

    });

});



// Edit article form
router.get('/edit_school_s_s/:id', ensureAuthenticated, function (req, res) {

  console.log('drin! edit 2')

  School.
    findOne({ _id: req.params.id }).
    populate('admin').
    populate('users').
    exec(function (err2, school) {
      if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);


      res.render('change/edit_school_s_s', {
        school: school

      });

    });

});











// get

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// post


































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
                      res.redirect('add_s_s');

                    });
                });
            }
          });
      }
    })
  });









})














router.post("/add_school_stamms", upload.single("file"), (req, res) => {

  User.findOne({ _id: req.user._id }).
    populate('school').
    exec(function (err, user) {
      if (err) throw err;
      if (!user) {
        return
      }

      var mySet2 = new Set();
      req.body.fstamm.forEach(function (stamm) {
        if (stamm.trim()) {
          mySet2.add(stamm);
        }
      });
      var myArrayOfStamms = []
      mySet2.forEach(function (value) {
        let stamm = new Stamm();
        stamm.name = value;
        stamm.school = user.school;
        myArrayOfStamms.push(stamm)
      });

      Stamm.insertMany(myArrayOfStamms, (err, stamms) => {

        School.findOne({ _id: user.school._id }).
          exec(function (err, schoool) {

            Stamm.
              find({ school: schoool }).
              exec(function (err, stamms) {
                stamms.forEach(function (stamm) {
                  schoool.s_stamms.push(stamm)
                  schoool.save(function (err, updated_school) { })
                })
                schoool.complete_school = '3';
                schoool.save(function (err, updated_school) { })

                req.flash('success', 'Schulklassen gespeichert. Nun die Schulfächer. ');
                res.redirect('/');

              });
          });
      })
    });
})









router.post("/add_school_disziplins", upload.single("file"), (req, res) => {

  User.findOne({ _id: req.user._id }).
    populate('school').
    exec(function (err, user) {
      if (err) throw err;
      if (!user) {
        return
      }

      var mySet2 = new Set();
      req.body.fdisziplin.forEach(function (disziplin) {
        if (disziplin.trim()) {
          mySet2.add(disziplin);
        }
      });
      var myArrayOfDisziplins = []
      mySet2.forEach(function (value) {
        let disziplin = new Disziplin();
        disziplin.name = value;
        disziplin.school = user.school;
        myArrayOfDisziplins.push(disziplin)
      });

      Disziplin.insertMany(myArrayOfDisziplins, (err, disziplins) => {

        School.findOne({ _id: user.school._id }).
          exec(function (err, schoool) {

            Disziplin.
              find({ school: schoool }).
              exec(function (err, disziplins) {
                disziplins.forEach(function (disziplin) {
                  schoool.s_disziplins.push(disziplin)
                  schoool.save(function (err, updated_school) { })
                })
                schoool.complete_school = '5';// schullogo ausgelassen
                schoool.save(function (err, updated_school) { })

                //req.flash('success', 'Unterrichtsfächer gespeichert. Nund das Schullogo hochladen. ');
                req.flash('success', 'Unterrichtsfächer gespeichert. Nund den Schülerschlüssel. ');
                res.redirect('/');

              });
          });
      })
    });
})











// 
router.post("/add_school_s_s", upload.single("file" /* name attribute of <file> element in your form */), (req, res) => {
  User.findOne({ _id: req.user._id }).
    populate('school').
    exec(function (err, user) {
      if (err) return console.log('iiiiiiiiiiiiiiiiiii ' + err);
      if (!user) {
        return
      }


      School.findOne({ schueler_schluessel: req.body.schueler_schluessel.toLowerCase().trim() }).
        exec(function (err, sch) {
          if (err) return console.log('iiiiiiiiiiiiiiiiiii ' + err);
          if (sch) {
            req.flash('warning', 'Dieser Schülerschlüssel ist bereits vergeben. Wähle einen anderen');
            res.redirect('add_school_s_s');
            return
          }



          let updateSchool = {};
          updateSchool.complete_school = '6';
          updateSchool.schueler_schluessel = req.body.schueler_schluessel.toLowerCase().trim();

          School.update({ _id: user.school._id }, updateSchool, function (err) {
            if (err) {
              console.log(err);
              return;
            } else {
              req.flash('success', 'Schülerschlüssel wurde gespeichert. Nun der Lehrerschlüssel');
              res.redirect('/');
            }
          })


        });


    })

});












// 
router.post("/add_school_l_s", upload.single("file" /* name attribute of <file> element in your form */), (req, res) => {
  User.findOne({ _id: req.user._id }).
    populate('school').
    exec(function (err, user) {
      if (err) return console.log('iiiiiiiiiiiiiiiiiii ' + err);
      if (!user) {
        return
      }


      School.findOne({ lehrer_schluessel: req.body.lehrer_schluessel.toLowerCase().trim() }).
        exec(function (err, sch) {
          if (err) return console.log('iiiiiiiiiiiiiiiiiii ' + err);
          if (sch) {
            req.flash('warning', 'Dieser Lehrerschlüssel ist bereits vergeben. Wähle einen anderen');
            res.redirect('add_school_l_s');
            return
          }



          let updateSchool = {};
          updateSchool.complete_school = '7';
          updateSchool.lehrer_schluessel = req.body.lehrer_schluessel.toLowerCase().trim();

          School.update({ _id: user.school._id }, updateSchool, function (err) {
            if (err) {
              console.log(err);
              return;
            } else {
              req.flash('success', 'Lehrerschlüssel wurde gespeichert. Jetzt nur noch der Adminschlüssel...');
              res.redirect('/');
            }
          })
        });


    })

});













// 
router.post("/add_school_a_s", upload.single("file" /* name attribute of <file> element in your form */), (req, res) => {
  User.findOne({ _id: req.user._id }).
    populate('school').
    exec(function (err, user) {
      if (err) return console.log('iiiiiiiiiiiiiiiiiii ' + err);
      if (!user) {
        return
      }


      School.findOne({ admin_schluessel: req.body.admin_schluessel.toLowerCase().trim() }).
        exec(function (err, sch) {
          if (err) return console.log('iiiiiiiiiiiiiiiiiii ' + err);
          if (sch) {
            req.flash('warning', 'Dieser Adminschlüssel ist bereits vergeben. Wähle einen anderen');
            res.redirect('add_school_a_s');
            return
          }



          let updateSchool = {};
          updateSchool.complete_school = '8';
          updateSchool.admin_schluessel = req.body.admin_schluessel.toLowerCase().trim();

          School.update({ _id: user.school._id }, updateSchool, function (err) {
            if (err) {
              console.log(err);
              return;
            } else {
              req.flash('success', 'Adminschlüssel wurde gespeichert. Jetzt nur noch deine Registrierung als Schuladministrator.');
              res.redirect('/');


            }
          })
        });

    })

});











// 
router.post("/add_school_register_admin_first", upload.single("file" ), (req, res) => {
  User.findOne({ _id: req.user._id }).
    populate('school').
    exec(function (err, user) {
      if (err) return console.log('iiiiiiiiiiiiiiiiiii ' + err);
      if (!user) {
        return
      }


      School.findOne({ admin_schluessel: req.body.admin_schluessel.toLowerCase().trim() }).
        exec(function (err, sch) {
          if (err) return console.log('iiiiiiiiiiiiiiiiiii ' + err);
          if (sch) {
            req.flash('warning', 'Dieser Adminschlüssel ist bereits vergeben. Wähle einen anderen');
            res.redirect('add_school_a_s');
            return
          }



          let updateSchool = {};
          updateSchool.complete_school = '8';
          updateSchool.admin_schluessel = req.body.admin_schluessel.toLowerCase().trim();

          School.update({ _id: user.school._id }, updateSchool, function (err) {
            if (err) {
              console.log(err);
              return;
            } else {
              req.flash('success', 'Adminschlüssel wurde gespeichert. Jetzt nur noch deine Registrierung als Schuladministrator.');
              res.redirect('/');


            }
          })
        });




    })

});























// Update submit POST route
router.post("/edit1/:id", (req, res) => {






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




















// 
router.post("/edit_school_a_s", (req, res) => {
  User.findOne({ _id: req.user._id }).
    populate('school').
    exec(function (err, user) {
      if (err) return console.log('iiiiiiiiiiiiiiiiiii ' + err);
      if (!user) {
        return
      }
      School.findOne({ admin_schluessel: req.body.admin_schluessel.toLowerCase().trim() }).
        exec(function (err, sch) {
          if (err) return console.log('iiiiiiiiiiiiiiiiiii ' + err);
          if (sch) {
            req.flash('warning', 'Dieser Adminschlüssel ist bereits vergeben. Wähle einen anderen.');
            
            res.render('change/edit_school_a_s', {
              school: user.school
      
            });
           
            return
          }
          let updateSchool = {};
          updateSchool.admin_schluessel = req.body.admin_schluessel.toLowerCase().trim();

          School.update({ _id: user.school._id }, updateSchool, function (err) {
            if (err) {
              console.log(err);
              return;
            } else {
              req.flash('success', 'Adminschlüssel wurde geändert.');
              res.redirect('/');
            }
          })
        });

    })

});




router.post("/edit_school_l_s", (req, res) => {
  User.findOne({ _id: req.user._id }).
    populate('school').
    exec(function (err, user) {
      if (err) return console.log('iiiiiiiiiiiiiiiiiii ' + err);
      if (!user) {
        return
      }
      School.findOne({ lehrer_schluessel: req.body.lehrer_schluessel.toLowerCase().trim() }).
        exec(function (err, sch) {
          if (err) return console.log('iiiiiiiiiiiiiiiiiii ' + err);
          if (sch) {
            req.flash('warning', 'Dieser Lehrerschlüssel ist bereits vergeben. Wähle einen anderen.');
            
            res.render('change/edit_school_l_s', {
              school: user.school
      
            });
           
            return
          }
          let updateSchool = {};
          updateSchool.lehrer_schluessel = req.body.lehrer_schluessel.toLowerCase().trim();

          School.update({ _id: user.school._id }, updateSchool, function (err) {
            if (err) {
              console.log(err);
              return;
            } else {
              req.flash('success', 'Lehrerschlüssel wurde geändert.');
              res.redirect('/');
            }
          })
        });

    })

});







router.post("/edit_school_s_s", (req, res) => {
  User.findOne({ _id: req.user._id }).
    populate('school').
    exec(function (err, user) {
      if (err) return console.log('iiiiiiiiiiiiiiiiiii ' + err);
      if (!user) {
        return
      }
      School.findOne({ schueler_schluessel: req.body.schueler_schluessel.toLowerCase().trim() }).
        exec(function (err, sch) {
          if (err) return console.log('iiiiiiiiiiiiiiiiiii ' + err);
          if (sch) {
            req.flash('warning', 'Dieser Schuelerschlüssel ist bereits vergeben. Wähle einen anderen.');
            
            res.render('change/edit_school_s_s', {
              school: user.school
      
            });
           
            return
          }
          let updateSchool = {};
          updateSchool.schueler_schluessel = req.body.schueler_schluessel.toLowerCase().trim();

          School.update({ _id: user.school._id }, updateSchool, function (err) {
            if (err) {
              console.log(err);
              return;
            } else {
              req.flash('success', 'Schülerschlüssel wurde geändert.');
              res.redirect('/');
            }
          })
        });

    })

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
