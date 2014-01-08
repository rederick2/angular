var _ =           require('underscore')
    , path =      require('path')
    , passport =  require('passport')
    , AuthCtrl =  require('./controllers/auth')
    , UserCtrl =  require('./controllers/user')
    , PostCtrl =  require('./controllers/post')
    , FileCtrl =  require('./controllers/file')
    , ProfileCtrl = require('./controllers/profile')
    , User =      require('./models/User.js')
    , userRoles = require('../client/js/routingConfig').userRoles
    , accessLevels = require('../client/js/routingConfig').accessLevels;

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
    {
        path: '/auth/facebook',
        httpMethod: 'GET',
        middleware: [passport.authenticate('facebook')]
    },
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
    },
    {
        path: '/remove',
        httpMethod: 'POST',
        middleware: [AuthCtrl.remove]
    },
    {
        path: '/login',
        httpMethod: 'POST',
        middleware: [AuthCtrl.login]
    },
    {
        path: '/loginFb',
        httpMethod: 'POST',
        middleware: [AuthCtrl.loginFb]
    },
    {
        path: '/logout',
        httpMethod: 'POST',
        middleware: [AuthCtrl.logout]
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
        accessLevel: accessLevels.user
    },

    {
        path: '/users/update',
        httpMethod: 'POST',
        middleware: [UserCtrl.update],
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
        path: '/profile/add',
        httpMethod: 'POST',
        middleware: [ProfileCtrl.add],
        accessLevel: accessLevels.user
    },

    {
        path: '/profile/getbyusername',
        httpMethod: 'POST',
        middleware: [ProfileCtrl.getByUsername],
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
    var role;
    if(!req.user) role = userRoles.public;
    else          role = req.user.role;

    var accessLevel = _.findWhere(routes, { path: req.route.path }).accessLevel || accessLevels.public;

    if(!(accessLevel.bitMask & role.bitMask)) return res.send(403);
    return next();
}