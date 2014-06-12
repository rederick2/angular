var mongoose = require('mongoose');
var request = require('request');
var Counter = mongoose.model('Counter');
var Firebase = require('../models/Firebase.js');

var profileSchema = new mongoose.Schema({
    id: {type:Number, required:true},
    username: {type: String, required:true},
    fullname: String,
    gender: String,
    dob: String,
    location:String,
    marital: String,
    created_time: {type: Date, default: Date.now},
    updated_time: {type: Date, default: Date.now}
}, {collection: 'profile'});

profileSchema.statics.findOrCreate = function (profile, done) {
  this.findOne({ username: profile.username }, function (err, doc) {

    if(err) return done(err);

    if(doc) return done(null, doc);

    Counter.getNextSequence("profileid", function(err, count){

        profile.id = count;

        doc = new Profile(profile);
        
        var myRootRef = Firebase.getRef('profiles/'+ profile.username);

        myRootRef.set(profile);
        
        doc.save(done);
    });

  });
};


/* Guardamos modelo de mongoose */

var Profile = mongoose.model('Profile', profileSchema);