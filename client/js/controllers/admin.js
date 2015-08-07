angular.module('unsApp')
.controller('AdminCtrl',
['$rootScope', '$scope', 'Auth', 'Users', 'Profiles', '_' , 
function($rootScope, $scope, Auth, Users, Profiles, _ ) {
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


            Users.getUsers({limit:15, page:$scope.page} , function(res) {

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