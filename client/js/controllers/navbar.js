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