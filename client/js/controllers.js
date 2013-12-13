'use strict';

/* Controllers */

angular.module('angular-client-side-auth')
.controller('NavCtrl', ['$rootScope', '$scope', '$location', 'Auth', 'Users', function($rootScope, $scope, $location, Auth, Users) {
    $scope.user = Auth.user;
    $scope.userRoles = Auth.userRoles;
    $scope.accessLevels = Auth.accessLevels;

   //////////////////////////////////////

    var name = Auth.user.username;
    var currentStatus = "online";

    // Get a reference to the presence data in Firebase.
    var userListRef = new Firebase("https://rederick2.firebaseio.com/presences/");

    // Generate a reference to a new location for my user with push.
    var myUserRef = userListRef.push();

    // Get a reference to my own presence status.
    var connectedRef = new Firebase("http://presence.firebaseio-demo.com/.info/connected");
    connectedRef.on("value", function(isOnline) {
    if (isOnline.val()) {
      // If we lose our internet connection, we want ourselves removed from the list.
      myUserRef.onDisconnect().remove();

      // Set our initial online status.
      setUserStatus("online");
    } else {

      // We need to catch anytime we are marked as offline and then set the correct status. We
      // could be marked as offline 1) on page load or 2) when we lose our internet connection
      // temporarily.
      setUserStatus(currentStatus);
    }
    });

    // A helper function to let us set our own state.
    function setUserStatus(status) {
        // Set our status in the list of online users.
        currentStatus = status;
        if(name !== ''){
            myUserRef.set({ name: name, status: status });
        }
    }

    function getMessageId(snapshot) {
        return snapshot.name().replace(/[^a-z0-9\-\_]/gi,'');
    }

    // Update our GUI to show someone"s online status.
    userListRef.on("child_added", function(snapshot) {
    var user = snapshot.val();

        $(".status_" + user.name).children('.status').text('user.status');

    });

    // Update our GUI to remove the status of a user who has left.
    userListRef.on("child_removed", function(snapshot) {

        var user = snapshot.val();

        $(".status_" + user.name).children('.status').text('');

        console.log(user);

    });


    document.onBack = function (isIdle, isAway) {
        setUserStatus("online");
    }

    //setIdleTimeout(5000);
    //setAwayTimeout(10000);


   //////////////////////////////////////

    $scope.logout = function() {
        Auth.logout(function() {
            //$location.path('/login');
            window.location.href = '/login';
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
                window.location.href = '/';
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
                //$location.path('/');
                window.location.href = '/';
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

    $scope.id = 0;

    $scope.idTo = 0;

    $scope.inboxes = [];

    $scope.username = Auth.user.username;

    $scope.writes = false;

    $scope.checkStatus = function(){

        setTimeout(function(){

            var userListRef = new Firebase('https://rederick2.firebaseio.com/presences/');

            userListRef.on("child_added", function(snapshot) {
                
                var user = snapshot.val();

                $("#status_" + user.name).html('<i class="fa fa-circle fa-1"></i>');

                //console.log(user);

            });

            userListRef.on("child_removed", function(snapshot) {

                var user = snapshot.val();

                $("#status_" + user.name).html('');

                //console.log(user);

            });

        }, 500);

    }


    Users.getByUsername({username: Auth.user.username}, function(res) {

        //console.log(res[0].messages);

        res[0].messages.forEach(function(r){

           // if($scope.to != r.id)

            var ref = new Firebase('https://rederick2.firebaseio.com/inboxes/' + r.id + '/messages');

            ref.limit(1).on('child_added' , function(snap){

                console.log(snap.val());

                if(snap.val().from !== $scope.to){
                    $scope.viewInboxes();
                }

            });

        });

    });

    $scope.writeMessage = function(){

        if($scope.to != '' && $scope.id != 0){

            console.log('write');

            var ref = new Firebase('https://rederick2.firebaseio.com/inboxes/' + $scope.idTo + '/write' );

            ref.update({estado: {valor : 'true', from : Auth.user.username}});

        }
        
    }

    $scope.unWriteMessage = function(){
        if($scope.to != '' && $scope.id != 0){

            console.log('unWrite');

            var ref = new Firebase('https://rederick2.firebaseio.com/inboxes/' + $scope.idTo +'/write');

            ref.update({estado: {valor : 'false', from : Auth.user.username}});

        }
    }

    $scope.viewInboxes = function(){

        Users.getByUsername({username: Auth.user.username}, function(res) {
        
            $scope.inboxes = _.sortBy(res[0].messages, function (m) {return m.update}).reverse();

            $scope.checkStatus();

            setTimeout(function(){

                $('#inbox_' + $scope.id).addClass('activo');

            }, 500);

            

            //console.log($scope.id);

        });

    }


    $scope.selectUser = function(user){

        $scope.to = user;

        $scope.s_users = [];

        $scope.messages = [];

        $scope.isSeach=false;

    }

    $scope.viewMessages = function(id, to){

        var messageRef = new Firebase('https://rederick2.firebaseio.com/inboxes/' + id + '/messages');

        $scope.messages = angularFireCollection(messageRef.limit(50));

        $scope.writes = angularFireCollection('https://rederick2.firebaseio.com/inboxes/' + id +'/write');
        
        $scope.to=to; 

        $scope.id = id;

        $scope.isSeach=false;

        $('a.inboxes').removeClass('activo');

        $('#inbox_' + id).addClass('activo');

        var ref = new Firebase('https://rederick2.firebaseio.com/inboxes/' + id + '/messages');

        ref.limit(1).on('child_added' , function(snap){

            setTimeout(function() {

                $('.contentMessages').animate({scrollTop : ($('.contentMessages').children().size() + 1) * 300 });

            }, 10);

            //console.log(snap.val());
        });

        Users.getByUsername({username: to}, function(res) {
        
            $scope.idTo = _.findWhere(res[0].messages, {to:Auth.user.username}).id;

        });

        //console.log($scope.messages);

    }

    $scope.searchUsers = function(username){

        var result = [];
        

        Users.query({q:username}, function(res) {

            $scope.s_users = [];

            res.forEach(function(r){

                if(r.username !== Auth.user.username){

                    var pic = 'http://placehold.it/50x50';

                    if (r.picture){
                        pic = r.picture;
                    }

                    result = {
                        username: r.username,
                        picture : pic
                    }

                    $scope.s_users.push(result);
                }
            });

        });
    }


    $scope.addMessage = function(text){

        //alert(text);
        if($scope.to != ''){

            var message = {
                to: $scope.to,
                from: Auth.user.username,
                text: text,
                time: new Date()
            }

            //$scope.messages.push(message);

            Users.addMessage(message, 
            function(res){

                //$scope.viewMessages(res.id, $scope.to);

                if($scope.newMessage){

                    //$scope.viewInboxes();
                    $scope.viewMessages(res.id, $scope.to);

                    $scope.newMessage=false;

                }

                

            }, function(err){
                $rootScope.error = err;
            });

            setTimeout(function() {

                $('.contentMessages').animate({scrollTop : ($('.contentMessages').children().size() + 1) * 300 });

            }, 500);



        }else{

            alert('Debe seleccionar un nombre de usuario a enviar.');

        }

    }

    var ref = new Firebase('https://rederick2.firebaseio.com/inboxes/');

    ref.limit(1).on('child_added' , function(snap){

       $scope.viewInboxes();

    });

    //$scope.viewInboxes();

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

                var url = new Firebase('https://rederick2.firebaseio.com/posts/'+res[p].to+'/'+res[p].id+'/comments');

                var data = angularFireCollection(url.limit(50));
                
                $scope.comments.push(data);

                var ref = url;

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
    $scope.username = '';


    $scope.$watch('username', function() {
        $scope.username = $scope.username.toLowerCase().replace(/\s+/g,'');
    });

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



