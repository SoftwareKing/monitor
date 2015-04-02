(function(angular){
    var controllers = angular.module('dashboard.controllers',['ngResource','dashboard.services','dashboard','compile','util.services']);

    controllers.controller('availablityBarCtrl', ['$scope', 'dashboardPerformanceService','$rootScope', function ($scope, svc,$rootScope) {
        $scope.processBars = [];
        var pieObj = {};
        $scope.pieObj=pieObj;
        $scope.$watch("availablityBarObj",function(n){
            if(n){
                pieObj.name="可用率(%)";
                if(n.rows && n.rows.length > 0){
                    var percent = n.rows[0]["AvailableRate"];
                    pieObj.value = (percent==null|| percent=="--"  || percent=="null" || percent=="-1.0" || percent=="")?"":percent;  //默认为未取到值
                    percent = parseFloat(pieObj.value);
                    if(percent >= 0){
                        if(n.colors){
                            var color=n.colors["AvailableRate"];
                            if(color){
                                pieObj.reverse=color.reverse;
                                pieObj.point1=color.point1;
                                pieObj.point2=color.point2;
                            }
                        }
                    }
                }
                $scope.processBars[0]=angular.copy(pieObj);
            }
        },true);
    }]);

    controllers.controller('lockPieCtrl', ['$scope', 'dashboardPerformanceService','$rootScope', function ($scope, svc,$rootScope) {
        $scope.lockPies = [];
        $scope.bottom=["--","--","--"];
        var pieObj = $scope.currentMoc["lockPies"][$scope.count.lock_pie_count];
        if(pieObj){
            $scope.pieObj=pieObj;
            $scope.$watch("viewRefresh.middle",function(n){
                if(n>0){
                    var f=0;
                    if(pieObj.isLoad){f=60;pieObj.isLoad=true;}
                    svc.getData({moc_name: $scope.param.moc_name, indicator_name: pieObj["indicator"], mo_id: $scope.param.moId, offset: n, limit: f}, {}, function (data) {
                        var color=data.colors[pieObj["metric"]];
                        pieObj.value= -1;  //默认为未取到：-1
                        pieObj.name=$rootScope.resource.metricMap[pieObj["indicator"]+"."+pieObj["metric"]];
                        if(color){
                            pieObj.reverse=color.reverse;
                            pieObj.point1=color.point1;
                            pieObj.point2=color.point2;
                        }
                        if(data.rows && data.rows.length>0){
                            var row=data.rows[0];
                            if(row){
                                if(pieObj.bottom){
                                    for(var i=0;i<pieObj.bottom.length;i++){
                                        $scope.bottom[i]=row[pieObj.bottom[i]];
                                    }
                                }

                                var percent=row[pieObj["metric"]];
                                percent = percent.replace(/\,/g,"");  //去除格式化分隔符 ","
                                if(pieObj.pic){
                                    percent=(percent==null|| percent=="--" || percent=="null" || percent=="-1.0" || percent=="")?"-1":percent;
                                }else{
                                    percent=(percent==null|| percent=="--"  || percent=="null" || percent=="-1.0" || percent=="")?"-1":percent;
                                    percent=parseInt(percent);
                                }
                                pieObj.value=percent;
                            }
                        }

                        if(pieObj["metric"] == "SessionCnt"){
                            pieObj.imgsrc = "../../img/dashboard/bg_chat.png";
                        }else if(pieObj["metric"] == "Deadlocks" || pieObj["metric"] == "DeadLock"){
                            pieObj.imgsrc = "../../img/dashboard/bg_lock.png";
                        }else if(pieObj["metric"] == "SQLParseHit"){
                            pieObj.imgsrc = "../../img/dashboard/bg_SQL.png";
                        }else if(pieObj["metric"] == "TransCnt"){
                            pieObj.imgsrc = "../../img/dashboard/bg_trans.png";
                        }

                        $scope.lockPies[0]=angular.copy(pieObj);
                    });
                }
            },true);
            $scope.count.lock_pie_count = $scope.count.lock_pie_count + 1;
        }
    }]);

    controllers.controller('cpuBarCtrl', ['$scope', 'dashboardPerformanceService','$rootScope', function ($scope, svc,$rootScope) {
        $scope.processBars = [];
        $scope.bottom=["--","--","--"];
        var pieObj = $scope.currentMoc["cpuBars"][$scope.count.cpu_bar_count];
        if(pieObj){
            $scope.pieObj=pieObj;
            $scope.$watch("viewRefresh.middle",function(n){
                if(n>0){
                    var f=0;
                    if(pieObj.isLoad){f=60;pieObj.isLoad=true;}
                    svc.getData({moc_name: $scope.param.moc_name, indicator_name: pieObj["indicator"], mo_id: $scope.param.moId, offset: n, limit: f}, {}, function (data) {
                        var color=data.colors[pieObj["metric"]];
                        pieObj.value=0;
                        pieObj.name=$rootScope.resource.metricMap[pieObj["indicator"]+"."+pieObj["metric"]];
                        if(color){
                            pieObj.reverse=color.reverse;
                            pieObj.point1=color.point1;
                            pieObj.point2=color.point2;
                        }
                        if(data.rows && data.rows.length>0){
                            var row=data.rows[0];
                            if(row){
                                if(pieObj.bottom){
                                    for(var i=0;i<pieObj.bottom.length;i++){
                                        $scope.bottom[i]=row[pieObj.bottom[i]];
                                    }
                                }
                                var percent=row[pieObj["metric"]];
                                if(pieObj.pic){
                                    percent=(percent==null|| percent=="--" || percent=="null" || percent=="-1.00" || percent=="")?"--":percent;
                                }else{
                                    percent=(percent==null|| percent=="--"  || percent=="null" || percent=="-1.00" || percent=="")?"0":percent;
                                    percent=parseFloat(percent).toFixed(2);
                                }
                                pieObj.value=percent;
                            }
                        }
                        $scope.processBars[0]=angular.copy(pieObj);
                    });
                }
            },true);
            $scope.count.cpu_bar_count = $scope.count.cpu_bar_count + 1;
        }
    }]);

    controllers.controller('cpuPieCtrl', ['$scope', 'dashboardPerformanceService','$rootScope', function ($scope, svc,$rootScope) {
        $scope.speedChart=[];
        $scope.bottom=["--","--","--"];
        var pieObj = $scope.currentMoc["cpuPies"][$scope.count.cpu_pie_count];
        if (pieObj) {
            $scope.pieObj=pieObj;
            $scope.$watch("viewRefresh.middle",function(n){
                if(n>0){
                    var f=0;
                    if(pieObj.isLoad){f=60;pieObj.isLoad=true;}
                    svc.getData({moc_name: $scope.param.moc_name, indicator_name: pieObj["indicator"], mo_id: $scope.param.moId, offset: n, limit: f}, {}, function (data) {
                        var color=data.colors[pieObj["metric"]];
                        pieObj.value=-1;
                        pieObj.name=$rootScope.resource.metricMap[pieObj["indicator"]+"."+pieObj["metric"]];
                        if(color){
                            pieObj.reverse=color.reverse;
                            pieObj.point1=color.point1;
                            pieObj.point2=color.point2;
                        }
                        if(data.rows && data.rows.length>0){
                            var row=data.rows[0];
                            if(row){
                                if(pieObj.bottom){
                                    for(var i=0;i<pieObj.bottom.length;i++){
                                        $scope.bottom[i]=row[pieObj.bottom[i]];
                                    }
                                }
                                var percent=row[pieObj["metric"]];
                                if(pieObj.pic){
                                    percent=(percent==null|| percent=="--" || percent=="null" || percent=="-1.00" || percent=="")?"--":percent;
                                }else{
                                    percent=(percent==null|| percent=="--"  || percent=="null" || percent=="-1.00" || percent=="")?-1:percent;
                                    percent=parseFloat(percent);
                                }
                                pieObj.value= percent;
                            }
                        }
                        $scope.speedChart[0]=angular.copy(pieObj);
                    });
                }
            },true);
            $scope.count.cpu_pie_count = $scope.count.cpu_pie_count + 1;
        }
    }]);

    controllers.controller('memPieCtrl', ['$scope', 'dashboardPerformanceService','$rootScope', function ($scope, svc,$rootScope) {
        $scope.speedChart=[];
        $scope.bottom=["--","--","--"];
        var pieObj = $scope.currentMoc["memPies"][$scope.count.mem_pie_count];
        if (pieObj) {
            $scope.pieObj=pieObj;
            $scope.$watch("viewRefresh.middle",function(n){
                if(n>0){
                    var f=0;
                    if(pieObj.isLoad){f=60;pieObj.isLoad=true;}
                    svc.getData({moc_name: $scope.param.moc_name, indicator_name: pieObj["indicator"], mo_id: $scope.param.moId, offset: n, limit: f}, {}, function (data) {
                        var color=data.colors[pieObj["metric"]];
                        pieObj.value=-1;
                        pieObj.name=$rootScope.resource.metricMap[pieObj["indicator"]+"."+pieObj["metric"]];
                        if(color){
                            pieObj.reverse=color.reverse;
                            pieObj.point1=color.point1;
                            pieObj.point2=color.point2;
                        }
                        if(data.rows && data.rows.length>0){
                            var row=data.rows[0];
                            if(pieObj.bottom){
                                for(var i=0;i<pieObj.bottom.length;i++){
                                    $scope.bottom[i]=row[pieObj.bottom[i]];
                                }
                            }
                            var percent=row[pieObj["metric"]];
                            if(pieObj.pic){
                                percent=(percent==null|| percent=="--" || percent=="null" || percent=="-1.00" || percent=="")?"--":percent;
                            }else{
                                percent=(percent==null|| percent=="--"  || percent=="null" || percent=="-1.00" || percent=="")?-1:percent;
                                percent=parseFloat(percent);
                            }
                            pieObj.value= percent;
                        }
                        $scope.speedChart[0]=angular.copy(pieObj);
                    });
                }
            },true);
            $scope.count.mem_pie_count = $scope.count.mem_pie_count + 1;
        }
    }]);

    controllers.controller('picPieCtrl', ['$scope', 'dashboardPerformanceService','$rootScope', function ($scope, svc,$rootScope) {
        var pieObj = $scope.currentMoc["picPies"][$scope.count.pic_pie_count];
        if (pieObj) {
            $scope.pieObj=pieObj;
            $scope.$watch("viewRefresh.middle",function(n){
                if(n>0){
                    var f=0;
                    if(pieObj.isLoad){f=60;pieObj.isLoad=true;}
                    svc.getData({moc_name: $scope.param.moc_name, indicator_name: pieObj["indicator"], mo_id: $scope.param.moId, offset: n, limit: f}, {}, function (data) {
                        $scope.pieObj['items']=new Array();
                        if(data.rows && data.rows.length>0){
                            for(var i=0;i<data.rows.length;i++){
                                var item={pic:"",bottom:[]};
                                var row=data.rows[i];
                                if(pieObj.bottom){
                                    for(var j=0;j<pieObj.bottom.length;j++){
                                        item.bottom[j]=row[pieObj.bottom[j]];
                                    }
                                }
                                var value=row[pieObj["metric"]];
                                value=(value==null|| value=="--" || value=="null" || value=="")?"--":value;
                                item.value=value;
                                if( $scope.param.type == "network"){
                                    item.desc = row.Desc;
                                }else if($scope.param.type == "storage"){
                                    item.desc = row.ID;
                                }
                                $scope.pieObj.items[i]=item;
                            }
                        }

                        $scope.pieObj.hasItem = $scope.pieObj['items'].length>0?true:false;
                    });
                }
            },true);
            $scope.count.pic_pie_count = $scope.count.pic_pie_count + 1;
        }
    }]);

    controllers.controller('labelCtrl',['$scope','dashboardPerformanceService','alarmCountService','$rootScope','baseService','dashboardPropertyService',function($scope,svc,alarm,$rootScope,svc2,svc3){
        var panelObj = $scope.currentMoc["labels"];
        $scope.panelBase=[[],[],[],[]];
        var titles=panelObj.names;
        var count=2;
        if(panelObj.count)count=panelObj.count;
        for(var i=0;i<$scope.panelBase.length;i++){
            var item=$scope.panelBase[i];
            for(var j=0;j<count;j++){
                var obj={key:titles[i*count+j],value:"--"};
                item.push(obj);
            }
        }
        var pushItems=function(key,value){
            for(var i=0;i<$scope.panelBase.length;i++){
                var item=$scope.panelBase[i];
                for(var j=0;j<count;j++){
                    var obj=item[j];
                    if(obj.key==key){
                        obj.value=value==null?"--":value;
                        break;
                    }
                }
            }
        };
        $scope.$watch("viewRefresh.top",function(n){
            if(n>0) {
                svc.getData({moc_name: $scope.param.moc_name, indicator_name: panelObj["indicator"], mo_id: $scope.param.moId, offset: 300, limit: 0}, {}, function (data) {
                    if (data.rows && data.rows.length > 0) {
                        var row = data.rows[0];
                        for (var key in row) {
                            pushItems(key, row[key]);
                        }
                    }
                });
            }
        });
        $scope.$watch("resource.metricReady",function(n){
            if(n){
                for(var i=0;i<$scope.panelBase.length;i++){
                    var item=$scope.panelBase[i];
                    for(var j=0;j<count;j++){
                        var obj=item[j];
                        if(obj.key.length>0){
                            var name;
                            if(obj.key.indexOf(".")==-1){
                                name=$rootScope.resource.metricMap[panelObj["indicator"]+"."+obj.key];
                            }else{
                                name=$rootScope.resource.metricMap[obj.key];
                            }
                            if(name!=null && name!="")obj.name=name;
                        }
                    }
                }
            }
        },true);
    }]);

    controllers.controller('hisTrendCtrl', ['$scope','getHisTrendService',function ($scope,svc) {
        var trendObj = $scope.currentMoc["trend"];
        var d = new Date();
        var max = d.getTime();
        var min = d.getTime()-1000*60*60*24;
        var pro=300000;
        $scope.loadChart=function(series){
            min=max;
            max=min+pro;
            var start_time=dateToStr(new Date(min));
            var end_time=dateToStr(new Date(max));
            svc.getData({moc_name: $scope.param.moc_name, indicator_name: trendObj["indicator"], metric_name: trendObj["metric"], start_time: start_time, end_time: end_time, mo_id: $scope.param.moId, offset: 0, limit: 2000000}, {}, function (res) {
                var data=res.rows;
                for(var i=0;i<data.length;i++){
                    var point = data[i];
                    series.addPoint([point[0], point[1]], true, true);
                }
            });
        };
        $scope.initChart=function(){
            var start_time=dateToStr(new Date(min));
            var end_time=dateToStr(new Date(max));
            svc.getData({moc_name: $scope.param.moc_name, indicator_name: trendObj["indicator"], metric_name: trendObj["metric"], start_time: start_time, end_time: end_time, mo_id: $scope.param.moId, offset: 0, limit: 2000000}, {}, function (res) {
                var data=res.rows;
                Highcharts.setOptions({
                    global: {
                        useUTC: false
                    }
                });
                var width=jQuery('#container').width()-10;
                jQuery('#container').width(width);
                jQuery('#container').height(240);
                jQuery('#container').highcharts({
                    exporting:{
                        // 是否允许导出
                        enabled:false
                    },
                    credits: {
                        text: '<label style="font-size:11px;color: #0000ff;">查看更多</label>',
                        href: '../../index.html#/historyTrend?moId='+$scope.param.moId+'&indicator='+trendObj["indicator"]+'&metric='+trendObj["metric"],
                        position: {
                            verticalAlign:'top',
                            y:15,
                            align: 'right',
                            x: 0
                        }
                    },
                    chart: {
                        type: 'area',
                        animation: Highcharts.svg, // don't animate in old IE
                        marginRight: 10,
                        events: {
                            load: function() {
                                var series = this.series[0];
                                setInterval(function() {
                                    $scope.loadChart(series);
                                }, pro);
                            }
                        }
                    },
                    plotOptions: {
                        area: {
                            marker: {
                                enabled: true,   //显示数据点
                                symbol: 'circle',
                                radius: 2,
                                states: {
                                    hover: {
                                        enabled: true
                                    }
                                }
                            }
                        }
                    },
                    title: {
                        text: trendObj.title
                    },
                    xAxis: {
                        type: 'datetime',
                        tickPixelInterval: width/12,
                        dateTimeLabelFormats: {
                            second : '%H:%M',
                            hour : '%H:%M',
                            minute: '%H:%M',
                            day: '%m-%d'
                        }
                    },
                    yAxis: {
                        title: {
                            text: '数值'
                        },
                        min: 0
//                        max:100
                    },
                    tooltip: {
                        formatter: function() {
                            return Highcharts.dateFormat('%m-%d %H:%M:%S', this.x) +' ：'+Highcharts.numberFormat(this.y, 2);
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    exporting: {
                        enabled: false
                    },
                    series: [{
                        name: '数值',
                        data: data
                    }]
                });
            });
        };
        if(trendObj) {
            $scope.chartId = $scope.param.moId;
            $scope.initChart();
        }
    }]);

    controllers.controller('tableCtrl', ['$rootScope','$scope', 'dashboardPerformanceService','Util', function ($rootScope,$scope, svc,Util) {
        var tableObj = $scope.currentMoc["tables"][$scope.count.table_count];
        var type=tableObj["type"];
        $scope.columns =tableObj["columns"];
        var columns=tableObj["columnDefs"];
        //add tips
        for(var i= 0,l=columns.length;i<l;i++){
            var mDataProp = columns[i];
            mDataProp.mRender = function (mData, type, full) {
               return Util.str2Html(mData);
           };
        }

        columns.push({
            "bSortable": false,
            "aTargets": []
        });
        $scope.columnDefs =columns;

        var index=$scope.count.table_count;
        $rootScope.$watch("resource.metricReady",function(newValues){
            if(newValues){
                var columns=[];
                for(var i=0;i<$scope.columnDefs.length;i++){
                    var name=tableObj["indicator"]+"."+$scope.columnDefs[i].mDataProp;
                    columns[i]=$rootScope.resource.metricMap[name]?$rootScope.resource.metricMap[name]:($scope.columns[i]?$scope.columns[i].sTitle:"");
                }
                angular.element("#DataTables_Table_"+index).find("th").each(function(i){
                    angular.element(this).html("<div class='th-title' title='"+columns[i]+"'>"+columns[i]+"</div>");
                });
            }
        },true);
        $scope.$watch("viewRefresh.bottom",function(n){
            if(n>0 && angular.element("#t_"+tableObj["indicator"]).is(":visible")){
                var x= n,l=0;
                if(tableObj["indicator"]=="Interface") x=1700,l=1800;

                //type:0 enum类型不转换，1 enmum 类型转换
                svc.getData({moc_name: $scope.param.moc_name, indicator_name: tableObj["indicator"], mo_id: $scope.param.moId, offset: x, limit: l, type:1}, {}, function (data) {
                    $scope.result = data.rows;
                });
            }
        },true);
        $scope.count.table_count = $scope.count.table_count + 1;
    }]);

    var dateToStr = function(datetime){
        var year = datetime.getFullYear();
        var month = datetime.getMonth()+1;//js从0开始取
        var date = datetime.getDate();
        var hour = datetime.getHours();
        var minutes = datetime.getMinutes();
        var second = datetime.getSeconds();
        if(month<10){
            month = "0" + month;
        }
        if(date<10){
            date = "0" + date;
        }
        if(hour <10){
            hour = "0" + hour;
        }
        if(minutes <10){
            minutes = "0" + minutes;
        }
        if(second <10){
            second = "0" + second ;
        }
        var time = year+"-"+month+"-"+date+" "+hour+":"+minutes+":"+second; //2009-06-12 17:18:05
        return time;
    };
})(angular);


