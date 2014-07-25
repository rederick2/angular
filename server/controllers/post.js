var _ =           require('underscore')
    , mongoose = require('mongoose')
    , Post = mongoose.model('Post')
    , User = mongoose.model('User')
    , Counter = mongoose.model('Counter')
    , Comment = mongoose.model('Comment')
    , userRoles = require('../../client/js/routingConfig').userRoles
    , Firebase = require('../models/Firebase.js');

/*var mongojs = require('mongojs');

var db = mongojs(config.URIMONGODB);

var postsmongo = db.collection('posts');*/



module.exports = {
    index: function(req, res) {
        

        var docs = [];

        var sm = Post.find().limit(req.body.limit).sort({_id:-1}).skip((req.body.page) * req.body.limit).populate('from' , 'username name picture').populate('to' , 'username name picture').stream();
        
        sm.on('data', function (doc) {
          // do something with the mongoose document
          if(!doc) return res.json({success:'true'});

          if(doc) this.pause();

          var self = this;

          Comment.find({post:doc}).populate('from' , 'username name picture').exec(function(err, comments){

                if(!comments) return res.json({success:'true'});

                var comment = [];

                if(comments){

                    comments.forEach(function(x){
                        
                        console.log(x);
                        
                        comment = { id: x.id, from:{username:x.from.username, name:x.from.name, picture:x.from.picture}, message:x.message, created_time: x.created_time};
                        
                        doc.comments.push(comment);
                    });

                }
                

                docs.push(doc);

                self.resume();

                

          });

        }).on('error', function (err) {

          // handle the error
          return res.send(403, err);

        }).on('close', function () {

          // the stream is closed

          res.json(docs);
          
        });


    },

    remove: function(req,res){

        try{

            Post.findOne({id:req.body.id}).populate('to' , 'username').exec(function(err, doc){

                if(!doc) return res.json({message: 'No se encontro post'});

                if(err) return res.send(500, err);

                var myRootRef = Firebase.getRef('posts/' + doc.to.username + '/' + req.body.id);

                myRootRef.remove();

                doc.remove();

                res.json({success:'true'});


            });

             

        }catch(e){
            console.log(e);
        }

        

    },

    removeComment: function(req, res) {

        try{

            Post.findOne({id:req.body.idpost}).populate('to' , 'username').exec(function(err, doc){

                var myRootRef = Firebase.getRef('posts/' + doc.to.username + '/' + req.body.idpost + '/comments/' + req.body.id);

                myRootRef.remove();

                Comment.remove({id:req.body.id}).exec();

                //doc.remove();

                res.json({success:'true'});

            });

             

        }catch(e){
            console.log(e);
        }

        


    },

    addComment: function(req, res) {

        Post.findOne({id:req.body.idpost}).populate('to' , 'username').exec(function(err, doc){

            if(err) return res.send(500, err);

            if(!doc) return res.json({mensaje : 'No se encontro el post'});

            
            Counter.getNextSequence("commentid" , function(err, count){

                User.findOne({username:req.body.from}, function(err, user){

                    var comment = new Comment({id:count, from: user, post:doc, message:req.body.message});

                    comment.save();

                    var myRootRef = Firebase.getRef('posts/' + doc.to.username + '/' + doc.id + '/comments/' + count);

                    myRootRef.set({id:count, from: user.username, fromPicture: user.picture, fromName: user.name, message:req.body.message, time:req.body.time});

                    res.json({success:'true' , to:doc.to.username, name: user.name,  id: doc.id}); 
                });

            });
           

        });

    },

    getComments : function(req, res){
        Post.findOne({id : req.body.id}, function(err, doc){
            
            if(err) return res.send(500, err);

            Comment.find({post:doc}).limit(20).sort({created_time:'desc'}).populate('from' , 'username name picture').exec(function(err,comments){

                res.json(comments);

            });


        });
        
    },

    add: function(req, res) {

        try{

            User.findOne({username:req.body.from}, function(err, from){
                
                if(err) return res.send(500, err);

                User.findOne({username:req.body.to}, function(err, to){

                    if(err) return res.send(500, err);

                    Counter.getNextSequence("postid", function(err, count){

                            var model = {
                                    id: count,
                                    from : from,
                                    to : to,
                                    title : req.body.title,
                                    picture : req.body.picture,
                                    source : req.body.source,
                                    url : req.body.url,
                                    fuente : req.body.fuente,
                                    description : req.body.description,
                                    message : req.body.message,
                                    type : req.body.type
                                }

                            var post = new Post(model);

                            post.save();

                            var myRootRef = Firebase.getRef('posts/' + to.username + '/' + count);

                            myRootRef.set({
                                    id: count,
                                    from : from.username,
                                    to : to.username,
                                    title : req.body.title,
                                    picture : req.body.picture,
                                    source : req.body.source,
                                    url : req.body.url,
                                    fuente : req.body.fuente,
                                    description : req.body.description,
                                    message : req.body.message,
                                    type : req.body.type
                                });

                            res.json({success:'true'});  

                    });


                });
            });

            
        }catch(e){
             console.log(e);
        }

    },
    getByUsername: function(req, res) {

        User.findOne({username:req.body.username} , function(err, user){

            var docs = [];

            var sm = Post.find({to:user}).limit(req.body.limit).sort({_id:-1}).skip((req.body.page) * req.body.limit).populate('from' , 'username name picture').populate('to' , 'username name picture').stream();
            
            sm.on('data', function (doc) {
              // do something with the mongoose document
              if(doc) this.pause();

              var self = this;

              Comment.find({post:doc}).populate('from' , 'username name picture').exec(function(err, comments){

                    var comment = [];

                    if(comments){

                        comments.forEach(function(x){
                            
                            console.log(x);
                            
                            comment = { id: x.id, from:{username:x.from.username, name:x.from.name, picture:x.from.picture}, message:x.message, created_time: x.created_time};
                            
                            doc.comments.push(comment);
                        });

                    }
                    

                    docs.push(doc);

                    self.resume();

                    

              });

            }).on('error', function (err) {

              // handle the error
              return res.send(403, err);

            }).on('close', function () {

              // the stream is closed

              res.json(docs);
              
            });

        });

        

    }
};