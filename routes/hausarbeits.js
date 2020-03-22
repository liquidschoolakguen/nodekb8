const express = require('express');
const router = express.Router();
const path = require('path');

const fs = require('fs');








//User model
let User = require('../models/user');

// Bring in Article Model
let Article = require('../models/article');
let Hausarbeits = require('../models/hausarbeit');






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


router.post(
  "/upload",
  upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {

    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, "../uploads/" + req.user._id + "_" + Date.now() + path.extname(req.file.originalname).toLowerCase());
    console.log('bennoYYY ' + targetPath);
    if (path.extname(req.file.originalname).toLowerCase() == ".png" || path.extname(req.file.originalname).toLowerCase() == ".jpg") {
      fs.rename(tempPath, targetPath, err => {
        if (err) return handleError(err, res);

        res.render('add_article', {
          title: 'Add Articles',
          image: targetPath
        })
      });
    } else {
      fs.unlink(tempPath, err => {
        if (err) return handleError(err, res);

        res
          .status(403)
          .contentType("text/plain")
          .end("Only .png files are allowed!");
      });
    }
  }
);



router.get('/uploads/:id', (req, res) => {

  res.sendFile(path.join(__dirname, '../uploads/' + req.params.id));
});






router.post("/add", upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {




    console.log('da is was');

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
      console.log(start.toLocaleDateString('de-DE'));


      var nau = start.getDate() + '.' + start.getMonth() + '.' + start.getFullYear() + ', ' + start.getHours() + '.' + start.getMinutes() + ' Uhr';

      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      var today = new Date();

      console.log(today.toLocaleDateString("de-AT", options)); // Saturday, September 17, 20


      article.created = nau;



      console.log('article.body ' + article.body);


      if (typeof req.file !== 'undefined') {


        const tempPath = req.file.path;
        const targetBasename = req.user._id + "_" + Date.now() + path.extname(req.file.originalname).toLowerCase();
        const targetPath = path.join(__dirname, "../uploads/" + targetBasename);


        console.log('bennoYYY ' + targetPath);
        if (path.extname(req.file.originalname).toLowerCase() == ".png" || path.extname(req.file.originalname).toLowerCase() == ".jpg" || path.extname(req.file.originalname).toLowerCase() == ".txt") {
          fs.rename(tempPath, targetPath, err => {
            if (err) return handleError(err, res);



          });



          article.material = targetBasename;



        } else {
          fs.unlink(tempPath, err => {
            if (err) return handleError(err, res);



          });
        }




      } else {

        console.log('kein upload ' + req.body.title);

      }









      article.save(function (err) {

        if (err) {
          console.log(err);
          return;
        } else {
          console.log('ADDED ' + article.author);
          console.log('ADDED ' + article.lehrer);
          req.flash('success', 'Article Added');
          res.redirect('/');
        }
      })
    }








  }
);


















router.post("/add_hausarbeit", upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {




    console.log('da is was');

 
    req.checkBody('body', 'Du hast keinen AUftrag erteilt').notEmpty();

    // get Errrors
    let errors = req.validationErrors();

    if (errors) {
      res.render('add_article', {
        title: 'Add Article',
        errors: errors
      });
    } else {


      let hausaufgabe = new Hausaufgabe();
      hausaufgabe.article = req.body.article_id;
      hausaufgabe.schueler = req.user._id;
      hausaufgabe.status = '1';
      hausaufgabe.body = req.body.body;


      const start = new Date();
      console.log(start.toLocaleDateString('de-DE'));
      var nau = start.getDate() + '.' + start.getMonth() + '.' + start.getFullYear() + ', ' + start.getHours() + '.' + start.getMinutes() + ' Uhr';
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      var today = new Date();
      console.log(today.toLocaleDateString("de-AT", options)); // Saturday, September 17, 20

      hausaufgabe.created = nau;



      console.log('hausaufgabe.body ' + hausaufgabe.body);


    


      hausaufgabe.save(function (err) {

        if (err) {
          console.log(err);
          return;
        } else {
          console.log('ADDED ' + hausaufgabe.schueler);
          console.log('ADDED ' + hausaufgabe.article);
          req.flash('success', 'Article Added');
          res.redirect('/');
        }
      })
    }








  }
);


































// Add Route
router.get('/add', ensureAuthenticated, function (req, res) {
  res.render('add_article', {
    title: 'Add Articles'
  })

});










// Load edit form
router.get('/edit/:id', ensureAuthenticated, function (req, res) {
  Article.findById(req.params.id, function (err, article) {
    // stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]

    //console.log('im edit article');
    //console.log(article);
    if (article.author != req.user._id) {
      console.log('redirect');
      req.flash('danger', 'not authorized');
      res.redirect('/');
      return;

    } else {
      console.log('ok');

    }

    res.render('edit_article', {
      title: 'Edit Article',
      article: article
    });
  });
});

// Update submit POST route
router.post('/edit/:id', function (req, res) {



  let query = { _id: req.params.id }


  Article.findById(req.params.id, function (err, articleX) {

    if (err) {
      console.log('wwwwww');
      console.log(err);
    }


    let article = {};
    article.title = req.body.title;
    article.author = articleX.author;
    article.klasse = req.body.klasse;
    article.fach = req.body.fach;
    article.termin = req.body.termin;
    article.body = req.body.body;


    Article.update(query, article, function (err) {
      if (err) {
        console.log(err);
        return;
      } else {
        req.flash('success', 'Article Updated');
        res.redirect('/');
      }
    })

  })
});

// Delete Article
router.delete('/:id', function (req, res) {
  if (!req.user._id) {

    res.status(500).send();

  }

  let query = { _id: req.params.id }

  Article.findById(req.params.id, function (err, article) {
    if (article.author != req.user._id) {

      res.status(500).send();

    } else {

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
      if (err) return console.log('iiiiiiiiiiiiiiiiiii ' + err);
      console.log('The author is %s', article);

      var x = article.body.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
      //console.log('x ' + x);


      res.render('article', {
        article: article,
        x: x
      });


    });



  /* 
    Article.findById(req.params.id, function (err, article) {
  
  
      if (!article) {
  
      
        req.flash('warning', 'Diese Hausaufgabe wurde eben gelöscht');
        res.redirect('/');
        
      }else{
  
        User.findById(article.author, function (err, user) {
  
          //console.log('article.materialX ' + article.material);
    
    
         
          var x = article.body.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
          //console.log('x ' + x);
    
       
            res.render('article', {
              article: article,
              author: user.name,
              x: x
            });
    
          
    
          });
  
      }
  
  
    }); */



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
