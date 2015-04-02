(function(angular){
    var loading = angular.module('dnt.loading',['ngResource']);
    loading.service('Loading',['$parse',function($parse){
        this.show=function(){
            var w = jQuery(document).width();
            var h = jQuery(document).height();
            jQuery("#my-ajax-view").css({
                width: w,
                height:h
            }).show();
            jQuery("#my-ajax-view-center").css({
                top:	(h - jQuery("#my-ajax-view-center").outerHeight())/2,
                left:	(w - jQuery("#my-ajax-view-center").outerWidth())/2
            }).show();
        };
        this.hide=function(){
            jQuery("#my-ajax-view").hide();
            jQuery("#my-ajax-view-center").hide();
        };
    }]);
    loading.directive('myLoading',function(){
        return {
            restrict: 'AE',
            templateUrl:"lib/dnt-angular-ui/loading/loading.html"
        };
    });
})(angular);