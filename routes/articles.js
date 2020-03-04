const express = require('express');
const router = express.Router();

// Bring in Article Model
let Article = require('../models/article');

//User model
let User = require('../models/user');

// Add Route
router.get('/add', ensureAuthenticated,  function(req, res){
  res.render('add_article', {
        title: 'Add Articles'
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
    res.render('add_article', {
      title:'Add Article',
      errors:errors
    });
  } else{

    let article = new Article();
    article.title= req.body.title;
    article.author= req.user._id;
    article.body= req.body.body;
    
    article.save(function(err){

        if(err){
            console.log(err);
            return;
        }else {
          req.flash('success', 'Article Added');
          res.redirect('/');
        }
    })
  }
});

// Load edit form
router.get('/edit/:id',ensureAuthenticated, function(req, res){
  Article.findById(req.params.id, function(err, article){
    

    //console.log(article.author);
    //console.log(req.user._id);
    if(article.author != req.user._id){
      console.log('redirect');
      req.flash('danger', 'not authorized');
      res.redirect('/');
      return;
      
    }else{
      console.log('ok');

    }
    
    res.render('edit_article', {
         title:'Edit Article',
         article:article
      });
  });
});

// Update submit POST route
router.post('/edit/:id', function(req, res){

    
    
    let query = {_id:req.params.id}


    Article.findById(req.params.id, function(err, articleX){
      
      if(err){
        console.log('wwwwww');
        console.log(err);
    }
     

      let article = {};
      article.title= req.body.title;
      article.author= articleX.author;
      article.body= req.body.body;


    Article.update(query, article, function(err){
        if(err){
            console.log(err);
            return;
        }else {
          req.flash('success', 'Article Updated');
          res.redirect('/');
        }
    })

  }) 
});

// Delete Article
router.delete('/:id', function(req, res){
  if(!req.user._id){
    
    res.status(500).send();
    
  }
  
  let query = {_id:req.params.id}

  Article.findById(req.params.id, function(err, article){
    if(article.author !=req.user._id){
      
      res.status(500).send();
      
    }else{
      
      Article.remove(query, function(err){
      if(err){
          console.log(err);
      }
      res.send('success');
      });
    }
  });

});

// Get Single Article
router.get('/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
      User.findById(article.author, function(err, user){
          res.render('article', {
          article:article,
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
