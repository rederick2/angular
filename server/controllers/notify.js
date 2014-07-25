var _ =           require('underscore')
    , mongoose = require('mongoose')
    , Notify = mongoose.model('Notify')
    , User = mongoose.model('User')
    , Counter = mongoose.model('Counter')
    , userRoles = require('../../client/js/routingConfig').userRoles
    , Firebase = require('../models/Firebase.js');


module.exports = {
    
    add: function(req, res) {

        try{

            User.findOne({username:req.body.from}, function(err, from){
                
                if(err) return res.send(403, err);

                User.findOne({username:req.body.to}, function(err, to){
                    
                    if(err) return res.send(403, err);

                    Counter.getNextSequence("notifyid", function(err, count){

                        var n = new Notify({id:count, from:from, to: to, title:req.body.title, link: req.body.link});

                        n.save();

                        var ref = Firebase.getRef('notifications/' + to.username );

                        ref.push({id:count, from:from.username, fromName: from.name, fromPicture: from.picture, title:req.body.title, link: req.body.link, datetime: req.body.time});

                        return res.json({success:'true'});

                    });
                });
            });
          // try

        }catch(e){

            console.log(e);
        }

    },

    unread: function(req, res) {

        User.findOne({username:req.body.to}, function(err, user){
            
            if(err) return res.send(500, err);

            Notify.update({to:user}, {unread:true}, { multi: true }).exec();

            var ref = Firebase.getRef('notifications/' + user.username );

            ref.remove();

            return res.json({success:'true'});

        });
        

    },

    index: function(req, res) {

        User.findOne({username:req.body.to}, function(err, user){
            
            if(err) return res.send(500, err);

            Notify.find({to:user}).sort({_id:-1}).limit(10).populate('from', 'username name picture').exec(function(err, nots){

                if(err) return res.send(500, err);

                return res.json(nots);

            });


        });

    }
};