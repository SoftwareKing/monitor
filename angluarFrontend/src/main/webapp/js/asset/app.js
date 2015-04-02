(function (angular) {
    var api_path = "/dmonitor-webapi/";
    var asset = angular.module('asset-module', ['ngRoute', 'ngResource','resource.client','user','zTreeDirective','checkListDirective','datepickerDirective','maskLayerDirective','dataTablesDirective','util.filters','util.services','bootstrap.modal','ui.bootstrap','asset.controllers','asset.services']);
    asset.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/abandonProperty', {
            templateUrl: 'views/asset/setting/property/index.html',
            controller: 'propertyController'});
        $routeProvider.when('/abandonReason', {
            templateUrl: 'views/asset/setting/abandonReason/index.html',
            controller: 'abandonReasonController'});
        $routeProvider.when('/assetManagement', {
            templateUrl: 'views/asset/asset/management/index.html',
            controller: 'assetManagementController'});
        $routeProvider.when('/assetCheckout', {
            templateUrl: 'views/asset/asset/checkout/index.html',
            controller: 'assetCheckoutController'});
        $routeProvider.otherwise({redirectTo: '/index'});
    }]);

})(angular);
