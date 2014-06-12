var mongoose = require('mongoose');
var request = require('request');

var inboxSchema = new mongoose.Schema({
    id: {type:Number, required:true},
    username:  String,
    to : String,
    update : {type: Date, default: Date.now},
    messages : [{
        to : {type:String, required : true},
        from : {type: String, required : true},
        text : String,
        time : {type: Date, default: Date.now} 
    }]
}, {collection: 'inboxes'});


/* Guardamos modelo de mongoose */

var Inbox = mongoose.model('Inbox', inboxSchema);