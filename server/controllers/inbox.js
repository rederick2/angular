var _ =           require('underscore')
    , mongoose = require('mongoose')
    , Inbox = mongoose.model('Inbox')
    , User = mongoose.model('User')
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

        Inbox.find({username : req.body.username} , function(err, docs) {
            if (err) {
                res.send(403, err);
            } else {

                res.json(docs);

            }

        });

    },

    getByTo: function(req, res) {

        Inbox.findOne({username : req.body.username, to: req.body.to} , function(err, docs) {
            if (err) {
                res.send(403, err);
            } else {

                res.json(docs);

            }

        });

    }
};