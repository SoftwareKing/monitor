(function (angular) {
    var lineFlow = angular.module('lineFlowTrend', ['ngRoute', 'ngResource', 'util.services','datepickerDirective']);

    lineFlow.run(['$rootScope', 'Util', function ($rootScope, Util) {
        var params = [];
        var url_param = window.location.search.substring(1);
        var array = url_param.split("&");
        for (var i = 0; i < array.length; i++) {
            params.push(array[i].split("=")[1]);
        }

        $rootScope.mo = {
            moId: params[0],
            isMonth: params[1],
            min:params[2],
            max:params[3],
            displayName: "",
            leftDisplayName: "",
            rightDisplayName: "",
            leftPort: "",
            leftPortName: "",
            rightPort: "",
            rightPortName: ""
        };

        $.getJSON('/dmonitor-webapi/resources/mo/' + $rootScope.mo.moId, function (data) {
            $rootScope.mo.displayName = data.mo.displayName;
            $rootScope.mo.leftDisplayName = data.mo.resource.leftDisplayName;
            $rootScope.mo.leftPort = data.mo.resource.leftPort;
            $rootScope.mo.rightDisplayName = data.mo.resource.rightDisplayName;
            $rootScope.mo.rightPort = data.mo.resource.rightPort;
            Util.go($rootScope);
        });

        $.getJSON('/dmonitor-webapi/history/elink/portnames?mo_id=' + $rootScope.mo.moId, function (data) {
            $rootScope.mo.leftPortName = data.leftPortName;
            $rootScope.mo.rightPortName = data.rightPortName;
            Util.go($rootScope);
        });
    }]);

    lineFlow.controller('lineFlowTrendCtrl', ['$scope', '$rootScope', '$timeout', '$location', function ($scope, $rootScope, $timeout, $location) {
        $scope.chartSettings = {
            method: 1,         //default refresh,  1:refresh, 2:history
            timeRanger: 1,     //default 30s,   1:3时, 2:1天, 3:1周, 4:1月, 5:自定义
            refreshTimeRanger: 1, //default 30s,   1:3时, 2:1天, 3:1周, 4:1月, 5:自定义
            refreshTime: 15 * 1000,  //default 15s
            startDate: '',    //自定义起始时间
            endDate: ''      //自定义结束时间，仅历史查看
        };

        if($rootScope.mo.isMonth){
            $scope.chartSettings.method = 2;
            $scope.chartSettings.timeRanger = 5;
            $scope.chartSettings.startDate = decodeURI($rootScope.mo.min);
            $scope.chartSettings.endDate = decodeURI($rootScope.mo.max);
        }

        var initParams = function(){
            $scope.reportType = null;
            if($scope.chartSettings.method == 1){  //刷新查看方式
                $scope.chartSettings.refreshTimeRanger =  $scope.chartSettings.timeRanger;
                $scope.chartSettings.endDate = "";
            }
            $scope.lastPoints = {
                inPoint: [],
                outPoint: []
            };
            $scope.in_points = points_num;    //read from config.js, 取不到值时的补点数
            $scope.out_points = points_num;
            $scope.isEmitSeconds = 15 * 1000;  //发送刷新请求计数
            $scope.toAddInList = [];
            $scope.toAddOutList = [];
        };

        $scope.loadChart = function(){
            if($scope.dInterval){
                clearInterval($scope.dInterval);
            }
            var chart = $('#line-chart').highcharts();
            if(chart){
                chart.destroy();
            }
            initParams();
            $.getJSON('/dmonitor-webapi/history/lineflow/trend/?mo_id=' + $rootScope.mo.moId + "&timeRanger=" + $scope.chartSettings.timeRanger + "&startDate=" + $scope.chartSettings.startDate + "&endDate=" + $scope.chartSettings.endDate + "&method=" + $scope.chartSettings.method, function (data) {
                $scope.reportType = data.reportType;
                if(data.reportType == ""){    //取不到值
                    alert("时间范围错误!");
                }else{
                    var result = [];
                    result[0] = data.in;
                    result[1] = data.out;

                    if(data.in.length>0 && data.out.length>0){
                        if($scope.chartSettings.method == 1){
                            var lastInPoint = data.in[data.in.length - 1];
                            var lastOutPoint = data.out[data.out.length - 1];
                            $scope.lastPoints = {
                                inPoint: lastInPoint,
                                outPoint: lastOutPoint
                            };

                            initDynamicChart(result);
                        }else if($scope.chartSettings.method == 2){
                            var firstPointTime = data.in[0][0];
                            var lastPointTime = data.in[data.in.length-1][0];
                            $scope.navigator_min = firstPointTime;
                            $scope.navigator_max = lastPointTime;

                            initStaticChart(result);
                        }
                    }
                }
            });
        };

        Highcharts.setOptions({
            lang: {
                rangeSelectorFrom: '从',
                rangeSelectorTo: '到',
                rangeSelectorZoom: '放大/缩小',
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
        var initDynamicChart = function (data) {
            $("#line-chart").highcharts('StockChart', {
                    chart: {
                        events: {
                            load: function () {
                                var seriesIn = this.series[0];
                                var seriesOut = this.series[1];
                                $scope.dInterval = setInterval(function () {
                                    if ($scope.isEmitSeconds >= $scope.chartSettings.refreshTime) {
                                        $.getJSON('/dmonitor-webapi/history/lineflow/currentFlow/?mo_id=' + $rootScope.mo.moId + "&timeRanger=" + $scope.chartSettings.refreshTimeRanger + "&reportType=" + $scope.reportType, function (data) {
                                            var lastPointTime = $scope.lastPoints.inPoint[0];
                                            var inResultList = data.in;
                                            var outResultList = data.out;

                                            inResultList.forEach(function (obj, index) {
                                                if(obj[0] > lastPointTime){
                                                    if (obj[1] >= 0) {
                                                        //覆盖空值 或者 添加新值
                                                        if($scope.toAddInList.length > 0){
                                                            for(var i=0;i<$scope.toAddInList.length;i++){
                                                                var point = $scope.toAddInList[i];
                                                                if(point[0] == obj[0]){
                                                                    point[1] = obj[1];
                                                                    break;
                                                                }
                                                            }
                                                        }else{
                                                            $scope.toAddInList.push(obj);
                                                        }

                                                        //处理有值的值及之前的数组
                                                        for(var j=0;j<$scope.toAddInList.length;j++){
                                                            var addObj = $scope.toAddInList[j];
                                                            if(addObj[1] >= 0){
                                                                seriesIn.addPoint([addObj[0], parseFloat(addObj[1])], true, true);
                                                                $scope.lastPoints.inPoint = [addObj[0], parseFloat(addObj[1])];
                                                                $scope.in_points = points_num;    //read from config.js

                                                                $scope.toAddInList.shift();
                                                                break;
                                                            }else{
                                                                if ($scope.in_points > 0) {  //补点
                                                                    seriesIn.addPoint([addObj[0], parseFloat($scope.lastPoints.inPoint[1])], true, true);
                                                                    $scope.lastPoints.inPoint = [addObj[0], parseFloat($scope.lastPoints.inPoint[1])];
                                                                    $scope.in_points = $scope.in_points - 1;
                                                                } else {
                                                                    seriesIn.addPoint([addObj[0], -100], true, true);
                                                                    $scope.lastPoints.inPoint = [addObj[0], -100];
                                                                }

                                                                $scope.toAddInList.shift();
                                                                j--;
                                                            }
                                                        }
                                                    } else {
                                                        if($scope.toAddInList.length > 0){
                                                            var lastToAddPoint = $scope.toAddInList[$scope.toAddInList.length - 1];
                                                            if(obj[0] > lastToAddPoint[0]){
                                                                $scope.toAddInList.push(obj);
                                                            }
                                                        }else{
                                                            $scope.toAddInList.push(obj);
                                                        }
                                                    }
                                                }
                                            });

                                            outResultList.forEach(function (obj, index) {
                                                if(obj[0] > lastPointTime){
                                                    if (obj[1] >= 0) {
                                                        //覆盖空值 或者 添加新值
                                                        if($scope.toAddOutList.length > 0) {
                                                            for (var i = 0; i < $scope.toAddOutList.length; i++) {
                                                                var point = $scope.toAddOutList[i];
                                                                if (point[0] == obj[0]) {
                                                                    point[1] = obj[1];
                                                                    break;
                                                                }
                                                            }
                                                        }else{
                                                            $scope.toAddOutList.push(obj);
                                                        }

                                                        //处理有值的值之前的数组
                                                        for(var j=0;j<$scope.toAddOutList.length;j++){
                                                            var addObj = $scope.toAddOutList[j];
                                                            if(addObj[1] >= 0){
                                                                seriesOut.addPoint([addObj[0], parseFloat(addObj[1])], true, true);
                                                                $scope.lastPoints.outPoint = [addObj[0], parseFloat(addObj[1])];
                                                                $scope.out_points = points_num;    //read from config.js

                                                                $scope.toAddOutList.shift();
                                                                break;
                                                            }else{
                                                                if ($scope.out_points > 0) {  //补点
                                                                    seriesOut.addPoint([addObj[0], parseFloat($scope.lastPoints.outPoint[1])], true, true);
                                                                    $scope.lastPoints.outPoint = [addObj[0], parseFloat($scope.lastPoints.outPoint[1])];
                                                                    $scope.out_points = $scope.out_points - 1;
                                                                } else {
                                                                    seriesOut.addPoint([addObj[0], -100], true, true);
                                                                    $scope.lastPoints.outPoint = [addObj[0], -100];
                                                                }

                                                                $scope.toAddOutList.shift();
                                                                j--;
                                                            }
                                                        }
                                                    } else {
                                                        if($scope.toAddOutList.length > 0){
                                                            var lastToAddPoint = $scope.toAddOutList[$scope.toAddOutList.length - 1];
                                                            if(obj[0] > lastToAddPoint[0]){
                                                                $scope.toAddOutList.push(obj);
                                                            }
                                                        }else{
                                                            $scope.toAddOutList.push(obj);
                                                        }
                                                    }
                                                }
                                            });
                                        });
                                        $scope.isEmitSeconds = 15 * 1000;
                                    } else {
                                        $scope.isEmitSeconds = $scope.isEmitSeconds + 15 * 1000;
                                    }
                                }, 15 * 1000);
                            }
                        },
                        /*zoomType: 'x',*/
                        type: 'spline'
                    },
                    exporting: {
                        enabled: true,
                        url: "../../../ExportingServer_java_Struts2/export/index"
                    },
                    legend: {
                        enabled: true
                    },
                    rangeSelector: {
                        enabled:false
/*                                                                    allButtonsEnabled: true,
                         beyondExtremes: true,
                         inputEnabled: true,
                         inputBoxWidth: 150,
                         inputDateFormat: '%Y-%m-%d %H:%M:%S',
                         inputEditDateFormat: '%Y-%m-%d %H:%M:%S',
                         buttons: [
                         {
                         type: 'all',
                         text: 'All'
                         }
                         ],
                         selected: 0*/
                    },
                    scrollbar:{
                        enabled:false
                    },
                    navigator: {
                        enabled:false,
                        adaptToUpdatedData: true,
                        series: {
                            data: []
                        },
                        margin: 20,
                        xAxis: {
                            type: 'datetime',
                            dateTimeLabelFormats: {
                                second: '%Y<br/>%m-%d<br/>%H:%M:%S',
                                minute: '%Y<br/>%m-%d<br/>%H:%M',
                                hour: '%Y<br/>%m-%d<br/>%H:%M',
                                day: '%Y<br/>%m-%d',
                                week: '%Y<br/>%m-%d',
                                month: '%Y<br/>%m',
                                year: '%Y'
                            },
                            labels: {
                                x: 0,
                                y: -30
                            }
                        }
                    },
                    xAxis: {
                        minRange: 300 * 1000,   //最小坐标刻度
                        type: 'datetime',
                        dateTimeLabelFormats: {
                            second: '%Y<br/>%m-%d<br/>%H:%M:%S',
                            minute: '%Y<br/>%m-%d<br/>%H:%M',
                            hour: '%Y<br/>%m-%d<br/>%H:%M',
                            day: '%Y<br/>%m-%d',
                            week: '%Y<br/>%m-%d',
                            month: '%Y<br/>%m',
                            year: '%Y'
                        }
                    },
                    yAxis: {
                        title: {
                            text: ' KBIT/S'
                        }
                    },
                    plotOptions: {
                        spline: {
                            /*                        marker: {
                             enabled: true
                             },*/
                            dataGrouping: {
                                enabled: false
                            }
                        },
                        series :{
                            turboThreshold:0
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: "高频流量分析"
                    },
                    series: [
                        {
                            name: '入流量',
                            data: data[0]
                        },
                        {
                            name: '出流量',
                            data: data[1]
                        }
                    ],
                    tooltip: {
                        valueDecimals: 2,
                        xDateFormat: '%Y-%m-%d %H:%M:%S',
                        valueSuffix: ' KBIT/S'
                    }
                });
        };

        var initStaticChart = function (data) {
              $("#line-chart").highcharts('StockChart', {
                    chart: {
                        zoomType: 'x',
                        type: 'spline'
                    },
                    exporting: {
                        enabled: true,
                        url: "../../../ExportingServer_java_Struts2/export/index"
                    },
                    legend: {
                        enabled: true
                    },
                    rangeSelector: {
                        enabled:true,
                        allButtonsEnabled: true,
                        beyondExtremes: true,
                        inputEnabled: true,
                        inputBoxWidth: 150,
                        inputDateFormat: '%Y-%m-%d %H:%M:%S',
                        inputEditDateFormat: '%Y-%m-%d %H:%M:%S',
                        buttons: [
                            {
                                type: 'all',
                                text: 'All'
                            }
                        ],
                        selected: 0
                    },
                    navigator: {
                        adaptToUpdatedData: false,
                        series: {
                            data: [[$scope.navigator_min,0],[$scope.navigator_max,0]]
                        },
                        margin: 20,
                        xAxis: {
                            type: 'datetime',
                            dateTimeLabelFormats: {
                                second: '%Y<br/>%m-%d<br/>%H:%M:%S',
                                minute: '%Y<br/>%m-%d<br/>%H:%M',
                                hour: '%Y<br/>%m-%d<br/>%H:%M',
                                day: '%Y<br/>%m-%d',
                                week: '%Y<br/>%m-%d',
                                month: '%Y<br/>%m',
                                year: '%Y'
                            },
                            labels: {
                                x: 0,
                                y: -30
                            }
                        }
                    },
                    xAxis: {
                        minRange: 300 * 1000,   //最小坐标刻度
                        events: {
                            afterSetExtremes: function (e) {
                                var chart = $('#line-chart').highcharts();
                                chart.showLoading('数据加载中...');
                                $.getJSON('/dmonitor-webapi/history/lineflow/trend/?mo_id=' + $rootScope.mo.moId + "&min=" + Math.round(e.min) + "&max=" + Math.round(e.max) + "&method=" + $scope.chartSettings.method, function (data) {
                                    chart.series[0].setData(data.in);
                                    chart.series[1].setData(data.out);
                                    chart.hideLoading();
                                });
                            }
                        },
                        type: 'datetime',
                        dateTimeLabelFormats: {
                            second: '%Y<br/>%m-%d<br/>%H:%M:%S',
                            minute: '%Y<br/>%m-%d<br/>%H:%M',
                            hour: '%Y<br/>%m-%d<br/>%H:%M',
                            day: '%Y<br/>%m-%d',
                            week: '%Y<br/>%m-%d',
                            month: '%Y<br/>%m',
                            year: '%Y'
                        }
                    },
                    yAxis: {
                        title: {
                            text: ' KBIT/S'
                        }
                    },
                    plotOptions: {
                        spline: {
                            /*                        marker: {
                             enabled: true
                             },*/
                            dataGrouping: {
                                enabled: false
                            }
                        },
                        series :{
                            turboThreshold:0
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: "高频流量分析"
                    },
                    series: [
                        {
                            name: '入流量',
                            data: data[0]
                        },
                        {
                            name: '出流量',
                            data: data[1]
                        }
                    ],
                    tooltip: {
                        valueDecimals: 2,
                        xDateFormat: '%Y-%m-%d %H:%M:%S',
                        valueSuffix: ' KBIT/S'
                    }
                });
        };

        $scope.loadChart();

    }]);

})(angular);