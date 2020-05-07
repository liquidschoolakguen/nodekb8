const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
//const nodemailer = require('nodemailer');
const config = require('./config/database');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
//var dotenv = require('dotenv').config()
// const stripeSecretKey = process.env.STRIPE_SECRET_KEY
// const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
// console.log('stripeSecretKey: ' + stripeSecretKey)
// console.log('stripePublicKey: ' + stripePublicKey)


mongoose.connect(config.database, {
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false
});


/* 
const stripe = require("stripe")("sk_test_ZiLt9XHklBjmvTbqFeLoGwFc00uGWhbTmg");

(async () => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'setup',
    customer: 'cus_FOsk5sbh3ZQpAU',
    success_url: 'https://liquidschool.de/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://liquidschool.de/cancel',
  });
})();
 */


/////index_no_user
/* form(action='your-server-side-code', method='POST')
    script.stripe-button(src='https://checkout.stripe.com/checkout.js', data-key='pk_test_DVpnaycBM2IACnm0dEKWXLAH00wQZEPgF8', data-amount='999', data-name='Stripe.com', data-description='Example charge', data-image='https://stripe.com/img/documentation/checkout/marketplace.png', data-locale='auto', data-zip-code='true') */




/* var smtpConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
      user: 'bubu000051@gmail.com',
      pass: 'unavejun93947'
  }
};
var transporter = nodemailer.createTransport(smtpConfig);

var mailOptions = {
  from: 'bruno.kamp@liquidschool.com',
  to: 'mitat_akguen@web.de',
  subject: 'jjj',
  text: 'lodnbnks  s sam dsamb dsabm dmasm dsam dsamsd'
};


 */



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
let School = require('./models/school');
let Stammverbund = require('./models/stammverbund');
let Stamm = require('./models/stamm');
let Group = require('./models/group');


// Load view Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');



//http://localhost:5000/fotzenknechtgymnasium-21107


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


app.use('/scripts', express.static(__dirname + '/node_modules/jquery-validation/dist/'));

app.get('*', function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});




function getMyNow() {
  var yes = new Date();
  var n = yes.getTimezoneOffset();
  if (n !== -120) {
    yes.setHours(yes.getHours() + 2)
    console.log('bimmelbingo')
  } else {
    // console.log('server')
  }
  return yes;
}





var benno = 3000;

function intervalFunc() {
  var nu2 = getMyNow();
  console.log('Cant stop meee now! ' + nu2.getHours() + ':' + nu2.getMinutes() + ':' + nu2.getSeconds());

}

var nu = getMyNow();

console.log(nu.getHours() + ':' + nu.getMinutes() + ':' + nu.getSeconds())
console.log('Start in ' + (24 - nu.getHours() - 1) + ' Std ' + (60 - nu.getMinutes() - 1) + ' Minuten und ' + (60 - nu.getSeconds() - 1) + ' Sekunden und ' + (1000 - nu.getMilliseconds()) + ' ms. ');
benno = ((24 - nu.getHours() - 1) * 24 * 60 * 1000) + ((60 - nu.getMinutes() - 1) * 60 * 1000) + ((60 - nu.getSeconds() - 1) * 1000) + ((1000 - nu.getSeconds()))
console.log('Verzögerung ms: ' + benno)



setTimeout(function () {
  intervalFunc();
  setInterval(intervalFunc, 24 * 60 * 60000);
}, benno);

// dieser ganze Scheiß hier müsste dafür sorgen, dass alle 24Std um 0 Uhr eine Methode aufgerufen wird



app.get('/alt_index', function (req, res) {
  res.render('alt_index', {
  })

});


app.get('/update_changer', function (req, res) {
  res.render('debug/update_changer', {
  })

});

app.post('/update_changer', function (req, res) {
  //createSchuelersAndLehrersSchool_AndChangeSchuelersKlasse();
  deleteUserVerknüpfung();
  res.render('debug/update_changer', {
  })

});

app.post('/update_changer_2', function (req, res) {

  changeArticleTermin()

  console.log('update_changer 2 complete');
  res.render('debug/update_changer', {
  })

});






function deleteUserVerknüpfung() {
  User.
    find().
    exec(function (err, all_users) {

      School.
        findOne({ plz: '20355' }).
        exec(function (err, school) {




          School.findByIdAndUpdate(school._id,
            { $unset: { users: 1 } },
            function (err, uptdatedArticle) {
              if (err) throw err;


            })


        });
    });
}




function changeArticleTermin() {
  Article.
    find().
    exec(function (err, allArticles) {

      allArticles.forEach(function (art) {

        art.termin = 'Frist: ' + art.termin
        art.save(function (err, us) {
          if (err) throw err;

        });
      });

    })
}










function createSchuelersAndLehrersSchool_AndChangeSchuelersKlasse() {
  User.
    find().
    exec(function (err, all_users) {

      School.
        findOne({ plz: '20355' }).
        exec(function (err, school) {

          all_users.forEach(function (user) {

            console.log('. ' + user.name + ' . ' + user.klasse);
            user.school = school;





            user.save(function (err, us) {
              if (err) throw err;


              if (user.type === 'schueler') {

                School.findByIdAndUpdate(school._id,
                  { $push: { schuelers: us } },
                  { safe: true, upsert: true },
                  function (err, uptdatedSchool) {
                    if (err) throw err;

                  })


              } else if (user.type === 'lehrer') {
                School.findByIdAndUpdate(school._id,
                  { $push: { lehrers: us } },
                  { safe: true, upsert: true },
                  function (err, uptdatedSchool) {
                    if (err) throw err;

                  })

              }

            });























          });
        });
    });
}





function changeSchuelersKlasses() {
  User.
    find({ type: 'schueler' }).
    exec(function (err, all_schulers) {


      all_schulers.forEach(function (schueler) {

        console.log('. ' + schueler.name);


      });



    });

}








function myStringToDate(termin_string) {

  var tag = termin_string.substring(7, 9)
  var monat = termin_string.substring(10, 12)
  var jahr = termin_string.substring(13, 17)
  //console.log('tag   ' + tag);
  //console.log('monat   ' + monat);
  //console.log('jahr   ' + jahr);
  return new Date(jahr, monat - 1, tag, 16);

}


function getTimeStringFuture(termin_string) {
  var jetzt = getMyNow();


  var termin = myStringToDate(termin_string);



  if (jetzt.getFullYear() === termin.getFullYear() &&
    jetzt.getMonth() === termin.getMonth() &&
    jetzt.getDate() === termin.getDate()) {

    return 'heute 16 Uhr'
  }
  if (jetzt.getFullYear() === termin.getFullYear() &&
    jetzt.getMonth() === termin.getMonth() &&
    jetzt.getDate() + 1 === termin.getDate()) {

    return 'morgen 16 Uhr'
  }
  if (jetzt.getFullYear() === termin.getFullYear() &&
    jetzt.getMonth() === termin.getMonth() &&
    jetzt.getDate() + 2 === termin.getDate()) {

    return 'übermorgen'
  }

  if (jetzt.getFullYear() === termin.getFullYear() &&
    jetzt.getMonth() === termin.getMonth() &&
    jetzt.getDate() + 3 === termin.getDate()) {

    return 'in 3 Tagen'
  }

  if (jetzt.getFullYear() === termin.getFullYear() &&
    jetzt.getMonth() === termin.getMonth() &&
    jetzt.getDate() + 4 === termin.getDate()) {

    return 'in 4 Tagen'
  }
  if (jetzt.getFullYear() === termin.getFullYear() &&
    jetzt.getMonth() === termin.getMonth() &&
    jetzt.getDate() + 5 === termin.getDate()) {

    return 'in 5 Tagen'
  }
  if (jetzt.getFullYear() === termin.getFullYear() &&
    jetzt.getMonth() === termin.getMonth() &&
    jetzt.getDate() + 6 === termin.getDate()) {

    return 'in 6 Tagen'
  }


  return termin_string;




}







function getTimeStringPast(termin_string) {
  var jetzt = getMyNow();


  var termin = myStringToDate(termin_string);


  //Vergangen

  if (jetzt.getFullYear() === termin.getFullYear() &&
    jetzt.getMonth() === termin.getMonth() &&
    jetzt.getDate() === termin.getDate()) {

    return 'abgelaufen (heute)'
  }
  if (jetzt.getFullYear() === termin.getFullYear() &&
    jetzt.getMonth() === termin.getMonth() &&
    jetzt.getDate() - 1 === termin.getDate()) {

    return 'abgelaufen (gestern)'
  }
  if (jetzt.getFullYear() === termin.getFullYear() &&
    jetzt.getMonth() === termin.getMonth() &&
    jetzt.getDate() - 2 === termin.getDate()) {

    return 'abgelaufen (vorgestern)'
  }

  return 'abgelaufen'


}










function isPossibleFrist(termin) {

  var tag = termin.substring(7, 9)
  var monat = termin.substring(10, 12)
  var jahr = termin.substring(13, 17)
  //console.log('tag   ' + tag);
  //console.log('monat   ' + monat);
  //console.log('jahr   ' + jahr);
  var d = new Date(jahr, monat - 1, tag, 16);
  var jetzt = getMyNow();
  var diffMs = (d - jetzt); // milliseconds between now & Christmas


  if (diffMs < 0) { //wenn der Termin in der Vergangenheit liegt, ist Schluss mit Speichern

    return false;
  } else {

    return true;

  }

}










// Home Route
app.get('/', function (req, res) {


  if (typeof req.user === "undefined") {


    /*     transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
     */




    const d = new Date(Date.now());

    d.setMonth(d.getMonth() + 7)
    d.setDate(d.getDate() + 4)
    console.log(d.getMonth() + ' 1.');
    console.log(d.toLocaleDateString());
    const month = d.getMonth();

    d.setMonth(d.getMonth() + 3);
    console.log(d.getMonth() + ' 2.');
    while (d.getMonth() === month + 4 || d.getMonth() === month - 8) {
      console.log(d.getMonth() + '.' + month);
      d.setDate(d.getDate() - 1);
      console.log('-- ' + d.getMonth() + '.' + month);

    }
    console.log(d.toLocaleDateString());





    res.render('index', {
      //stripePublicKey: stripePublicKey
    });
  } else {


    User.
      findOne({ _id: req.user._id }).
      populate({
        path: 'schueler_stamm',
        populate: {
          path: 'stammverbunds'
        }
      }).
      exec(function (err, user) {




        if (user.type === 'lehrer') {


          Article.
            find({ author: req.user._id }, 'title termin klasse').
            populate('lehrer').
            populate('stamm').
            populate('stammverbund').
            populate('disziplin').
            populate({
              path: 'group',
              populate: {
                path: 'schuelers'
              }
            }).
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


                  if (isPossibleFrist(my_article.termin)) {
                    my_article.termin = getTimeStringFuture(my_article.termin)
                  } else {
                    my_article.termin = getTimeStringPast(my_article.termin)

                  }

                  my_article.ha_gruen = '0'
                  my_article.ha_gelb = '0'
                  my_article.ha_grau = '0'
                  var inte_gelb = parseInt(my_article.ha_gelb)
                  var inte_gruen = parseInt(my_article.ha_gruen);
                  var inte_grau = parseInt(my_article.ha_grau);

                  has.forEach(function (ha) {

                    if (ha.article._id.toString() === my_article._id.toString()) {

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

                res.render('index', {
                  my_articles: my_articles,
                  length: length
                });
              })
            });



        } else if (user.type === 'schueler') {


          var jo2 = []
          user.schueler_stamm.stammverbunds.forEach(function (verbund) {
            console.log('verbund    ' + verbund.name);
            jo2.push(verbund);
          })

          Article.
            find({
              $or: [
                { klasse: user.schueler_stamm.name },
                { stamm: user.schueler_stamm },
                { stammverbund: { $in: jo2 } },
                { schuelers: user },
              ]
            }).
            populate('lehrer').
            populate('schuelers').
            populate('stamm').
            populate('stammverbund').
            populate('disziplin').
            populate('uploads').
            sort({ created_as_date: -1 }).
            exec(function (err2, my_articles) {
              if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);

              var length = my_articles.length;

              Hausarbeit.
                find({ schueler: req.user._id }).
                populate('article').
                exec(function (err, hausarbeits) {
                  if (err) return console.log('iiiiiiiiiiiiiiiiiii ' + err);


                  //console.log('-------------------------------------')
                  my_articles.forEach(function (my_article) {

                    if (isPossibleFrist(my_article.termin)) {
                      my_article.termin = getTimeStringFuture(my_article.termin)
                    } else {
                      my_article.termin = getTimeStringPast(my_article.termin)

                    }


                    my_article.schueler_token = '0';
                    hausarbeits.forEach(function (hausarbeit) {
                      // console.log(hausarbeit);
                      if (my_article._id.toString() === hausarbeit.article._id.toString()) {
                        my_article.schueler_token = hausarbeit.status;
                      }
                    });
                  });

                  res.render('index', {
                    my_articles: my_articles,
                    length: length
                  });
                });
            });



        } else if (user.type === 'admin') {




          User.findOne({ _id: req.user._id }).
            populate('school').
            exec(function (err, user) {
              if (err) return console.log('iiiiiiiiiiiiiiiiiii ' + err);



              if (!user.school) {

                res.redirect('/schools/add');
                return;

              }


              School.findOne({ _id: user.school._id }).
                populate('stammverbunds').
                populate('s_stamms').
                populate('s_disziplins').
                populate('groups').
                populate('users').
                populate('admins').
                populate('lehrers').
                populate('schuelers').
                exec(function (err, schoool) {


                  res.render('index', {

                    school: user.school,
                    stammverbunds: schoool.stammverbunds,
                    stamms: schoool.s_stamms,
                    disziplins: schoool.s_disziplins,
                    groups: schoool.groups,

                    users: schoool.users,
                    admins: schoool.admins,
                    lehrers: schoool.lehrers,
                    schuelers: schoool.schuelers,

                  });





                })








            })








        } else if (user.type === 'liquidboy') {


        } else if (user.type === 'school') {


          User.findOne({ _id: req.user._id }).
            populate('school').
            exec(function (err, user) {
              if (err) return console.log('iiiiiiiiiiiiiiiiiii ' + err);





              if (!user.school) {
                //FEHLER  Es kann hier keinen user ohne school geben
                res.redirect('/');
                return;

              }

              if (user.school.complete_school === '2') {//stamms stehen an
                res.redirect('/schools/add_school_stamms');
                return;

              }
              if (user.school.complete_school === '3') {//disziplins stehen an

                res.redirect('/schools/add_school_disziplins');
                return;

              }

              if (user.school.complete_school === '4') {//logo steht an

                res.redirect('/schools/add_school_logo');// schullogo ausgelassen
                return;// schullogo ausgelassen

              }
              if (user.school.complete_school === '5') {// schülerschlüssel steht an

                res.redirect('/schools/add_school_s_s');
                return;

              }

              if (user.school.complete_school === '6') {// lehrerschlüssel steht an

                res.redirect('/schools/add_school_l_s');
                return;

              }

              if (user.school.complete_school === '7') { //adminschlüssel steht an

                res.redirect('/schools/add_school_a_s');
                return;

              }

              if (user.school.complete_school === '8') { //adminREGISTRIERUNG steht an

                res.redirect('/users/add_school_register_admin_first');
                return;

              }

              if (user.school.complete_school === '1') {
                //FEHLER  Der schoolUser dürfte garnicht mehr existieren
                res.redirect('/');
                return;

              }
















            })


        }





      })

  }

});








function handleOldVersionSchuelerIndex() {





  Article.
    find({
      $or: [
        { $or: [{ klasse: user.klasse }, { klasse: user.klasse2 }, { klasse: user.klasse3 }, { klasse: user.klasse4 }] },
        { klasse: { $in: jo } },
        { schuelers: user }
      ]
    }).
    populate('lehrer').
    populate('schuelers').
    populate('stamm').
    populate('stammverbund').
    populate('disziplin').
    populate('uploads').
    sort({ created_as_date: -1 }).
    exec(function (err2, my_articles) {
      if (err2) return console.log('iiiiiiiiiiiiiiiiiii ' + err2);




    })




}





app.get('/disclaimer', function (req, res) {


  res.render('footer/disclaimer', {
  });
})



app.get('/datenschutz', function (req, res) {


  res.render('footer/datenschutz', {
  });
})


app.get('/haeufige_fragen', function (req, res) {


  res.render('footer/haeufige_fragen', {
  });
})




app.get('/einfach_besser', function (req, res) {


  res.render('footer/einfach_besser', {
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


        res.render('show/index_all', {
          title: 'Articles'


        });


      } else {
        //console.log('d is %s', req.user._id);

        var length = all_articles.length;

        //all_articles.forEach(article => console.log(article.title));

        res.render('show/index_all', {
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
let schools = require('./routes/schools');
let stamms = require('./routes/stamms');
let disziplins = require('./routes/disziplins');
let stammverbunds = require('./routes/stammverbunds');
let groups = require('./routes/groups');


app.use('/articles/', articles);
app.use('/users/', users);
app.use('/hausarbeits/', hausarbeits);
app.use('/schools/', schools);
app.use('/stamms/', stamms);
app.use('/disziplins/', disziplins);
app.use('/stammverbunds/', stammverbunds);
app.use('/groups/', groups);

/* 

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

 */

/* 
// ALLET
app.get('/:id/:id2', function (req, res) {

console.log('hi:    '+req.params.id)
console.log('hi2:    '+req.params.id2)


  res.redirect('/');





});
 */





// Start server
app.listen(5000, () => console.log(`Example app listening on port 5000!`));



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



