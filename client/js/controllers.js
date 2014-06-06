'use strict';

/* Controllers */



angular.module('angular-client-side-auth')
.controller('PrivateCtrl',
['$rootScope', function($rootScope) {
}]);




angular.module('angular-client-side-auth')
.controller('ListCtrl',
['$rootScope', '$scope', 'Users', 'Auth', 'angularFireCollection', 'Usersregistered', function($rootScope, $scope, Users, Auth, angularFireCollection, Usersregistered ) {
    $scope.loading = false;
    $scope.userRoles = Auth.userRoles;

    console.log(angularFireCollection('https://rederick2.firebaseio.com/users/rederick2'));

    $scope.users = angularFireCollection('https://rederick2.firebaseio.com/users/');

}]);



