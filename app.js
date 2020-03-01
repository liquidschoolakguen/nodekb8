const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/nodekb');

let db = mongoose.connection;
// check connection
db.once('open', function(){
    console.log('connection to MongoDB');


});
//check for DB errors
db.on('error', function(err){
    console.log(err);
});

// init App
const app = express();

// Bring in Models
let Article = require('./models/article');

// Load view Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


// set Public Folder

app.use(express.static(path.join(__dirname, 'public')));

// home Route

app.get('/', function(req, res){
    Article.find({}, function(err, articles){

        if(err){
            console.log(err);
        }
        else {
            res.render('index', {
                title: 'Articles',
                articles: articles
        
            });
            
        }
        
    });
});
// Add route

app.get('/articles/add', function(req, res){

    res.render('add_article', {
        title: 'Add Articles'
    })


});

// add submit POST route

app.post('/articles/add', function(req, res){

    let article = new Article();
    article.title= req.body.title;
    article.author= req.body.author;
    article.body= req.body.author;
    
    article.save(function(err){

        if(err){

            console.log(err);
            return;
        }else {
            res.redirect('/');
        }


    })
   
});

app.listen(3000, () => console.log(`Example app listening on port 3000!`))
