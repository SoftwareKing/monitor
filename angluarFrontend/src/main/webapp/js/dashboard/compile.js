(function(angular){
    angular.module('compile', [], function($compileProvider) {
        $compileProvider.directive('compile', function($compile) {
            return function(scope, element, attrs) {
                scope.$watch(
                    function(scope) {
                        return scope.$eval(attrs.compile);
                    },
                    function(value) {
                        element.html(value);
                        $compile(element.contents())(scope);
                    }
                );
            };
        });
    });
})(angular);;