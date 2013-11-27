'use strict';

/*angular.module('angular-client-side-auth')
    .directive('infiniteScroll', [ "$window", function ($window) {
        return {
            link:function (scope, element, attrs) {
                var offset = parseInt(attrs.threshold) || 0;

                if(attrs.element){
                    element = $(window);
                    var e = $('body')[0];
                }else{
                    var e = element[0];
                }
                

                element.bind('scroll', function () {

                    if (scope.$eval(attrs.canLoad) && e.scrollTop + e.offsetHeight >= e.scrollHeight - offset) {
                        scope.$apply(attrs.infiniteScroll);

                        console.log(attrs.infiniteScroll);
                    }
                });
            }
        };
    }]);*/

angular.module('angular-client-side-auth')
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

angular.module('angular-client-side-auth')
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

angular.module('angular-client-side-auth').directive("passwordVerify", function() {
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

angular.module('angular-client-side-auth').directive('activeNav', ['$location', function($location) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var nestedA = element.find('a')[0];
            var path = nestedA.href;

            scope.location = $location;
            scope.$watch('location.absUrl()', function(newPath) {
                if (path === newPath) {
                    //element.addClass('active');
                } else {
                    //element.removeClass('active');
                }
            });
        }

    };

}]);

angular.module('angular-client-side-auth').directive('uniqueUsername', function () {
    return {
        require:'ngModel',
        restrict:'A',
        link:function (scope, el, attrs, ctrl) {

            ctrl.$parsers.unshift(function (viewValue) {
                if (viewValue) {

                   new Firebase('https://rederick2.firebaseio.com/users/')
                    .on('value', function(snapshot) {

                        var data = snapshot.val();

                        var result = _.where(data, {username: viewValue});

                        

                      if(!result[0]) {
                        console.log('not exist.');
                        ctrl.$setValidity('uniqueUsername', true);
                      } else {
                        console.log('exist.');
                        ctrl.$setValidity('uniqueUsername', false);
                      }
                    });

                    return viewValue;
                }
            });

        }
    }
});

angular.module('angular-client-side-auth').directive('uniqueEmail', ['_' ,  function (_) {
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
                        console.log('not exist.');
                        ctrl.$setValidity('uniqueEmail', true);
                      } else {
                        console.log('exist.');
                        ctrl.$setValidity('uniqueEmail', false);
                      }
                    });

                    return viewValue;
                }

            });

        }
    }
}]);


