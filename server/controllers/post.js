var _ =           require('underscore')
    , mongoose = require('mongoose')
    , Post = mongoose.model('Post')
    , User = mongoose.model('User')
    , Counter = mongoose.model('Counter')
    , userRoles = require('../../client/js/routingConfig').userRoles
    , Firebase = require('../models/Firebase.js');

/*var mongojs = require('mongojs');

var db = mongojs(config.URIMONGODB);

var postsmongo = db.collection('posts');*/



module.exports = {
    index: function(req, res) {
        
        Post.find().limit(req.body.limit).sort({_id:-1}).skip((req.body.page) * req.body.limit).exec(function(err, docs) {
            if (err) {
                res.send(403, err);
            } else {

                var usernames = docs.map(function(doc) { return doc.from; });

                User.find({ username : { $in : usernames } }, function(err, users) {
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

            Post.remove({id:req.body.id}).exec();

            var myRootRef = Firebase.getRef('posts/' + req.body.username + '/' + req.body.id);

            myRootRef.remove();

            res.json({success:'true'}); 

        }catch(e){
            console.log(e);
        }

        

    },

    removeComment: function(req, res) {

        try{

            Post.update({id:req.body.idpost}, {$pull: {'comments': {'id': req.body.id}}});

            var myRootRef = Firebase.getRef('posts/' + req.body.from + '/' + req.body.idpost + '/comments/' + req.body.id);

            myRootRef.remove();

            res.json({success:'true'}); 

        }catch(e){
            console.log(e);
        }

        


    },

    addComment: function(req, res) {

        Post.find({id:req.body.idpost},function(err, docs){

            
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

                Post.update({id:req.body.idpost},{$push:{'comments':comment}});

                var myRootRef = Firebase.getRef('posts/' + req.body.to + '/' + req.body.idpost + '/comments/' + id);

                myRootRef.set(comment);

                res.json({success:'true'});  

            }catch(e){
                 console.log(e);
            }

                 

        });

        


    },

    add: function(req, res) {

        try{

            Counter.getNextSequence("postid", function(err, count){

                if(count != 0){

                    var model = {
                            id: count,
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
                            created_time: Date.now
                        }

                    var post = new Post(model);

                    post.save();

                    var myRootRef = Firebase.getRef('posts/' + req.body.to + '/' + count);

                    myRootRef.set(model);

                    res.json({success:'true'});  

                }else{

                    res.json({success:'false'});  
                }

            });

        }catch(e){
             console.log(e);
        }

    },
    getByUsername: function(req, res) {

        Post.find({to : req.body.username}).limit(req.body.limit).sort({_id:-1}).skip((req.body.page) * req.body.limit).exec(function(err, docs) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {

                var usernames = docs.map(function(doc) { return doc.from; });

                User.find({ username : { $in : usernames } }, function(err, users) {
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