var express =       require('express')
    , http =        require('http')
    , passport =    require('passport')
    , path =        require('path')
    , mongoose = require('mongoose')
    , TwitterStrategy = require('passport-twitter').Strategy
    , FacebookStrategy = require('passport-facebook').Strategy;
    //, User =        require('./server/models/User.js');

var app = module.exports = express();

config = require('./config.json');



/**
* Configuracion de la database
*/
mongoose.connect(config.db.uri);

require('./server/models/Counter');
require('./server/models/User');
require('./server/models/Post');
require('./server/models/Profile');
require('./server/models/Inbox');
require('./server/models/Notify');

var User = mongoose.model('User'), Notify = mongoose.model('Notify'), Counter = mongoose.model('Counter');

var auth = require('./server/controllers/auth'),
    sche = config.loginsecure ? 'https' : 'http';

/*Counter.getNextSequence("notifyid", function(err, count){

    User.findOne({username:'rederick2013'}, function(err, user){

        User.findOne({username: 'UR'}, function(err, user2){

            var n = new Notify({id: count, from: user, to: user2, title:'Elgin te mando saludos', unread: false});

            n.save();

        });

    });
    
});*/

Notify.find().populate('from').populate('to').exec(function(err, notify){
    console.log(notify);
});


//app.set('views', __dirname + '/client/views');
//app.set('view engine', 'jade');
/*app.use(express.logger('dev'))
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.cookieSession(
    {
        secret: process.env.COOKIE_SECRET || "Superdupersecret"
    }));
app.use(passport.initialize());
app.use(passport.session());*/

//passport.use(auth.local);
//passport.use(User.twitterStrategy());  // Comment out this line if you don't want to enable login via Twitter
//passport.use(User.facebookStrategy()); // Comment out this line if you don't want to enable login via Facebook
//passport.use(User.googleStrategy());   // Comment out this line if you don't want to enable login via Google
//passport.use(User.linkedInStrategy()); // Comment out this line if you don't want to enable login via LinkedIn

/*passport.use(new FacebookStrategy({
      clientID: config.facebook.appId,
      clientSecret: config.facebook.appSecret,
      callbackURL: sche+"://"+config.host+"/auth/facebook/callback"
    }, auth.facebook));*/


passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

passport.deserializeUser(auth.user);


app.configure(function(){
    app.set('port', process.env.VCAP_APP_PORT || config.port);
    app.set('views', __dirname + '/client/views');
    app.set('view engine', 'jade');

    /*app.use(function (req, res, next) {
      if(toobusy()) res.status(500).sendfile(__dirname+'/views/overload.html');
      else next();
    });*/
    //Directorio estatico y favicon
    app.use(express.static(path.join(__dirname, 'client')));
   // app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
    //Peticiones POST para Express
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({secret: process.env.COOKIE_SECRET || "Superdupersecret" }));
    //Importamos passport para autenticacion
    app.use(passport.initialize());
    app.use(passport.session());

    //Establece apartir de la ip su localizacion y la guarda en la informacion del usuario
    /*app.use(function (req, res, next) {
    //console.log('HOLAAAAAAAAAA');
      if(req.user) {
        console.log(user);
        req.logIn(user, function(err) {
                if(err)     { next(err); }
                else        { res.json(200, { "role": user.role, "username": user.username }); }
            });
        
      } else {
        next();
      }
    });*/
    //Importa router de la app
    app.use(app.router);
});


//Permite que varios procesos de nodejs compartan la conexion tcp
app.configure('production', function () {
    app.use(require('raven').middleware.express(config.sentry_dsn));
    app.use(function (err, req, res, next) {
      res.status(500).sendfile(__dirname+'/views/500.html');
    });
});

//Permite establecer parametros de configuracion para entorno de desarrollo y produccion
app.configure('development', function(){
    app.use(express.logger('dev'));
    app.use(express.errorHandler());
});



require('./server/routes.js')(app);

//app.set('port', process.env.VCAP_APP_PORT || config.port);
http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});