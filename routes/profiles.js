const express = require('express');
const router = express.Router();


//User model
let User = require('../models/user');

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










module.exports = router;

