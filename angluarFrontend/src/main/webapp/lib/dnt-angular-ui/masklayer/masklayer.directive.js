(function(angular){


angular.module('maskLayerDirective', [])

.directive('maskLayer', ['$compile',function($compile){
    return {
        link: function(scope, element, attrs) {
            var $div = $('<div style="position: absolute;z-index:100;opacity: 0.4;background-color:#CCCCCC;" ng-show="'+attrs.maskLayer+'"></div>').insertAfter(element);
            var move = function(){
                var cityOffset = element.position();
                $div.css({left:cityOffset.left + "px", top:cityOffset.top + "px" ,width:element.outerWidth() + "px" ,height:element.outerHeight() + "px" });
            }
            $compile($div)(scope);
            setInterval(move,500);
        }
    };
} ])

.service('MaskLayer',function(){
    this.show = function(msg,cancelAble,cancelFn){
        var $mask = $("#_mask_layer");
        if($mask.length==0){
            $body = $("body");
            $mask = $('<div id="_mask_layer" style="position: absolute;z-index:10000;opacity: 0.4;background-color:#CCCCCC;"></div>').appendTo($body);
            var cityOffset = $body.position();
            $mask.css({left:cityOffset.left + "px", top:cityOffset.top + "px" ,width:$body.outerWidth() + "px" ,height:$body.outerHeight() + "px" });
        }
        $mask.empty();
        $('<label>'+msg+'</label>').appendTo($mask);
        if(cancelAble){
            $('<button>取消</button>').appendTo($mask).on("click",function(){
                $mask.hide();
                if(cancelFn){
                    cancelFn();
                }
            });
        }
        $mask.show();
    };

    this.hide = function(){
        $("#_mask_layer").hide();
    };
});

})(angular);