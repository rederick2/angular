var mongoose = require('mongoose');
var request = require('request');

var notifySchema = new mongoose.Schema({
    id: {type:Number, required:true},
    from: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    to: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    title: String,
    link:String,
    unread: Boolean
}, {collection: 'notifications'});


/* Guardamos modelo de mongoose */

var Notify = mongoose.model('Notify', notifySchema);