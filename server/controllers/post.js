var _ =           require('underscore')
    , User =      require('../models/User.js')
    , userRoles = require('../../client/js/routingConfig').userRoles
    , Firebase = require('../models/Firebase.js');

var mongojs = require('mongojs');

var db = mongojs(config.URIMONGODB);

var postsmongo = db.collection('posts');



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

    remove: function(req,res){

        postsmongo.remove({id:req.body.id});

        var myRootRef = Firebase.getRef('posts/' + req.body.username + '/' + req.body.id);

        myRootRef.remove();

        res.json({success:'true'}); 

    },

    add: function(req, res) {

        postsmongo.find(function(err, docs){

            var id = _.max(docs, function(doc) { return doc.id; }).id + 1;

            if(_.isNaN(id)){
                id = 1;
            }

            var post = {
                id: id,
                from : req.body.from,
                to : req.body.to,
                message : req.body.message,
                type : req.body.type,
                picture : req.body.picture,
                created_time: req.body.create_time, 
                updated_time: req.body.update_time
            }

            postsmongo.save(post);

            var myRootRef = Firebase.getRef('posts/' + req.body.to + '/' + id);

            myRootRef.push(post);

            res.json({success:'true'});        

        });

        


    },
    getByUsername: function(req, res) {

        postsmongo.find({to : req.body.username}).sort({_id:-1} ,function(err, docs) {
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