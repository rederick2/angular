var passport =  require('passport')
    , User = require('../models/User.js')
    , Firebase = require('../models/Firebase.js');

var mongojs = require('mongojs');

var db = mongojs(config.URIMONGODB);

//myRootRef.set("hello world!");

module.exports = {
    register: function(req, res, next) {
        try {
            User.validate(req.body);
        }
        catch(err) {
            return res.send(400, err.message);
        }

        //var id = req.body.username;

        //myRootRef.set({ id : {username:req.body.username, password:req.body.password, role:req.body.role}});

        User.addUser(req.body.username, req.body.password, req.body.email, req.body.firstname, req.body.role, function(err, user) {
            if(err === 'UserAlreadyExists') return res.send(403, "User already exists");
            else if(err)                    return res.send(500);

            req.logIn(user, function(err) {
                if(err)     { next(err); }
                else        { res.json(200, { "role": user.role, "username": user.username }); }
            });

            var myRootRef = Firebase.getRef('users/'+ req.body.username);

            myRootRef.set(user);

            var usersmongo = db.collection('users');

            usersmongo.save(user);

        });
    },

    remove: function(req, res, next) {

        User.deleteUser(req.body.username, function(err, user) {
            if(err === 'UserNotExists') return res.send(403, "User not exists");
            else if(err)                    return res.send(500);

        });
    },

    login: function(req, res, next) {
        passport.authenticate('local', function(err, user) {

            if(err)     { return next(err); }
            if(!user)   { return res.send(400); }


            req.logIn(user, function(err) {
                if(err) {
                    return next(err);
                }

                if(req.body.rememberme) req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
                res.json(200, { "role": user.role, "username": user.username, "email": user.email});
            });
        })(req, res, next);
    },

    loginFb: function(req, res, next) {
        User.firebaseAuth(req.body.provider, req.body.id, req.body.username, req.body.email, function(err, user){
            if(err === 'UserAlreadyExists') return res.send(403, "User already exists");
            else if(err)                    return res.send(500);
            //console.log(user);
            req.logIn(user, function(err) {
                if(err)     { next(err); }
                else        { res.json(200, { "role": user.role, "username": user.username }); }
            });
        });
    },

    logout: function(req, res) {
        req.logout();
        res.send(200);
    }
};