var module = angular.module('infinite-scroll', []);

module.directive('infiniteScroll', ['$rootScope', '$window', '$timeout', function($rootScope, $window, $timeout) {
    return {
        link: function(scope, element, attrs) {
            $window = angular.element($window);
            var scrollDistance   = 0;
            var scrollEnabled    = true;
            var checkWhenEnabled = false;

            // infinite-scroll specifies a function to call when the window
            // is scrolled within a certain range from the bottom of the
            // document. It is recommended to use infinite-scroll-disabled
            // with a boolean that is set to true when the function is
            // called in order to throttle the function call.
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

            // infinite-scroll-distance specifies how close to the bottom of the page
            // the window is allowed to be before we trigger a new scroll. The value
            // provided is multiplied by the window height; for example, to load
            // more when the bottom of the page is less than 3 window heights away,
            // specify a value of 3. Defaults to 0.
            if(!attrs.infiniteScrollDistance) {
                scope.$watch(attrs.infiniteScrollDistance, function(value) {
                    return scrollDistance = parseInt(value, 10);
                });
            }

            // infinite-scroll-disabled specifies a boolean that will keep the
            // infnite scroll function from being called; this is useful for
            // debouncing or throttling the function call. If an infinite
            // scroll is triggered but this value evaluates to true, then
            // once it switches back to false the infinite scroll function
            // will be triggered again.
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