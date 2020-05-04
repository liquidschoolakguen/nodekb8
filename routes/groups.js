const express = require('express');
const router = express.Router();







//User model
let User = require('../models/user');
let School = require('../models/school');
let Group = require('../models/group');

const multer = require("multer");


const upload = multer({
  dest: "../uploads"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});



// 
router.get('/add_group', ensureAuthenticated, function (req, res) {
  User.
    findOne({ _id: req.user.id }).
    populate({
      path: 'school',
      populate: {
        path: 's_stamms',
        populate: {
          path: 'schuelers',
        }
      }
    }).
    exec(function (err2, user) {
      if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);
      res.render('change/add_group', {
        user: user
      })
    });
});





router.get('/add_group_x', ensureAuthenticated, function (req, res) {
  User.
    findOne({ _id: req.user.id }).
    populate({
      path: 'school',
      populate: {
        path: 's_stamms',
        populate: {
          path: 'schuelers',
        }
      }
    }).
    exec(function (err2, user) {
      if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);
      res.render('change/add_group_x', {
        user: user
      })
    });
});








router.get('/all_groups_l', function (req, res) {


  User.
    findOne({ _id: req.user.id }).
    populate({
      path: 'school',
      populate: {
        path: 'groups',
        populate: {
          path: 'schuelers',
        }

      }
    }).
    exec(function (err, user) {
      if (err) return console.log('4_iiiiiiiiiiii ' + err);
      var benno = user.school.groups;

      User.
        findOne({ _id: req.user.id }).
        populate({
          path: 'lehrers_groups',
          populate: {
            path: 'schuelers'
          }
        }).
        exec(function (err, user) {
          benno.push(...user.lehrers_groups);
          res.render('show/all_groups', {
            groups: benno
          });

        })

    });

});








router.get('/all_groups_a', function (req, res) {

  User.
    findOne({ _id: req.user.id }).
    populate({
      path: 'school',
      populate: {
        path: 'groups',
        populate: {
          path: 'schuelers',
        }
      }
    }).
    exec(function (err, user) {
      if (err) return console.log('4_iiiiiiiiiiii ' + err);
      var benno = user.school.groups;

      res.render('show/all_groups', {
        groups: benno
      });



    });

});















/* 

router.get('/all_groups', function (req, res) {


 Group.
   find().
   populate('schuelers').
   exec(function (err, groups) {
     if (err) return console.log('4_iiiiiiiiiiii ' + err);
  
 
         res.render('show/all_groups', {
           groups: groups
         });

     

   });

});
*/






// Edit group form
router.get('/edit/:id', ensureAuthenticated, function (req, res) {


  User.
    findOne({ _id: req.user.id }).
    populate({
      path: 'school',
      populate: {
        path: 's_stamms',
        populate: {
          path: 'schuelers',
        }
      }
    }).
    exec(function (err2, user) {
      if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);


      Group.
        findOne({ _id: req.params.id }).
        populate('schuelers').
        exec(function (err2, group) {
          if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);

          //console.log('NEU');



          user.school.s_stamms.forEach(function (stamm) {
            console.log(' ---all_stammr: ' + stamm.name);
            stamm.schuelers.forEach(function (schueler) {
              console.log(' -schueler: ' + schueler.name);
            });
          });


          console.log('- - - - - - - - - - - - - - - ');

          group.schuelers.forEach(function (his_user) {
            console.log('group_schueler: ' + his_user.name);
          });






          var all_stamms = user.school.s_stamms;
          var his = group.schuelers;


          all_stamms.forEach(function (stamm) {
            console.log(' ---all_stammr: ' + stamm.name);


            stamm.schuelers.forEach(function (user) {
              console.log(' -schueler: ' + user.name);


              his.forEach(function (his_user) {
                // console.log('ein all-schüler: ' + all_schueler.name + ' / ' + all_schueler._id);
                if (user._id.toString() === his_user._id.toString()) {
                  //console.log('ein arti-schüler: ' + arti_schueler.name + ' / ' + arti_schueler._id);
                  user.article_token = true
                }
              });




            });


          });



          res.render('change/edit_group', {
            s_stamms: all_stamms,
            group: group
          });





        });


    });

});
























// get

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// post



/* 
// 
router.post("/add_group", upload.array("files"),
  (req, res) => {
    if (!req.user) {  //wer nicht angemeldet ist, kann nicht speichern
      req.flash('warning', 'Du bist nicht angemeldet');
      res.redirect('/');
      return
    }

    if (!req.body.users) { // Wenn man kein Users auswählt kann man (hier) nicht speichern
      req.flash('warning', 'Du hast keine Klassen ausgewählt. ');
      res.redirect('/');
      return
    }



    User.
      findOne({ _id: req.user.id }).
      populate({
        path: 'school',
        populate: {
          path: 's_users'
        }
      }).
      exec(function (err2, user) {
        if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);


        var jo = []
        var ii = 0;
        req.body.users.forEach(function (user_id) {//alle adressaten werden in einen Array gesteckt
          console.log('fifi:   ' + user_id);
          jo.push(user_id);
          ii++;
        });



        let group = new Group();
        group.name = req.body.name;
        //group.users = req.body.users;
        group.school = user.school;


        var benno = false
        user.school.s_users.forEach(function (user) {
          if (user === group.name) {
            console.log('den Namen gibbet schon als User');
            benno = true
          }
        });

        if (benno) {
          req.flash('warning', 'Es existiert bereits eine Klasse mit diesem Namen');
          res.redirect('/');
          return;
        }



        Group.
          findOne({ name: group.name }).
          exec(function (err2, useri) {

            if (useri) {
              req.flash('warning', 'Es existiert bereits ein Klassenverbund mit diesem Namen');
              res.redirect('/');
              return;
            }

            group.save(function (err, saved_group) {

              if (err) {
                console.log(err);
                return;
              } else {

                School.findByIdAndUpdate(user.school._id,
                  { $push: { groups: saved_group } },
                  { safe: true, upsert: true },
                  function (err, updated_school) {
                    if (err) {
                      console.log(err);
                    } else {

                      User.find().where('_id').in(jo).exec((err, users) => {

                        users.forEach(function (user) {
                          console.log('record :   ' + user.name);

                          Group.findByIdAndUpdate(saved_group._id,
                            { $push: { users: user } },
                            { safe: true, upsert: true },
                            function (err, uptdatedGroup) {
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



 */








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
















// Update submit POST route
router.post("/edit/:id", upload.array("files" /* name attribute of <file> element in your form */),
  (req, res) => {
    var name = req.body.name.trim();
    if (!req.user) {  //wer nicht angemeldet ist, kann nicht speichern
      req.flash('warning', 'Du bist nicht angemeldet');
      res.redirect('login');
      return
    }

    if (!req.body.schuelers) { // Wenn man kein SuS auswählt kann man (hier) nicht speichern
      req.flash('warning', 'Du hast keine SchülerInnen ausgewählt. ');
      res.redirect('/');
      return
    }


    var jo = []
    var ii = 0;
    req.body.schuelers.forEach(function (user) {
      jo.push(user);
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



        Group.
          findOne({ _id: req.params.id }).
          populate('schuelers').
          populate('school').
          exec(function (err2, group) {
            if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);


            group.schuelers.forEach(function (user) {
              //console.log('record :   ' + schueler.name);

              Group.findByIdAndUpdate(group._id,
                { $pull: { schuelers: user } },
                { upsert: true, save: true },
                function (err, uptdatedGroup) {
                  if (err) throw err;
                });
            });// alte Verknüpfungen werden gelöst




            //neue Verknüpfungen
            User.find().where('_id').in(jo).exec((err, users) => {

              users.forEach(function (user) {
                //console.log('record :   ' + schueler.name);
                Group.findByIdAndUpdate(group._id,
                  { $push: { schuelers: user } },
                  { safe: true, upsert: true },
                  function (err, uptdatedGroup) {
                    if (err) throw err;
                  });
              });//ende loop
            });



            let query = { _id: req.params.id }
            Group.findById(req.params.id, function (err, verbundX) {
              if (err) throw err;





              Group.findOne({
                $or: [
                  { $and: [{ name: name }, { school: user.school }] },
                  { $and: [{ name: name }, { lehrer: user }] }
                ]
              }, function (err, gibbet_schon) {
                if (err) throw err;

                if (gibbet_schon) {
                  if (gibbet_schon._id.toString() !== req.params.id.toString()) {
                    req.flash('danger', 'Deine Schule hat bereits eine Schülergruppe mit diesem Namen');
                    res.redirect('/');
                    return
                  } else {
                    res.redirect('/');
                    return
                  }
                }



                let groupi = {};
                groupi.name = name;

                Group.update(query, groupi, function (err, groupiiii) {
                  if (err) throw err;
                  req.flash('success', 'Schülergruppe geändert geändert');
                  res.redirect('/');
                  return
                })









              })






            })

          });
      });
  });































// 
router.post("/edit_group/:id", upload.array("files"), (req, res) => {
  if (!req.user) {  //wer nicht angemeldet ist, kann nicht speichern
    req.flash('warning', 'Du bist nicht angemeldet');
    res.redirect('/');
    return
  }



  if (!req.body.users) { // Wenn man kein Users auswählt kann man (hier) nicht speichern
    req.flash('warning', 'Du hast keine Klassen ausgewählt. ');
    res.redirect('/');
    return
  }




  User.
    findOne({ _id: req.user.id }).
    populate('school').
    exec(function (err2, user) {
      if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);






      req.body.users.forEach(function (user) {//alle adressaten werden in einen Array gesteckt
        console.log('fifi:   ' + user);

      });


      console.log('req.body.name:   ' + req.body.name);


      let group = {};
      group.name = req.body.name;
      group.users = req.body.users;






      var benno = false
      user.school.users.forEach(function (user) {
        if (user === group.name) {
          console.log('den Namen gibbet schon als User');
          benno = true
        }
      });

      if (benno) {
        req.flash('warning', 'Es existiert bereits eine Klasse mit diesem Namen');
        res.redirect('/');
        return;
      }



      Group.
        findOne({ name: group.name }).
        exec(function (err2, useri) {

          if (useri && req.params.id.toString() !== useri._id.toString()) {
            req.flash('warning', 'Es existiert bereits ein Klassenverbund mit diesem Namen');
            res.redirect('/');
            return;
          }


          console.log('lalalalalalala');

          Group.update({ _id: req.params.id }, group, function (err, willi) {
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























































router.get('/:id', function (req, res) {
  Group.
    findOne({ _id: req.params.id }).
    populate('users').
    exec(function (err2, group) {
      if (err2) return console.log('iiiiiiiiihhhiiiiiiiii ' + err2);
      if (!group) {
        console.log('Der Klassenverbund existiert nicht')
        req.flash('danger', 'Die Klassenverbund existiert nicht');
        res.redirect('/');
        return;
      }
      res.render('show/group', {
        group: group,
      })
    });
});


























// Delete Group
router.delete('/:id', function (req, res) {

  console.log('drinn')
  if (!req.user._id) {

    res.status(500).send();

  }

  Group.
    findOne({ _id: req.params.id }).
    populate('school').
    exec(function (err2, group) {

      if (req.user.school.toString() !== group.school._id.toString()) {

        console.log('nicht berechtigt zum löschen');
        console.log('nicht berechtigt zum löschen ' + req.user.school.toString());
        console.log('nicht berechtigt zum löschen ' + group.school._id.toString());

        res.status(500).send();

      } else {

        console.log('-------- ' + group.name);
        console.log('-------- ' + group.school._id);

        var ooo = group.school._id
        console.log('-jjj--- ' + ooo);

        School.findOne({ _id: group.school._id }).
          exec(function (err2, school) {
            console.log('-bennobenno--- ' + school.name);

            let query = { _id: req.params.id }

            Group.remove(query, function (err) {
              if (err) {
                console.log(err);
              }


              school.groups.pull(group);
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
