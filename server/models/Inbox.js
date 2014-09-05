var mongoose = require('mongoose');
var request = require('request');
var Counter = mongoose.model('Counter');
var User = mongoose.model('User');
var Message = mongoose.model('Message');
var Firebase = require('../models/Firebase.js');

var inboxSchema = new mongoose.Schema({
    id: {type:Number, required:true},
    user:  {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    to : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    update : {type: Date, default: Date.now},
    unread : {type:Boolean, default:false},
    messages : [Message]
}, {collection: 'inboxes'});

inboxSchema.statics.findOrCreate = function(fromUser, toUser, content, time, number, done){

    var self = this;

    User.findOne({username : fromUser}, function(err, from){

        User.findOne({username : toUser}, function(err, to){

            self.findOneAndUpdate({ user : from, to: to}, {$set:{'update': time}}).populate('user', 'username name').exec(function(err, doc){

                if(err) done(err);

                if(!doc){

                    var idInbox;

                    Counter.getNextSequence("inboxid", function(err, count){

                        idInbox = count;

                        var inbox = new Inbox({
                                id: count,
                                user: from,
                                to : to
                            });

                        inbox.save();

                        myRootRef = Firebase.getRef('inboxes/' + idInbox);

                        myRootRef.set({ from: from.name, to : to.name });

                        Counter.getNextSequence("messageid" , function(err, countMessage){

                            if(number == 1){

                                var m = new Message({ id: countMessage, from: from, to:to, content: content, inbox: inbox });

                                m.save();

                            }else{

                                var m = new Message({ id: countMessage, from: to, to:from, content: content, inbox: inbox });

                                m.save();

                            }

                            Inbox.findOne({id:count}).populate('user', 'username name').exec(function(err, doc){

                                return done(null, doc);

                            });

                            

                        });

                    });
                }

                else{

                    Counter.getNextSequence("messageid" , function(err, countMessage){

                        if(number == 1){

                            var m = new Message({ id: countMessage, from: from, to:to, content: content, inbox: doc });

                            m.save();

                            myRootRef = Firebase.getRef('inboxes/' + doc.id + '/messages');

                            myRootRef.push({ from: from.username, to:to.name, picture:from.picture, name:from.name, content: content, datetime: time });

                            Inbox.update({id : doc.id} , {unread:true}).exec();

                        }else{

                            var m = new Message({ id: countMessage, from: to, to:from, content: content, inbox: doc });

                            m.save();

                            myRootRef = Firebase.getRef('inboxes/' + doc.id + '/messages');

                            myRootRef.push({ from: to.username, to:to.name, picture:to.picture, name:to.name, content: content, datetime: time });

                            Inbox.update({id : doc.id} , {unread:false}).exec();

                        }

                    }); 

                    return done(null, doc);

                } 

            });

        });
    });

};


/* Guardamos modelo de mongoose */

var Inbox = mongoose.model('Inbox', inboxSchema);