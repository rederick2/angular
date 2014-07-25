var mongoose = require('mongoose');
var request = require('request');
var Counter = mongoose.model('Counter');
var Firebase = require('../models/Firebase.js');

var profileSchema = new mongoose.Schema({
    id: {type:Number, required:true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    fullname: String,
    gender: String,
    dob: String,
    location:String,
    marital: String,
    created_time: {type: Date, default: Date.now},
    updated_time: {type: Date, default: Date.now}
}, {collection: 'profile'});




/* Guardamos modelo de mongoose */

var Profile = mongoose.model('Profile', profileSchema);