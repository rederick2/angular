var _ =           require('underscore')
    , User =      require('../models/User.js')
    , userRoles = require('../../client/js/routingConfig').userRoles
    , Firebase = require('../models/Firebase.js');

var mongojs = require('mongojs');

var db = mongojs(config.URIMONGODB);

        



module.exports = {
    index: function(req, res) {
        var users = User.findAll();
        _.each(users, function(user) {
            delete user.password;
            delete user.twitter;
            delete user.facebook;
            delete user.google;
            delete user.linkedin;
        });
        res.json(users);
    },

    getUsers: function(req, res) {
        var usersmongo = db.collection('users');

        

        usersmongo.find().limit(req.body.limit).sort({id:-1}).skip((req.body.page) * req.body.limit,function(err, docs) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                res.json(docs);
            }

        });

    },
    getByUsername: function(req, res) {
        var usersmongo = db.collection('users');

        

        usersmongo.find({username:req.body.username} ,function(err, docs) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                res.json(docs);
            }

        });

    },
    update: function(req, res) {

        try{

            var usersmongo = db.collection('users');

            usersmongo.update({username:req.body.username} , {$set: {'picture':req.body.value}});

            var myRootRef = Firebase.getRef('users/' + req.body.username);

            myRootRef.update({'picture':req.body.value});
            
            res.json({success:'true'}); 

        }catch(e){
            console.log(e);
        }

    }
};