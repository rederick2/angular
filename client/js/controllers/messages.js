angular.module('angular-client-side-auth')
.controller('MessagesCtrl',
['$rootScope', '$http', '$location', '$scope', 'Users', 'Inboxes', 'Auth', '$firebase', '_', function($rootScope, $http, $location, $scope, Users, Inboxes, Auth, $firebase, _) {

    $scope.messages = [];

    $scope.messages2 = [];

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


    Inboxes.getByUsername({username: Auth.user.username}, function(res) {

        //console.log(res[0].messages);

        res.forEach(function(r){

           // if($scope.to != r.id)

            var ref = new Firebase('https://rederick2.firebaseio.com/inboxes/' + r.id + '/messages');

            ref.limit(1).on('child_added' , function(snap){

                //console.log(snap.val());

                if(snap.val().from !== $scope.to){
                    $scope.viewInboxes();
                }

            });

        });

    });

    $scope.writeMessage = function(){

        if($scope.to != '' && $scope.id != 0){

            //console.log('write');

            var ref = new Firebase('https://rederick2.firebaseio.com/inboxes/' + $scope.idTo + '/write' );

            ref.update({estado: {valor : 'true', from : Auth.user.username}});

            Inboxes.getByTo({username:Auth.user.username, to: $scope.to}, function(res){

                Inboxes.unread({id: res.id});

            });

        }

        
    }

    $scope.unWriteMessage = function(){
        if($scope.to != '' && $scope.id != 0){

            var ref = new Firebase('https://rederick2.firebaseio.com/inboxes/' + $scope.idTo +'/write');

            ref.update({estado: {valor : 'false', from : Auth.user.username}});

        }
    }

    $scope.viewInboxes = function(){

        Inboxes.getByUsername({username: Auth.user.username}, function(res) {
        
            $scope.inboxes = _.sortBy(res, function (m) {return m.update}).reverse();

            $scope.checkStatus();

        });

    }


    $scope.selectUser = function(user){

        $scope.to = user;

        $scope.s_users = [];

        $scope.messages = [];

        $scope.messages2 = [];

        $scope.isSeach=false;

    }

    $scope.viewMessages = function(id, to){

        //$('a.inboxes').removeClass('activo');

        //$('#inbox_' + id).addClass('activo');

        Inboxes.getMessages({ id: id}, function(res) {

            var messageRef = new Firebase('https://rederick2.firebaseio.com/inboxes/' + id + '/messages');

            messageRef.remove();

            var m = _.last(res);

            messageRef.push({content : m.content, from: m.from.username, name: m.from.name, picture: m.from.picture, datetime: m.datetime});

            var obj = $firebase(messageRef);

            $scope.messages = obj.$asArray();

            $scope.messages2 = _.without(res, _.last(res));

            $scope.writes = $firebase(new Firebase('https://rederick2.firebaseio.com/inboxes/' + id +'/write')).$asObject();
            
            $scope.to=to; 

            $scope.id = id;

            $scope.isSeach=false;

            $scope.newMessage = false;

            //console.log(4);

            var ref = new Firebase('https://rederick2.firebaseio.com/inboxes/' + id + '/messages');

            $('.loading').show();

            ref.limit(1).on('child_added' , function(snap){

                setTimeout(function() {

                    $('.contentMessages').animate({scrollTop : ($('.contentMessages').children().size() + 1) * 300 });

                    //console.log(2);

                    $('.loading').hide();

                }, 1000);

                //console.log(snap.val());
            });

        
            Inboxes.getByTo({username : to, to: Auth.user.username}, function(res){
                $scope.idTo = res.id;
            });

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