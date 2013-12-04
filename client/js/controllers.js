'use strict';

/* Controllers */

angular.module('angular-client-side-auth')
.controller('NavCtrl', ['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
    $scope.user = Auth.user;
    $scope.userRoles = Auth.userRoles;
    $scope.accessLevels = Auth.accessLevels;

    $scope.logout = function() {
        Auth.logout(function() {
            $location.path('/login');
        }, function() {
            $rootScope.error = "Failed to logout";
        });
    };
}]);

angular.module('angular-client-side-auth')
.controller('LoginCtrl',
['$rootScope', '$scope', '$location', '$window', 'Auth', 'angularFireAuth', function($rootScope, $scope, $location, $window, Auth, angularFireAuth) {

    $scope.rememberme = true;

    var url = "https://rederick2.firebaseio.com/";

    angularFireAuth.initialize(url, {scope: $scope, name: "user"});

    $scope.login = function() {
        Auth.login({
                username: $scope.username,
                password: $scope.password,
                rememberme: $scope.rememberme
            },
            function(res) {
                $location.path('/');
            },
            function(err) {
                $rootScope.error = "Failed to login";
            });
    };

    $scope.loginOauth = function(provider) {
        //$window.location.href = '/auth/' + provider;
        /*var ref = new Firebase('https://rederick2.firebaseio.com/users/');

        var auth = new FirebaseSimpleLogin(ref , function(error, user) {
                  
                });*/

        angularFireAuth.login(provider);

        $scope.$on("angularFireAuth:login", function(evt, user) {
        // User logged in.
            console.log(user);

            Auth.loginFb({
                provider : provider,
                id : user.id,
                username: user.username,
                email: user.email,
               // rememberme: $scope.rememberme
            },
            function(res) {
                $location.path('/');
            },
            function(err) {
                $rootScope.error = err;
            });
        });
    };
}]);

angular.module('angular-client-side-auth')
.controller('HomeCtrl',
['$rootScope', '$scope', function($rootScope, $scope) {

    $scope.message = {
       text: 'hello world!',
       time: new Date()
    };

}]);

angular.module('angular-client-side-auth')
.controller('UserCtrl',
['$rootScope', '$scope', '$window','$routeParams', '$sce', '$upload', 'Users', 'Posts', 'Auth', 'angularFireCollection', 'Files', function($rootScope , $scope, $window, $routeParams, $sce, $upload, Users, Posts, Auth, angularFireCollection, Files) {

    //$scope.username = $routeParams.id;
    //$scope.userRoles = Auth.userRoles;
    $scope.username = $routeParams.id;
    $scope.authUser = Auth.user.username;

    $scope.video = [];

    $scope.id = '';
    $scope.typepost = 'text';
    $scope.source = '';
    $scope.photo = false;
    $scope.uploadimage = '<i class="fa fa-spinner fa-spin"></i>';


    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    }

    $scope.onFileSelect = function($files) {
        $scope.selectedFiles = [];
        $scope.progress = [];
        if ($scope.upload && $scope.upload.length > 0) {
                for (var i = 0; i < $scope.upload.length; i++) {
                        if ($scope.upload[i] != null) {
                                $scope.upload[i].abort();
                        }
                }
        }
        $scope.upload = [];
        $scope.uploadResult = [];
        $scope.selectedFiles = $files;
        for ( var i = 0; i < $files.length; i++) {
                var $file = $files[i];
                $scope.progress[i] = 0;
                $scope.uploadimage = '<i class="fa fa-spinner fa-spin"></i>';
                (function(index) {
                        $scope.upload[index] = $upload.upload({
                                url : '/file',
                                headers: {'myHeaderKey': 'myHeaderVal'},
                                data : {
                                        myModel : $scope.myModel
                                },
                                /* formDataAppender: function(fd, key, val) {
                                        if (angular.isArray(val)) {
                        angular.forEach(val, function(v) {
                          fd.append(key, v);
                        });
                      } else {
                        fd.append(key, val);
                      }
                                }, */
                                file : $file,
                                fileFormDataName: 'file'
                        }).then(function(response) {
                                $scope.uploadResult.push(response.data.result);
                                $scope.uploadimage = response.data.image_th;
                                $scope.picture = response.data.image_big;

                        }, null, function(evt) {
                                $scope.progress[index] = parseInt(100.0 * evt.loaded / evt.total);
                        });
                })(i);
        }
    }

    $scope.uploadPhoto = function(){
        $scope.photo = true;

        //console.log($scope.file);
        $scope.typepost = 'photo';

        $('.btn-select-files').on('click', function(){
            //alert('0');
            $('.uploadphoto').trigger('click');

        });

        $rootScope.photo = true;

    }
    
    Users.getByUsername({username:$routeParams.id} , 
        function(res){

            console.log(res[0]);

            $scope.user = res[0];

        }, function(err){
            $rootScope.error = err;
        });

    $scope.getPost = function(){
        Posts.getByUsername({
            username : $scope.username
        },
        function(res){

            $scope.posts = res;

        },
        function(err) {
                $rootScope.error = err;
        });
    }
    //$scope.posts = angularFireCollection('https://rederick2.firebaseio.com/posts/' + $scope.username);

    $scope.addPost = function(){

        //alert($scope.typepost);
        //var message = '';
        var title = '';
        var picture = '';
        var description = '';
        var source = '';
        var url = '';
        var fuente = '';

        $scope.loading = true;

        //console.log($('.liveurl').html());

        if($scope.typepost == 'url' || $scope.typepost == 'video'){
            description = $scope.description;//$('.liveurl').html();
            title = $scope.title;
            picture = $scope.picture;
            url = $scope.url;
            fuente = getHost(url);
            source = $scope.source;
        }else if($scope.typepost == 'photo'){
            picture = $scope.picture;
        }

        Posts.add({
            from : Auth.user.username,
            to : $scope.username,
            title : title,
            picture : picture,
            source : source,
            url : url,
            fuente:fuente,
            description : description,
            message : $scope.message,
            type : $scope.typepost,
            created_time: new Date(), 
            updated_time: new Date()

        },
        function(res){
            $scope.message = '';
            $scope.getPost();
            $('.close').click();
            $scope.loading = false;
            $scope.selectedFiles = [];
            $scope.photo = false;
        },
        
        function(err) {
            $rootScope.error = err;
        });

    }

    function getHost(url)
    {
        var a = document.createElement('a');
        a.href = url;
        return a.hostname;
    }

    $scope.remove = function(id){
        Posts.remove({id:id, username:Auth.user.username},
            function(res){
                $scope.getPost();
            },
            function(err){
                $rootScope.error = err;
            });
    }

    $scope.getPost();


}]);

angular.module('angular-client-side-auth')
.controller('RegisterCtrl',
['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
    $scope.role = Auth.userRoles.user;
    $scope.userRoles = Auth.userRoles;

    $scope.register = function() {
        Auth.register({
                username: $scope.username,
                password: $scope.password,
                email: $scope.email,
                firstname: $scope.firstname,
                role: $scope.role
            },
            function() {
                $location.path('/');
            },
            function(err) {
                $rootScope.error = err;
            });
    };
}]);

angular.module('angular-client-side-auth')
.controller('PrivateCtrl',
['$rootScope', function($rootScope) {
}]);


angular.module('angular-client-side-auth')
.controller('AdminCtrl',
['$rootScope', '$scope', 'Auth', 'Users', '_' , 
function($rootScope, $scope, Auth, Users, _ ) {
    $scope.loading = true;
    $scope.userRoles = Auth.userRoles;

    
     
    Users.getAll(function(res) {
        $scope.users = res;
        $scope.loading = false;
    }, function(err) {
        $rootScope.error = "Failed to fetch users.";
        $scope.loading = false;
    });

    $scope.page = 0;
    $scope.busy = false;

    $scope.addItems = function () {

        if ($scope.busy) return;
        $scope.busy = true;


            Users.getUsers({limit:5, page:$scope.page} , function(res) {

                    res.forEach(function(r){
                        $scope.items.push(r);
                    });

                    $scope.page++;
                    $scope.busy = false;
                
            }, function(err) {
                $rootScope.error = "Failed to fetch users.";
                $scope.loading = false;
            });


    };

    $scope.reset = function () {
        $scope.items = [];
        $scope.page = 0;
        $scope.canLoad = true;
        $scope.addItems();
    };

    $scope.reset();


    
}]);

angular.module('angular-client-side-auth')
.controller('EditCtrl',
['$rootScope', '$scope', '$location', 'angularFire', '$routeParams','Users', 'Auth', 
function($rootScope, $scope, $location, angularFire, $routeParams, Users, Auth) {
    $scope.loading = true;
    $scope.userRoles = Auth.userRoles;

    var ref = new Firebase('https://rederick2.firebaseio.com/users/' + $routeParams.id);
     
    angularFire(ref , $scope, 'remote', {}).
    then(function() {
    $scope.user = angular.copy($scope.remote);
    $scope.user.$id = $routeParams.id;
   /* $scope.isClean = function() {
      return angular.equals($scope.remote, $scope.project);
    }*/
    $scope.destroy = function() {
      $scope.remote = null;
      //console.log($scope.user.username);
      Auth.remove({
                    username : $scope.user.username
                },
                function() {
                    $location.path('/admin');
                },
                function(err) {
                    $rootScope.error = err;
                });
    };
    /*$scope.save = function() {
      $scope.remote = angular.copy($scope.project);
      $location.path('/');
    };*/
    });

}]);

angular.module('angular-client-side-auth')
.controller('ListCtrl',
['$rootScope', '$scope', 'Users', 'Auth', 'angularFireCollection', 'Usersregistered', function($rootScope, $scope, Users, Auth, angularFireCollection, Usersregistered ) {
    $scope.loading = false;
    $scope.userRoles = Auth.userRoles;

    console.log(angularFireCollection('https://rederick2.firebaseio.com/users/rederick2'));

    $scope.users = angularFireCollection('https://rederick2.firebaseio.com/users/');

}]);

