angular.module('angular-client-side-auth')
.controller('NavCtrl', ['$rootScope', '$scope', '$location', 'Auth', 'Users', '$firebase', '_', 'Notify',  function($rootScope, $scope, $location, Auth, Users, $firebase, _, Notify) {
    
    var url = "https://rederick2.firebaseio.com/";
   
    $scope.getNotifications = function(unread){

        Notify.getAll({to:Auth.user.username}, function(res){

            var i = 0;

            if(res.length > 0){

                res.forEach(function(x){
                    if(!x.unread)
                        i++;
                });

                $scope.count_notifications = i;

                $scope.notifications = res;
            }else{
                $scope.notifications = [{title:'No hay notificaciones.'}];
            }

            if(unread == 1)
                Notify.unread({to:Auth.user.username}, function(res){ if(res.success = 'true') $scope.count_notifications = 0;});
        });

        notifyRef.remove();

    }

    

    /*notifications.on("child_changed" , function(notify){
        
        if(notify.numChildren() > 0){
            $scope.count_notifications = notify.numChildren();
            $scope.notify = true;
            //console.log("N: " + notify.val());
        }else{
            $scope.notify = false;
        }
    });*/


   //////////////////////////////////////

    $scope.logout = function() {

        var ref = new Firebase(url);
        /*var authFirebase = new FirebaseSimpleLogin(Ref, function(error, user) {
          if (error) {
            // an error occurred while attempting login
            console.log(error);
          } else if (user) {
            // user authenticated with Firebase
            console.log('User ID: ' + user.uid + ', Provider: ' + user.provider);

          }
        });*/

        Auth.logout(function() {
            //$location.path('/login');
            //authFirebase.logout();
            ref.unauth();
            window.location.href = '/home';
        }, function() {
            $rootScope.error = "Failed to logout";
        });
    };

    //console.log(Auth.user);


    $scope.user = Auth.user;
    $scope.userRoles = Auth.userRoles;
    $scope.accessLevels = Auth.accessLevels;

    if(Auth.user.username != ''){        
        //$scope.notify = false;
        //$scope.count_notifications = 10;
        /*var Ref = new Firebase(url);
        /*var authFirebase = new FirebaseSimpleLogin(Ref, function(error, user) {
          if (error) {
            // an error occurred while attempting login
            console.log(error);
          } else if (user) {
            // user authenticated with Firebase
            console.log('User ID: ' + user.uid + ', Provider: ' + user.provider);

          }
        });*/

        $scope.notifications = [];

        var notifyRef = new Firebase(url + "notifications/" + Auth.user.username );

        $scope.created_time = "2013-12-05T04:28:16.891Z";

        notifyRef.on("value" , function(notify){
            //console.log(_.last(_.toArray(notify.val())));
            if(notify.numChildren() > 0){

                $scope.count_notifications = $scope.count_notifications + 1;
                
                $scope.notify = true;

                var n = _.last(_.toArray(notify.val()));

                $('.bottom-left').notify({
                    message: { html: '<div style="height:60px"><img src="' + n.fromPicture +'" align="left" valign="middle" style="margin:5px" width="50"><div class="content">  ' + n.title + '</div></div>'},
                    type : 'info'
                }).show();
                
            }else{
                $scope.notify = false;
            }
        });

        $scope.count_notifications = $firebase(notifyRef).$asArray().length;

        //////////////////////////////////////

        var name = Auth.user.username;
        var currentStatus = "online";

        // Get a reference to the presence data in Firebase.
        var userListRef = new Firebase(url + "presences/" + name);

        // Generate a reference to a new location for my user with push.
        var myUserRef = userListRef;

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

        $scope.getNotifications(0);
    }

    
}]);