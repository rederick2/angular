angular.module('angular-client-side-auth')
.controller('UserCtrl',
['$rootScope', '$scope', '$window','$routeParams', '$sce', '$upload', 'Users', 'Posts', 'Auth', 'angularFireCollection', 'Files', 'Notify', function($rootScope , $scope, $window, $routeParams, $sce, $upload, Users, Posts, Auth, angularFireCollection, Files, Notify) {

    //$scope.username = $routeParams.id;
    //$scope.userRoles = Auth.userRoles;
    if($routeParams.id)
        $scope.username = $routeParams.id;
    else
        $scope.username = Auth.user.username;
    
    $scope.authUser = Auth.user.username;

    $scope.video = [];

    $scope.comments = [];

    $scope.comments2 = [];

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
    
    Users.getByUsername({username:$scope.username} , 
        function(res){

            //console.log(res[0]);
            if(res.length != 0){
                $scope.imgProfile = res.picture;
            }

            $scope.user = res;

        }, function(err){
            $rootScope.error = err;
        });

    $scope.page = 0;
    $scope.busy = false;
    $scope.posts = [];

    $scope.getPost = function(){
        

        if ($scope.busy) return;
        $scope.busy = true;

        if($routeParams.id){

            Posts.getByUsername({ username : $scope.username, limit:20, page:$scope.page },
            function(res){
                $scope.afterGetPost(res);
            },
            function(err) {
                    $rootScope.error = err;
            });
        }else{

            Posts.getAll({ limit:20, page:$scope.page },
            function(res){
                $scope.afterGetPost(res);
            },
            function(err) {
                    $rootScope.error = err;
            });
        }
    }

    $scope.afterGetPost = function(res){
        res.forEach(function(r){
                $scope.posts.push(r);
            });

            for (var p in res){

                var pt = res[p];

                //console.log(pt);*/

                //Posts.getComments({id:pt.id}, function(c){

                    var ref = new Firebase('https://rederick2.firebaseio.com/posts/'+pt.to.username+'/'+pt.id+'/comments');

                    //console.log('https://rederick2.firebaseio.com/posts/'+pt.to.username+'/'+pt.id+'/comments');

                    ref.remove();

                    var m = _.last(pt.comments);



                    if(pt.comments.length != 0){

                       // console.log(m);

                        var ref2 = new Firebase('https://rederick2.firebaseio.com/posts/'+pt.to.username+'/'+pt.id+'/comments/' + m.id);

                        ref2.set({id:m.id, from: m.from.username, fromPicture: m.from.picture, fromName: m.from.name, message: m.message, time: m.created_time});

                    }
                    
                    $scope.comments.push(angularFireCollection(ref));

                    $scope.comments2.push(_.without(pt.comments, _.last(pt.comments)));

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

                //});


            }
            

            $scope.page++;
            $scope.busy = false;
    }
    //$scope.posts = angularFireCollection('https://rederick2.firebaseio.com/posts/' + $scope.username);
    $scope.addCommentPost = function(id, message){

        //$scope.loading = true;

        Posts.addComment({
            idpost: id,
            from : Auth.user.username,
            message : message,
            time: new Date()
        },
        function(res){
            $scope.message = '';
            //$scope.getPost();
            //$('.close').click();
            $scope.loading = false;

            if(Auth.user.username != res.to){

                Notify.add({from:Auth.user.username, to:res.to, title: res.name + ' comento un post tuyo. "' + message + '"' , link:'./post/' + res.id , time: new Date()}, function(res){ return true;});
            }

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

    $scope.removeCommentPost = function(from, idpost, id){


        Posts.removeComment({
            idpost: idpost,
            id:id,
            from : from
        },
        function(res){

            if(res.success == 'true'){

                for(var x in $scope.comments2){

                    $scope.comments2[x] = _.without($scope.comments2[x], _.findWhere($scope.comments2[x], {id:id}));

                };
                
            }

            setTimeout(function() {

                $('.masonry').masonry();

            }, 500);

        },
        
        function(err) {
            $rootScope.error = err;
        });


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
            $scope.page = 0;
            $scope.busy = false;
            $scope.posts = [];
            $scope.comments = [];
            $scope.comments2 = [];
            $scope.getPost();
            //document.location.reload();
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
        Posts.remove({id:id},
            function(res){
                $scope.page = 0;
                $scope.busy = false;
                $scope.posts = [];
                $scope.comments = [];
                $scope.getPost();
            },
            function(err){
                $rootScope.error = err;
            });
    }

    $scope.getPost();


}]);