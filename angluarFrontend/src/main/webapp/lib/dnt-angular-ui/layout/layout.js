(function(angular,$){
    var layout = angular.module("dnt.layout",[]);

    layout.directive("layoutLr",function(){
         return {
             replace: true,
             transclude: true,
             restrict: 'E',
             template: " <div class='layout-lr' ng-transclude></div>",
             link: function(scope, element, attrs) {
                 var _adjustRightPanelHeight = function(){
                     var windowHeight = $(window).height() -126;
                     var rightContentHeight = $(element[0]).find(".panel-right .page-content").height();
                     if(windowHeight > rightContentHeight){
                         $(element[0]).find(".panel-right").css({height:windowHeight + "px"});
                     }
                 };
                 $(window).resize(_adjustRightPanelHeight);
                 _adjustRightPanelHeight();
             }
         };
    });
    layout.directive("panelLeft",function(){
         return {
             replace: true,
             transclude: true,
             restrict: 'E',
             template: " <div class='panel-left' ng-transclude></div>"
         };
    });
    layout.directive("collapseLeft",function(){
         return {
             replace: true,
             transclude: true,
             restrict: 'E',
             template: "<div  class='collapsebar-v collapseLeft'><i class='fa fa-angle-double-left'></i></div>",
             link: function(scope, element, attrs) {
               $(".collapseLeft").click(function(){
                 var leftObj = $(".panel-left");
                 if(leftObj.hasClass("panel-collapse")){
                    leftObj.removeClass("panel-collapse");
                    $(this).find("i").attr("class","fa fa-angle-double-left");
                    $(".layout-lr").animate({
                       "padding-left": 210 + "px"
                     });
                 }else{
                    leftObj.addClass("panel-collapse");
                    $(this).find("i").attr("class","fa fa-angle-double-right");
                    $(".layout-lr").animate({
                       "padding-left": 30 + "px"
                     });
                 }
               });
             }
         };
    });
    layout.directive("panelRight",function(){
         return {
             replace: true,
             transclude: true,
             restrict: 'E',
             template: " <div class='panel-right' ng-transclude></div>"
         };
    });

    layout.directive("layoutTb",function(){
         return {
             replace: true,
             transclude: true,
             restrict: 'E',
             template: " <div class='layout-tb' ng-transclude></div>"
         };
    });
    layout.directive("panelTop",function(){
         return {
             replace: true,
             transclude: true,
             restrict: 'E',
             template: " <div class='panel-top' ng-transclude></div>"
         };
    });
    layout.directive("panelBottom",function(){
         return {
             replace: true,
             transclude: true,
             restrict: 'E',
             template: " <div class='panel-bottom' ng-transclude></div>"
         };
    });
    layout.directive("collapseBottom",function(){
         return {
             replace: true,
             transclude: true,
             restrict: 'E',
             template: "<div class='collapsebar-h collapse-bottom'><i class='f28 fa fa-angle-double-down'></i></div>",
             link: function(scope, element, attrs) {
               $(".collapse-bottom").click(function(){
                 var bottomObj = $(".panel-bottom");
                 if(bottomObj.hasClass("panel-collapse")){
                    bottomObj.removeClass("panel-collapse");
                    $(this).find("i").attr("class","f28 fa fa-angle-double-down");
                    $(".panel-bottom").animate({
                       "height": "show"
                     });
                 }else{
                    bottomObj.addClass("panel-collapse");
                    $(this).find("i").attr("class","f28 fa fa-angle-double-up");
                    $(".panel-bottom").animate({
                       "height": "hide"
                     });
                 }
               });
             }
         };
    });

    layout.directive("collapseAll",function(){
        return {
            replace: true,
            transclude: true,
            restrict: 'E',
            template: "<div class='collapsebar-h collapse-all'><i class='f28 fa fa-angle-double-down'></i></div>",
            link: function(scope, element, attrs) {
                $(".collapse-all").click(function(){
                    if($(".panel-bottom").hasClass("panel-collapse")){
                        $(".panel-top").animate({
                            "height": "hide"
                        },200,function(){
                            $(".panel-top").addClass("panel-collapse");
                            $(".panel-bottom").removeClass("panel-collapse");
                            $(".collapse-all").find("i").attr("class","f28 fa fa-angle-double-up");
                        });
                        $(".panel-bottom").animate({
                            "height": "show"
                        });
                        $(".collapse-all").show();
                    }else{
                        $(".panel-bottom").animate({
                            "height": "hide"
                        },200,function(){
                            $(".panel-bottom").addClass("panel-collapse");
                            $(".panel-top").removeClass("panel-collapse");
                            $(".collapse-all").find("i").attr("class","f28 fa fa-angle-double-down");
                        });
                        $(".panel-top").animate({
                            "height": "show"
                        });
                        $(".collapse-all").hide();
                    }
                });

                $(".panel-bottom").addClass("panel-collapse");
                $(".panel-bottom").hide();
                $(".collapse-all").hide();
            }
        };
    });

    layout.directive("layoutTab",function(){
         return {
             replace: true,
             transclude: true,
             restrict: 'E',
             template: " <div class='layout-tab' ng-transclude></div>",
              link: function(scope, element, attrs) {
                $(".layout-tab").each(function(index,obj){
                    var array = $(obj).find(".tab-title>span");
                    $(array.get(0)).trigger("click");
                });
              }
         };
    });
    layout.directive("tabTitles",function(){
         return {
             replace: true,
             transclude: true,
             restrict: 'E',
             template: " <div class='tab-title' ng-transclude></div>"
         };
    });
    layout.directive("tabContents",function(){
         return {
             replace: true,
             transclude: true,
             restrict: 'E',
             template: " <div class='tab-content' ng-transclude></div>"
         };
    });

    layout.directive("tabTitle",function(){
         return {
             replace: true,
             transclude: true,
             restrict: 'E',
             template: "<span  ng-transclude></span>",
             link: function(scope, element, attrs) {
                $(".tab-title>span").click(function(){
                   $(this).addClass("selected").siblings().removeClass();
                    var current = $(this).parent().parent();
                    current.find(".tab-content > ul").hide().eq(current.find(".tab-title>span").index(this)).show();
                });
             }
         };
    });
    layout.directive("tabContent",function(){
         return {
             replace: true,
             transclude: true,
             restrict: 'E',
             template: "<ul><li  ng-transclude></li></ul>"
         };
    });

})(angular, jQuery);