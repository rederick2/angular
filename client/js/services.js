'use strict';

angular.module('angular-client-side-auth')
.factory('Auth', function($http, $cookieStore){

    var accessLevels = routingConfig.accessLevels
        , userRoles = routingConfig.userRoles
        , currentUser = $cookieStore.get('user') || { username: '', role: userRoles.public };

    $cookieStore.remove('user');

    function changeUser(user) {
        _.extend(currentUser, user);
    };

    return {
        authorize: function(accessLevel, role) {
            if(role === undefined)
                role = currentUser.role;

            return accessLevel.bitMask & role.bitMask;
        },
        isLoggedIn: function(user) {
            if(user === undefined)
                user = currentUser;
            return user.role.title == userRoles.user.title || user.role.title == userRoles.admin.title;
        },
        register: function(user, success, error) {
            $http.post('/register', user).success(function(res) {
                changeUser(res);
                success();
            }).error(error);
        },
        remove: function(user, success, error) {

            console.log(user);

            $http.post('/remove', user).success(function(res) {
                //changeUser(res);
                success();
            }).error(error);
        },
        login: function(user, success, error) {
            $http.post('/login', user).success(function(user){
                changeUser(user);
                success(user);
            }).error(error);
        },
        loginFb: function(user, success, error) {
            $http.post('/loginFb' , user).success(function(user){
                changeUser(user);
                success(user);
            }).error(error);
        },
        logout: function(success, error) {
            $http.post('/logout').success(function(){
                changeUser({
                    username: '',
                    role: userRoles.public
                });
                success();
            }).error(error);
        },
        accessLevels: accessLevels,
        userRoles: userRoles,
        user: currentUser
    };
});

angular.module('angular-client-side-auth')
.factory('Users', function($http) {
    return {
        getAll: function(success, error) {
            $http.get('/users').success(success).error(error);
        },
        getUsers: function(data, success, error) {
            //console.log(sort);
            $http.post('/users/get', data).success(success).error(error);
        },
        getByUsername: function(data, success, error) {
            //console.log(sort);
            $http.post('/users/getbyusername', data).success(success).error(error);
        }

    };
});


angular.module('angular-client-side-auth')
.factory('Posts', function($http) {
    return {

        add: function(data, success, error) {
            //console.log(sort);
            $http.post('/posts/add', data).success(success).error(error);
        },

        getByUsername: function(data, success, error) {
            //console.log(sort);
            $http.post('/posts/getbyusername', data).success(success).error(error);
        }

    };
});


angular.module('angular-client-side-auth')
.factory('_', function() {
        return window._; // assumes underscore has already been loaded on the page
    });  

/*value('fbURL', 'https://rederick2.firebaseio.com/users/').
    factory('Usersregistered', function(angularFireCollection, fbURL) {
        return angularFireCollection(fbURL);
    })*/
