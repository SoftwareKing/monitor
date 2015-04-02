(function(angular){
    angular.module('log.controllers', ['log.services'])
        .controller('syslogController', ['$scope','log','Loading',function($scope,log,Loading){
            $scope.syslogState = false;
            $scope.updateState = function(state){
                $scope.syslogState = state;
            };
            var myDate = new Date();
            $scope.dateTimeSyslog = myDate.getHours()+":"+ myDate.getMinutes();
            $scope.refreshSyslog = function(){
                var myDate = new Date();
                $scope.dateTimeSyslog = myDate.getHours()+":"+ myDate.getMinutes();
                Loading.show();
                log.query(function(d){
                    Loading.hide();
                    $scope.resultSyslog =  d.facets.host.terms;
                });
            }
            $scope.myCallback = function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $('td:eq(2)', nRow).bind('click', function() {
                    $scope.$apply(function() {
                        $scope.someClickHandler(aData);
                    });
                });
                return nRow;
            };
            $scope.someClickHandler = function(info) {
                $scope.syslogIp = info.term;
                $scope.syslogState = true;
            };
            $scope.columns = [
                { sTitle: "ip"},
                { sTitle: "数量"},
                { sTitle: "详情"}
            ];
            $scope.columnDefs = [
                { "mDataProp": "term", "aTargets":[0]},
                { "mDataProp": "count", "aTargets":[1] },
                { "mDataProp": function(){return "<a><i class='fa fa-map-marker'></i><a>"}, "aTargets":[2] }
            ];
            $scope.refreshSyslog();

        }])
        .controller('syslogDetailController', ['$scope','log','Loading',function($scope,log,Loading){
            $scope.syslogBeginTime  =  $scope.syslogEndTime = 0;
            $scope.syslog = {beginTime:{hour:0,min:0},endTime:{hour:0,min:0}};
            $scope.syslog.beginTime.hour=0;
            $scope.syslog.beginTime.min=0;
            $scope.syslog.endTime.hour=0;
            $scope.syslog.endTime.min=0;
            $scope.columns = [
                { sTitle: "类型"},
                { sTitle: "ip地址"},
                { sTitle: "发生时间"},
                { sTitle: "运行级别"},
                { sTitle: "服务级别"},
                { sTitle: "详细信息"}
            ];
            $scope.columnDefs = [
                { "mDataProp": "_type", "aTargets":[0]},
                { "mDataProp": "_source.host", "aTargets":[1] },
                { "mDataProp": "_source.receivedtime", "aTargets":[2] },
                { "mDataProp": "_source.facility_label", "aTargets":[3] },
                { "mDataProp": "_source.severity_label", "aTargets":[4] },
                { "mDataProp": "_source.message", "aTargets":[5] }
            ];
            $scope.querySyslogByTime = function(flag){
                if( !flag){
                    Loading.show();
                    log.get({id:'log',tag:'syslog',para:'id',ip: $scope.syslogIp},function(d){
                        Loading.hide();
                        $scope.result = d.hits.hits;

                    });
                }else{
                    if(Number($scope.syslog.beginTime.hour)>Number($scope.syslog.endTime.hour) ||
                        (Number($scope.syslog.beginTime.hour) == Number($scope.syslog.endTime.hour))&&(Number($scope.syslog.beginTime.min)>Number($scope.syslog.endTime.min))){
                        alert("时间范围错误！");
                        return;
                    }
                    Loading.show();
                    $scope.syslogBeginTime = new Date();
                    $scope.syslogBeginTime.setHours( $scope.syslog.beginTime.hour);
                    $scope.syslogBeginTime.setMinutes( $scope.syslog.beginTime.min);

                    $scope.syslogEndTime = new Date();
                    $scope.syslogEndTime.setHours( $scope.syslog.endTime.hour);
                    $scope.syslogEndTime.setMinutes( $scope.syslog.endTime.min);
                    $scope.syslogBeginTime.setHours($scope.syslogBeginTime.getHours()+8);
                    $scope.syslogEndTime.setHours($scope.syslogEndTime.getHours()+8);
                    log.get({id:'log',tag:'syslog',para:'id',ip:$scope.syslogIp,beginTime:$scope.syslogBeginTime,endTime:$scope.syslogEndTime},function(d){
                        Loading.hide();
                        $scope.result = d.hits.hits;
                    });
                };
            };
            $scope.querySyslogByTime(false);
        }])
        .controller('trapController', ['$scope','log','Loading',function($scope,log,Loading){
            $scope.trapState = false;
            $scope.updateState = function(state){
                $scope.trapState = state;
            };
            var myDate = new Date();
            $scope.dateTimeTrap = myDate.getHours()+":"+ myDate.getMinutes();
            $scope.refreshTrap = function(){
                var myDate = new Date();
                $scope.dateTimeTrap = myDate.getHours()+":"+ myDate.getMinutes();
                Loading.show();
                log.query({id:'log',tag:'trap'},function(d){
                    Loading.hide();
                    $scope.resultTrap =  d.facets.host.terms;
                });
            };
            $scope.myCallback = function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $('td:eq(2)', nRow).bind('click', function() {
                    $scope.$apply(function() {
                        $scope.someClickHandler(aData);
                    });
                });
                return nRow;
            };
            $scope.someClickHandler = function(info) {
                $scope.trapIp = info.term;
                $scope.trapState = true;
            };
            $scope.columns = [
                { sTitle: "ip"},
                { sTitle: "数量"},
                { sTitle: "详情"}
            ];
            $scope.columnDefs = [
                { "mDataProp": "term", "aTargets":[0]},
                { "mDataProp": "count", "aTargets":[1] },
                { "mDataProp": function(){return "<a><a><i class='fa fa-map-marker'></i><a><a>"}, "aTargets":[2] }
            ];
            $scope.refreshTrap();
        }])
        .controller('trapDetailController', ['$scope','log','Loading',function($scope,log,Loading){

            $scope.trapBeginTime = $scope.trapEndTime = 0;
            $scope.trap = {beginTime:{hour:0,min:0},endTime:{hour:0,min:0}};
            $scope.trap.beginTime.hour=0;
            $scope.trap.beginTime.min=0;
            $scope.trap.endTime.hour=0;
            $scope.trap.endTime.min=0;
            $scope.columns = [
                { sTitle: "类型"},
                { sTitle: "ip地址"},
                { sTitle: "发生时间"},
                { sTitle: "详细信息"}
            ];
            $scope.columnDefs = [
                { "mDataProp": "_type", "aTargets":[0]},
                { "mDataProp": "_source.host", "aTargets":[1] },
                { "mDataProp": "_source.receivedtime", "aTargets":[2] },
                { "mDataProp": "_source.message", "aTargets":[3] }
            ];
            $scope.queryByTimeTrap = function(flag){
                if( !flag){
                    Loading.show();
                    log.get({id:'log',tag:'trap',para:'id',ip: $scope.trapIp},function(d){
                        Loading.hide();
                        $scope.result = d.hits.hits;

                    });
                }else{
                    if(Number($scope.trap.beginTime.hour)>Number($scope.trap.endTime.hour) ||
                        (Number($scope.trap.beginTime.hour) == Number($scope.trap.endTime.hour))&&(Number($scope.trap.beginTime.min)>Number($scope.trap.endTime.min))){
                        alert("时间范围错误！");
                        return;
                    }
                    Loading.show();
                    $scope.trapBeginTime = new Date();
                    $scope.trapBeginTime.setHours( $scope.trap.beginTime.hour);
                    $scope.trapBeginTime.setMinutes( $scope.trap.beginTime.min);

                    $scope.trapEndTime = new Date();
                    $scope.trapEndTime.setHours( $scope.trap.endTime.hour);
                    $scope.trapEndTime.setMinutes( $scope.trap.endTime.min);
                    $scope.trapBeginTime.setHours($scope.trapBeginTime.getHours()+8);
                    $scope.trapEndTime.setHours($scope.trapEndTime.getHours()+8);
                    log.get({id:'log',tag:'trap',para:'id',ip:$scope.trapIp,beginTime:$scope.trapBeginTime,endTime:$scope.trapEndTime},function(d){
                        Loading.hide();
                        $scope.result = d.hits.hits;
                    });
                };
            };
            $scope.queryByTimeTrap(false);
        }])
//        .directive('syslogdetail', function() {
//            return {
//                restrict: 'AE',
//                transclude:false,
//                templateUrl: 'views/log/syslogDetailTable.html'
//            };
//        })
    ;
})(angular);