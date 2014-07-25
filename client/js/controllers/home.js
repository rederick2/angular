angular.module('angular-client-side-auth')
.controller('HomeCtrl',
['$rootScope', '$scope', '$window','$routeParams', '$sce', '$upload', 'Users', 'Posts', 'Auth', 'angularFireCollection', 'Files', function($rootScope , $scope, $window, $routeParams, $sce, $upload, Users, Posts, Auth, angularFireCollection, Files) {

    //$scope.username = $routeParams.id;
    //$scope.userRoles = Auth.userRoles;
    $scope.username = Auth.user.username;
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
    
        Users.getByUsername({username:$scope.authUser} , 
            function(res){

                //console.log(res[0]);
                if(res.length != 0 ){
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

        Posts.getAll({
            limit:10, 
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
                from : Auth.user.username
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
            $scope.page = 0;
            $scope.busy = false;
            $scope.posts = [];
            $scope.comments = [];
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
        Posts.remove({id:id, username:Auth.user.username},
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