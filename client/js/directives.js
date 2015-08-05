'use strict';

angular.module('unsApp')
  .directive('ngEnter', function () {
    return function ($scope, element, attrs) {
        
          element.bind("keydown keypress", function (event) {
              if(event.which === 13) {
                if (!event.shiftKey) {
                    $scope.$apply(function (){
                        $scope.$eval(attrs.ngEnter);
                    });
                  event.preventDefault();
                }
              }
          });
        
    };
});

angular.module('unsApp')
    .directive('modalLogin', [ '$rootScope', '$location', '$window', 'Auth', '$firebase', function ($rootScope, $location, $window, Auth, $firebase) {
        return {
            restrict: 'E',
            //replace:true,
            templateUrl: '/partials/login.jade',
            controller: function ($scope) {

              $('#modalLogin').on('hidden.bs.modal', function (e) {
                // do something...
                $scope.username = "";
                $scope.password = "";
                $scope.messageError = "";

              })
              
              if(Auth.user.username == '')
              {
                  $scope.rememberme = true;

                  $scope.messageError = "";

                  var url = "https://rederick2.firebaseio.com/";

                  var ref = new Firebase(url);
                  
                  /*var authFirebase = new FirebaseSimpleLogin(ref, function(error, user) {
                    if (error) {
                      // an error occurred while attempting login
                      console.log(error);
                    } else if (user) {
                      // user authenticated with Firebase
                      //console.log(1);

                          if(user.provider == 'facebook'){
                              
                              Auth.loginFb(user,
                              function(res) {

                                  if(res.login == 'true')
                                  {

                                      //$location.path('/');
                                      window.location.href = '/';

                                  }else{

                                      $rootScope.userRegister = user;
                                      $location.path('/register');

                                  }
                              },
                              function(err) {
                                  $rootScope.error = err;
                              });
                              
                          }

                    } 
                  });*/
              }

              $scope.login = function() {
                  
                  $scope.messageError = "";
                  
                  Auth.login({
                          username: $scope.username,
                          password: $scope.password,
                          rememberme: $scope.rememberme
                      },
                      function(res) {
                          //console.log(res);
                          if(res.message)
                            $scope.messageError = res.message;
                          else
                            //authFirebase.login('password', {email: res.email, password: res.password});
                            window.location.href = '/';
                        
                          //authFirebase.login('password', {email: res.email, password: res.password});
                          //$location.path('/');
                          
                      },
                      function(err) {
                          $rootScope.error = "Failed to login";
                      });
              };

              $scope.handleAuthResponse = function (promise) {
                  $.when(promise)
                      .then(function (authData) {

                        $('#modalLogin').modal('hide');

                        Auth.loginFb(authData,
                          function(res) {

                            if(res.login == 'true')
                            {

                                //$location.path('/');
                                window.location.href = '/';

                            }else{

                                if(authData.provider == 'facebook')
                                {
                                  $rootScope.userRegister = authData.facebook;
                                  $rootScope.userRegister.picture = 'https://graph.facebook.com/'+authData.facebook.username+'/picture';
                                }
                                else if(authData.provider == 'twitter')
                                {
                                  $rootScope.userRegister = authData.twitter;
                                  $rootScope.userRegister.picture = authData.twitter.cachedUserProfile.profile_image_url.replace('_normal' , '');
                                }
                                else if(authData.provider == 'google')
                                {
                                  console.log(authData);
                                  $rootScope.userRegister = authData.google;
                                  $rootScope.userRegister.picture = authData.google.cachedUserProfile.picture;
                                }

                                $rootScope.userRegister.provider = authData.provider;

                                //$location.path('/register');
                                //console.log(authData);

                                
                                $('#modalRegister').modal('show');

                            }
                          },
                          function(err) {
                              $rootScope.error = err;
                          });
                          //console.log(authData)

                      // route
                      //routeTo(route);

                  }, function (err) {
                      console.log(err);
                      // pop up error
                      $rootScope.error = "Failed to login";

                  });
              }

              $scope.loginOauth = function(provider) {

                  //authFirebase.login(provider);
                  /*if (provider == 'google'){
                      ref.authWithOAuthPopup("google", function(err, authData) {
                        if (err) {

                        } else if (authData) {
                          // user authenticated with Firebase
                          console.log(authData)
                        }
                      }, {scope: 'https://www.googleapis.com/auth/userinfo.email, https://www.googleapis.com/auth/plus.login'});

                  };*/
                  var socialLoginPromise = $scope.thirdPartyLogin(provider);

                  $scope.handleAuthResponse(socialLoginPromise);

              };

              $scope.thirdPartyLogin = function(provider) {

                  var deferred = $.Deferred();

                  var scope = '';

                  if(provider == 'google')
                  {
                      scope = 'https://www.googleapis.com/auth/userinfo.email, https://www.googleapis.com/auth/plus.login';
                  }

                  ref.authWithOAuthPopup(provider, function (err, user) {
                      if (err) {
                          deferred.reject(err);
                      }

                      if (user) {
                          deferred.resolve(user);
                      }
                  }, {scope: scope});

                  return deferred.promise();
              };

            }
        };
    }])

angular.module('unsApp')
    .directive('modalRegister', [ '$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
        return {
            restrict: 'E',
            //replace:true,
            templateUrl: '/partials/register.jade',
            controller: function ($scope) {

              $('#modalRegister').on('hidden.bs.modal', function (e) {
                // do something...
                $rootScope.userRegister.username = "";
                $rootScope.userRegister.email = "";
                $rootScope.userRegister.displayName = "";
                $scope.password = "";
                $scope.password_verify = "";
                $scope.messageError = '';

              })
              
              $scope.role = Auth.userRoles.user;
              $scope.userRoles = Auth.userRoles;
              $scope.username = '';
              $scope.messageError = '';

              var url = "https://rederick2.firebaseio.com/";

              /*if($rootScope.userRegister)
              {

                  $scope.username = $rootScope.userRegister.username;
                  $scope.email = $rootScope.userRegister.email;
                  $scope.displayName = $rootScope.userRegister.displayName;
              }*/


              $scope.$watch('username', function() {
                  $scope.username = $scope.username != undefined ? $scope.username.toLowerCase().replace(/\s+/g,'') : $scope.username;
              });

              $scope.register = function() {
                  var social = null;
                  var picture = "";
                  $scope.messageError = '';

                  if($rootScope.userRegister)
                  {

                      social = {
                                  provider: $rootScope.userRegister.provider, 
                                  providerId: $rootScope.userRegister.id, 
                                  token: $rootScope.userRegister.accessToken, 
                                  picture:$rootScope.userRegister.picture, 
                                  link: $rootScope.userRegister.link
                                } 
                  }

                  Auth.register({
                          username: $scope.userRegister.username,
                          password: $scope.password,
                          email: $scope.userRegister.email,
                          name: $scope.userRegister.displayName,
                          role: $scope.userRegister.role,
                          social : social
                      },
                      function(res) {
                          /*authFirebase.createUser(res.email, res.password, function(error, user) {
                            if (!error) {
                              console.log('User Id: ' + user.uid + ', Email: ' + user.email);
                              authFirebase.login('password', {email: res.email, password: res.password});
                            }
                          });*/
                          //$location.path('/');
                          //console.log(res);

                          if(res.message)
                            $scope.messageError = res.message;
                          else
                            window.location.href = '/';
                      },
                      function(err) {
                          $rootScope.error = err;
                      });
              };
          }
        }
    }])

angular.module('unsApp').directive('inboxes', ['$location', function($location) {
    return {
        restrict: 'E',
        templateUrl : '/partials/inboxes.jade'
    };

}]);

angular.module('unsApp').directive('messagesChat', ['$location', function($location) {
    return {
        restrict: 'E',
        templateUrl : '/partials/messages-chat.jade'
    };

}]);

angular.module('unsApp').directive('headerUsers', ['$location', function($location) {
    return {
        restrict: 'E',
        templateUrl : '/partials/headerUsers.jade'
    };

}]);

angular.module('unsApp')
.directive('infiniteScroll', [
  '$rootScope', '$window', '$timeout', function($rootScope, $window, $timeout) {
    return {
      link: function(scope, elem, attrs) {
        var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
        $window = angular.element($window);
        scrollDistance = 0;
        if (attrs.infiniteScrollDistance != null) {
          scope.$watch(attrs.infiniteScrollDistance, function(value) {
            return scrollDistance = parseInt(value, 10);
          });
        }
        scrollEnabled = true;
        checkWhenEnabled = false;
        if (attrs.infiniteScrollDisabled != null) {
          scope.$watch(attrs.infiniteScrollDisabled, function(value) {
            scrollEnabled = !value;
            if (scrollEnabled && checkWhenEnabled) {
              checkWhenEnabled = false;
              return handler();
            }
          });
        }
        handler = function() {
          var elementBottom, remaining, shouldScroll, windowBottom;
          windowBottom = $window.height() + $window.scrollTop();
          elementBottom = elem.offset().top + elem.height();
          remaining = elementBottom - windowBottom;
          shouldScroll = remaining <= $window.height() * scrollDistance;
          if (shouldScroll && scrollEnabled) {
            if ($rootScope.$$phase) {
              return scope.$eval(attrs.infiniteScroll);
            } else {
              return scope.$apply(attrs.infiniteScroll);
            }
          } else if (shouldScroll) {
            return checkWhenEnabled = true;
          }
        };
        $window.on('scroll', handler);
        scope.$on('$destroy', function() {
          return $window.off('scroll', handler);
        });
        return $timeout((function() {
          if (attrs.infiniteScrollImmediateCheck) {
            if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
              return handler();
            }
          } else {
            return handler();
          }
        }), 0);
      }
    };
  }
]);

angular.module('unsApp')
.directive('accessLevel', ['Auth', function(Auth) {
    return {
        restrict: 'A',
        link: function($scope, element, attrs) {
            var prevDisp = element.css('display')
                , userRole
                , accessLevel;

            $scope.user = Auth.user;
            $scope.$watch('user', function(user) {
                if(user.role)
                    userRole = user.role;
                updateCSS();
            }, true);

            attrs.$observe('accessLevel', function(al) {
                if(al) accessLevel = $scope.$eval(al);
                updateCSS();
            });

            function updateCSS() {
                if(userRole && accessLevel) {
                    if(!Auth.authorize(accessLevel, userRole))
                        element.css('display', 'none');
                    else
                        element.css('display', prevDisp);
                }
            }
        }
    };
}]);

angular.module('unsApp').directive("passwordVerify", function() {
   return {
      require: "ngModel",
      restrict: 'A',
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, ctrl) {
        scope.$watch(function() {
            var combined;

            if (scope.passwordVerify || ctrl.$viewValue) {
               combined = scope.passwordVerify + '_' + ctrl.$viewValue; 
            }                    
            return combined;
        }, function(value) {
            if (value) {
                ctrl.$parsers.unshift(function(viewValue) {
                    var origin = scope.passwordVerify;
                    if (origin !== viewValue) {
                        ctrl.$setValidity("passwordVerify", false);
                        return undefined;
                    } else {
                        ctrl.$setValidity("passwordVerify", true);
                        return viewValue;
                    }
                });
            }
        });
     }
   };
});

angular.module('unsApp').directive('activeNav', ['$location', function($location) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var nestedA = element.find('a')[0];
            var path = nestedA.href;

            scope.location = $location;
            scope.$watch('location.absUrl()', function(newPath) {
                if (path === newPath) {
                    element.addClass('active');
                } else {
                    element.removeClass('active');
                }
            });
        }

    };

}]);

angular.module('unsApp').directive('uniqueUsername', [ 'Users', function(Users) {
    return {
        require:'ngModel',
        restrict:'A',
        link:function (scope, el, attrs, ctrl) {

            ctrl.$parsers.unshift(function (viewValue) {
                if (viewValue) {

               // console.log(viewValue.trim() + '|');

                   Users.getByUsername({username: viewValue.trim()}, function(res) {

                      if(res.success == 0) {
                        //console.log('not exist.');
                        ctrl.$setValidity('uniqueUsername', true);
                      } else {
                        //console.log('exist.');
                        ctrl.$setValidity('uniqueUsername', false);
                      }

                    });

                    return viewValue;
                }
            });

        }
    }
}]);

angular.module('unsApp').directive('active', function() {
  return function(scope, element, attrs) {
    var clickingCallback = function() {
      //alert('clicked!')
      $('ul.menuProfile').find("li").removeClass('active');
      element.addClass('active');
    };
    element.bind('click', clickingCallback);
  }
});

angular.module('unsApp').directive('uniqueEmail', ['_' ,  function (_) {
    return {
        require:'ngModel',
        restrict:'A',
        link:function (scope, el, attrs, ctrl) {

            ctrl.$parsers.unshift(function (viewValue) {
                if (viewValue) {

                    new Firebase('https://rederick2.firebaseio.com/users/')
                    .on('value', function(snapshot) {

                        var data = snapshot.val();

                        var result = _.where(data, {email: viewValue});

                        

                      if(!result[0]) {
                        //console.log('not exist.');
                        ctrl.$setValidity('uniqueEmail', true);
                      } else {
                        //console.log('exist.');
                        ctrl.$setValidity('uniqueEmail', false);
                      }
                    });

                    return viewValue;
                }

            });

        }
    }
}]);


angular.module('unsApp').directive('liveUrl', function () {
    return {
        require:'ngModel',
        restrict:'A',
        link:function (scope, el, attrs, ctrl) {

                var curImages = new Array();
                
                $('textarea').liveUrl({
                    loadStart : function(){
                        $('.liveurl-loader').show();
                        scope.loading = true;
                    },
                    loadEnd : function(){
                        $('.liveurl-loader').hide();
                        scope.loading = false;
                    },
                    success : function(data) 
                    {
                        scope.typepost = 'url';                        
                        var output = $('.liveurl');
                        output.find('.title').text(data.title);
                        scope.title = data.title;
                        output.find('.description').text(data.description);
                        scope.description = data.description;
                        scope.message = data.description;
                        output.find('.url').text(data.url);
                        scope.url = data.url;
                        output.find('.link').attr('href' , data.url);
                        output.find('.image').empty();
                        
                        output.find('.close').one('click', function() 
                        {
                            var liveUrl     = $(this).parent();
                            liveUrl.hide('fast');
                            liveUrl.find('.video').html('').hide();
                            liveUrl.find('.image').html('');
                            liveUrl.find('.controls .prev').addClass('inactive');
                            liveUrl.find('.controls .next').addClass('inactive');
                            liveUrl.find('.thumbnail').hide();
                            liveUrl.find('.image').hide();

                            $('textarea').trigger('clear'); 
                            curImages = new Array();

                            scope.typepost = 'text';
                        });
                        
                        output.show('fast');
                        
                        if (data.video != null) {                       
                            var ratioW        = data.video.width  /350;
                            data.video.width  = 350;
                            data.video.height = data.video.height / ratioW;
        
                            var video = 
                            '<object width="' + data.video.width  + '" height="' + data.video.height  + '">' +
                                '<param name="movie"' +
                                      'value="' + data.video.file  + '"></param>' +
                                '<param name="allowScriptAccess" value="always"></param>' +
                                '<embed src="' + data.video.file  + '"' +
                                      'type="application/x-shockwave-flash"' +
                                      'allowscriptaccess="always"' +
                                      'width="' + data.video.width  + '" height="' + data.video.height  + '"></embed>' +
                            '</object>';
                            output.find('.video').html(video).show();

                            scope.typepost = 'video';
                            scope.source = data.video.file;
                         
                        }
                    },
                    addImage : function(image)
                    {   
                        var output  = $('.liveurl');
                        var jqImage = $(image);
                        jqImage.attr('alt', 'Preview');
                        
                        if ((image.width / image.height)  > 7 
                        ||  (image.height / image.width)  > 4 ) {
                            // we dont want extra large images...
                            return false;
                        } 

                        curImages.push(jqImage.attr('src'));
                        output.find('.image').append(jqImage);

                        scope.picture = jqImage.attr('src');
                        
                        
                        if (curImages.length == 1) {
                            // first image...
                            
                            output.find('.thumbnail .current').text('1');
                            output.find('.thumbnail').show();
                            output.find('.image').show();
                            jqImage.addClass('active');
                            
                        }
                        
                        if (curImages.length == 2) {
                            output.find('.controls .next').removeClass('inactive');
                        }
                        
                        output.find('.thumbnail .max').text(curImages.length);
                    }
                });
              
              
                $('.liveurl ').on('click', '.controls .button', function() 
                {
                    var self        = $(this);
                    var liveUrl     = $(this).parents('.liveurl');
                    var content     = liveUrl.find('.image');
                    var images      = $('img', content);
                    var activeImage = $('img.active', content);

                    if (self.hasClass('next')) 
                         var elem = activeImage.next("img");
                    else var elem = activeImage.prev("img");
      
                    if (elem.length > 0) {
                        activeImage.removeClass('active');
                        elem.addClass('active');  
                        liveUrl.find('.thumbnail .current').text(elem.index() +1);
                        
                        if (elem.index() +1 == images.length || elem.index()+1 == 1) {
                            self.addClass('inactive');
                        }
                    }

                    if (self.hasClass('next')) 
                         var other = elem.prev("img");
                    else var other = elem.next("img");
                    
                    if (other.length > 0) {
                        if (self.hasClass('next')) 
                               self.prev().removeClass('inactive');
                        else   self.next().removeClass('inactive');
                   } else {
                        if (self.hasClass('next')) 
                               self.prev().addClass('inactive');
                        else   self.next().addClass('inactive');
                   }
                   
                   
                   
                });

                

        }
    }
});

angular.module('unsApp')
.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.fileread = changeEvent.target.files[0];
                    // or all selected files:
                    // scope.fileread = changeEvent.target.files;
                });
            });
        }
    }
}]);

angular.module('unsApp')
.directive('imgCropped', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: { src:'@', selected:'&' },
    link: function(scope,element, attr) {
      var myImg;
      var clear = function() {
        if (myImg) {
          myImg.next().remove();
          myImg.remove();
          myImg = undefined;
        }
      };
      scope.$watch('src', function(nv) {        
        clear();
        if (nv) {
          element.after('<img />');
          myImg = element.next();        
          myImg.attr('src',nv);
          myImg.attr('style', 'position:absolute; top:0; left:0; right:0; bottom:0; margin:auto;');
          $(myImg).Jcrop({
            trackDocument: true,  
            aspectRatio: 1,
            minSize: [160,160],
            setSelect:   [ 100, 100, 260, 260 ],
            onSelect: function(x) {              
              scope.$apply(function() {
                scope.selected({cords: x});
              });
            }
          });
        }
      });
      
      scope.$on('$destroy', clear);
    }
  };
});

/*angular.module('unsApp')
.directive('pictureProfile', ['Users', function(Users) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {

             Users.getByUsername({username:attrs.username} , 
                function(res){

                    //console.log(res[0]);
                    if(res[0].picture){
                        element.attr('src' , res[0].picture + '?' + (Math.random()*10));
                    }else{
                        element.attr('src' , 'http://placehold.it/50x50');
                    }

                }, function(err){
                    $rootScope.error = err;
                });
            //element.attr('src' , attrs.username);
        }
    };
}]);*/

angular.module('unsApp')
.directive('googlePlaces', function(){
    return {
        restrict:'E',
        replace:true,
        // transclude:true,
        scope: {location:'='},
        template: '<input id="google_places_ac" name="google_places_ac" type="text" class="input-block-level"/>',
        link: function($scope, elm, attrs){
            var autocomplete = new google.maps.places.Autocomplete($("#google_places_ac")[0], {});
            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                var place = autocomplete.getPlace();
                //$scope.location = place.geometry.location.lat() + ',' + place.geometry.location.lng();
                $scope.$apply();
            });
        }
    }
});

angular.module('unsApp')
.directive('customSelect', function($parse, $timeout) {
  
    var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/;

    var regularTemplate = '<md-select ng-model="ngModel" ng-change="ngChange()">\
            <md-select-label>{{selectedItem.text}}</md-select-label> \
            <md-option md-no-ink ng-repeat="item in items track by $index" ng-value="item.value" ng-click="selected(item)">{{item.text}}</md-option> \
            </md-select>';

    var oneTimeTemplate = '<md-select ng-model="ngModel" ng-change="ngChange()">\
            <md-select-label>{{selectedItem.text}}</md-select-label> \
            <md-option md-no-ink ng-repeat="item in ::items track by $index" ng-value="::item.value" ng-click="selected(item)">{{::item.text}}</md-option> \
            </md-select>';

    var noSelectionTemplate = '<md-select ng-model="ngModel" class="no-select">\
            <md-select-label>{{selectedItem.text}}</md-select-label> \
            <md-option md-no-ink ng-value="::items[0].value">{{::items[0].text}}</md-option></md-select>';

    var groupTemplate = '<md-select ng-model="ngModel" ng-change="ngChange()">\
            <md-select-label>{{selectedItem.text}}</md-select-label> \
            <md-optgroup ng-repeat = "group in groups" ng-attr-label="{{group}}"> \
            <md-option md-no-ink ng-repeat="item in items| filter: {group: group}" track by $index" ng-value="item.value" ng-click="selected(item)">{{item.text}}</md-option></md-optgroup> \
            </md-select>';

    var groupTemplatePerformant = '<md-select ng-model="ngModel" ng-change="ngChange()">\
            <md-select-label>{{selectedItem.text}}</md-select-label> \
            <md-optgroup ng-repeat = "group in ::groups" ng-attr-label="{{::group}}"> \
            <md-option md-no-ink ng-repeat="item in ::items| filter: {group: group}" track by $index" ng-value="::item.value" ng-click="selected(item)">{{::item.text}}</md-option></md-optgroup> \
            </md-select>';
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            ngChange:"&?"
        },
        template: function(elm, attr){
          var settings = JSON.parse(attr.settings || "{}");
          
          if(settings.noSelection){
            return noSelectionTemplate;
          }
          
          if(attr.options.match(NG_OPTIONS_REGEXP)[3]){
            if(settings.performant){
              return groupTemplatePerformant;
            }
            return groupTemplate;
          }
          
          if(settings.performant){
             return oneTimeTemplate;
          }
          
          return regularTemplate;
        },
        link: function(scope, elm, attrs, ctrl) {
            var match = attrs.options.match(NG_OPTIONS_REGEXP);

            console.log(match)

            var
                displayFn = $parse(match[2] || match[1]),
                valueName = match[4] || match[6],
                selectAs = / as /.test(match[0]) && match[1],
                selectAsFn = selectAs ? $parse(selectAs) : null,
                keyName = match[5],
                groupByFn = $parse(match[3] || ''),
                valueFn = $parse(match[2] ? match[1] : valueName),
                valuesFn = $parse(match[7]),
                track = match[8],
                trackFn = track ? $parse(match[8]) : null,
                locals = {},
                displayField = _getNormalizedProp(match[2] || match[1]),
                idField = _getNormalizedProp(track || selectAs || valueName),
                trackField = _getNormalizedProp(track),
                groupField = _getNormalizedProp(match[3]),
                settings = JSON.parse(attrs.settings || "{}"),
                unWatchCollection;
         
          init();
          
          function init(){
            scope.selectedItem = {};
            unWatchCollection = scope.$parent.$watchCollection(valuesFn, _setCollection);
            scope.selected = setSelected;
            scope.groups = [];
            ctrl.$render = render;
          }
          
          function setSelected(item){
              scope.selectedItem = item;
          }
          
          function render(){
            if(!angular.isArray(scope.items) || !ctrl.$viewValue) return;
            var viewValue = _getMatchedTrackValue(ctrl.$viewValue);
            
              for(var i=0, l= scope.items.length; i<l; i++){
                if(viewValue == _getMatchedTrackValue(scope.items[i].value)){
                  return scope.selectedItem = scope.items[i];
                }
             }
          }
          
          function _getMatchedTrackValue(value){
             return trackField ? scope.$eval.call(value, trackField) : value;
          }
  
           function _getNormalizedProp(prop){
              if(!prop) return prop;
              return prop.split('.').slice(1).join('.');
           }
          
           function _setCollection(values){
                scope.groups = [];
                if(angular.isDefined(values) && settings.performant){
                  unWatchCollection();
                }
               
                if(values && angular.isArray(values)){
                 
                  scope.items = values.map(function(it, i){
                    console.log(_callExpression(displayFn, i, it))
                     var ret = {
                       text: _callExpression(displayFn, i, it),
                       value: _callExpression(selectAsFn || valueFn, i, it)
                     };
                    _setGroup(i, it, ret);
                    return ret;
                  });
                }else if (values) {
                    // TODO: Implement for object if needed
                    scope.items = {};
                    for (var prop in values) {
                        if (values.hasOwnProperty(prop)) {
                            scope.items[prop] = _callExpression(displayFn, prop, values[prop]);
                        }
                    }
                }
                ctrl.$render();
            }
          
          function _setGroup(i, it, listItem){
             var group;
             if(!groupField) return;
             group = _callExpression(groupByFn, i, it) || "List";
             listItem.group = group;
             if(!~scope.groups.indexOf(group)){
                scope.groups.push(group);  
             }
          }
  
            function _callExpression(exprFn, key, value) {

                locals[valueName] = value;
                if (keyName) locals[keyName] = key;
                return exprFn(window, locals);
            }
        }
    }
});


