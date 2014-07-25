angular.module('angular-client-side-auth')
.controller('ProfileCtrl',
['$rootScope', '$routeParams', '$scope', '$filter', 'Profiles', 'Users', 'Auth', function($rootScope, $routeParams, $scope, $filter, Profiles, Users, Auth) {

    $scope.authUser = Auth.user.username;
    
    $scope.userProfile = $routeParams.id;

    $scope.idProfile = 0;

    $scope.educations = [];

    Profiles.getByUsername({username: $scope.userProfile}, function(res) {

        $scope.user = res.profile; 

        $scope.idProfile = res.profile.id;
        //console.log(res[0]);
        if(res.educations != 0){
            //console.log(res.educations);//$scope.educations = res.educations;
            res.educations.forEach(function(r){
                $scope.educations.push(r);
                //console.log(r);
            });
        }

    });

    //$scope.email = "rederick2@hotmail.com"

    Users.getByUsername({username:$scope.userProfile} , 
        function(res){

            if(res.length != 0 ) $scope.email = res.email;

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
        //console.log($scope.user);
        $scope.user.location = $('#google_places_ac').val();

        if(Auth.user.username == $scope.userProfile ){

            Profiles.update(
                {
                    username:Auth.user.username,
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

        }

        
    };

    $scope.addEducation = function() {
        // $scope.user already updated!
       // console.log($scope.user);

        if(Auth.user.username == $scope.userProfile ){

            Profiles.addEducation(
                {
                    id: $scope.idProfile,
                    school:$scope.school,
                    yearRange: '',
                    schoolDegree: '',
                    career:'',
                    description : ''

                } , 
            
            function(res){

                    return true;

            }, function(err){
                    $rootScope.error = err;
            });

        }

        
    };

    $scope.saveEducation = function(index, id) {
        // $scope.user already updated!
       // console.log($scope.user);

        if(Auth.user.username == $scope.userProfile ){

            Profiles.updateEducation(
                {
                    id: id,
                    school: $scope.educations[index].school,
                    yearRange: '',
                    schoolDegree: '',
                    career:'',
                    description : ''

                } , 
            
            function(res){

                    return true;

            }, function(err){
                    $rootScope.error = err;
            });

        }

        
    };

}]);