var _ =           require('underscore')
    , mongoose = require('mongoose')
    , User = mongoose.model('User')
    , Message = mongoose.model('Message')
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

        User.findOne({username:req.body.username} ,function(err, doc) {
            
            if (err) return res.send(500, err);
            
            if(!doc) return res.json({success:0});
            
            return res.json(doc);
            

        });

    },
    update: function(req, res) {

        try{

            User.update({username:req.body.username} , {$set: {'picture':req.body.value}}).exec();

            var myRootRef = Firebase.getRef('users/' + req.body.username);

            myRootRef.update({'picture':req.body.value});
            
            res.json({success:'true'}); 

        }catch(e){
            console.log(e);
        }

    },
    addMessage: function(req, res) {

        var fromUser = req.body.from;
        var toUser = req.body.to;
        var time = req.body.time;
        var content = req.body.text;

        var message =   [{
                            to: req.body.to,
                            from: req.body.from,
                            text: req.body.text,
                            time : req.body.time
                        }];

        Inbox.findOrCreate(fromUser, toUser, content, time, 1, function(err, inbox){
            
            if(err) return res.send(403, err);

            Inbox.findOrCreate(toUser, fromUser, content, time, 2, function(err, inbox){
                
                if(err) return res.send(403, err);

                res.json({success:'true'}); 
            });
        });
    }
};