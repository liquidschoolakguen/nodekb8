const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');




const config = require('./config/database');

mongoose.connect(config.database, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

let db = mongoose.connection;

// check connection
db.once('open', function () {
  //console.log('connection to MongoDB');
});

//check for DB errors
db.on('error', function (err) {
  console.log(err);
});

// init App
const app = express();

// Bring in Models
let Article = require('./models/article');
let User = require('./models/user');
let Hausarbeit = require('./models/hausarbeit');

// Load view Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}))


// Express Message Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Passwort congig

require('./config/passport')(passport);



// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});




// Home Route
app.get('/', function (req, res) {


  if (typeof req.user === "undefined") {
    res.render('index', {
      title: 'Articles'
    });
  } else {







    User.findById(req.user._id, function (err, user) {

      if (err) {
        //console.log('wwwwww');
        console.log(err);
      }



      if (user.type == 'lehrer') {

        //console.log('lehrer')



        Article.
          find({ author: req.user._id }).
          populate('lehrer').
          exec(function (err2, my_articles) {
            if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);

            var length = my_articles.length;

            res.render('index', {
              title: 'Articles',
              my_articles: my_articles.reverse(),
              length: length

            });

          });





      } else {

        //console.log('schueler')
       // console.log('ggg : ' + user.klasse)


        Article.
          find({
            $or: [
              { klasse: user.klasse },
              { klasse: user.klasse2 }
            ]


          }).
          populate('lehrer').
          exec(function (err2, my_articles) {
            if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);

            var length = my_articles.length;



            Hausarbeit.
              find({ schueler: req.user._id }).
              populate('article').
              exec(function (err, hausarbeits) {
                if (err) return console.log('iiiiiiiiiiiiiiiiiii ' + err);
                //console.log('kkk')

                //console.log('-------------------------------------')
                my_articles.forEach(function (my_article) {
                  // console.log(my_article);

                  my_article.schueler_token = '0';

                  hausarbeits.forEach(function (hausarbeit) {
                   // console.log(hausarbeit);

                    if (my_article._id.toString() === hausarbeit.article._id.toString()) {

                      // console.log('---------------'+my_article.id);
                      // console.log('---------------'+hausarbeit.article._id);
                      // console.log('---------------');
                      // console.log('---------------');
                      // console.log('---------------');

                      my_article.schueler_token = hausarbeit.status;

                    }
                  });
                });

                // my_articles.forEach(function (my_article){
                //   console.log('--------------- '+my_article.schueler_token);
                // });
                
              res.render('index', {
                title: 'Articles',
                my_articles: my_articles.reverse(),
                length: length
  
              });
              });

          });

      }

    })

  }

});



app.get('/disclaimer', function (req, res) {

 
  res.render('disclaimer', {
  });
})



app.get('/datenschutz', function (req, res) {

 
  res.render('datenschutz', {
  });
})






// Home Route
app.get('/index_all', function (req, res) {


  Article.
    find({}).
    populate('lehrer').
    exec(function (err, all_articles) {
      if (err) return console.log('iiiiiiiiiiiiiiiiiii ' + err);

      if (typeof req.user === "undefined") {


        res.render('index_all', {
          title: 'Articles'


        });


      } else {
        //console.log('d is %s', req.user._id);

        var length = all_articles.length;

        //all_articles.forEach(article => console.log(article.title));

        res.render('index_all', {
          title: 'Articles',
          articles: all_articles.reverse(),
          length: length


        });



      }

    });

});












// Router Files
let articles = require('./routes/articles');
let users = require('./routes/users');
let hausarbeits = require('./routes/hausarbeits');



app.use('/articles/', articles);
app.use('/users/', users);
app.use('/hausarbeits/', hausarbeits);















// Start server
app.listen(5000, () => console.log(`Example app listening on port 3000!`));



const http = require('http').createServer(app);
//Socket Logic
const socketio = require('socket.io')(http)

Article.schema.post('save', function (doc) {
  //console.log('%s has been xcvcvv saved', doc._id);
});


var allClients = [];
socketio.on("connection", (socket) => {
  //console.log('connection!!! ' + socket.id)




  allClients.push(socket);

  socket.on('disconnect', function () {
    //console.log('Got disconnect!');

    var i = allClients.indexOf(socket);
    allClients.splice(i, 1);
  });



  socket.on("send_message", (data) => {

    socket.send('geht los')


    socket.emit('receive_message', { message: 'haaloooo' });




    Article.find({}, function (err, articles) {

      if (err) {
        console.log(err);
      }
      else {

        //console.log(data);



        socket.broadcast.emit("receive_message", { message: articles[0].title })




      }
    });


  })
})

http.listen(3000, () => {});



