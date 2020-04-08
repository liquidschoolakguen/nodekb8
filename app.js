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
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false 
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
app.use(bodyParser.urlencoded({ extended: true }))

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


    //console.log('lehrer+:::   ' + req.user._id)














    User.findById(req.user._id, function (err, user) {

      if (err) {
        //console.log('wwwwww');
        console.log(err);
      }



      if (user.type === 'lehrer') {

        //console.log('lehrer')



        Article.
          find({ author: req.user._id }).
          populate('lehrer').
          populate('schuelers').
          sort({ created_as_date: -1 }).
          exec(function (err2, my_articles) {
            if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);

            var length = my_articles.length;


            var jo = []




            my_articles.forEach(function (o) {

              jo.push(o._id)


            }); // jo hält die ids der articles




            Hausarbeit.find().where('article').in(jo).exec((err, has) => {

              // Hausarbeit.
              //   find().
              //    exec(function (err, has) {





              my_articles.forEach(function (my_article) {

                my_article.schuelers.sort();



                var tag = my_article.termin.substring(0, 2)
                var monat = my_article.termin.substring(3, 5)
                var jahr = my_article.termin.substring(6, 10)

                var termin = new Date(jahr, monat - 1, tag, 16);
                var jetzt = new Date();

                // To calculate the time difference of two dates 
                var Difference_In_Time = termin.getTime() - jetzt.getTime();
                var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

                var nicht_jetzt = new Date(jetzt);
                // console.log('iiiiiiiiiiiiiiiiiii ' + my_article.termin);
                my_article.termin = my_article.termin.substring(0, 10)
                //console.log('iiiiiiiiiiiiiiiiiii ' + my_article.termin);


                if (Difference_In_Days >= 0) {

                  if (jetzt.getFullYear() === termin.getFullYear() &&
                    jetzt.getMonth() === termin.getMonth() &&
                    jetzt.getDate() === termin.getDate()) {

                    my_article.termin = 'heute 16 Uhr'
                  }





                  nicht_jetzt.setDate(jetzt.getDate() + 1)

                  if (nicht_jetzt.getFullYear() === termin.getFullYear() &&
                    nicht_jetzt.getMonth() === termin.getMonth() &&
                    nicht_jetzt.getDate() === termin.getDate()) {
                    //console.log('nicht_jetzt         ' + nicht_jetzt);
                    //console.log('termin              ' + termin);
                    my_article.termin = 'morgen 16 Uhr'
                  }




                  nicht_jetzt.setDate(jetzt.getDate() + 2)

                  if (nicht_jetzt.getFullYear() === termin.getFullYear() &&
                    nicht_jetzt.getMonth() === termin.getMonth() &&
                    nicht_jetzt.getDate() === termin.getDate()) {
                    //console.log('nicht_jetzt         ' + nicht_jetzt);
                    //console.log('termin              ' + termin);
                    my_article.termin = 'übermorgen'
                  }





                  nicht_jetzt.setDate(jetzt.getDate() + 3)

                  if (nicht_jetzt.getFullYear() === termin.getFullYear() &&
                    nicht_jetzt.getMonth() === termin.getMonth() &&
                    nicht_jetzt.getDate() === termin.getDate()) {
                    ////console.log('nicht_jetzt         ' + nicht_jetzt);
                    //console.log('termin              ' + termin);
                    my_article.termin = 'in 3 Tagen'
                  }




                  nicht_jetzt.setDate(jetzt.getDate() + 4)

                  if (nicht_jetzt.getFullYear() === termin.getFullYear() &&
                    nicht_jetzt.getMonth() === termin.getMonth() &&
                    nicht_jetzt.getDate() === termin.getDate()) {
                    //console.log('nicht_jetzt         ' + nicht_jetzt);
                    //console.log('termin              ' + termin);
                    my_article.termin = 'in 4 Tagen'
                  }




                  nicht_jetzt.setDate(jetzt.getDate() + 5)

                  if (nicht_jetzt.getFullYear() === termin.getFullYear() &&
                    nicht_jetzt.getMonth() === termin.getMonth() &&
                    nicht_jetzt.getDate() === termin.getDate()) {
                    //console.log('nicht_jetzt         ' + nicht_jetzt);
                    //console.log('termin              ' + termin);
                    my_article.termin = 'in 5 Tagen'
                  }






                  nicht_jetzt.setDate(jetzt.getDate() + 6)

                  if (nicht_jetzt.getFullYear() === termin.getFullYear() &&
                    nicht_jetzt.getMonth() === termin.getMonth() &&
                    nicht_jetzt.getDate() === termin.getDate()) {
                    //console.log('nicht_jetzt         ' + nicht_jetzt);
                    //console.log('termin              ' + termin);
                    my_article.termin = 'in 6 Tagen'
                  }







                } else {
                  ///Termin vorüber
                  my_article.termin = 'abgelaufen'



                  if (jetzt.getFullYear() === termin.getFullYear() &&
                    jetzt.getMonth() === termin.getMonth() &&
                    jetzt.getDate() === termin.getDate()) {

                    my_article.termin = 'abgelaufen (heute)'
                  }
                  if (jetzt.getFullYear() === termin.getFullYear() &&
                    jetzt.getMonth() === termin.getMonth() &&
                    jetzt.getDate() - 1 === termin.getDate()) {

                    my_article.termin = 'abgelaufen (gestern)'
                  }
                  if (jetzt.getFullYear() === termin.getFullYear() &&
                    jetzt.getMonth() === termin.getMonth() &&
                    jetzt.getDate() - 2 === termin.getDate()) {

                    my_article.termin = 'abgelaufen (vorgestern)'
                  }





                }











                my_article.ha_gruen = '0'
                my_article.ha_gelb = '0'
                my_article.ha_grau = '0'
                var inte_gelb = parseInt(my_article.ha_gelb)
                var inte_gruen = parseInt(my_article.ha_gruen);
                var inte_grau = parseInt(my_article.ha_grau);

                has.forEach(function (ha) {

                  if (ha.article._id.toString() === my_article._id.toString()) {

                    // console.log('pppp:    ' + my_article.title);

                    if (ha.status === '1') {
                      inte_gelb += 1;

                    } else if (ha.status === '2') {
                      inte_gruen += 1;
                    } else if (ha.status === '3') {
                      inte_grau += 1;
                    }

                  }




                })


                tuString_gelb = inte_gelb.toString();
                my_article.ha_gelb = tuString_gelb

                tuString_gruen = inte_gruen.toString();
                my_article.ha_gruen = tuString_gruen

                tuString_grau = inte_grau.toString();
                my_article.ha_grau = tuString_grau







              });




              /*   my_articles.forEach(function (my_article) {
  
                  console.log('                          ');
                  console.log('----------------------    ' + my_article.ha_gruen);
                  console.log('----------------------    ' + my_article.ha_gelb);
                  console.log('----------------------    ' + my_article.ha_grau);
  
                })
   */

                 
              res.render('index', {
                my_articles: my_articles,
                length: length

              });

            })

          });





      } else {







          //alte User vorbereiten
        User.find({type: 'schueler'}).
          exec(function (erro, updateUsers) {



            updateUsers.forEach(function (updateUser) {




              let op = {};

              if (updateUser.klasse.includes('St. Pauli')) {

                op.klasse3 = 'St. Pauli'

              } else if (updateUser.klasse.includes('Neustadt') ) {

                op.klasse2 = ''
                op.klasse3 = 'Neustadt'


              } else if (updateUser.klasse.includes('Oberstufe') ) {


                op.klasse2 = ''
                op.klasse3 = 'Oberstufe'


              } else {

                op.klasse2 = ''
                op.klasse3 = ''
                console.log('FE  HEHEHE LER');


              }


              op.klasse4 = 'alle drei Standorte'


              var query = { '_id': updateUser._id };


              User.findOneAndUpdate(query, op, { upsert: true }, function (err, doc) {
                if (err) return res.send(500, { error: err });
                //console.log('geändert:   ' + doc.name + ' (' + doc.klasse3 + ')')
              });


            })


          })













        Article.
          find({
            $or: [

              { $or: [{ klasse: user.klasse }, { klasse: user.klasse2 }, { klasse: user.klasse3 }, { klasse: user.klasse4 }] },
              { schuelers: user }

            ]

          }).
          populate('lehrer').
          populate('schuelers').
          populate('uploads').
          sort({ created_as_date: -1 }).
          exec(function (err2, my_articles) {
            if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);


            if (my_articles) {



              // console.log('okkkkkkkkkkk');




            } else {



              // console.log('neeeeeeeeeeeeeeee');


            }


            var length = my_articles.length;


            //////////////////////7 gggg6g7
            Hausarbeit.
              find({ schueler: req.user._id }).
              populate('article').
              exec(function (err, hausarbeits) {
                if (err) return console.log('iiiiiiiiiiiiiiiiiii ' + err);


                //console.log('-------------------------------------')
                my_articles.forEach(function (my_article) {






                  var tag = my_article.termin.substring(0, 2)
                  var monat = my_article.termin.substring(3, 5)
                  var jahr = my_article.termin.substring(6, 10)

                  var termin = new Date(jahr, monat - 1, tag, 16);
                  var jetzt = new Date();

                  // To calculate the time difference of two dates 
                  var Difference_In_Time = termin.getTime() - jetzt.getTime();
                  var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

                  var nicht_jetzt = new Date(jetzt);

                  my_article.termin = my_article.termin.substring(0, 10)

                  if (Difference_In_Days >= 0) {

                    if (jetzt.getFullYear() === termin.getFullYear() &&
                      jetzt.getMonth() === termin.getMonth() &&
                      jetzt.getDate() === termin.getDate()) {

                      my_article.termin = 'heute 16 Uhr'
                    }





                    nicht_jetzt.setDate(jetzt.getDate() + 1)

                    if (nicht_jetzt.getFullYear() === termin.getFullYear() &&
                      nicht_jetzt.getMonth() === termin.getMonth() &&
                      nicht_jetzt.getDate() === termin.getDate()) {
                      //console.log('nicht_jetzt         ' + nicht_jetzt);
                      //console.log('termin              ' + termin);
                      my_article.termin = 'morgen 16 Uhr'
                    }




                    nicht_jetzt.setDate(jetzt.getDate() + 2)

                    if (nicht_jetzt.getFullYear() === termin.getFullYear() &&
                      nicht_jetzt.getMonth() === termin.getMonth() &&
                      nicht_jetzt.getDate() === termin.getDate()) {
                      //console.log('nicht_jetzt         ' + nicht_jetzt);
                      //console.log('termin              ' + termin);
                      my_article.termin = 'übermorgen'
                    }





                    nicht_jetzt.setDate(jetzt.getDate() + 3)

                    if (nicht_jetzt.getFullYear() === termin.getFullYear() &&
                      nicht_jetzt.getMonth() === termin.getMonth() &&
                      nicht_jetzt.getDate() === termin.getDate()) {
                      //console.log('nicht_jetzt         ' + nicht_jetzt);
                      //console.log('termin              ' + termin);
                      my_article.termin = 'in 3 Tagen'
                    }




                    nicht_jetzt.setDate(jetzt.getDate() + 4)

                    if (nicht_jetzt.getFullYear() === termin.getFullYear() &&
                      nicht_jetzt.getMonth() === termin.getMonth() &&
                      nicht_jetzt.getDate() === termin.getDate()) {
                      //console.log('nicht_jetzt         ' + nicht_jetzt);
                      //console.log('termin              ' + termin);
                      my_article.termin = 'in 4 Tagen'
                    }




                    nicht_jetzt.setDate(jetzt.getDate() + 5)

                    if (nicht_jetzt.getFullYear() === termin.getFullYear() &&
                      nicht_jetzt.getMonth() === termin.getMonth() &&
                      nicht_jetzt.getDate() === termin.getDate()) {
                      //console.log('nicht_jetzt         ' + nicht_jetzt);
                      //console.log('termin              ' + termin);
                      my_article.termin = 'in 5 Tagen'
                    }






                    nicht_jetzt.setDate(jetzt.getDate() + 6)

                    if (nicht_jetzt.getFullYear() === termin.getFullYear() &&
                      nicht_jetzt.getMonth() === termin.getMonth() &&
                      nicht_jetzt.getDate() === termin.getDate()) {
                      //console.log('nicht_jetzt         ' + nicht_jetzt);
                      //console.log('termin              ' + termin);
                      my_article.termin = 'in 6 Tagen'
                    }







                  } else {
                    ///Termin vorüber
                    my_article.termin = 'abgelaufen'



                    if (jetzt.getFullYear() === termin.getFullYear() &&
                      jetzt.getMonth() === termin.getMonth() &&
                      jetzt.getDate() === termin.getDate()) {

                      my_article.termin = 'abgelaufen (heute)'
                    }
                    if (jetzt.getFullYear() === termin.getFullYear() &&
                      jetzt.getMonth() === termin.getMonth() &&
                      jetzt.getDate() - 1 === termin.getDate()) {

                      my_article.termin = 'abgelaufen (gestern)'
                    }
                    if (jetzt.getFullYear() === termin.getFullYear() &&
                      jetzt.getMonth() === termin.getMonth() &&
                      jetzt.getDate() - 2 === termin.getDate()) {

                      my_article.termin = 'abgelaufen (vorgestern)'
                    }





                  }






                  my_article.schueler_token = '0';
                  hausarbeits.forEach(function (hausarbeit) {
                    // console.log(hausarbeit);
                    if (my_article._id.toString() === hausarbeit.article._id.toString()) {
                      my_article.schueler_token = hausarbeit.status;
                    }
                  });
                });






                /* 
                                console.log('-------------------------------------');
                                my_articles.forEach(function (my) {
                
                                  console.log('created:  ' + my.created + ' |  title:  ' + my.title + ' |  create_as_date  ' + my.created_as_date)
                
                                })
                 */

                res.render('index', {

                  my_articles: my_articles,
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


app.get('/haeufige_fragen', function (req, res) {


  res.render('haeufige_fragen', {
  });
})




app.get('/einfach_besser', function (req, res) {


  res.render('einfach_besser', {
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





app.post('/search', (req, res) => {
  let q = req.body.query;
  let query = {
    "$or": [{"name.first": {"$regex": q, "$options": "i"}}, {"name.last": {"$regex": q, "$options": "i"}}]
  };
  let output = [];

  Users.find(query).limit(6).then( usrs => {
      if(usrs && usrs.length && usrs.length > 0) {
          usrs.forEach(user => {
            let obj = {
                id: user.name.first + ' ' + user.name.last,
                label: user.name.first + ' ' + user.name.last
            };
            output.push(obj);
          });
      }
      res.json(output);
  }).catch(err => {
    res.sendStatus(404);
  });

});







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

http.listen(3000, () => { });



