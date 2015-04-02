(function(angular){

angular.module('datepickerDirective', [])

.directive('jqDatepicker', function(){
    return {
        link: function(scope, element, attrs) {
            element.datepicker({
                changeMonth: true,
                changeYear: true,
                dateFormat: "yy-mm-dd",
                dayNamesMin: [ "日", "一", "二", "三", "四", "五", "六" ],
                minDate: attrs.minDate?attrs.minDate:null,
                maxDate: attrs.maxDate?(attrs.maxDate=="null"?null:attrs.maxDate):0,
                monthNamesShort : ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"]
			});
        }
    };
})
.directive('jqDate', ['Util',function(Util){
    return {
        link: function(scope, element, attrs) {
            var format=attrs.format?attrs.format:"yyyy-mm-dd";
            var today=new Date();
            today.setHours(23);
            today.setMinutes(59);
            element.datetimepicker({
                language:"zh-CN",
                format:format,
                startDate: attrs.minDate?attrs.minDate:null,
                endDate: attrs.maxDate?(attrs.maxDate=="null"?null:attrs.maxDate):today,
                minView:attrs.minView?attrs.minView:(format.length>10?"hour":"month"),
                startView:attrs.startView?attrs.startView:"month",
                minuteStep:attrs.step?parseInt(attrs.step):5,
                allowClear:attrs.allowClear,
                autoclose:true,
                todayBtn:attrs.todayBtn?attrs.todayBtn:((attrs.startView==null || attrs.startView=="day")?true:false)
            });
        }
    };
}]).directive('jqDate2', function(){
        return {
            link: function(scope, element, attrs) {
                var format=attrs.format?attrs.format:"yyyy-mm-dd";
                var today=new Date();
                element.datetimepicker({
                    language:"zh-CN",
                    format:format,
                    startDate: attrs.minDate?attrs.minDate:null,
                    endDate: attrs.maxDate?(attrs.maxDate=="null"?null:attrs.maxDate):today,
                    minView:attrs.minView?attrs.minView:(format.length>10?"hour":"month"),
                    startView:attrs.startView?attrs.startView:"month",
                    minuteStep:attrs.step?parseInt(attrs.step):5,
                    allowClear:attrs.allowClear,
                    autoclose:true,
                    todayBtn:attrs.todayBtn?attrs.todayBtn:((attrs.startView==null || attrs.startView=="day")?true:false)
                });
            }
        };
}).directive('itsmDate',['Util', function(Util){
        return {
            link: function(scope, element, attrs) {
                var format=attrs.format?attrs.format:"yyyy-mm-dd";
                var today=new Date();
                today.setHours(23);
                today.setMinutes(59);
                var init=function(){
                    var minDate=attrs.minDate?Util.getValue(attrs.minDate,scope):null;
                    if(minDate){
                        element.datetimepicker({
                            language:"zh-CN",
                            format:format,
                            startDate:minDate?minDate:null,
                            endDate: attrs.maxDate?(attrs.maxDate=="null"?null:attrs.maxDate):today,
                            minView:attrs.minView?attrs.minView:(format.length>10?"hour":"month"),
                            startView:attrs.startView?attrs.startView:"month",
                            minuteStep:attrs.step?parseInt(attrs.step):5,
                            allowClear:attrs.allowClear,
                            autoclose:true,
                            todayBtn:attrs.todayBtn?attrs.todayBtn:((attrs.startView==null || attrs.startView=="day")?true:false)
                        });
                    }
                };
                init();
                return scope.$watch(attrs.minDate, init, true);
            }
        };
    }]).directive('rjqDate', function(){
        return {
            link: function(scope, element, attrs) {
                var format=attrs.format?attrs.format:"yyyy-mm-dd";
                var today1=new Date();
                today1.setFullYear(2010);
                today1.setMonth(0);
                today1.setDate(1);
                today1.setHours(00);
                today1.setMinutes(00);
                var today2=new Date();
                today2.setFullYear(2010);
                today2.setMonth(11);
                today2.setDate(31);
                today2.setHours(23);
                today2.setMinutes(59);
                element.datetimepicker({
                    linkField: attrs.targetInput,
                    linkFormat: format,
                    language:"zh-CN",
                    //format:format,
                    startDate: null,
                    endDate: null,
                    minView:0,
                    maxView:attrs.maxView,
                    startView:attrs.startView,
                    minuteStep:1,
                    allowClear:false,
                    autoclose:true,
                    todayBtn:attrs.todayBtn?attrs.todayBtn:((attrs.startView==null || attrs.startView=="day")?false:false)
                }).on("changeDate",function(){
                    $(".date-component.open").removeClass("open");
                });

                element.find(".table-condensed .prev").remove();
                element.find(".table-condensed .switch").html("");
                element.find(".table-condensed .next").remove();
                element.find(".table-condensed .dow").remove();
                jQuery("body").removeClass("modal-open");
            }
        };
    }).directive('jqDate3', ['Util',function(Util){  //资产模块使用
        return {
            link: function(scope, element, attrs) {
                var init = function(){
                    var target = attrs.targetData?attrs.targetData:"";
                    if(target!=""){
                        var value = Util.getValue(target,scope);
                        if(value){
                            value = Util.formatSimpleDate(value);
                            Util.setValue(target,value,scope);
                        }
                    }

                    var format=attrs.format?attrs.format:"yyyy-mm-dd";
                    var today=new Date();
                    today.setHours(23);
                    today.setMinutes(59);
                    element.datetimepicker({
                        language:"zh-CN",
                        format:format,
                        startDate: attrs.minDate?attrs.minDate:null,
                        endDate: attrs.maxDate?(attrs.maxDate=="null"?null:attrs.maxDate):today,
                        minView:attrs.minView?attrs.minView:(format.length>10?"hour":"month"),
                        startView:attrs.startView?attrs.startView:"month",
                        minuteStep:attrs.step?parseInt(attrs.step):5,
                        allowClear:attrs.allowClear,
                        autoclose:true,
                        todayBtn:attrs.todayBtn?attrs.todayBtn:((attrs.startView==null || attrs.startView=="day")?true:false)
                    }).on("changeDate",function(){
                        if(target!=""){
                            if(Util.getValue(target,scope) == ""){
                                Util.setValue(target,null,scope);
                            }
                        }
                    });
                };
                init();
                return scope.$watch(attrs.targetData, init, true);
            }
        };
    }]);

})(angular);