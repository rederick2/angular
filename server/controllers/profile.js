var _ =           require('underscore')
    , User =      require('../models/User.js')
    , userRoles = require('../../client/js/routingConfig').userRoles
    , Firebase = require('../models/Firebase.js');

var mongojs = require('mongojs');

var db = mongojs(config.URIMONGODB);

var profile = db.collection('profile');



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

        try{

            profile.remove({id:req.body.id});

            var myRootRef = Firebase.getRef('posts/' + req.body.username + '/' + req.body.id);

            myRootRef.remove();

            res.json({success:'true'}); 

        }catch(e){
            console.log(e);
        }

        

    },

    removeComment: function(req, res) {

        try{

            profile.update({id:req.body.idpost}, {$pull: {'comments': {'id': req.body.id}}});

            var myRootRef = Firebase.getRef('posts/' + req.body.from + '/' + req.body.idpost + '/comments/' + req.body.id);

            myRootRef.remove();

            res.json({success:'true'}); 

        }catch(e){
            console.log(e);
        }

        


    },

    addComment: function(req, res) {

        profile.find({id:req.body.idpost},function(err, docs){

            
            var id = _.max(docs[0].comments, function(doc) { return doc.id; }).id + 1;
           

            //console.log(docs);

            if(_.isNaN(id)){
                id = 1;
            }

            var comment = {
                id: id,
                from : req.body.from,
                comment:req.body.comment,
                created_time: req.body.created_time, 
                updated_time: req.body.updated_time
            }

            try{

                profile.update({id:req.body.idpost},{$push:{'comments':comment}});

                var myRootRef = Firebase.getRef('posts/' + req.body.to + '/' + req.body.idpost + '/comments/' + id);

                myRootRef.set(comment);

                res.json({success:'true'});  

            }catch(e){
                 console.log(e);
            }

                 

        });

        


    },

    add: function(req, res) {

        profile.find({username:req.body.username}, function(err, docs){

            if(docs.length == 0 ){

                profile.find(function(err, profiles){

                    var id = _.max(profiles, function(p) { return p.id; }).id + 1;

                    if(_.isNaN(id)){
                        id = 1;
                    }

                    var p = {
                        id: id,
                        username: req.body.username,
                        fullname: req.body.fullname,
                        location: req.body.location,
                        dob : req.body.dob
                    }

                    try{

                        profile.save(p);

                        var myRootRef = Firebase.getRef('profiles/' + req.body.username );

                        myRootRef.set(p);

                        res.json({success:'true'});  

                    }catch(e){
                         console.log(e);
                    }
                });

            }else{

                var p = {
                    fullname: req.body.fullname,
                    location: req.body.location,
                    dob : req.body.dob
                }

                try{

                    profile.update({username : req.body.username }, {$set : p});

                    var myRootRef = Firebase.getRef('profiles/' + req.body.username );

                    myRootRef.update(p);

                    res.json({success:'true'});  

                }catch(e){
                     console.log(e);
                }



            }    

        });

    },

    getByUsername: function(req, res) {

        profile.find({username : req.body.username} , function(err, docs) {
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