var mongoose = require('mongoose');
var request = require('request');

var infosocialSchema = new mongoose.Schema({
    user: String,
    provider: String,
    providerId: String,
    token: String,
    tokenSecret:String,
    link: String,
    datetime : {type: Date, default: Date.now}
}, {collection: 'infosocial'});


/* Guardamos modelo de mongoose */

var Infosocial = mongoose.model('Infosocial', infosocialSchema);