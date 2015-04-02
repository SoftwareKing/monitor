(function(angular){
    var widget = angular.module("dnt.widget",[]);

    widget.directive("widgetBox",function(){
          return {
              replace: true,
              transclude: true,
              restrict: 'E',
              template:"<div class='widget-box' ng-transclude></div>",
              link:function(scope, element, attrs) {
      			    $('.widget-container-span').sortable({
      			        connectWith: '.widget-container-span',
      					items:'> .widget-box',
      					opacity:0.8,
      					revert:true,
      					forceHelperSize:true,
      					placeholder: 'widget-placeholder',
      					forcePlaceholderSize:true,
      					tolerance:'pointer'
      			    });
              }
          };
    });
    widget.directive("widgetHeader",function(){
          return {
              replace: true,
              transclude: true,
              restrict: 'E',
              template:" <div class='widget-header' ng-transclude></div>"
          };
    });
    widget.directive("widgetToolbar",function(){
          return {
              replace: true,
              transclude: true,
              restrict: 'E',
              template:"<div class='widget-toolbar'><a data-action='collapse'><i class='icon-chevron-up'></i></a></div>"
//              link: function (scope, elem, attrs) {
//              var collapseBtn = elem.find("a");
//              $(collapseBtn).click(function(){
//                    var widgetContent = elem.parent().parent().find(".widget-body .widget-main");
//                    if(collapseBtn.hasClass("collapse")){
//                      collapseBtn.removeClass("collapse");
//                      collapseBtn.find("i").attr("class","icon-chevron-up");
//                      widgetContent.animate({
//                        "height": "show"
//                      },200);
//                    }else{
//                        collapseBtn.addClass("collapse");
//                        collapseBtn.find("i").attr("class","icon-chevron-down");
//                        widgetContent.animate({
//                          "height": "hide"
//                        },200);
//                    }
//                });
//              }
          }
    });
    widget.directive("widgetBody",function(){
          return {
              replace: true,
              transclude: true,
              restrict: 'E',
              template:" <div class='widget-body'><div class='widget-main' ng-transclude></div></div>"
          };
    });

})(angular);