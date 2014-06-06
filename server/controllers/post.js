var _ =           require('underscore')
    , User =      require('../models/User.js')
    , userRoles = require('../../client/js/routingConfig').userRoles
    , Firebase = require('../models/Firebase.js');

var mongojs = require('mongojs');

var db = mongojs(config.URIMONGODB);

var postsmongo = db.collection('posts');



module.exports = {
    index: function(req, res) {
        
        postsmongo.find().limit(req.body.limit).sort({_id:-1}).skip((req.body.page) * req.body.limit , function(err, docs) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {

                var usernames = docs.map(function(doc) { return doc.from; });

                db.collection('users').find({ username : { $in : usernames } }, function(err, users) {
                    // create a mapping of username -> first name for easy lookup
                    var usernames = {};
                    users.forEach(function(user) {
                        if(user.picture){
                            usernames[user.username] = user.picture;
                        }else{
                            usernames[user.username] = 'http://placehold.it/50x50';
                        }
                        
                    });

                    docs.forEach(function(doc) {
                      doc.pictureUser = usernames[doc.from];
                    });

                    res.json(docs);
                });
            }

        });
    },

    remove: function(req,res){

        try{

            postsmongo.remove({id:req.body.id});

            var myRootRef = Firebase.getRef('posts/' + req.body.username + '/' + req.body.id);

            myRootRef.remove();

            res.json({success:'true'}); 

        }catch(e){
            console.log(e);
        }

        

    },

    removeComment: function(req, res) {

        try{

            postsmongo.update({id:req.body.idpost}, {$pull: {'comments': {'id': req.body.id}}});

            var myRootRef = Firebase.getRef('posts/' + req.body.from + '/' + req.body.idpost + '/comments/' + req.body.id);

            myRootRef.remove();

            res.json({success:'true'}); 

        }catch(e){
            console.log(e);
        }

        


    },

    addComment: function(req, res) {

        postsmongo.find({id:req.body.idpost},function(err, docs){

            
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

                postsmongo.update({id:req.body.idpost},{$push:{'comments':comment}});

                var myRootRef = Firebase.getRef('posts/' + req.body.to + '/' + req.body.idpost + '/comments/' + id);

                myRootRef.set(comment);

                res.json({success:'true'});  

            }catch(e){
                 console.log(e);
            }

                 

        });

        


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
                title : req.body.title,
                picture : req.body.picture,
                source : req.body.source,
                url : req.body.url,
                fuente : req.body.fuente,
                description : req.body.description,
                message : req.body.message,
                type : req.body.type,
                picture : req.body.picture,
                created_time: req.body.created_time, 
                updated_time: req.body.updated_time
            }

            try{

                postsmongo.save(post);

                var myRootRef = Firebase.getRef('posts/' + req.body.to + '/' + id);

                myRootRef.set(post);

                res.json({success:'true'});  

            }catch(e){
                 console.log(e);
            }

                 

        });

        


    },
    getByUsername: function(req, res) {

        postsmongo.find({to : req.body.username}).limit(req.body.limit).sort({_id:-1}).skip((req.body.page) * req.body.limit , function(err, docs) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {

                var usernames = docs.map(function(doc) { return doc.from; });

                db.collection('users').find({ username : { $in : usernames } }, function(err, users) {
                    // create a mapping of username -> first name for easy lookup
                    var usernames = {};
                    users.forEach(function(user) {
                        if(user.picture){
                            usernames[user.username] = user.picture;
                        }else{
                            usernames[user.username] = 'http://placehold.it/50x50';
                        }
                        
                    });

                    docs.forEach(function(doc) {
                      doc.pictureUser = usernames[doc.from];
                    });

                    res.json(docs);
                });
            }

        });

    }
};