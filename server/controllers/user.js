var _ =           require('underscore')
    , User =      require('../models/User.js')
    , userRoles = require('../../client/js/routingConfig').userRoles;

var mongojs = require('mongojs');

var db = mongojs(config.URIMONGODB);

        



module.exports = {
    index: function(req, res) {
        var users = User.findAll();
        _.each(users, function(user) {
            delete user.password;
            delete user.twitter;
            delete user.facebook;
            delete user.google;
            delete user.linkedin;
        });
        res.json(users);
    },

    getUsers: function(req, res) {
        var usersmongo = db.collection('users');
        usersmongo.find().limit(req.body.limit).skip((req.body.page) * req.body.limit,function(err, docs) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                res.json(docs);
            }

        });

    }
};