var mongoose = require('mongoose');
var request = require('request');
var Counter = mongoose.model('Counter');
var Firebase = require('../models/Firebase.js');

var educationSchema = new mongoose.Schema({
    id: {type:Number, required:true},
    profile: {type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true},
    school: String, // Nombre de la Institucion
    yearStart: Number, // Año de inicio y fin: ej.: 2010-2015
    yearEnd: Number,
    schoolDegree: String, // Grado de Estudios: Diplomado, Bachillerato, Licenciatura, etc
    career:String, // Carrera
    description : String,
    created_time: Date,
    updated_time: {type: Date, default: Date.now}
}, {collection: 'education'});




/* Guardamos modelo de mongoose */

var Education = mongoose.model('Education', educationSchema);