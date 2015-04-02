(function(angular){
    var portal = angular.module('portal',['ngResource']);

    portal.directive('systemHeader', function(){
        return {
          restrict: 'E',
          templateUrl: 'templates/portal/systemHeader.html'
        }
    });

    portal.factory('portalNavbarService',['$resource',function(resource){
        return resource('data/portal/navbar.json',{},{
            getNavbar:{method:'GET',isArray:true}
        });
    }]);

    portal.directive('navBar',function(){
        return {
            transclude: true,
            restrict: 'E',
            templateUrl:"templates/portal/navbar.html"
        };
    });

    portal.directive('leftRightlayout',function(){
        return {
            transclude: true,
            restrict: 'A',
            templateUrl:"templates/portal/leftRightlayout.html"
        };
    });

    portal.controller('navbarController',['$scope','$location','portalNavbarService',function($scope,$location,svc){
            $scope.navbarItems = svc.getNavbar();
            $scope.activeClass=function(path){
                return $location.path()==path ? "on":"";
            };
        }]);
})(angular);