/**
 * Created by User on 2014/7/23.
 */
angular.module('Index.Menu', []).
  controller('MenuCtrl', ['$scope', '$resource', function ($scope, $resource) {
    var menuService = $resource('/api/menu_items');
    var promise = menuService.query().$promise;
    promise.then(function (data) {
        $scope.topMenuItems = data;
    });

    $("#LogoId").mouseenter(function(e){
        $(this).css('opacity','1');
    }).mouseleave(function(){
      $(this).css('opacity','0');
    });
  }]);
