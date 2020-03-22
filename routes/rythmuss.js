const express = require('express');
const router = express.Router();

// Bring in Rythmus Model
let Rythmus = require('../models/rythmus');

//User model
let User = require('../models/user');

// Add Route
router.get('/add', ensureAuthenticated,  function(req, res){
  res.render('add_rythmus', {
        title: 'Add Rythmuss'
    })
  
});

// Add Submit POST route
router.post('/add', function(req, res){
  
  req.checkBody('title', 'Title is required').notEmpty();
  //req.checkBody('author', 'Autor is required').notEmpty();
  //req.checkBody('body', 'Body is required').notEmpty();

  // get Errrors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_rythmus', {
      title:'Add Rythmus',
      errors:errors
    });
  } else{

    let rythmus = new Rythmus();
    rythmus.title= req.body.title;
    rythmus.author= req.user._id;

    rythmus.montag_1 = req.body.montag_1;
    rythmus.montag_1u = req.body.montag_1u;

    rythmus.montag_1 = req.body.montag_1;
    rythmus.montag_1u = req.body.montag_1u;

    rythmus.montag_1 = req.body.montag_1;
    rythmus.montag_1u = req.body.montag_1u;

    rythmus.montag_1 = req.body.montag_1;
    rythmus.montag_1u = req.body.montag_1u;

    rythmus.montag_1 = req.body.montag_1;
    rythmus.montag_1u = req.body.montag_1u;

    rythmus.montag_1 = req.body.montag_1;
    rythmus.montag_1u = req.body.montag_1u;

    rythmus.montag_1 = req.body.montag_1;
    rythmus.montag_1u = req.body.montag_1u;

    rythmus.montag_1 = req.body.montag_1;
    rythmus.montag_1u = req.body.montag_1u;

    rythmus.montag_1 = req.body.montag_1;
    rythmus.montag_1u = req.body.montag_1u;

    rythmus.montag_1 = req.body.montag_1;
    rythmus.montag_1u = req.body.montag_1u;

    rythmus.montag_1 = req.body.montag_1;
    rythmus.montag_1u = req.body.montag_1u;

    rythmus.montag_1 = req.body.montag_1;
    rythmus.montag_1u = req.body.montag_1u;

    rythmus.montag_1 = req.body.montag_1;
    rythmus.montag_1u = req.body.montag_1u;

    rythmus.montag_1 = req.body.montag_1;
    rythmus.montag_1u = req.body.montag_1u;

    rythmus.montag_1 = req.body.montag_1;
    rythmus.montag_1u = req.body.montag_1u;
   
    
    rythmus.save(function(err){

        if(err){
            console.log(err);
            return;
        }else {
          req.flash('success', 'Rythmus Added');
          res.redirect('/');
        }
    })
  }
});

// Load edit form
router.get('/edit/:id',ensureAuthenticated, function(req, res){
  Rythmus.findById(req.params.id, function(err, rythmus){
    

    //console.log(rythmus.author);
    //console.log(req.user._id);
    if(rythmus.author != req.user._id){
      console.log('redirect');
      req.flash('danger', 'not authorized');
      res.redirect('/');
      return;
      
    }else{
      console.log('ok');

    }
    
    res.render('edit_rythmus', {
         title:'Edit Rythmus',
         rythmus:rythmus
      });
  });
});

// Update submit POST route
router.post('/edit/:id', function(req, res){

    
    
    let query = {_id:req.params.id}


    Rythmus.findById(req.params.id, function(err, rythmusX){
      
      if(err){
        console.log('wwwwww');
        console.log(err);
    }
     

      let rythmus = {};
      rythmus.title= req.body.title;
      rythmus.author= rythmusX.author;
      rythmus.body= req.body.body;


    Rythmus.update(query, rythmus, function(err){
        if(err){
            console.log(err);
            return;
        }else {
          req.flash('success', 'Rythmus Updated');
          res.redirect('/');
        }
    })

  }) 
});

// Delete Rythmus
router.delete('/:id', function(req, res){
  if(!req.user._id){
    
    res.status(500).send();
    
  }
  
  let query = {_id:req.params.id}

  Rythmus.findById(req.params.id, function(err, rythmus){
    if(rythmus.author !=req.user._id){
      
      res.status(500).send();
      
    }else{
      
      Rythmus.remove(query, function(err){
      if(err){
          console.log(err);
      }
      res.send('success');
      });
    }
  });

});

// Get Single Rythmus
router.get('/:id', function(req, res){
    Rythmus.findById(req.params.id, function(err, rythmus){
      User.findById(rythmus.author, function(err, user){
          res.render('rythmus', {
          rythmus:rythmus,
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
