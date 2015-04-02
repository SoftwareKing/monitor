(function(angular){
    var breadcrumb = angular.module('breadcrumb',['ngResource']);

    breadcrumb.directive("breadCrumb",function(){
          return {
              replace: true,
              transclude: true,
              restrict: 'E',
              template:" <div id='sys-breadcrumbs' class='sys-breadcrumbs' ng-transclude></div>",
              link:function(scope, element, attrs) {
                $(".search-link").on("click",function(){
                    $(".search-head").toggle(100);
                });
              }
          };
    });

})(angular);