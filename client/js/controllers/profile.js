angular.module('unsApp')
.controller('ProfileCtrl',
['$rootScope', '$routeParams', '$scope', '$filter', 'Profiles', 'Users', 'Auth', '_', '$mdDialog', function($rootScope, $routeParams, $scope, $filter, Profiles, Users, Auth, _, $mdDialog) {

    $scope.authUser = Auth.user.username;
    
    $scope.userProfile = $routeParams.id;

    $scope.idProfile = 0;

    $scope.imgProfile = '';

    $scope.edad;

    $scope.id = 0;

    $scope.index = 0;

    $scope.tipo = 0;

    $scope.Init = function(){

        /*$('a').on('click' , function(e){
            e.preventDefault();
        });*/

        $scope.educations = [];

        $scope.experiences = [];

        $('.loading').show();

        Profiles.getByUsername({username: $scope.userProfile}, function(res) {

            $scope.user = res.profile; 

            if(res.profile.dob != null)
                $scope.user.dob = new Date(res.profile.dob).toLocaleDateString();
           // $scope.dob = res.profile.dob.toLocaleDateString(); 

            $scope.idProfile = res.profile.id;
            //console.log(res[0]);
            if(res.educations != 0){
                //console.log(res.educations);//$scope.educations = res.educations;
                res.educations.forEach(function(r){
                    $scope.educations.push(r);
                    //console.log(r);
                });
            }

            //console.log(res.experiences);
            if(res.experiences != 0){
                //console.log(res.educations);//$scope.educations = res.educations;
                res.experiences.forEach(function(r){

                    if(r.startDate != null)
                        r.startDate = new Date(r.startDate).toLocaleDateString();
                    if(r.endDate != null)
                        r.endDate = new Date(r.endDate).toLocaleDateString();
                    $scope.experiences.push(r);
                    //console.log(r);
                });
            }

            if(res.profile.dob) $scope.edad = $scope.calcular_edad(res.profile.dob);

            $('.loading').hide();

           /* setTimeout(function() {

                $('.masonry').masonry();

            }, 4500);*/

        });


    };

    var myDate = new Date();
    var year = myDate.getFullYear();

    $scope.items = []; 


    for(var i = 1970; i < year+1; i++){
      $scope.items.push({id: i, name:i});
    }


     $scope.someVal = 3;

    $scope.changed = function(val){
        //console.log("Updated", val);
      }

    $scope.scroll = function(id){

        //console.log(id);

        $("#" + id).scrolld();
    }

    
    $scope.calcular_edad = function (fecha) {

            //console.log(fecha);

            var fechaActual = new Date()
            var diaActual = fechaActual.getDate();
            var mmActual = fechaActual.getMonth() + 1;
            var yyyyActual = fechaActual.getFullYear();
            FechaNac = fecha.split("/");
            var diaCumple = FechaNac[0];
            var mmCumple = FechaNac[1];
            var yyyyCumple = FechaNac[2];
            //retiramos el primer cero de la izquierda
            if (mmCumple.substr(0,1) == 0) {
                mmCumple= mmCumple.substring(1, 2);
            }
            //retiramos el primer cero de la izquierda
            if (diaCumple.substr(0, 1) == 0) {
                diaCumple = diaCumple.substring(1, 2);
            }
            var edad = yyyyActual - yyyyCumple;

            //validamos si el mes de cumpleaños es menor al actual
            //o si el mes de cumpleaños es igual al actual
            //y el dia actual es menor al del nacimiento
            //De ser asi, se resta un año
            if ((mmActual < mmCumple) || (mmActual == mmCumple && diaActual < diaCumple)) {
                edad--;
            }

            //console.log(edad);

            return edad;
    };

    //$scope.email = "rederick2@hotmail.com"

    Users.getByUsername({username:$scope.userProfile} , 
        function(res){

            if(res.length != 0 ) $scope.email = res.email;

            if(res.length != 0 ) $scope.imgProfile = res.picture;

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

                            //console.log(result);
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
        //console.log(data);
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

                    $scope.edad = $scope.calcular_edad($scope.user.dob);

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
                    yearStart: $scope.yearStart,
                    yearEnd: $scope.yearEnd,
                    schoolDegree: $scope.schoolDegree,
                    career: $scope.career,
                    description : $scope.description,
                    created_time : new Date()

                } , 
            
            function(res){

                    //$scope.Init();
                    $scope.educations.push(res.o);

                    $('#formAddEducation')[0].reset();

                    $('#modalEducation').modal('hide');

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
                    yearStart: $scope.educations[index].yearStart,
                    yearEnd: $scope.educations[index].yearEnd,
                    schoolDegree: $scope.educations[index].schoolDegree,
                    career:$scope.educations[index].career,
                    description : $scope.educations[index].description

                } , 
            
            function(res){

                    return true;

            }, function(err){
                    $rootScope.error = err;
            });

        }

        
    };

    /*$scope.beforeRemove = function(index, id, tipo) {
        // $scope.user already updated!

        $scope.index = index;
        $scope.id = id;
        $scope.tipo = tipo;
        
    };*/

    $scope.refresh = function(){

        setTimeout(function(){
            $('.masonry').masonry();
        }, 10);
        

       // console.log('hhh');
    }


    $scope.remove = function(index, id, tipo){

        $scope.index = index;
        $scope.id = id;
        $scope.tipo = tipo;

        if(Auth.user.username == $scope.userProfile){

                $mdDialog.show(
                  $mdDialog.confirm()
                    .title('Eliminar')
                    .content('Desea realmente eliminar?')
                    .ok('Aceptar')
                    .cancel('Cancelar')
                    .targetEvent(event)
                ).then(function () {
                    //console.log(_.findWhere($rootScope.bienesSolicitudes[id], { Vcodbarra: Vcodbarra }));
                    //console.log(tipo);

                    if($scope.tipo == 1){

                        Profiles.removeEducation(
                            {
                                id: $scope.id

                            } , 
                        
                            function(res){

                                    $scope.educations = _.without($scope.educations, $scope.educations[$scope.index]);

                                    $scope.id = 0;

                                    $scope.index = 0;

                                    $scope.tipo = 0;

                                    $('#modalRemove').modal('hide');

                                    return true;

                            }, function(err){
                                    $rootScope.error = err;
                        });

                    }else if($scope.tipo == 2){

                        Profiles.removeExperience(
                            {
                                id: $scope.id

                            } , 
                        
                            function(res){

                                    $scope.experiences = _.without($scope.experiences, $scope.experiences[$scope.index]);

                                    $scope.id = 0;

                                    $scope.index = 0;

                                    $scope.tipo = 0;

                                    $('#modalRemove').modal('hide');

                                    return true;

                            }, function(err){
                                    $rootScope.error = err;
                        });

                    }
                    
                }, function () {
                    //console.log('You decided to keep your debt.');
                });

        }
    }


    $scope.addExperience = function() {
        // $scope.user already updated!
       // console.log($scope.user);

        if(Auth.user.username == $scope.userProfile ){

            Profiles.addExperience(
                {
                    id: $scope.idProfile,
                    company: $scope.company,
                    position: $scope.position,
                    location: $scope.locationExp,
                    startDate: $scope.startDate,
                    endDate:$scope.endDate,
                    description : $scope.descriptionExp,
                    created_time : new Date()

                } , 
            
            function(res){

                    $scope.experiences.push(res.o);

                    $('#formAddExperience')[0].reset();

                    $('#modalExperience').modal('hide');

                    return true;

            }, function(err){
                    $rootScope.error = err;
            });

        }

        
    };

    $scope.saveExperience = function(index, id) {
        // $scope.user already updated!
       // console.log($scope.user);
       //console.log($('#locationExp_' + index).val());

        if(Auth.user.username == $scope.userProfile ){

            $scope.experiences[index].location = $('#locationExp_' + index).val();

            Profiles.updateExperience(
                {
                    id: id,
                    company: $scope.experiences[index].company,
                    position: $scope.experiences[index].position,
                    location: $('#locationExp_' + index).val(),
                    startDate: $scope.experiences[index].startDate,
                    endDate:$scope.experiences[index].endDate,
                    description : $scope.experiences[index].description == null ? "" : $scope.experiences[index].description
                    

                } , 
            
            function(res){

                    return true;

            }, function(err){
                    $rootScope.error = err;
            });

        }

        
    };

    $scope.Init();

}]);