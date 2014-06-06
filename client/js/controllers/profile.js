angular.module('angular-client-side-auth')
.controller('ProfileCtrl',
['$rootScope', '$routeParams', '$scope', '$filter', 'Profiles', 'Users', function($rootScope, $routeParams, $scope, $filter, Profiles, Users) {

    
    Profiles.getByUsername({username: $routeParams.id}, function(res) {

        $scope.user = res[0]; 

        //console.log(res[0]);

    });

    //$scope.email = "rederick2@hotmail.com"

    Users.getByUsername({username:$routeParams.id} , 
        function(res){

            console.log(res[0]);

            $scope.email = res[0].email;

        }, function(err){
            $rootScope.error = err;
    });

    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        yearRange: '1900:-0'
    };

    $scope.statuses = [
        {value: 'Soltero(a)', text: 'Soltero(a)'},
        {value: 'Casado', text: 'Casado'},
        {value: 'Viudo', text: 'Viudo'},
        {value: 'Divorciado', text: 'Divorciado'}
    ]; 

    $scope.genders = [
        {value: 'Hombre', text: 'Hombre'},
        {value: 'Mujer', text: 'Mujer'}
    ]; 

    $scope.showStatus = function() {
        var selected = $filter('filter')($scope.statuses, {value: $scope.user.status});
        return ($scope.user.status && selected.length) ? selected[0].text : 'Not set';
    };

    

    $scope.jsondata = {publicProfileUrl:'url', firstName:'John Doe'};

    $scope.getCommitData = function() {
        IN.API.Profile("me").fields(
                [ "id", "firstName", "lastName", "pictureUrl",
                        "publicProfileUrl", "educations", "positions" ]).result(function(result) {

                            console.log(result);
            //set the model
            $scope.$apply(function() {
                $scope.jsondata = result.values[0];
            });
        }).error(function(err) {
            $scope.$apply(function() {
                $scope.error = err;
            });
        });
    };

    $scope.logoutLinkedIn = function() {
    //retrieve values from LinkedIn
            IN.User.logout();
            delete $rootScope.jsondata;
            $rootScope.loggedUser = false;
            $location.path("/");
    };

    $scope.checkName = function(data) {
        console.log(data);
        if (data == '') {
          return "Nombre no puede ser vacio";
        }
    };

    $scope.saveUser = function() {
        // $scope.user already updated!
        console.log($scope.user);
        $scope.user.location = $('#google_places_ac').val();

        Profiles.add(
            {
                username:$routeParams.id,
                fullname : $scope.user.fullname,
                location : $('#google_places_ac').val(),
                dob: $scope.user.dob,
                marital: $scope.user.marital,
                gender: $scope.user.gender

            } , 
        
        function(res){

                return true;

        }, function(err){
                $rootScope.error = err;
        });

        
    };

}]);