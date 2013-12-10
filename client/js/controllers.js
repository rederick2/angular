'use strict';

/* Controllers */

angular.module('angular-client-side-auth')
.controller('NavCtrl', ['$rootScope', '$scope', '$location', 'Auth', 'Users', function($rootScope, $scope, $location, Auth, Users) {
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
.controller('MessagesCtrl',
['$rootScope', '$http', '$location', '$scope', 'Users', 'Auth', 'angularFireCollection', '_', function($rootScope, $http, $location, $scope, Users, Auth, angularFireCollection, _) {

    $scope.messages = [];

    $scope.typeahead = [];

    $scope.s_users = [];

    $scope.to = '';

    $scope.inboxes = [];

    $scope.username = Auth.user.username;

    $scope.viewInboxes = function(){

        Users.getByUsername({username: Auth.user.username}, function(res) {
        
            $scope.inboxes = _.sortBy(res[0].messages, function (m) {return m.update}).reverse();
        });

    }


    $scope.selectUser = function(user){

        $scope.to = user;

        $scope.s_users = [];

        $scope.messages = [];

        $scope.isSeach=false;

    }

    $scope.viewMessages = function(id, to){

        $scope.messages = angularFireCollection('https://rederick2.firebaseio.com/inboxes/' + id + '/messages');

        $scope.to=to; 

        $scope.isSeach=false;

        $('a.inboxes').removeClass('activo');

        $('#inbox_' + id).addClass('activo');

        var ref = new Firebase('https://rederick2.firebaseio.com/inboxes/' + id + '/messages');

        ref.limit(1).on('child_added' , function(snap){

            setTimeout(function() {

                $('.contentMessages').animate({scrollTop : ($('.contentMessages').children().size() + 1) * 300 });

            }, 10);

        });

        //console.log($scope.messages);

    }

    $scope.searchUsers = function(username){

        var result = [];
        

        Users.query({q:username}, function(res) {

            $scope.s_users = [];

            res.forEach(function(r){

                var pic = 'http://placehold.it/50x50';

                if (r.picture){
                    pic = r.picture;
                }

                result = {
                    username: r.username,
                    picture : pic
                }

                $scope.s_users.push(result);
            });

        });
    }


    $scope.addMessage = function(text){

        //alert(text);

        var message = {
            to: $scope.to,
            from: Auth.user.username,
            text: text,
            time: new Date()
        }

        //$scope.messages.push(message);

        Users.addMessage(message, 
        function(res){

            $scope.viewMessages(res.id, $scope.to);

            if($scope.newMessage){

                $scope.viewInboxes();

                $scope.newMessage=false;

            }

            

        }, function(err){
            $rootScope.error = err;
        });

        setTimeout(function() {

            $('.contentMessages').animate({scrollTop : ($('.contentMessages').children().size() + 1) * 300 });

        }, 500);

        



    }

    $scope.viewInboxes();

}]);

angular.module('angular-client-side-auth')
.controller('UserCtrl',
['$rootScope', '$scope', '$window','$routeParams', '$sce', '$upload', 'Users', 'Posts', 'Auth', 'angularFireCollection', 'Files', function($rootScope , $scope, $window, $routeParams, $sce, $upload, Users, Posts, Auth, angularFireCollection, Files) {

    //$scope.username = $routeParams.id;
    //$scope.userRoles = Auth.userRoles;
    $scope.username = $routeParams.id;
    $scope.authUser = Auth.user.username;

    $scope.video = [];

    $scope.comments = [];

    $scope.id = '';
    $scope.idpost = 45;
    $scope.typepost = 'text';
    $scope.source = '';
    $scope.photo = false;
    $scope.uploadimage = '<i class="fa fa-spinner fa-spin"></i>';
    $scope.imgProfile = '';

    $('.btn-select-imgProfile').on('click', function(){
        //alert('0');
        $('.profilephoto').trigger('click');

        return false;

    });

    $('.btn-select-files').on('click', function(){
        //alert('0');
        $('.uploadphoto').trigger('click');

        return false;

    });

    $scope.refresh = function(){

        setTimeout(function(){
            $('.masonry').masonry();
        }, 10);
        

       // console.log('hhh');
    }

    $scope.pictureProfile = function(username){
        return username;
    }


    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    }

    $scope.onFileSelect = function($files, type) {
        if($rootScope.public_id){
            Files.destroy({public_id:$rootScope.public_id});
        }
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
                if($file.size <= 200000){
                    $scope.progress[i] = 0;
                    $scope.uploadimage = '<i class="fa fa-spinner fa-spin"></i>';
                    (function(index) {
                            $scope.upload[index] = $upload.upload({
                                    url : '/file',
                                    headers: {'myHeaderKey': 'myHeaderVal'},
                                    data : {
                                            myModel : $scope.myModel,
                                            widht : 200
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
                                    if(type=='post'){
                                        $scope.uploadimage = response.data.image_th;
                                        $scope.picture = response.data.image_big;
                                        $rootScope.public_id = response.data.public_id;
                                    }else if(type=='profile'){
                                        $scope.uploadimgProfile = response.data.image_th;
                                        //$scope.picture = response.data.image_big;
                                    }
                                    


                            }, null, function(evt) {
                                    $scope.progress[index] = parseInt(100.0 * evt.loaded / evt.total);
                            });
                    })(i);
                }else{

                    alert('Tamaño maximo del archivo debe ser de 200Kb, el tamaño de tu archivo es: '+($file.size/1000)+ 'Kb');
                    $scope.selectedFiles = null;
                }
        }
    }

    $scope.uploadPhoto = function(){
        $scope.photo = true;

        //console.log($scope.file);
        $scope.typepost = 'photo';

        $rootScope.photo = true;

    }
    
        Users.getByUsername({username:$routeParams.id} , 
            function(res){

                //console.log(res[0]);
                if(res[0].picture){
                    $scope.imgProfile = res[0].picture;
                }

                $scope.user = res[0];

            }, function(err){
                $rootScope.error = err;
            });

    $scope.page = 0;
    $scope.busy = false;
    $scope.posts = [];

    $scope.getPost = function(){
        

        if ($scope.busy) return;
        $scope.busy = true;

        Posts.getByUsername({
            username : $scope.username,
            limit:20, 
            page:$scope.page
        },
        function(res){

            res.forEach(function(r){
                $scope.posts.push(r);
            });

            for (var p in res){

                var url = 'https://rederick2.firebaseio.com/posts/'+res[p].to+'/'+res[p].id+'/comments';

                var data = angularFireCollection(url);
                
                $scope.comments.push(data);

                var ref = new Firebase(url);

                ref.limit(1).on('child_added', function(snap){

                    //console.log('Hola');

                    setTimeout(function() {

                        $('div.comments').animate({scrollTop : ($('div.comments').children().size() + 1) * 300 });

                        $('.masonry').masonry();

                    }, 10);

                });

                ref.on('child_removed', function(snap){

                    setTimeout(function() {

                        $('.masonry').masonry();

                    }, 10);

                });


            }


            //console.log($scope.comments);
            

            $scope.page++;
            $scope.busy = false;

            //$scope.posts = res;


        },
        function(err) {
                $rootScope.error = err;
        });
    }
    //$scope.posts = angularFireCollection('https://rederick2.firebaseio.com/posts/' + $scope.username);
    $scope.addCommentPost = function(id, comment, to){

        //$scope.loading = true;

        Posts.addComment({
            idpost: id,
            from : Auth.user.username,
            to : to,
            comment : comment,
            created_time: new Date(), 
            updated_time: new Date()

        },
        function(res){
            $scope.comment = '';
            //$scope.getPost();
            //$('.close').click();
            $scope.loading = false;

            setTimeout(function() {

                $('#'+id).animate({scrollTop : ($('#'+id).children().size() + 1) * 300 });

                $('.masonry').masonry();

            }, 500);

            //console.log($('#'+id).height());
        },
        
        function(err) {
            $rootScope.error = err;
        });

       // console.log(comment);

    }

    $scope.removeCommentPost = function(to, from, idpost, id){

        //$scope.loading = true;

        if(to == $scope.authUser || from == $scope.authUser){

            Posts.removeComment({
                idpost: idpost,
                id:id,
                from : $routeParams.id
            },
            function(res){

                setTimeout(function() {

                    $('.masonry').masonry();

                }, 500);

            },
            
            function(err) {
                $rootScope.error = err;
            });
        }

       // console.log(comment);

    }


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
            $rootScope.photo = false;
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
.controller('PictureCtrl',
['$rootScope', '$scope', '$location', '$upload', 'Files' , '$sce', 'Users', 'Auth' , function($rootScope, $scope, $location, $upload, Files, $sce, Users, Auth) {

    $('.btn-select-files').on('click', function(){
        //alert('0');
        $('.uploadphoto').trigger('click');

        return false;

    });

    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    }

    $scope.imagePreview = false;
    $scope.uploadimage = '';

    $scope.selected = function(x) {
        console.log("selected",x);
        $scope.coordenadas = x;
    };

    $scope.cancel = function(){

        Files.destroy({
            public_id: $scope.public_id
        },
        function(res) {
            console.log(res);
            $location.path('/'+Auth.user.username);

        },
        function(err) {
            $rootScope.error = err;
        });
         
    }

    $scope.setAsProfile = function() {
        var url = $scope.picture;
        var x = $scope.coordenadas;
        var newurl = '';

        newurl = url.replace('h_0' , 'h_' + x.h)
                    .replace('w_0' , 'w_' + x.w)
                    .replace('x_0' , 'x_' + x.x)
                    .replace('y_0' , 'y_' + x.y);

        console.log(newurl);

        Users.update({
            username: Auth.user.username,
            name: 'picture',
            value: newurl
        },
        function(res) {
            console.log(res);
            //$location.path('/'+Auth.user.username);
            window.location.href = '/'+Auth.user.username;

        },
        function(err) {
            $rootScope.error = err;
        });
    };

    $scope.onFileSelect = function($files) {
        $scope.loading = true;
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
                //$scope.uploadimage = '<i class="fa fa-spinner fa-spin"></i>';
               // console.log($file);
                if($file.size <= 100000){
                    (function(index) {
                            $scope.upload[index] = $upload.upload({
                                    url : '/file',
                                    headers: {'myHeaderKey': 'myHeaderVal'},
                                    data : {
                                            myModel : $scope.myModel,
                                            width : 450
                                    },
                                    file : $file,
                                    fileFormDataName: 'file'
                            }).then(function(response) {
                                    $scope.uploadResult.push(response.data.result);

                                    $scope.uploadimage = response.data.image_big;
                                    $scope.picture = response.data.image_th;
                                    $scope.public_id = response.data.public_id;
                                    $scope.imagePreview = true;
                                    $scope.loading = false;

                            }, null, function(evt) {
                                    $scope.progress[index] = parseInt(100.0 * evt.loaded / evt.total);
                                    console.log(parseInt(100.0 * evt.loaded / evt.total));
                            });
                    })(i);
                }else{

                    $rootScope.error = 'Tamaño maximo del archivo debe ser de 100Kb, el tamaño de tu archivo es: '+($file.size/1000)+ 'Kb';
                    $scope.imagePreview = false;
                    $scope.loading = false;
                }
        }
    }



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



