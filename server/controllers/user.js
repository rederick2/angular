var _ =           require('underscore')
    , mongoose = require('mongoose')
    , User = mongoose.model('User')
    , Counter = mongoose.model('Counter')
    , Inbox = mongoose.model('Inbox')
    , userRoles = require('../../client/js/routingConfig').userRoles
    , Firebase = require('../models/Firebase.js');


module.exports = {
    index: function(req, res) {

        User.AllUsers(function(err,users){

            if(err) return res.send(403, err);

            if(users) res.json(users);

        });
        
    },

    query: function(req, res) {

        if(req.body.q !== ''){

            User.find({username:{$regex:req.body.q}}).limit(10).sort({id:-1}).exec(function(err, users) {
                if (err) {
                    res.send(403, err);
                } else {
                    res.json(users);
                }

            });
        }else{
            res.json([]);
        }

    },

    getUsers: function(req, res) {

        User.find().limit(req.body.limit).sort({id:-1}).skip((req.body.page) * req.body.limit).exec(function(err, docs) {
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

        User.find({username:req.body.username} ,function(err, docs) {
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

            User.update({username:req.body.username} , {$set: {'picture':req.body.value}});

            var myRootRef = Firebase.getRef('users/' + req.body.username);

            myRootRef.update({'picture':req.body.value});
            
            res.json({success:'true'}); 

        }catch(e){
            console.log(e);
        }

    },
    addMessage: function(req, res) {
        
        var id = 0;

        var message =   [{
                            to: req.body.to,
                            from: req.body.from,
                            text: req.body.text,
                            time : req.body.time
                        }];

        Inbox.findOne({ username : req.body.from, to: req.body.to}, function(err, doc){

            if(err) return res.send(403, err);

            if(doc) id  = doc.id;

            if(id == 0){

                var idInbox1, idInbox2;

                Counter.getNextSequence("profileid", function(err, count){

                    idInbox1 = count;

                    Counter.getNextSequence("profileid", function(err, count){

                        idInbox2 = count;

                        var inbox = {
                            id: idInbox1,
                            from: req.body.from,
                            to : req.body.to
                            
                        }

                        var inbox2 = {
                            id: idInbox2,
                            username: req.body.to,
                            to : req.body.from
                            
                        }

                        try{

                            var model1 = new Inbox(inbox)

                            model1.messages = message;

                            model1.save();

                            var model2 = new Inbox(inbox2);

                            model2.messages = message;

                            model2.save();

                            myRootRef = Firebase.getRef('inboxes/' + idInbox1);

                            myRootRef.set(inbox);

                            myRootRef = Firebase.getRef('inboxes/' + idInbox1 + '/messages');

                            myRootRef.push(message[0]);

                            myRootRef2 = Firebase.getRef('inboxes/' + idInbox2);

                            myRootRef2.set(inbox);

                            myRootRef2 = Firebase.getRef('inboxes/' + idInbox2 + '/messages');

                            myRootRef2.push(message[0]);

                            /*var messageTo = {
                                id: idInbox1,
                                to: req.body.to,
                                update : req.body.time
                            }

                            var messageFrom = {
                                id: idInbox2,
                                to: req.body.from,
                                update : req.body.time
                            }

                            User.update({username:req.body.from},{$push:{'messages':messageTo}}).exec();

                            User.update({username:req.body.to},{$push:{'messages':messageFrom}}).exec();*/

                            res.json({success:'true', id: idInbox1});  

                        }catch(e){
                             console.log(e);
                        }

                    });
                });

            
                
            }else{


                    try{

                        Inbox.update({id: id} , {$push: {'messages' : message[0]}}).exec();

                        //db.collection('inboxes').update({id: id + 1} , {$push: {'messages' : message}});

                        User.update({username:req.body.from , 'messages.id' : id},{$set:{'messages.$.update': req.body.time}}).exec();

                        //db.collection('users').update({username:req.body.to, 'messages.id' : id + 1},{$set:{'messages.$.update':req.body.time}});

                        myRootRef = Firebase.getRef('inboxes/' + id + '/messages');

                        myRootRef.push(message[0]);

                        //myRootRef2 = Firebase.getRef('inboxes/' + (id + 1) + '/messages');

                        //myRootRef2.push(message);

                        Inbox.findOneAndUpdate({username:req.body.to, to: req.body.from}, {$push: {'messages' : message[0]}},  function(err, doc){

                            if(err) return res.send(500, err);

                            //Inbox.update({id: doc.id} , {$push: {'messages' : message}}).exec();

                            //User.update({username:req.body.to, 'messages.id' : arr.id},{$set:{'messages.$.update':req.body.time}}).exec();
                            if(doc){

                                myRootRef2 = Firebase.getRef('inboxes/' + doc.id + '/messages');

                                myRootRef2.push(message[0]);


                            }else{

                                Counter.getNextSequence("profileid", function(err, count){

                                    var inbox = {

                                            id: count,
                                            username: req.body.to,
                                            to : req.body.from
                                            
                                        };

                                    var model = new Inbox(inbox);

                                    model.messages = message;

                                    model.save();

                                    myRootRef = Firebase.getRef('inboxes/' + count);

                                    myRootRef.set(inbox);

                                    myRootRef = Firebase.getRef('inboxes/' + count + '/messages');

                                    myRootRef.push(message[0]);

                                });

                            }

                            res.json({success:'true', id: id});


                        });
 

                    }catch(e){
                         console.log(e);
                    }
                

            }

        });

    }
};