var _ =           require('underscore')
    , path =      require('path')
    , passport =  require('passport')
    , AuthCtrl =  require('./controllers/auth')
    , UserCtrl =  require('./controllers/user')
    , PostCtrl =  require('./controllers/post')
    , FileCtrl =  require('./controllers/file')
    , ProfileCtrl = require('./controllers/profile')
    , InboxCtrl = require('./controllers/inbox')
    , NotifyCtrl = require('./controllers/notify')
    , User =      require('./models/User.js')
    , mongoose = require('mongoose')
    , mUser = mongoose.model('User')
    , userRoles = require('../client/js/routingConfig').userRoles
    , accessLevels = require('../client/js/routingConfig').accessLevels;

var jwt = require('jwt-simple');

var routes = [


    // Views
    {
        path: '/partials/*',
        httpMethod: 'GET',
        middleware: [function (req, res) {
            var requestedView = path.join('./', req.url);
            res.render(requestedView);
        }]
    },

    

    // OAUTH
    {
        path: '/auth/twitter',
        httpMethod: 'GET',
        middleware: [passport.authenticate('twitter')]
    },
    {
        path: '/auth/twitter/callback',
        httpMethod: 'GET',
        middleware: [passport.authenticate('twitter', {
            successRedirect: '/',
            failureRedirect: '/login'
        })]
    },
    /*{
        path: '/auth/facebook',
        httpMethod: 'GET',
        middleware: [passport.authenticate('facebook')]
    },*/
    {
        path: '/auth/facebook/callback',
        httpMethod: 'GET',
        middleware: [passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/login'
        })]
    },
    {
        path: '/auth/google',
        httpMethod: 'GET',
        middleware: [passport.authenticate('google')]
    },
    {
        path: '/auth/google/return',
        httpMethod: 'GET',
        middleware: [passport.authenticate('google', {
            successRedirect: '/',
            failureRedirect: '/login'
        })]
    },
    {
        path: '/auth/linkedin',
        httpMethod: 'GET',
        middleware: [passport.authenticate('linkedin')]
    },
    {
        path: '/auth/linkedin/callback',
        httpMethod: 'GET',
        middleware: [passport.authenticate('linkedin', {
            successRedirect: '/',
            failureRedirect: '/login'
        })]
    },

    // Local Auth
    {
        path: '/register',
        httpMethod: 'POST',
        middleware: [AuthCtrl.register]
    },/*
    {
        path: '/remove',
        httpMethod: 'POST',
        middleware: [AuthCtrl.remove]
    },*/
    {
        path: '/login',
        httpMethod: 'POST',
        middleware: [AuthCtrl.login]
    },
    {
        path: '/auth/facebook',
        httpMethod: 'POST',
        middleware: [AuthCtrl.facebook]
    },
    {
        path: '/logout',
        httpMethod: 'POST',
        middleware: [AuthCtrl.logout]
    },

    {
        path: '/token',
        httpMethod: 'POST',
        middleware: [UserCtrl.token]
    },

    // User resource
    {
        path: '/users',
        httpMethod: 'GET',
        middleware: [UserCtrl.index],
        accessLevel: accessLevels.user
    },

    {
        path: '/users/query',
        httpMethod: 'POST',
        middleware: [UserCtrl.query],
        accessLevel: accessLevels.user
    },

    {
        path: '/users/messages/add',
        httpMethod: 'POST',
        middleware: [UserCtrl.addMessage],
        accessLevel: accessLevels.user
    },

    {
        path: '/users/get',
        httpMethod: 'POST',
        middleware: [UserCtrl.getUsers],
        accessLevel: accessLevels.user
    },

    {
        path: '/users/getbyusername',
        httpMethod: 'POST',
        middleware: [UserCtrl.getByUsername],
        accessLevel: accessLevels.public
    },

    {
        path: '/users/update',
        httpMethod: 'POST',
        middleware: [UserCtrl.update],
        accessLevel: accessLevels.user
    },

    //Posts

    {
        path: '/posts',
        httpMethod: 'POST',
        middleware: [PostCtrl.index],
        accessLevel: accessLevels.user
    },

    {
        path: '/posts/add',
        httpMethod: 'POST',
        middleware: [PostCtrl.add],
        accessLevel: accessLevels.user
    },

    {
        path: '/posts/remove',
        httpMethod: 'POST',
        middleware: [PostCtrl.remove],
        accessLevel: accessLevels.user
    },

    {
        path: '/posts/getbyusername',
        httpMethod: 'POST',
        middleware: [PostCtrl.getByUsername],
        accessLevel: accessLevels.user
    },

    {
        path: '/posts/add/comment',
        httpMethod: 'POST',
        middleware: [PostCtrl.addComment],
        accessLevel: accessLevels.user
    },

    {
        path: '/posts/remove/comment',
        httpMethod: 'POST',
        middleware: [PostCtrl.removeComment],
        accessLevel: accessLevels.user
    },

    {
        path: '/posts/getcomments',
        httpMethod: 'POST',
        middleware: [PostCtrl.getComments],
        accessLevel: accessLevels.user
    },

    {
        path: '/inbox/add',
        httpMethod: 'POST',
        middleware: [InboxCtrl.add],
        accessLevel: accessLevels.user
    },

    {
        path: '/inbox/getbyusername',
        httpMethod: 'POST',
        middleware: [InboxCtrl.getByUsername],
        accessLevel: accessLevels.user
    },

    {
        path: '/inbox/getmessages',
        httpMethod: 'POST',
        middleware: [InboxCtrl.getMessages],
        accessLevel: accessLevels.user
    },

    {
        path: '/inbox/getbyto',
        httpMethod: 'POST',
        middleware: [InboxCtrl.getByTo],
        accessLevel: accessLevels.user
    },

    {
        path: '/inbox/unread',
        httpMethod: 'POST',
        middleware: [InboxCtrl.unread],
        accessLevel: accessLevels.user
    },

    {
        path: '/profile/update',
        httpMethod: 'POST',
        middleware: [ProfileCtrl.update],
        accessLevel: accessLevels.user
    },

    {
        path: '/profile/getbyusername',
        httpMethod: 'POST',
        middleware: [ProfileCtrl.getByUsername],
        accessLevel: accessLevels.user
    },

    {
        path: '/profile/getEducations',
        httpMethod: 'POST',
        middleware: [ProfileCtrl.getEducations],
        accessLevel: accessLevels.user
    },

    {
        path: '/profile/addEducation',
        httpMethod: 'POST',
        middleware: [ProfileCtrl.addEducation],
        accessLevel: accessLevels.user
    },

    {
        path: '/profile/removeEducation',
        httpMethod: 'POST',
        middleware: [ProfileCtrl.removeEducation],
        accessLevel: accessLevels.user
    },

    {
        path: '/profile/updateEducation',
        httpMethod: 'POST',
        middleware: [ProfileCtrl.updateEducation],
        accessLevel: accessLevels.user
    },

    {
        path: '/profile/getExperiences',
        httpMethod: 'POST',
        middleware: [ProfileCtrl.getExperiences],
        accessLevel: accessLevels.user
    },

    {
        path: '/profile/addExperience',
        httpMethod: 'POST',
        middleware: [ProfileCtrl.addExperience],
        accessLevel: accessLevels.user
    },

    {
        path: '/profile/removeExperience',
        httpMethod: 'POST',
        middleware: [ProfileCtrl.removeExperience],
        accessLevel: accessLevels.user
    },

    {
        path: '/profile/updateExperience',
        httpMethod: 'POST',
        middleware: [ProfileCtrl.updateExperience],
        accessLevel: accessLevels.user
    },

    {
        path: '/file',
        httpMethod: 'POST',
        middleware: [FileCtrl.index],
        accessLevel: accessLevels.user
    },

    {
        path: '/file/destroy',
        httpMethod: 'POST',
        middleware: [FileCtrl.destroy],
        accessLevel: accessLevels.user
    },
    {
        path: '/notify',
        httpMethod: 'POST',
        middleware: [NotifyCtrl.index],
        accessLevel: accessLevels.user
    },
    {
        path: '/notify/add',
        httpMethod: 'POST',
        middleware: [NotifyCtrl.add],
        accessLevel: accessLevels.user
    },
    {
        path: '/notify/unread',
        httpMethod: 'POST',
        middleware: [NotifyCtrl.unread],
        accessLevel: accessLevels.user
    },

    // All other get requests should be handled by AngularJS's client-side routing system
    {
        path: '/*',
        httpMethod: 'GET',
        middleware: [function(req, res) {
            var role = userRoles.public, username = '';
            if(req.user) {
                role = req.user.role;
                username = req.user.username;
                
            }
            res.cookie('user', JSON.stringify({
                'username': username,
                'role': role
            }));
            res.render('index');
        }]
    },

    
];

module.exports = function(app) {

    _.each(routes, function(route) {
        route.middleware.unshift(ensureAuthorized);
        var args = _.flatten([route.path, route.middleware]);

        switch(route.httpMethod.toUpperCase()) {
            case 'GET':
                app.get.apply(app, args);
                break;
            case 'POST':
                app.post.apply(app, args);
                break;
            case 'PUT':
                app.put.apply(app, args);
                break;
            case 'DELETE':
                app.delete.apply(app, args);
                break;
            default:
                throw new Error('Invalid HTTP method specified for route ' + route.path);
                break;
        }
    });
}

function ensureAuthorized(req, res, next) {
    
    //console.log('req.body.token');

    var token = req.headers.token;

    var role;

    if(!req.user) {

        role = userRoles.public;
    }
    else{
        role = req.user.role;
    }

    var accessLevel = _.findWhere(routes, { path: req.route.path }).accessLevel || accessLevels.public;

    if(req.headers.token){

            var decoded = jwt.decode(req.headers.token, config.token.secret);

            //console.log(decoded);
            
            mUser.findOne({username:decoded.username}, function(err, user){

                //console.log(user);

                if(!user) res.send(403);

                //return next();

            });
    }else{

        if(!(accessLevel.bitMask & role.bitMask)) return res.send(403);
    }

    //if(!(accessLevel.bitMask & role.bitMask)) return res.send(403);

    return next();
}