const express = require('express');
const router = express.Router();

let User = require('../models/user');
let School = require('../models/school');
let Stamm = require('../models/stamm');
let Stammverbund = require('../models/stammverbund');


const multer = require("multer");


const upload = multer({
  dest: "../uploads"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});




// Add single_stamm
router.get('/add_single_stamm', ensureAuthenticated, function (req, res) {

  res.render('add_single_stamm', {
    title: 'Add Klasse',
  })

});







// get

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// post





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
          { name: req.body.name },
          { school: user.school }
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


                  Stammverbund.find({ stamms: stamm }).
                    populate('stamms').
                    exec(function (err2, verbunds) {


                      verbunds.forEach(function (verbund) {
                        console.log('record :   ' + verbund.name);



                        Stammverbund.findOne({ _id: verbund._id }).
                          populate('stamms').
                          exec(function (err2, ver) {




                            ver.stamms.pull(stamm);
                            console.log('kkkkkkkk     '+ver.stamms.length);
                            if (ver.stamms.length > 0) {
                              ver.save(function (err, updated_ver) {
                                if (err) {
                                  console.log(err);
                                  return;
                                } else { }
                              })
                            } else {// wenn keine Stamms mehr im Stammverbund sind, dann lösche den Stammverbund gleich mit
                              let query = { _id: ver._id }
                              Stammverbund.remove(query, function (err) {
                                if (err) {
                                  console.log(err);
                                }
                              })
                            }


                          })

                      })

                      res.send('success');




                    })


                }



              })

            })


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
