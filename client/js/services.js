'use strict';

angular.module('unsApp')
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
                success(res);
            }).error(error);
        },
        remove: function(user, success, error) {

            //console.log(user);

            $http.post('/remove', user).success(function(res) {
                //changeUser(res);
                success();
            }).error(error);
        },
        login: function(user, success, error) {
            //console.log(user);
            $http.post('/login', user).success(function(user){
                changeUser(user);
                success(user);
            }).error(error);
        },
        loginFb: function(user, success, error) {
            $http.post('/auth/facebook', user).success(function(user){
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

angular.module('unsApp')
.factory('Users', function($http) {
    return {
        getAll: function(success, error) {
            $http.get('/users').success(success).error(error);
        },
        query: function(data, success, error) {
            $http.post('/users/query', data).success(success).error(error);
        },
        getUsers: function(data, success, error) {
            //console.log(sort);
            $http.post('/users/get', data).success(success).error(error);
        },
        getByUsername: function(data, success, error) {
            //console.log(sort);
            $http.post('/users/getbyusername', data).success(success).error(error);
        },
        update: function(data, success, error) {
            //console.log(sort);
            $http.post('/users/update', data).success(success).error(error);
        },
        addMessage: function(data, success, error) {
            //console.log(sort);
            $http.post('/users/messages/add', data).success(success).error(error);
        }

    };
});

angular.module('unsApp')
.factory('Profiles', function($http) {
    return {
        getByUsername: function(data, success, error) {
            //console.log(sort);
            $http.post('/profile/getbyusername', data).success(success).error(error);
        },
        update: function(data, success, error) {
            //console.log(sort);
            $http.post('/profile/update', data).success(success).error(error);
        },
        getEducations: function(data, success, error) {
            //console.log(sort);
            $http.post('/profile/getEducations', data).success(success).error(error);
        },
        updateEducation: function(data, success, error) {
            //console.log(sort);
            $http.post('/profile/updateEducation', data).success(success).error(error);
        },
        removeEducation: function(data, success, error) {
            //console.log(sort);
            $http.post('/profile/removeEducation', data).success(success).error(error);
        },
        addEducation: function(data, success, error) {
            //console.log(sort);
            $http.post('/profile/addEducation', data).success(success).error(error);
        },
        getExperiences: function(data, success, error) {
            //console.log(sort);
            $http.post('/profile/getExperiences', data).success(success).error(error);
        },
        updateExperience: function(data, success, error) {
            //console.log(sort);
            $http.post('/profile/updateExperience', data).success(success).error(error);
        },
        removeExperience: function(data, success, error) {
            //console.log(sort);
            $http.post('/profile/removeExperience', data).success(success).error(error);
        },
        addExperience: function(data, success, error) {
            //console.log(sort);
            $http.post('/profile/addExperience', data).success(success).error(error);
        }

    };
});

angular.module('unsApp')
.factory('Notify', function($http) {
    return {
        getAll: function(data, success, error) {
            //console.log(sort);
            $http.post('/notify', data).success(success).error(error);
        },
        add: function(data, success, error) {
            //console.log(sort);
            $http.post('/notify/add', data).success(success).error(error);
        },
        unread: function(data, success, error) {
            //console.log(sort);
            $http.post('/notify/unread', data).success(success).error(error);
        }

    };
});

angular.module('unsApp')
.factory('Inboxes', function($http) {
    return {
        getByUsername: function(data, success, error) {
            //console.log(sort);
            $http.post('/inbox/getbyusername', data).success(success).error(error);
        },
        getByTo: function(data, success, error) {
            //console.log(sort);
            $http.post('/inbox/getbyto', data).success(success).error(error);
        },
        add: function(data, success, error) {
            //console.log(sort);
            $http.post('/inbox/add', data).success(success).error(error);
        },
        getMessages: function(data, success, error) {
            //console.log(sort);
            $http.post('/inbox/getmessages', data).success(success).error(error);
        },
        unread: function(data, success, error) {
            //console.log(sort);
            $http.post('/inbox/unread', data).success(success).error(error);
        }

    };
});

angular.module('unsApp')
.factory('Posts', function($http) {
    return {
        getAll: function(data, success, error) {
            //console.log(data);
            $http.post('/posts', data).success(success).error(error);
        },
        add: function(data, success, error) {
            //console.log(sort);
            $http.post('/posts/add', data).success(success).error(error);
        },

        remove: function(data, success, error) {
            //console.log(sort);
            $http.post('/posts/remove', data).success(success).error(error);
        },

        addComment: function(data, success, error) {
            //console.log(sort);
            $http.post('/posts/add/comment', data).success(success).error(error);
        },

        removeComment: function(data, success, error) {
            //console.log(sort);
            $http.post('/posts/remove/comment', data).success(success).error(error);
        },

        getByUsername: function(data, success, error) {
            //console.log(sort);
            $http.post('/posts/getbyusername', data).success(success).error(error);
        },

        getById: function(data, success, error) {
            //console.log(sort);
            $http.post('/posts/getbyid', data).success(success).error(error);
        },


        getComments: function(data, success, error) {
            //console.log(sort);
            $http.post('/posts/getcomments', data).success(success).error(error);
        }

    };
});

angular.module('unsApp')
.factory('Files', function($http) {
    return {

        upload: function(data, success, error) {
            //console.log(sort);
            $http.post('/file', data).success(success).error(error);
        },

        destroy: function(data, success, error) {
            //console.log(sort);
            $http.post('/file/destroy', data).success(success).error(error);
        }

    };
});


angular.module('unsApp')
.factory('_', function() {
        return window._; // assumes underscore has already been loaded on the page
    });  

/*value('fbURL', 'https://rederick2.firebaseio.com/users/').
    factory('Usersregistered', function(angularFireCollection, fbURL) {
        return angularFireCollection(fbURL);
    })*/
