(function(angular){
    angular.module('bootstrap.modal',[])
    .directive('modalDialog',function(Util) {
        return {
            restrict: 'AE',
            transclude:true,
            scope: {
                dialog: '=settings'
            },
            templateUrl: 'lib/dnt-angular-ui/modal/templates/dialog.html',
            link: function(scope, element, attrs) {
                scope.$parent.$parent[scope.dialog.id]=scope.$$nextSibling;
                if(scope.dialog.hiddenFn){
                    element.on('hidden.bs.modal', scope.dialog.hiddenFn);
                }

               /* var winHeight = $(window).height();
                var winWidth = $(window).width();
                var modalWin = $(element[0]).find(".modal-dialog");
                modalWin.css({
                    left:(winWidth/2 - modalWin.width()/2) + "px",
                    top: (winHeight/2 - modalWin.height()/2) + "px"
                });


                $('.ui-draggable').draggable({
                    addClass:false,
                    containment: "document",
                    scroll: false,
                    handle: ".modal-header",
                    cursor: "pointer"
                });
                $(".ui-draggable").draggable( 'enable' );*/
            }
        };
    }).directive('modalAlert', function() {
        return {
            restrict: 'AE',
            transclude:false,
            scope: {
                dialog: '=settings'
            },
            templateUrl: 'lib/dnt-angular-ui/modal/templates/alert.html',
            link: function(scope, element, attrs) {
                scope.thisClick=function(id){
                    angular.element('#'+id).modal('hide');
                };
            }
        };
    }).directive('modalConfirm', function() {
        return {
            restrict: 'AE',
            transclude:false,
            scope: {
                dialog: '=settings'
            },
            templateUrl: 'lib/dnt-angular-ui/modal/templates/confirm.html'
        };
    })
    .service('Modal',function(){
        this.show=function(id,width,height){
            var obj = angular.element('#'+id).modal('show');
            if(width){
                obj.find("div.modal-dialog:first").css("width",width).css("margin-left",-width/2);
                obj.find("div.modal-content:first").css("width",width);
            }
            if(height){
                obj.find("div.modal-dialog:first").css("height",height).css("margin-top",-height/2);;
                obj.find("div.modal-content:first").css("height",height);
                obj.find("div.modal-body:first").css("height",height-95);
            }
        };
        this.hide=function(id){
            angular.element('#'+id).modal('hide');
        };
    });
})(angular);