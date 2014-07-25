var mongoose = require('mongoose');
var request = require('request');
var Counter = mongoose.model('Counter');
var Firebase = require('../models/Firebase.js');

var experienceSchema = new mongoose.Schema({
    id: {type:Number, required:true},
    profile: {type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true},
    company: String, // Nombre de la Empresa
    position: String, // Cargo
    location: String, // Ubicacion de la empresa
    startDate : { type: Date },
    endDate : { type: Date },
    description : String,
    created_time: {type: Date, default: Date.now},
    updated_time: {type: Date, default: Date.now}
}, {collection: 'experience'});




/* Guardamos modelo de mongoose */

var Experience = mongoose.model('Experience', experienceSchema);