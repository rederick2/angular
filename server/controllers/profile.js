var _ =           require('underscore')
    , async     = require('async')
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

            res.json({success:'true'});

        });


    },

    getByUsername: function(req, res) {
        

        async.waterfall([
            function(cb){
                User.findOne({username:req.body.username}, cb);
            },
            function(user, cb){
                Profile.findOne({user : user} , cb);
            },
            function(profile, cb){
                Education.find({profile : profile } , function(err, educations){cb(null, educations, profile)});
            },
            function(educations, profile, cb){
                Experience.find({profile : profile } , function(err, experiences){cb(null, educations, experiences, profile)});
            }
        ],
        function(err, educations, experiences, profile){
            if (err)
            {
                res.send(403, err);
                return false;
            } 

            var r = 0, e = 0;

            if(experiences) e = experiences;

            if(educations)  r = educations;

            res.json({success:'true', profile: profile, educations: r, experiences : e});

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
                                                description : req.body.description,
                                                created_time : req.body.created_time
                                            });

                        e.save();

                        return res.json({success:'true', o: e});

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

    },

    getExperiences: function(req, res){

        Profile.findOne({id : req.body.id } , function(err, profile) {
                
            if (err) return res.send(403, err);

            if(!profile) return res.json({success:'true'});

            Experience.find({profile : profile } , function(err, experiences) {
            
                if (err) return res.send(403, err);

                if(!experiences) return res.json({success:'true', result:0});

                res.json({success:'true', result: experiences});

            });
        });

    },

    addExperience: function(req, res){

        Profile.findOne({id : req.body.id } , function(err, profile) {
                
                if (err) return res.send(403, err);

                if(!profile) return res.json({success:'true'});

                Counter.getNextSequence("experienceid", function(err, count){

                        var e = new Experience({
                                                id: count,
                                                profile: profile,
                                                company: req.body.company, // Nombre de la Empresa
                                                position: req.body.position, // Cargo
                                                location: req.body.location, // Ubicacion de la empresa
                                                startDate : req.body.startDate,
                                                endDate : req.body.endDate,
                                                description : req.body.description,
                                                created_time: req.body.created_time
                                            });

                        e.save();

                        return res.json({success:'true', o:e});

                    });

            });
    },

    updateExperience: function(req, res) {

        Experience.update({id:req.body.id}, 
                {
                    company: req.body.company, // Nombre de la Empresa
                    position: req.body.position, // Cargo
                    location: req.body.location, // Ubicacion de la empresa
                    startDate : req.body.startDate,
                    endDate : req.body.endDate,
                    description : req.body.description

                }, function(err, numberAffected, rawResponse){

                    if (err) return res.send(403, err);

                    res.json({success:'true', numberAffected: numberAffected , rawResponse: rawResponse });

                });

    },

    removeExperience: function(req, res){

        Experience.findOne({id:req.body.id} , function(err, e){

            if(!e) return res.json({message: 'No se encontro'});

            if(err) return res.send(500, err);

            e.remove();

            res.json({success:'true'});


        });

    }
};