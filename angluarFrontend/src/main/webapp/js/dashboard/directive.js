(function (angular) {

    angular.module('dashboard.directives', [])

    .directive('lockPie', function () {
        return {
            restrict: 'AE',
            transclude: true,
            template: ' <canvas ui-lock="pieObj" width="134" height="134" imgsrc="{{pieObj.imgsrc}}"></canvas>',
            replace: true,
            link: function (scope, elem, attrs) {
                var renderLock = function(){
                    var value = scope.pieObj.value;
                    elem.draw_lock(value);
                };

                scope.$watch(attrs.uiLock, function () {
                    renderLock();
                }, true);
            }
        }
    })

    .directive('processBar', function () {
        return {
            restrict: 'AE',
            transclude: true,
            template: ' <div ui-bar="pieObj"><div class="bar-label">{{pieObj.value}}</div><div class="bar-wrap"><div class="bar-title">{{pieObj.name}}</div><div class="Bar"></div></div></div>',
            replace: true,
            link: function (scope, elem, attrs) {
                var renderBar = function(){
                    var processor ="";
                    if (scope.pieObj.reverse == true) {   //反转
                        if (scope.pieObj.value < scope.pieObj.point1) {
                            processor = '<div class="red" style="width:' + scope.pieObj.value + '%;"></div>';
                        } else if ((scope.pieObj.value == scope.pieObj.point1 || scope.pieObj.value > scope.pieObj.point1) && (scope.pieObj.value == scope.pieObj.point2 || scope.pieObj.value < scope.pieObj.point2)) {
                            processor = '<div class="yellow" style="width:' + scope.pieObj.value + '%;"></div>';
                        } else if (scope.pieObj.value > scope.pieObj.point2) {
                            processor = '<div class="green" style="width:' + scope.pieObj.value + '%;"></div>';
                        }
                    } else if(scope.pieObj.reverse == false){
                        if (scope.pieObj.value < scope.pieObj.point1) {
                            processor = '<div class="green" style="width:' + scope.pieObj.value + '%;"></div>';
                        } else if ((scope.pieObj.value == scope.pieObj.point1 || scope.pieObj.value > scope.pieObj.point1) && (scope.pieObj.value == scope.pieObj.point2 || scope.pieObj.value < scope.pieObj.point2)) {
                            processor = '<div class="yellow" style="width:' + scope.pieObj.value + '%;"></div>';
                        } else if (scope.pieObj.value > scope.pieObj.point2) {
                            processor = '<div class="red" style="width:' + scope.pieObj.value + '%;"></div>';
                        }
                    }else{
                        //未取到值
                        processor = '<div class="default" style="width:100%"></div>';
                    }
                    $(elem[0]).find(".Bar").html(processor);
                };

                scope.$watch(attrs.uiBar, function () {
                    renderBar();
                }, true);
            }
        };
    })

})(angular);