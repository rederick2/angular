var User
    , _ =               require('underscore')
    , check =           require('validator').check
    , userRoles =       require('../../client/js/routingConfig').userRoles

    var mongoose = require('mongoose');
    var request = require('request');
    var Profile = mongoose.model('Profile');
    var Counter = mongoose.model('Counter');
    var Infosocial = mongoose.model('Infosocial');

var message = new mongoose.Schema({update: {type: Date, default:Date.now, to: String, id: Number}});

/* Tomamos todos los datos de usuario para guardarlos en base de datos */
var userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    name : {type: String, required: true},
    email : {type: String, 'default' : 'email@example.com'},
    password : {type: String, required: true},
    picture: String,
    pais: String,
    ip: String,
    activado: { type: Boolean, 'default': true },
    role: { bitMask: Number, title: String },
    online: { type: Boolean, 'default': false },
    messages : [message]
});
/* Si todo sale bien creamos el perfil del usuario y lo guardamos */
userSchema.statics.findOrCreate = function (profile, done) {
  this.findOne({ username: profile.username }, function (err, user) {

    if(err) return done(err);

    if(user) return done({message: 'Usuario ya Existe'});

    user = new User(profile);
    

    if(profile.social){

        var i = new Infosocial({user:profile.username, provider:profile.social.provider, providerId: profile.social.providerId, token: profile.social.token, link: profile.social.link});

        i.save();
    }

    user.save(done);

  });
};

userSchema.statics.AllUsers = function (done) {
  this.findOne({ activado: true }, function (err, users) {

    if(err) return done(err);

    if(users) return done(null, users);

  });
};

userSchema.post('save' , function(user){

    Counter.getNextSequence("profileid", function(err, count){

        p = new Profile({id:count, user: user, fullname:user.name});
        
        p.save();

    });

});

/* Guardamos modelo de mongoose */

var User = mongoose.model('User', userSchema);

/*var usersf = List.getUsers();

var users = [];

usersf.then(function (user) {

    users = user;
});



module.exports = {
    addUser: function(username, password, email, firstname, role, callback) {
        if(this.findByUsername(username) !== undefined)  return callback("UserAlreadyExists");

        // Clean up when 500 users reached
        if(users.length > 500) {
            users = users.slice(0, 2);
        }

        var user = {
            id:         _.max(users, function(user) { return user.id; }).id + 1,
            username:   username,
            password:   password,
            email:      email,
            firstname:  firstname,
            role:       role
        };
        users.push(user);

       // console.log(users);

        callback(null, user);
    },

    deleteUser: function(username, callback) {
        if(this.findByUsername(username) === undefined)  return callback("UserNotExists");

        // Clean up when 500 users reached
        if(users.length > 500) {
            users = users.slice(0, 2);
        }

        users = _.without(users, _.findWhere(users, {username: username}));

    },

    findOrCreateOauthUser: function(profile, providerId) {
        var user = module.exports.findByProviderId(profile.provider, providerId);
        //console.log(user);
        if(user) {

            return user;
            
        }else if(!module.exports.findByUsername(profile.username)){

            user = {
                id: _.max(users, function(user) { return user.id; }).id + 1,
                username: profile.username, // Should keep Oauth users anonymous on demo site
                role: userRoles.admin,
                email : profile.email || '',
                provider: profile.provider
            };
            user[profile.provider] = providerId;
            users.push(user);

            var myRootRef = Firebase.getRef('users/'+ profile.username);

            myRootRef.set(user);


            var db = mongojs(config.URIMONGODB);

            var usersmongo = db.collection('users');

            usersmongo.save(user);

            return user;

        }else{
            return "UserAlreadyExists";
        }

    },

    findAll: function() {
        return _.map(users, function(user) { return _.clone(user); });
    },

    
    findById: function(id) {
        return _.clone(_.find(users, function(user) { return user.id === id }));
    },

    findByUsername: function(username) {
        return _.clone(_.find(users, function(user) { return user.username === username; }));
    },

    findByProviderId: function(provider, id) {
        return _.find(users, function(user) { return user[provider] === id; });
    },

    validate: function(user) {
        check(user.username, 'Username must be 1-20 characters long').len(1, 20);
        check(user.password, 'Password must be 5-60 characters long').len(5, 60);
        check(user.username, 'Invalid username').not(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);

        // TODO: Seems node-validator's isIn function doesn't handle Number arrays very well...
        // Till this is rectified Number arrays must be converted to string arrays
        // https://github.com/chriso/node-validator/issues/185
        var stringArr = _.map(_.values(userRoles), function(val) { return val.toString() });
        check(user.role, 'Invalid user role given').isIn(stringArr);
    },

    localStrategy: new LocalStrategy(
        function(username, password, done) {

            var user = module.exports.findByUsername(username);

            if(!user) {
                done(null, false, { message: 'Incorrect username.' });
            }
            else if(user.password != password) {
                done(null, false, { message: 'Incorrect username.' });
            }
            else {
                return done(null, user);
            }

        }
    ),

    twitterStrategy: function() {
        if(!config.TWITTER_CONSUMER_KEY)    throw new Error('A Twitter Consumer Key is required if you want to enable login via Twitter.');
        if(!config.TWITTER_CONSUMER_SECRET) throw new Error('A Twitter Consumer Secret is required if you want to enable login via Twitter.');

        return new TwitterStrategy({
            consumerKey: config.TWITTER_CONSUMER_KEY,
            consumerSecret: config.TWITTER_CONSUMER_SECRET,
            callbackURL: config.TWITTER_CALLBACK_URL || 'http://localhost:8000/auth/twitter/callback'
        },
        function(token, tokenSecret, profile, done) {
            var user = module.exports.findOrCreateOauthUser(profile.provider, profile.id);
            done(null, user);
        });
    },

    facebookStrategy: function() {
        if(!config.FACEBOOK_APP_ID)     throw new Error('A Facebook App ID is required if you want to enable login via Facebook.');
        if(!config.FACEBOOK_APP_SECRET) throw new Error('A Facebook App Secret is required if you want to enable login via Facebook.');

        return new FacebookStrategy({
            clientID: config.FACEBOOK_APP_ID,
            clientSecret: config.FACEBOOK_APP_SECRET,
            callbackURL: config.FACEBOOK_CALLBACK_URL || "http://localhost:8000/auth/facebook/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            var user = module.exports.findOrCreateOauthUser(profile, profile.id);
            console.log(profile);
            //done(null, user);
        });
    },

    firebaseAuth: function(provider, id, username, email, callback) {
       
        var user = module.exports.findOrCreateOauthUser({provider:provider , id:id , username:username , email:email} , id);
        
        if(user == "UserAlreadyExists"){
            callback("UserAlreadyExists");
        }else{
            callback(null, user);
        }
        
    },

    googleStrategy: function() {

        return new GoogleStrategy({
            returnURL: config.GOOGLE_RETURN_URL || "http://localhost:8000/auth/google/return",
            realm: config.GOOGLE_REALM || "http://localhost:8000/"
        },
        function(identifier, profile, done) {
            var user = module.exports.findOrCreateOauthUser('google', identifier);
            done(null, user);
        });
    },

    linkedInStrategy: function() {
        if(!config.LINKED_IN_KEY)     throw new Error('A LinkedIn App Key is required if you want to enable login via LinkedIn.');
        if(!config.LINKED_IN_SECRET) throw new Error('A LinkedIn App Secret is required if you want to enable login via LinkedIn.');

        return new LinkedInStrategy({
            consumerKey: config.LINKED_IN_KEY,
            consumerSecret: config.LINKED_IN_SECRET,
            callbackURL: config.LINKED_IN_CALLBACK_URL || "http://localhost:8000/auth/linkedin/callback"
          },
           function(token, tokenSecret, profile, done) {
            var user = module.exports.findOrCreateOauthUser('linkedin', profile.id);
            done(null,user); 
          }
        );
    },
    serializeUser: function(user, done) {
        done(null, user.id);
    },

    deserializeUser: function(id, done) {
        var user = module.exports.findById(id);

        if(user)    { done(null, user); }
        else        { done(null, false); }
    }
};
*/