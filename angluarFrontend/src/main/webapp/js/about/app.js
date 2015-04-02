(function(angular){
    angular.module('about-module', ['ngRoute','ngResource','resource.client'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/about',{
            templateUrl:'views/about/about.html',
            controller:'aboutCtrl'});
    }])
    .controller('aboutCtrl',['$scope','AboutClient',function($scope,AboutClient){
        $scope.about = {};
        AboutClient.get({},{},function(data){
            $scope.about.version = data.version;
            $scope.about.date = new Date(data.date).Format("yyyy-MM-dd hh:mm:ss");
        });
    }])
})(angular);