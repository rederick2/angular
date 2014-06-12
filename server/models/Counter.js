var mongoose = require('mongoose');
var request = require('request');

var counterSchema = new mongoose.Schema({
    _id: {type: String, required:true},
    seq: Number
}, {collection: 'counters'});

counterSchema.statics.getNextSequence = function(name, done) {
                
   Counter.findOneAndUpdate({ _id: name },{ $inc: { seq: 1 } },{ new: true} , function(err, counter){

        if(err) return done(err);
        if(counter) return done(null, counter.seq)

   });
};

/* Guardamos modelo de mongoose */

var Counter = mongoose.model('Counter', counterSchema);