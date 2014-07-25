var _ =           require('underscore')
    , mongoose = require('mongoose')
    , Profile = mongoose.model('Profile')
    , Education = mongoose.model('Education')
    , Experience = mongoose.model('Experience')
    , User = mongoose.model('User')
    , Counter = mongoose.model('Counter')
    , userRoles = require('../../client/js/routingConfig').userRoles
    , Firebase = require('../models/Firebase.js');


module.exports = {
    
    update: function(req, res) {

        User.findOne({username:req.body.username}, function(err, user){

            if(err) return res.send(403, err);

            if(!user) return res.json({success:'true'});

            Profile.update({user:user}, 
                    {
                        fullname: req.body.fullname, 
                        location: req.body.location,           
                        dob : req.body.dob,
                        marital : req.body.marital,
                        gender : req.body.gender
                    }).exec();

        });


    },

    getByUsername: function(req, res) {

        User.findOne({username:req.body.username}, function(err, user){
            
            if(err) return res.send(500,err);

            if(!user) return res.json({success:'true'});

            Profile.findOne({user : user} , function(err, profile) {
                
                if (err) return res.send(403, err);

                if(!profile) return res.json({success:'true'});

                Education.find({profile : profile } , function(err, educations) {

                    var r = 0;
            
                    if (err) return res.send(403, err);

                    if(educations) r = educations;

                    res.json({success:'true', profile: profile, educations: r});

                });


            });

        });

        

    }, 

    getEducations: function(req, res){

        Profile.findOne({id : req.body.id } , function(err, profile) {
                
            if (err) return res.send(403, err);

            if(!profile) return res.json({success:'true'});

            Education.find({profile : profile } , function(err, educations) {
            
                if (err) return res.send(403, err);

                if(!educations) return res.json({success:'true', result:0});

                res.json({success:'true', result: educations});

            });
        });

    },

    addEducation: function(req, res){

        Profile.findOne({id : req.body.id } , function(err, profile) {
                
                if (err) return res.send(403, err);

                if(!profile) return res.json({success:'true'});

                Counter.getNextSequence("educationid", function(err, count){

                        var e = new Education({
                                                id: count,
                                                profile: profile,
                                                school: req.body.school,
                                                yearStart: req.body.yearStart,
                                                yearEnd: req.body.yearEnd,
                                                schoolDegree: req.body.schoolDegree,
                                                career:req.body.career,
                                                description : req.body.description
                                            });

                        e.save();

                        return res.json({success:'true'});

                    });

            });
    },

    updateEducation: function(req, res) {

        Education.update({id:req.body.id}, 
                {
                    school: req.body.school,
                    yearStart: req.body.yearStart,
                    yearEnd: req.body.yearEnd,
                    schoolDegree: req.body.schoolDegree,
                    career:req.body.career,
                    description : req.body.description

                }, function(err, numberAffected, rawResponse){

                    if (err) return res.send(403, err);

                    res.json({success:'true', numberAffected: numberAffected , rawResponse: rawResponse });

                });

    },

    removeEducation: function(req, res){

        Education.findOne({id:req.body.id} , function(err, e){

            if(!e) return res.json({message: 'No se encontro'});

            if(err) return res.send(500, err);

            e.remove();

            res.json({success:'true'});


        });

    }
};