const express = require('express');
const router = express.Router();

// Bring in Kollege Model
let Kollege = require('../../models/v1/kollege');

//User model
let User = require('../../models/user');

// Add Route
router.get('/add', ensureAuthenticated,  function(req, res){
  res.render('add_kollege', {
        title: 'Add Kolleges'
    })
  
});

// Add Submit POST route
router.post('/add', function(req, res){
  
  req.checkBody('title', 'Title is required').notEmpty();
  //req.checkBody('author', 'Autor is required').notEmpty();
  req.checkBody('body', 'Body is required').notEmpty();

  // get Errrors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_kollege', {
      title:'Add Kollege',
      errors:errors
    });
  } else{

    let kollege = new Kollege();
    kollege.vorname = req.body.vorname;
    kollege.nachname = req.body.vorname;
    kollege.kuerzel = req.body.vorname;
    kollege.strafpunkte = req.body.vorname;


    kollege.title= req.body.title;
    kollege.au= req.user._id;
    kollege.body= req.body.body;
    
    kollege.save(function(err){

        if(err){
            console.log(err);
            return;
        }else {
          req.flash('success', 'Kollege Added');
          res.redirect('/');
        }
    })
  }
});

// Load edit form
router.get('/edit/:id',ensureAuthenticated, function(req, res){
  Kollege.findById(req.params.id, function(err, kollege){
    

    //console.log(kollege.author);
    //console.log(req.user._id);
    if(kollege.author != req.user._id){
      console.log('redirect');
      req.flash('danger', 'not authorized');
      res.redirect('/');
      return;
      
    }else{
      console.log('ok');

    }
    
    res.render('edit_kollege', {
         title:'Edit Kollege',
         kollege:kollege
      });
  });
});

// Update submit POST route
router.post('/edit/:id', function(req, res){

    
    
    let query = {_id:req.params.id}


    Kollege.findById(req.params.id, function(err, kollegeX){
      
      if(err){
        console.log('wwwwww');
        console.log(err);
    }
     

      let kollege = {};
      kollege.title= req.body.title;
      kollege.author= kollegeX.author;
      kollege.body= req.body.body;


    Kollege.update(query, kollege, function(err){
        if(err){
            console.log(err);
            return;
        }else {
          req.flash('success', 'Kollege Updated');
          res.redirect('/');
        }
    })

  }) 
});

// Delete Kollege
router.delete('/:id', function(req, res){
  if(!req.user._id){
    
    res.status(500).send();
    
  }
  
  let query = {_id:req.params.id}

  Kollege.findById(req.params.id, function(err, kollege){
    if(kollege.author !=req.user._id){
      
      res.status(500).send();
      
    }else{
      
      Kollege.remove(query, function(err){
      if(err){
          console.log(err);
      }
      res.send('success');
      });
    }
  });

});

// Get Single Kollege
router.get('/:id', function(req, res){
    Kollege.findById(req.params.id, function(err, kollege){
      User.findById(kollege.author, function(err, user){
          res.render('kollege', {
          kollege:kollege,
          author: user.name
       });
      }); 
      
    });
});




// Access Control
function ensureAuthenticated(req, res, next){ 
  if(req.isAuthenticated()){
    return next();
  }else{
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }

}



module.exports = router;
