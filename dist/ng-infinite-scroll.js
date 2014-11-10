/* ng-infinite-scroll - v1.0.0 - 2013-09-16 */
var module = angular.module('infinite-scroll', []);

module.directive('infiniteScroll', ['$rootScope', '$window', '$timeout', function($rootScope, $window, $timeout) {
    return {
        link: function(scope, element, attrs) {
            $window = angular.element($window);
            var scrollDistance   = 0;
            var scrollEnabled    = true;
            var checkWhenEnabled = false;

            var handler = function() {
                var windowBottom  = $window[0].innerHeight + $window[0].scrollY;
                var elementBottom = element[0].offsetTop + element[0].scrollHeight;
                var remaining     = elementBottom - windowBottom;
                var shouldScroll  = remaining <= $window[0].innerHeight * scrollDistance;

                if(shouldScroll && scrollEnabled) {
                    if($rootScope.$$phase) {
                        return scope.$eval(attrs.infiniteScroll);
                    } else {
                        return scope.$apply(attrs.infiniteScroll);
                    }
                } else if(shouldScroll) {
                    return checkWhenEnabled = true;
                }
            };

            if(!attrs.infiniteScrollDistance) {
                scope.$watch(attrs.infiniteScrollDistance, function(value) {
                    return scrollDistance = parseInt(value, 10);
                });
            }

            if(!attrs.infiniteScrollDisabled) {
                scope.$watch(attrs.infiniteScrollDisabled, function(value) {
                    scrollEnabled = !value;

                    if(scrollEnabled && checkWhenEnabled) {
                        checkWhenEnabled = false;

                        return handler();
                    }
                });
            }

            $window.bind('scroll', handler);
            scope.$on('$destroy', function() {
                return $window.unbind('scroll', handler);
            });

            return $timeout((function() {
                if(attrs.infiniteScrollImmediateCheck) {
                    if(scope.$eval(attrs.infiniteScrollImmediateCheck)) {
                        return handler();
                    }
                } else {
                    return handler();
                }
            }), 0);
        }
    };
}]);
