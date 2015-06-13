angular.module('unsApp')
.controller('FirepadCtrl',
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

    var firepadRef = getExampleRef(Auth.user.username);
    // TODO: Replace above line with:
    // var ref = new Firebase('<YOUR FIREBASE URL>');

    //// Create CodeMirror (with line numbers and the JavaScript mode).
    var codeMirror = CodeMirror(document.getElementById('firepad-container'), {
      lineNumbers: true,
      mode: 'javascript',
      theme : 'neo'
    });

    // Create a random ID to use as our user ID (we must give this to firepad and FirepadUserList).
    var userId = Auth.user.username;//Math.floor(Math.random() * 9999999999).toString();

    //// Create Firepad (with rich text features and our desired userId).
    var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror,
        { richTextToolbar: false, richTextShortcuts: false, userId: userId});

    //// Create FirepadUserList (with our desired userId).
    var firepadUserList = FirepadUserList.fromDiv(firepadRef.child('users'),
        document.getElementById('userlist'), userId, Auth.user.username);


    //// Initialize contents.
    firepad.on('ready', function() {
      if (firepad.isHistoryEmpty()) {
        firepad.setText('// JavaScript Editing with Firepad!\nfunction go() {\n  var message = "Hello, world.";\n  console.log(message);\n}');
      }
    });

    
}]);