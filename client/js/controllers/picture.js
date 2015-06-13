angular.module('unsApp')
.controller('PictureCtrl',
['$rootScope', '$scope', '$location', '$upload', 'Files' , '$sce', 'Users', 'Auth' , function($rootScope, $scope, $location, $upload, Files, $sce, Users, Auth) {

    $('.btn-select-files').on('click', function(){
        //alert('0');
        $('.uploadphoto').trigger('click');

        return false;

    });

    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    }

    $scope.imagePreview = false;
    $scope.uploadimage = '';

    $scope.selected = function(x) {
        console.log("selected",x);
        $scope.coordenadas = x;
    };

    $scope.cancel = function(){

        Files.destroy({
            public_id: $scope.public_id
        },
        function(res) {
            console.log(res);
            $location.path('/'+Auth.user.username);

        },
        function(err) {
            $rootScope.error = err;
        });
         
    }

    $scope.setAsProfile = function() {
        var url = $scope.picture;
        var x = $scope.coordenadas;
        var newurl = '';

        newurl = url.replace('h_0' , 'h_' + x.h)
                    .replace('w_0' , 'w_' + x.w)
                    .replace('x_0' , 'x_' + x.x)
                    .replace('y_0' , 'y_' + x.y);

        console.log(newurl);

        Users.update({
            username: Auth.user.username,
            name: 'picture',
            value: newurl
        },
        function(res) {
            console.log(res);
            //$location.path('/'+Auth.user.username);
            window.location.href = '/'+Auth.user.username;

        },
        function(err) {
            $rootScope.error = err;
        });
    };

    $scope.onFileSelect = function($files) {
        $scope.loading = true;
        $scope.selectedFiles = [];
        $scope.progress = [];
        if ($scope.upload && $scope.upload.length > 0) {
                for (var i = 0; i < $scope.upload.length; i++) {
                        if ($scope.upload[i] != null) {
                                $scope.upload[i].abort();
                        }
                }
        }
        $scope.upload = [];
        $scope.uploadResult = [];
        $scope.selectedFiles = $files;
        for ( var i = 0; i < $files.length; i++) {
                var $file = $files[i];
                $scope.progress[i] = 0;
                //$scope.uploadimage = '<i class="fa fa-spinner fa-spin"></i>';
               // console.log($file);
                if($file.size <= 100000){
                    (function(index) {
                            $scope.upload[index] = $upload.upload({
                                    url : '/file',
                                    headers: {'myHeaderKey': 'myHeaderVal'},
                                    data : {
                                            myModel : $scope.myModel,
                                            width : 450
                                    },
                                    file : $file,
                                    fileFormDataName: 'file'
                            }).then(function(response) {
                                    $scope.uploadResult.push(response.data.result);

                                    $scope.uploadimage = response.data.image_big;
                                    $scope.picture = response.data.image_th;
                                    $scope.public_id = response.data.public_id;
                                    $scope.imagePreview = true;
                                    $scope.loading = false;

                            }, null, function(evt) {
                                    $scope.progress[index] = parseInt(100.0 * evt.loaded / evt.total);
                                    console.log(parseInt(100.0 * evt.loaded / evt.total));
                            });
                    })(i);
                }else{

                    $rootScope.error = 'Tamaño maximo del archivo debe ser de 100Kb, el tamaño de tu archivo es: '+($file.size/1000)+ 'Kb';
                    $scope.imagePreview = false;
                    $scope.loading = false;
                }
        }
    }



}]);