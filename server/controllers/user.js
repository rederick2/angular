var _ =           require('underscore')
    , mongoose = require('mongoose')
    , User = mongoose.model('User')
    , Profile = mongoose.model('Profile')
    , Experience = mongoose.model('Experience')
    , Message = mongoose.model('Message')
    , Counter = mongoose.model('Counter')
    , Inbox = mongoose.model('Inbox')
    , userRoles = require('../../client/js/routingConfig').userRoles
    , Firebase = require('../models/Firebase.js');

var jwt = require('jwt-simple');


module.exports = {
    index: function(req, res) {

        User.AllUsers(function(err,users){

            if(err) return res.send(403, err);

            if(users) res.json(users);

        });
        
    },

    query: function(req, res) {

        if(req.body.q !== ''){

            User.find({name:{$regex:req.body.q}}, '_id username picture name').limit(10).sort({id:-1}).exec(function(err, users) {
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

        var sm = User.find(null, '_id username picture name').limit(req.body.limit).sort({id:-1}).skip((req.body.page) * req.body.limit).stream();

        var docs = [];

        sm.on('data', function (doc) {
            
            if(!doc) return res.json({success:'true'});

            if(doc) this.pause();

            var self = this;

            Profile.findOne({ user: doc }, function (err, profile) {

                Experience.findOne({ profile: profile, endDate: null }, 'company', function (err, experience) {

                    if(experience) doc.company = experience.company;

                    docs.push(doc);

                    self.resume();

                });

            });

        }).on('error', function (err) {

          // handle the error
          return res.send(403, err);

        }).on('close', function () {

          // the stream is closed
            res.json(docs);

        });

    },
    getByUsername: function(req, res) {

        User.findOne({username:req.body.username}, '_id username picture name' ,function(err, doc) {
            
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

                res.json({success:'true', inbox: inbox}); 
            });
        });
    }, 

    token : function(req, res){

        var username = req.body.username;
        var password = req.body.password;

        User.findOne({username: username, password: password}, function(err, user){
            
            if(err) return res.send(403, err);

            if(!user) return res.json({message: 'Datos incorrectos'} )

            var token = jwt.encode({username: username}, config.token.secret);
            
            res.json({token : token});

        });

    }
};