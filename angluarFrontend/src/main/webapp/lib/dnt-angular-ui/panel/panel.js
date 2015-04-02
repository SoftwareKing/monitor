(function(angular){
    var panel = angular.module('panel',['ngResource']);

    panel.directive('panelWidget',function(){
        return {
            replace: true,
            transclude: true,
            restrict: 'E',
            templateUrl:"../../lib/dnt-angular-ui/panel/panel.html"
        };
    });

})(angular);
