(function (angular) {
    var flowCounter = angular.module('flowCounter', ['ngRoute', 'ngResource', 'util.services', 'dnt.widget']);

    flowCounter.run(['$rootScope', 'Util', function ($rootScope, Util) {
        var params = [];
        var url_param = window.location.search.substring(1);
        var array = url_param.split("&");
        for (var i = 0; i < array.length; i++) {
            params.push(array[i].split("=")[1]);
        }

        $rootScope.mo = {
            moId: params[0],
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

    flowCounter.controller('flowCounterCtrl', ['$scope', '$rootScope', '$timeout', '$location', function ($scope, $rootScope, $timeout, $location) {
        var DEFAULT_START_YEAR = 2014;
        var DEFAULT_START_MONTH = 1;

        var now = new Date();
        var currentYear = now.getFullYear();
        var currentMonth = now.getMonth() + 1;
        $scope.dateRange = {
            year:[]
        };
        var temp = currentYear;
        while(temp>=DEFAULT_START_YEAR){
            $scope.dateRange.year.unshift(temp);
            temp--;
        }
        $scope.chartSettings = {
            startYear: 2014,
            startMonth: 1,
            endYear: currentYear,
            endMonth: currentMonth
        };
        var flag = (currentYear*12 + currentMonth)-(DEFAULT_START_YEAR*12 + DEFAULT_START_MONTH);
        if(flag >= 12){
            $scope.chartSettings.startYear = currentYear-1;
            $scope.chartSettings.startMonth = currentMonth+1;
        }

        $scope.loadChart = function(){
            var validate =  (parseInt($scope.chartSettings.endYear)*12 + parseInt($scope.chartSettings.endMonth)) - (parseInt($scope.chartSettings.startYear)*12 + parseInt($scope.chartSettings.startMonth));
            if(validate >= 0 && validate<12){
                $.getJSON('/dmonitor-webapi/history/lineflow/monthsTrend/?mo_id=' + $rootScope.mo.moId + "&startYear=" + $scope.chartSettings.startYear + "&startMonth=" + $scope.chartSettings.startMonth + "&endYear=" + $scope.chartSettings.endYear + "&endMonth=" + $scope.chartSettings.endMonth, function (data) {
                    /*               data:{
                     months:[
                     {
                     monthTitle:"2014-12",
                     data:[[data.in],[data.out]],
                     }
                     ]
                     }*/
                    $(".chart-wrapper").each(function(obj,index){
                        var chart = $('#line-chart-'+index).highcharts();
                        if(chart){
                            chart.destroy();
                        }
                    });
                    $(".month-panels").empty();
                    $scope.monthsData = data.months.reverse();
                    $scope.monthsData.forEach(function(obj,index){
                        if(obj.data[0].length > 0){   //取到入流量时，执行
                            var min = obj.data[0][0][0];
                            var max = obj.data[0][obj.data[0].length-1][0];
                            var startDate = new Date(min);
                            var endDate = new Date(max);
                            endDate.setHours(23);
                            endDate.setMinutes(59);

                            var panel = "<div class='col-xs-6 mt20'><div class='chart-wrapper'><a class='detail-link' href='/dmonitor-webapp/views/lineFlowTrend/lineFlowTrend.html?moId=" + $rootScope.mo.moId +"&isMonth=true&min=" + dateToStr(startDate) + "&max=" + dateToStr(endDate) + "' target='_blank'>详细信息</a><div style='height:100%;' id='line-chart-" + index + "'></div></div></div>";
                            $(".month-panels").append(panel);
                            initStaticChart(obj,index);
                        }
                    });
                });
            }else{
                alert("时间范围错误!");
            }
        };

        var dateToStr = function(datetime){
            var year = datetime.getFullYear();
            var month = datetime.getMonth()+1;//js从0开始取
            var date = datetime.getDate();
            var hour = datetime.getHours();
            var minutes = datetime.getMinutes();
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
            var time = year+"-"+month+"-"+date+" "+hour+":"+minutes; //2009-06-12 17:18
            return time;
        };

        Highcharts.setOptions({
            lang: {
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

        var initStaticChart = function (obj,index) {
            $("#line-chart-" + index).highcharts('StockChart', {
                chart: {
                    type: 'spline'
                },
                exporting: {
                    enabled: true,
                    url: "../../../ExportingServer_java_Struts2/export/index"
                },
                credits:{
                    enabled: false
                },
/*                credits:{
                    enabled: true,
                    text: "详细信息",
                    href: "/dmonitor-webapp/views/lineFlowTrend/lineFlowTrend.html?moId=" + $rootScope.mo.moId +"&isMonth=true&min=" + min + "&max=" + max ,
                    position:{
                        align: 'right',
                        x: -10,
                        verticalAlign: 'bottom',
                        y: -10
                    },
                    style:{
                        cursor: 'pointer',
                        color: '#2a6496',
                        fontSize: '12px'
                    }
                },*/
                legend: {
                    enabled: true
                },
                rangeSelector: {
                    enabled:false
                },
                navigator: {
                    enabled:false
                },
                scrollbar: {
                    enabled: false
                },
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
                    }
                },
                yAxis: {
                    title: {
                        text: ' KBIT/S'
                    },
                    min: 0
                },
                plotOptions: {
                    spline: {
                        dataGrouping: {
                            enabled: false
                        }
                    },
                    series :{
                        turboThreshold:0
                    }
                },
                title: {
                    text: obj.monthTitle
                },
                series: [
                    {
                        name: '入流量',
                        data: obj.data[0]
                    },
                    {
                        name: '出流量',
                        data: obj.data[1]
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