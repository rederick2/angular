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

    query: function(req, res) {

        var usersmongo = db.collection('users');

        if(req.body.q !== ''){

            usersmongo.find({username:{$regex:req.body.q}}).limit(10).sort({id:-1},function(err, docs) {
                if (err) {
                    res.render('error', {
                        status: 500
                    });
                } else {
                    res.json(docs);
                }

            });
        }else{
            res.json([]);
        }

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

    },
    addMessage: function(req, res) {

        db.collection('users').find({ username : req.body.from}, function(err, docs){

            var id = 0;

            //console.log(docs);

            //console.log(_.findWhere(docs[0].messages , {to:req.body.to}));

            if(docs[0].messages){

                arr = _.findWhere(docs[0].messages , {to:req.body.to});

                if(arr){
                    id = arr.id;
                }

            }

            

            if(id == 0){
                db.collection('inboxes').find(function(err,docs){

                    var idInbox = 1;

                    if(docs.length > 0 ){
                        idInbox = _.max(docs, function(doc) { return doc.id; }).id + 1;
                    }

                    var inbox = {
                        id: idInbox,
                        messages : [{
                            to: req.body.to,
                            from: req.body.from,
                            text: req.body.text,
                            time : req.body.time
                        }]
                        
                    }

                    try{

                        db.collection('inboxes').save(inbox);

                        myRootRef = Firebase.getRef('inboxes/' + idInbox + '/messages');

                        myRootRef.push(inbox.messages[0]);

                        var messageTo = {
                            id: idInbox,
                            to: req.body.to,
                            update : new Date()
                        }

                        var messageFrom = {
                            id: idInbox,
                            to: req.body.from,
                            update : new Date()
                        }

                        db.collection('users').update({username:req.body.from},{$push:{'messages':messageTo}});

                        db.collection('users').update({username:req.body.to},{$push:{'messages':messageFrom}});

                        res.json({success:'true', id: idInbox});  

                    }catch(e){
                         console.log(e);
                    }
                });
            }else{

                var message = {
                            to: req.body.to,
                            from: req.body.from,
                            text: req.body.text,
                            time : req.body.time
                        
                    };


                    try{

                        db.collection('inboxes').update({id: id} , {$push: {'messages' : message}});

                        db.collection('users').update({username:req.body.from , 'messages.id' : id},{$set:{'messages.$.update': req.body.time}});

                        db.collection('users').update({username:req.body.to, 'messages.id' : id},{$set:{'messages.$.update':req.body.time}});

                        myRootRef = Firebase.getRef('inboxes/' + id + '/messages');

                        myRootRef.push(message);

                        res.json({success:'true', id: id});  

                    }catch(e){
                         console.log(e);
                    }
                

            }

        });

    }
};