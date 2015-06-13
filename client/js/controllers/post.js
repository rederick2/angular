angular.module('unsApp')
.controller('PostCtrl',
['$rootScope', '$scope', '$routeParams', '$location', '$window', 'Auth', '$firebase', 'Posts', function($rootScope, $scope, $routeParams, $location, $window, Auth, $firebase, Posts) {

    $scope.page = 0;
    $scope.busy = false;
    $scope.post = [];

    $scope.comments = [];

    $scope.comments2 = [];

    //$scope.getPost = function(){
        

        if ($scope.busy) return;
        $scope.busy = true;

        Posts.getById({ id : $routeParams.id },
        function(res){
            $scope.afterGetPost(res.docs);
        },
        function(err) {
                $rootScope.error = err;
        });

    //}

    $scope.afterGetPost = function(res){
        //res.forEach(function(r){
                $scope.post = res;
           // });

           // for (var p in res){

                var pt = res;

                //console.log(pt);*/

                Posts.getComments({id:pt.id}, function(c){

                    var ref = new Firebase('https://rederick2.firebaseio.com/posts/'+pt.to.username+'/'+pt.id+'/comments');

                    //console.log('https://rederick2.firebaseio.com/posts/'+pt.to.username+'/'+pt.id+'/comments');

                    ref.remove();

                    var m = _.last(pt.comments);



                    if(pt.comments.length != 0){

                       // console.log(m);

                        var ref2 = new Firebase('https://rederick2.firebaseio.com/posts/'+pt.to.username+'/'+pt.id+'/comments/' + m.id);

                        ref2.set({id:m.id, from: m.from.username, fromPicture: m.from.picture, fromName: m.from.name, message: m.message, time: m.created_time});

                    }

                    var obj = $firebase(ref);
                    
                    $scope.comments = obj.$asArray();

                    $scope.comments2 = _.without(pt.comments, _.last(pt.comments));

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

                });


           // }
            

            $scope.page++;
            $scope.busy = false;
    }
    //$scope.posts = $firebase('https://rederick2.firebaseio.com/posts/' + $scope.username);
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

    //$scope.getPost();

}]);
