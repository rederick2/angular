'use strict';

/* Controllers */



angular.module('angular-client-side-auth')
.controller('PrivateCtrl',
['$rootScope', function($rootScope) {
}]);



angular.module('angular-client-side-auth')
.controller('CursoCtrl',
['$rootScope', '$scope', '$sce', '$window','$routeParams', function($rootScope , $scope, $sce, $window, $routeParams) {

	$scope.ver = 0;

	$scope.curso = {};

	$scope.title = 'Curso de ' + $routeParams.id;

	$scope.lists = [];

	var nameCurso = $routeParams.id;

	switch(nameCurso){
		case 'python':
			$scope.lists = [
		
				{
					title 	: 'Introducción a Phyton con Django',
					items 	: 	[
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
									}
								]
				},
				{
					title 	: 'Django: vistas, modelos y formularios',
					items 	: 	[
									{
										title 	: 'Manejo de vistas en Django',
										url 	: 'https://mdstrm.com/embed/53712e6c461e963e2d52af29'
									},
									{
										title 	: 'Uso de formularios',
										url 	: 'https://mdstrm.com/embed/53712e50a0b1145a2a6841c4'
									},
									{
										title 	: 'Sesión de preguntas y respuestas',
										url 	: 'https://mdstrm.com/embed/53712c74461e963e2d52af14'
									},
									{
										title 	: 'Mejores prácticas en Django',
										url 	: 'https://www.youtube.com/embed/TcA9VtWl6nI'
									}
								]
				},
				{
					title 	: 'Django Avanzado',
					items 	: 	[
									{
										title 	: 'Django Revolutions',
										url 	: 'https://mdstrm.com/embed/53713a85a0b1145a2a68420c'
									},
									{
										title 	: 'Django Revolutions Parte 2',
										url 	: 'https://mdstrm.com/embed/53713a41461e963e2d52afac'
									},
									{
										title 	: 'Sesión de preguntas y respuestas',
										url 	: 'https://mdstrm.com/embed/53713114ab2460302fe74d8b'
									},
									{
										title 	: '¿Cómo funciona una aplicación web?',
										url 	: 'https://www.youtube.com/embed/8zQqHII2840'
									},
									{
										title 	: 'La alegría de ser un backend',
										url 	: 'https://www.youtube.com/embed/J_2nszdHYjc'
									}
								]
				},
				{
					title 	: 'API\'s REST en Django',
					items 	: 	[
									{
										title 	: 'Creando un API REST en Django',
										url 	: 'https://mdstrm.com/embed/53878b40bfdfef64446bf0d2'
									},
									{
										title 	: 'Archivos Estáticos',
										url 	: 'https://mdstrm.com/embed/53878920bfdfef64446bf0b2'
									},
									{
										title 	: 'Manejo de Cache en Django',
										url 	: 'https://mdstrm.com/embed/53878b41bfdfef64446bf0db'
									},
									{
										title 	: 'Manejo de Imágenes',
										url 	: 'https://mdstrm.com/embed/53727e570542f2bb7f1a61e7'
									},
									{
										title 	: 'Procesos Asíncronos',
										url 	: 'https://mdstrm.com/embed/53878b41bfdfef64446bf0e5'
									},
									{
										title 	: 'Sesión de preguntas y respuestas',
										url 	: 'https://mdstrm.com/embed/53878ce23427faf842cfae71'
									}
								]
				}
				
				
			]
			break;
		case 'angularjs':
			$scope.lists = [
		
				{
					title 	: 'Introducción a Angular JS',
					items 	: 	[
									{
										title 	: '¿Que es AngularJS?',
										url 	: 'https://mdstrm.com/embed/5419d108f0ababb9105094f6'
									},
									{
										title 	: 'Agregando Angular a nuestro proyecto',
										url 	: 'https://mdstrm.com/embed/5419d079f0ababb91050948e'
									},
									{
										title 	: 'Directivas',
										url 	: 'https://mdstrm.com/embed/5371251ba0b1145a2a684189'
									},
									{
										title 	: 'Tu primer controlador',
										url 	: 'https://mdstrm.com/embed/5419d305da91e68112c00680'
									},
									{
										title 	: 'Filtros básicos',
										url 	: 'https://mdstrm.com/embed/5419d4c3f0ababb9105096ed'
									},
									{
										title 	: 'Sesión de preguntas y respuestas',
										url 	: 'https://mdstrm.com/embed/53712a76a0b1145a2a6841ac'
									}
								]

								/****  REPOSITORIO POKEDEX: https://github.com/proyectos-mejorandola/pokedex  ******/
				},
				{
					title 	: 'Crea Formularios, Directivas y Módulos',
					items 	: 	[
									{
										title 	: 'Uso de formularios',
										url 	: 'https://mdstrm.com/embed/541b4df2d6882f980ca370ed'
									},
									{
										title 	: 'Directivas personalizadas',
										url 	: 'https://mdstrm.com/embed/541b4fafd6882f980ca3710c'
									},
									{
										title 	: 'Validación y filtros en formularios',
										url 	: 'https://mdstrm.com/embed/541b51b3d6882f980ca3713b'
									},
									{
										title 	: 'Creación de módulos en AngularJS',
										url 	: 'https://mdstrm.com/embed/541b4ffc66d012b104d3dc94'
									},
									{
										title 	: 'Sesión de preguntas y respuestas',
										url 	: 'https://mdstrm.com/embed/541b52b4d6882f980ca37148'

								]
				},
				{
					title 	: 'Rutas, Servicios y Local Storage',
					items 	: 	[
									{
										title 	: 'Introducción a rutas',
										url 	: 'https://mdstrm.com/embed/541c6116d6882f980ca377f3'
									},
									{
										title 	: 'Creación de un controlador asociado a una vista',
										url 	: 'https://mdstrm.com/embed/541c616dd6882f980ca37804'
									},
									{
										title 	: 'Servicios como buena practica de peticiones HTTP',
										url 	: 'https://mdstrm.com/embed/541c682fd6882f980ca37853'
									},
									{
										title 	: 'Almacenamiento de datos en Local Storage',
										url 	: 'https://mdstrm.com/embed/541c7f57d6882f980ca37914'
									},
									{
										title 	: 'Se parte del proyecto, tareas adicionales de Pokedex',
										url 	: 'https://mdstrm.com/embed/541c7fa3864663c202a506e0'
									},
									{
										title 	: 'Sesión de preguntas y respuestas',
										url 	: 'https://mdstrm.com/embed/541c686766d012b104d3e119'
									}
								]

								/****  REPOSITORIO POKEDEX: https://github.com/proyectos-mejorandola/pokedex  ******/
				},
				
				
			]
			break;
		default : 
			break;
	}

	
    
    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    }

    $scope.verVideo = function(id, index ){
    	console.log(id);
    	$scope.curso = $scope.lists[id].items[index];
    	$scope.ver = 1;
    }
}]);


