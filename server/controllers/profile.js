var _ =           require('underscore')
    , mongoose = require('mongoose')
    , Profile = mongoose.model('Profile')
    , User = mongoose.model('User')
    , Counter = mongoose.model('Counter')
    , userRoles = require('../../client/js/routingConfig').userRoles
    , Firebase = require('../models/Firebase.js');


module.exports = {
    
    add: function(req, res) {

        try{

            Profile.findOrCreate({
                id: 0,
                username: req.body.username,
                fullname: req.body.fullname,
                location: req.body.location,
                dob : req.body.dob,
                marital : req.body.marital,
                gender : req.body.gender

            }, function(err, doc){
                if(doc){

                    var p = {
                                fullname: req.body.fullname,
                                location: req.body.location,
                                dob : req.body.dob,
                                marital : req.body.marital,
                                gender : req.body.gender
                            };

                    Profile.update({username:req.body.username}, p).exec();

                    var myRootRef = Firebase.getRef('profiles/' + req.body.username );

                    myRootRef.update(p);

                    res.json({success:'true'});

                }else if(err){

                    res.send(403, err);
                }

            });

        }catch(e){

            console.log(e);
        }

    },

    getByUsername: function(req, res) {

        Profile.find({username : req.body.username} , function(err, docs) {
            if (err) {
                res.send(403, err);
            } else {

                res.json(docs);

            }

        });

    }
};