var mongoose = require('mongoose');
var request = require('request');

var postSchema = new mongoose.Schema({
    id: {type:Number, required:true},
    from: {type: String, required:true},
    to: {type: String, required:true},
    title: String,
    picture:String,
    source: String,
    url: String,
    description: String,
    message: String,
    type: String,
    pictureUser : String,
    created_time: {type: Date, default: Date.now},
    updated_time: {type: Date, default: Date.now}
}, {collection: 'posts'});


/* Guardamos modelo de mongoose */

var Post = mongoose.model('Post', postSchema);