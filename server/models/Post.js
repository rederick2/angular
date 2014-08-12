var mongoose = require('mongoose');
var request = require('request');

var commentSchema = new mongoose.Schema({
    id: {type:Number, required:true},
    from: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true},
    message: String,
    created_time: {type: Date, default: Date.now}

}, {collection: 'comments'});


/* Guardamos modelo de mongoose */

var Comment = mongoose.model('Comment', commentSchema);

var postSchema = new mongoose.Schema({
    id: {type:Number, required:true},
    from: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    to: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    title: String,
    picture:String,
    picture_id:String,
    source: String,
    url: String,
    description: String,
    message: String,
    type: String,
    created_time: {type: Date, default: Date.now},
    updated_time: {type: Date, default: Date.now},
    comments : [{id:Number, from:{username:String,name:String,picture:String},message:String, created_time:Date}]
}, {collection: 'posts'});


/* Guardamos modelo de mongoose */

var Post = mongoose.model('Post', postSchema);