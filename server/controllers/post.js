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

    add: function(req, res) {

        var postsmongo = db.collection('posts');

        var post = {
            from : {
                username : req.body.username
            },
            message : req.body.message,
            type : req.body.type,
            picture : req.body.picture,
            created_time: req.body.create_time, 
            updated_time: req.body.update_time
        }

        

        postsmongo.save(post);

        var myRootRef = Firebase.getRef('posts/' + req.body.username);

        myRootRef.push(post);

        res.json({success:'true'});


    },
    getByUsername: function(req, res) {

        var postsmongo = db.collection('posts');

        

        postsmongo.find({from : {username:req.body.username} }).sort({_id:-1} ,function(err, docs) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                res.json(docs);
            }

        });

    }
};