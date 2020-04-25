const express = require('express');
const router = express.Router();






//User model
let School = require('../models/school');
let Disziplin = require('../models/disziplin');
let User = require('../models/user');


const multer = require("multer");


const upload = multer({
  dest: "../uploads"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});




// Add single_stamm
router.get('/add_single_disziplin', ensureAuthenticated, function (req, res) {

  res.render('add_single_disziplin', {
    title: 'Add Disziplin',
  })

});










// get

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// post








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
