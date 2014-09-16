'use strict';

/* Controllers */



angular.module('angular-client-side-auth')
.controller('PrivateCtrl',
['$rootScope', function($rootScope) {
}]);



angular.module('angular-client-side-auth')
.controller('PythonCtrl',
['$rootScope', '$scope', '$sce', '$window','$routeParams', function($rootScope , $scope, $sce, $window, $routeParams) {

	$scope.ver = 0;

	$scope.curso = {};

	$scope.lists = [
		{
			title 	: 'Introducción a Python',
			url 	: 'https://mdstrm.com/embed/537126a6ab2460302fe74d47'
		},
		{
			title 	: 'Creación de proyecto: Sfotipy',
			url 	: 'https://mdstrm.com/embed/53712497ab2460302fe74d2c'
		},
		{
			title 	: 'Creación de módulos para sfotipy',
			url 	: 'https://mdstrm.com/embed/5371251ba0b1145a2a684189'
		},
		{
			title 	: 'Sesión de preguntas y respuestas',
			url 	: 'https://mdstrm.com/embed/53712a76a0b1145a2a6841ac'
		},
		{
			title 	: 'La seguridad informática y hacking',
			url 	: 'https://www.youtube.com/embed/DndllbA9sEA'
		},
		{
			title 	: '¿Qué es backend?',
			url 	: 'https://www.youtube.com/embed/iIg2I4IicaI'
		},
		
	]
    
    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    }

    $scope.verVideo = function(id){
    	console.log(id);
    	$scope.curso = $scope.lists[id];
    	$scope.ver = 1;
    }
}]);


