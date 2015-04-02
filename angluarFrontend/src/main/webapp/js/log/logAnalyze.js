(function(angular){
    'use strict';
    angular.module('logAnalyze',['ngRoute','ngResource'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/logAnalyze',{
            templateUrl:'views/log/logAnalyze.html',
            controller:'logAnalyzeCtrl'});
    }])
    .controller('logAnalyzeCtrl',['$scope','$rootScope','Util','$timeout','FlowChartClient','Modal','Loading','MoClient','$location',function($scope,$rootScope,Util,$timeout,FlowChartClient,Modal,Loading,MoClient,$location){
        $scope.flowchart = {
            table:{
                keyword:"",
                data:[],
                id:"",
                search:function(){
                    $scope.flowchart.table.settings.reload(true);
                },
                settings:{
                    reload : null,
                    getData:function(search,fnCallback){
                        Loading.show();
                        FlowChartClient.getLinks({limit:search.limit,offset:search.offset,keyword:$scope.flowchart.table.keyword},function(data){
                            $scope.flowchart.table.data = data.rows;
                            fnCallback(data);
                            Loading.hide();
                            if(data.rows.length>0){
                                $scope.flowchart.table.id = data.rows[0].id;
                            }else{
                                $scope.flowchart.table.id = "";
                            }
                        });
                    }, //getData应指定获取数据的函数
                    columns : [
                        {
                            sTitle: "",
                            mData:"id",
                            mRender:function(mData,type,full) {
                                return "<label title='"+full.displayName+"' style='margin-left:10px'><input type='radio' value="+mData+" ng-model='flowchart.table.id'>&nbsp;"+full.displayName+"</label>";
                            }
                        }
                    ] , //定义列的形式,mRender可返回html
                    columnDefs : [
                        { bSortable: false, aTargets: [ 0] }  //不可排序
                    ], //定义列的约束
                    defaultOrderBy : []  //定义默认排序列为第8列倒序
                }
            },
            tree:[],
            selectPort:"",
            selectMoId:"",
            selectNode:null,
            selectFlowChartTemplate:[],
            selectReportTypeList : [["Day"],["Day"]],
            addChart:function(index){
                var template = $scope.flowchart.selectFlowChartTemplate[index];
                var types = $scope.flowchart.selectReportTypeList[index];
                for(var i=0;i<types.length;i++){
                    var exist = false;
                    for(var j=0;j<$scope.flowchart.selectChartList.length;j++){
                        var temp = $scope.flowchart.selectChartList[j];
                        if(template.moId==temp.moId && template.flowChartType==temp.flowChartType && template.port==temp.port && types[i]==temp.reportType){
                            exist = true;
                            break;
                        }
                    }
                    if(!exist){
                        var temp = {};
                        Util.init(temp,template);
                        temp.reportType = types[i];
                        $scope.flowchart.selectChartList.unshift(temp);
                    }
                }
                $scope.flowchart.settings.reload(true);
            },
            remove:function(flowChartType,moId,port,reportType){
                for(var i=0;i<$scope.flowchart.selectChartList.length;i++){
                    var temp = $scope.flowchart.selectChartList[i];
                    if(moId==temp.moId && flowChartType==temp.flowChartType && port==temp.port && reportType==temp.reportType){
                        $scope.flowchart.selectChartList.splice(i,1);
                        break;
                    }
                }
                $scope.flowchart.settings.reload(true);
            },
            showChart:function(){
                $(".collapse-all").trigger("click");
                $scope.flowchart.chartList = [{"id":0,"linkDisplayName":"1","metrics":[],"flowChartType":"FLOW","reportType":"Day"},
                    {"id":1,"linkDisplayName":"2","metrics":[],"flowChartType":"FLOW","reportType":"Day"},
                    {"id":2,"linkDisplayName":"3","metrics":[],"flowChartType":"FLOW","reportType":"Day"}];
                for(var i=0;i<$scope.flowchart.chartList.length;i++){
                    var chart = $scope.flowchart.chartList[i];
                    chart.id = i;

                        var chartName = chart.linkDisplayName+"-采集端口:"+chart.portName+"-";
                        if(chart.flowChartType=="FLOW"){
                            chartName+="流量图";
                        }else if(chart.flowChartType=="FLOW_CAST"){
                            chartName+="广播量图";
                        }
                        if(chart.reportType=="Day"){
                            chartName+="(日)"
                        }else if(chart.reportType=="Week"){
                            chartName+="(周)"
                        }else if(chart.reportType=="Month"){
                            chartName+="(月)"
                        }else if(chart.reportType=="Year"){
                            chartName+="(年)"
                        }
                        var series = [];
                        series.push({data:[[Date.UTC(2003,8,24),0.8709],
                            [Date.UTC(2003,8,25),0.872],
                            [Date.UTC(2003,8,26),0.8714],
                            [Date.UTC(2003,8,29),0.8638],
                            [Date.UTC(2003,8,30),0.8567],
                            [Date.UTC(2003,9,1),0.8536],
                            [Date.UTC(2003,9,2),0.8564],
                            [Date.UTC(2003,9,3),0.8639],
                            [Date.UTC(2003,9,6),0.8538],
                            [Date.UTC(2003,9,7),0.8489],
                            [Date.UTC(2003,9,8),0.8459],
                            [Date.UTC(2003,9,9),0.8521],
                            [Date.UTC(2003,9,10),0.8477],
                            [Date.UTC(2003,9,13),0.8554],
                            [Date.UTC(2003,9,14),0.853],
                            [Date.UTC(2003,9,15),0.8607],
                            [Date.UTC(2003,9,16),0.8636],
                            [Date.UTC(2003,9,17),0.8565],
                            [Date.UTC(2003,9,20),0.86],
                            [Date.UTC(2003,9,21),0.8583],
                            [Date.UTC(2003,9,22),0.8462],
                            [Date.UTC(2003,9,23),0.846],
                            [Date.UTC(2003,9,24),0.8492],
                            [Date.UTC(2003,9,27),0.8521],
                            [Date.UTC(2003,9,28),0.8573],
                            [Date.UTC(2003,9,29),0.8573],
                            [Date.UTC(2003,9,30),0.8603],
                            [Date.UTC(2003,9,31),0.8632],
                            [Date.UTC(2003,10,3),0.8729],
                            [Date.UTC(2003,10,4),0.8717],
                            [Date.UTC(2003,10,5),0.8753],
                            [Date.UTC(2003,10,6),0.8766]],type:"column",name:"总流量"});
                        for(var j=0;j<chart.metrics.length;j++){
                            var metric = chart.metrics[j];
    //                        if(metric.hasRule){
                            if(metric.flowMetricType=="TOTAL_HOST" || metric.flowMetricType=="TOTAL_NETWORK"){
                                series.push({data:metric.data,type:"areaspline",name:"总流量"});
                            }else if(metric.flowMetricType=="TOTAL_NETWORK_CAST"){
                                series.push({data:metric.data,type:"areaspline",name:"总广播量"});
                            }else if(metric.flowMetricType=="IN_HOST" || metric.flowMetricType=="IN_NETWORK"){
                                series.push({data:metric.data,type:"spline",name:"入流量"});
                            }else if(metric.flowMetricType=="OUT_HOST" || metric.flowMetricType=="OUT_NETWORK"){
                                series.push({data:metric.data,type:"spline",name:"出流量"});
                            }else if(metric.flowMetricType=="IN_NETWORK_CAST"){
                                series.push({data:metric.data,type:"spline",name:"入广播量"});
                            }else if(metric.flowMetricType=="OUT_NETWORK_CAST"){
                                series.push({data:metric.data,type:"spline",name:"出广播量"});
                            }
    //                        }
                        }
                        Highcharts.setOptions({
                            lang:{
                                printChart: '打印',
                                downloadPNG: '导出为PNG格式',
                                downloadJPEG: '导出为JPEG格式',
                                downloadPDF: '导出为PDF格式',
                                downloadSVG: '导出为SVG格式',
                                contextButtonTitle: '导出图表'
                            },
                            global: {
                                useUTC: false
                            }
                        });
                        $("#flowchartBottomDiv div.flowchartDiv").eq(chart.id).highcharts('StockChart', {
                            chart:{
                                type:'column'
                            },
                            exporting:{
                                // 是否允许导出
                                enabled:true,
                                url:"../ExportingServer_java_Struts2/export/index"
                            },
                            legend:{
                                enabled:true
                            },
                            rangeSelector : {
                                enabled:false
                            },
                            navigator : {
                                enabled:false
                            },
                            scrollbar: {
                                enabled: false
                            },
                            xAxis:{
                                type : 'datetime',
                                min:chart.beginTime,
                                max:chart.endTime,
                                dateTimeLabelFormats : {
                                    second : '%Y<br/>%m-%d<br/>%H:%M:%S',
                                    minute : '%Y<br/>%m-%d<br/>%H:%M',
                                    hour : '%Y<br/>%m-%d<br/>%H:%M',
                                    day : '%Y<br/>%m-%d',
                                    week : '%Y<br/>%m-%d',
                                    month : '%Y<br/>%m',
                                    year : '%Y'
                                }
                            },
                            yAxis : {
                                title: {
                                    text: ''  //y轴上的标题
                                },
                                min:0
                            },
                            plotOptions: {
                                spline: {
                                    marker: {
                                        enabled: true
                                    },
                                    dataGrouping:{
                                        enabled: false
                                    }
                                },
                                areaspline:{
                                    dataGrouping:{
                                        enabled: false
                                    }
                                }
                            },
                            credits:{
                                enabled:false
                            },
                            title : {
                                text : chartName
                            },
                            series : series ,
                            tooltip:{
                                valueDecimals: 2,
                                xDateFormat:'%Y-%m-%d %H:%M:%S',
                                valueSuffix:' '+chart.unit
                            }
                        });
                    $("#flowchartBottomDiv div.flowchartDiv").eq(chart.id).eq();
                }
            },
            clearChart:function(){
                $scope.flowchart.chartList = [];
            },
            selectChartList:[],
            chartList:[],
            settings:{
                reload : null,
                getData:function(search,fnCallback){
                    if($scope.flowchart.selectChartList){
                        var data = {
                            rows:$scope.flowchart.selectChartList.slice(search.offset,search.offset+search.limit),
                            total:$scope.flowchart.selectChartList.length
                        }
                        fnCallback(data);
                    }
    //              search.limit;
    //              search.offset;
    //              search.orderBy;
    //              search.orderByType;

                }, //getData应指定获取数据的函数
                columns : [
                    {
                        sTitle: "类型",
                        mData:"flowChartType",
                        mRender:function(mData,type,full) {
                            var type = mData;
                            if(mData=="FLOW"){
                                type="流量图";
                            }else if(mData=="FLOW_CAST"){
                                type="广播量图";
                            }
                            if(full.reportType=="Day"){
                                type+="(日)"
                            }else if(full.reportType=="Week"){
                                type+="(周)"
                            }else if(full.reportType=="Month"){
                                type+="(月)"
                            }else if(full.reportType=="Year"){
                                type+="(年)"
                            }
                            return type;
                        }
                    },
                    {
                        sTitle: "线路名称",
                        mData:"linkDisplayName",
                        mRender:function(mData,type,full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {
                        sTitle: "采集实例",
                        mData:"moDisplayName",
                        mRender:function(mData,type,full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {
                        sTitle: "采集端口",
                        mData:"portName",
                        mRender:function(mData,type,full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {
                        sTitle:"操作",
                        mData:"moId",
                        mRender:function(mData,type,full) {
                            return '<i class="fa fa-trash-o" title="删除" ng-click="flowchart.remove(\''+ full.flowChartType +'\','+ full.moId +',\''+ full.port +'\',\''+ full.reportType +'\')"></i>';
                        }
                    }
                ] , //定义列的形式,mRender可返回html
                columnDefs : [
                    { bSortable: false, aTargets: [ 0,1,2,3,4 ] },  //不可排序
                    { sWidth: "100px", aTargets: [ 0 ] },
                    { sWidth: "100px", aTargets: [ 4 ] }
                ], //定义列的约束
                defaultOrderBy : []  //定义默认排序列为第8列倒序
            }
        }

        $scope.$watch("flowchart.table.id",function(newVal,oldVal){
            if(newVal){
                if(newVal!=oldVal){
                    for(var i in $scope.flowchart.table.data){
                        var row = $scope.flowchart.table.data[i];
                        if(row.id==newVal){
                            $timeout(function(){
                                $scope.flowchart.selectReportTypeList=[["Day"],["Day"]];
                                FlowChartClient.getChartTemplate({moId:(row.sampleLeft?row.leftMoId:row.rightMoId),port:(row.sampleLeft?row.leftPort:row.rightPort)},function(data){
                                    $scope.flowchart.selectFlowChartTemplate = data;
                                });
                            },100);
                            break;
                        }
                    }
                }
            }else{
                $scope.flowchart.selectFlowChartTemplate = [];
            }
        },false);


        var linkId = $location.$$search.id;
        if(linkId){
            MoClient.get({id:linkId},{},function(data){
                $timeout(function(){
                    $scope.flowchart.table.keyword=data.mo.displayName;
                    $scope.flowchart.table.search();
                },200);
            });
        }
    }])
})(angular);