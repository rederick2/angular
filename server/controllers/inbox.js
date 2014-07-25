var _ =           require('underscore')
    , mongoose = require('mongoose')
    , Inbox = mongoose.model('Inbox')
    , User = mongoose.model('User')
    , Message = mongoose.model('Message')
    , Counter = mongoose.model('Counter')
    , userRoles = require('../../client/js/routingConfig').userRoles
    , Firebase = require('../models/Firebase.js');


module.exports = {
    
    add: function(req, res) {

        try{

          // try

        }catch(e){

            console.log(e);
        }

    },

    getByUsername: function(req, res) {

        User.findOne({username: req.body.username}, function(err, user){

            if(err) return res.send(403, err);

            if(!user) return res.json({message: 'Usuario no existe'});

            Inbox.find({user : user}).populate('user' , 'username name picture').populate('to' , 'username name picture').exec(function(err, docs) {
                if (err) {

                    res.send(403, err);

                } else {

                    res.json(docs);

                }

            });

        });

    },

    getByTo: function(req, res) {

        User.findOne({username: req.body.username}, function(err, user){

            if(err) return res.send(403, err);

            if(!user) return res.json({message: 'Usuario no existe'});

            User.findOne({username: req.body.to}, function(err, userTo){

                if(err) return res.send(403, err);

                if(!user) return res.json({message: 'Usuario no existe'});

                Inbox.findOne({user : user, to: userTo}).populate('user' , 'username name picture').populate('to' , 'username name picture').exec(function(err, docs) {
                    if (err) {
                        res.send(403, err);
                    } else {

                        res.json(docs);
                    }

                });
            });
        });

    },

    getMessages: function(req, res) {

        Inbox.findOneAndUpdate({id: req.body.id}, {unread : true}).exec(function(err, inbox){

            if(err) return res.send(403, err);

            if(!inbox) return res.json({message: 'Inbox no existe'});

            Message.find({inbox:inbox}).populate('from', 'username name picture').populate('to', 'username name picture').exec(function(err, messages){

                if(err) return res.send(403, err);

                if(!messages) return res.json({message: 'Ningun Mensaje en este inbox'});

                return res.json(messages);

            })
        });
       

    },

    unread: function(req, res){
        Inbox.update({id:req.body.id} , {unread:true}).exec();
    }
};