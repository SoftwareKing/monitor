(function(angular){
var chart = angular.module('ui.chart', []);

chart.directive('pieChart', function () {
      return {
        restrict: 'E',
        transclude: true,
        template: '<div><div class="percent-value">{{usedPercent}}%</div><div chart-type="pie" ui-chart="data" chart-options="chartOpts" style="height:200px; " ></div></div>',
        replace: true
      };
  });

    chart.directive('speedChart2', function () {
        return {
            restrict: 'AE',
            template: '<div id="{{speedChartId}}" style="width:100%;"></div>',
            link: function (scope, elem, attrs) {
                scope.speedChartId=attrs.id;
                var yAxis={
                    tickPixelInterval: 30,
                    tickWidth: 2,
                    tickPosition: 'inside',
                    tickLength: 10,
                    tickColor: '#666',
                    min: 0,
                    max: 100,
                    pane: 0,
                    title: {
                        text: ''
                    },
                    plotBands: [{
                        from: 0,
                        to: null,
                        color: '#55BF3B' // green
                    }, {
                        from: null,
                        to: null,
                        color: '#DDDF0D' // yellow
                    }, {
                        from: null,
                        to: 100,
                        color: '#DF5353' // red
                    }]
                };
                setTimeout(function () {
                    angular.element('#'+scope.speedChartId).highcharts({
                        chart: {
                            type: 'gauge',
                            height: 120
                        },
                        credits: {text: '',href: ''},
                        title: {text: ''},
                        pane:{
                            startAngle: -90,
                            endAngle: 90,
                            background: null,
                            center: ['50%', '95%'],
                            size:180
                        },
                        yAxis: angular.copy(yAxis),
                        series:[{name:"值",data:[-1],yAxis:0}],
                        tooltip: {
                            formatter:function(){
                                if(this.y<0)
                                    return this.series.name + ':--';
                                else
                                    return this.series.name + ':' + Highcharts.numberFormat(this.y,2,'.');
                            }
                        }
                    });
                }, 100);
                scope.$watch("speedChart",function(){
                    if(scope.speedChart && scope.speedChart.length>0){
                        var chart=angular.element('#'+scope.speedChartId).highcharts();
                        if(chart==null)return;
                        var point = chart.series[0].points[0];
                        var yAxis1=angular.copy(yAxis);
                        if(scope.speedChart[0].reverse){
                            yAxis1.plotBands[0].color="#DF5353";
                            yAxis1.plotBands[2].color="#55BF3B";
                        }else{
                            yAxis1.plotBands[0].color="#55BF3B";
                            yAxis1.plotBands[2].color="#DF5353";
                        }
                        yAxis1.plotBands[0].to=scope.speedChart[0].point1;
                        yAxis1.plotBands[1].from=scope.speedChart[0].point1;
                        yAxis1.plotBands[1].to=scope.speedChart[0].point2;
                        yAxis1.plotBands[2].from=scope.speedChart[0].point2;
                        chart.yAxis[0].update(yAxis1);
                        point.update(scope.speedChart[0].value);
                    }
                },true)
            }
        };
    });

chart.directive('speedChart', function () {
    return {
        restrict: 'AE',
        template: '<div id="{{speedChartId}}" style="width:100%;"></div>',
        link: function (scope, elem, attrs) {
            scope.speedChartId=attrs.id;
            var pane={
                startAngle: -90,
                endAngle: 90,
                background: null,
                center: ['15%', '95%']
              //  size: 170
            };
            var yAxis={
                tickPixelInterval: 30,
                tickWidth: 2,
                tickPosition: 'inside',
                tickLength: 10,
                tickColor: '#666',
                min: 0,
                max: 100,
                pane: 0,
                title: {
                    text: ''
                },
                plotBands: [{
                        from: 0,
                        to: null,
                        color: '#55BF3B' // green
                    }, {
                        from: null,
                        to: null,
                        color: '#DDDF0D' // yellow
                    }, {
                        from: null,
                        to: 100,
                        color: '#DF5353' // red
                }]
            };
            var width=angular.element(elem).width()-20;
            var avgWidth=width/1;
            var v=((avgWidth/width*100)*0+(avgWidth/2/width*100));
            pane.center[0]=v+"%";
            pane.size=avgWidth;
            setTimeout(function () {
                angular.element('#'+scope.speedChartId).highcharts({
                    chart: {
                        type: 'gauge',
                        height: 180
                    },
                    credits: {text: '',href: ''},
                    title: {text: ''},
                    pane:pane,
                    yAxis: angular.copy(yAxis),
                    series:[{name:"值",data:[-1],yAxis:0}],
                    tooltip: {
                        formatter:function(){
                            if(this.y<0)
                                return this.series.name + ':--';
                            else
                                return this.series.name + ':' + Highcharts.numberFormat(this.y,2,'.');
                        }
                    }
                });
            }, 100);
            scope.$watch("speedChart",function(){
                if(scope.speedChart && scope.speedChart.length>0){
                    var chart=angular.element('#'+scope.speedChartId).highcharts();
                    if(chart==null)return;
                    var point = chart.series[0].points[0];
                    var yAxis1=angular.copy(yAxis)
                    yAxis1.title.text=scope.speedChart[0].name;
                    if(scope.speedChart[0].reverse){
                        yAxis1.plotBands[0].color="#DF5353";
                        yAxis1.plotBands[2].color="#55BF3B";
                    }else{
                        yAxis1.plotBands[0].color="#55BF3B";
                        yAxis1.plotBands[2].color="#DF5353";
                    }
                    yAxis1.plotBands[0].to=scope.speedChart[0].point1;
                    yAxis1.plotBands[1].from=scope.speedChart[0].point1;
                    yAxis1.plotBands[1].to=scope.speedChart[0].point2;
                    yAxis1.plotBands[2].from=scope.speedChart[0].point2;
                    chart.yAxis[0].update(yAxis1);
                    point.update(scope.speedChart[0].value);
                }
            },true)
        }
    };
});
chart.directive('trendChart', function () {
       return {
         restrict: 'E',
         transclude: true,
         template: '<div id="container" class="ui-trend"></div>',
         //template: '<div class="ui-trend"><div chart-type="trend" ui-chart="data" chart-options="chartOpts" style="height:250px;"></div></div>',
         replace: true
       }
   });
 chart.directive('uiChart', function () {
    return {
      restrict: 'EACM',
      template: '<div></div>',
      replace: true,
      link: function (scope, elem, attrs) {
        var renderChart = function () {
          var data = scope.$eval(attrs.uiChart);
          elem.html('');
          if (!angular.isArray(data)) {
            return;
          }

          var opts = {};
          if (!angular.isUndefined(attrs.chartOptions)) {
            opts = scope.$eval(attrs.chartOptions);
            if (!angular.isObject(opts)) {
              throw 'Invalid ui.chart options attribute';
            }
          }

          var defaultOpts = {};
          var type =attrs.chartType;
          if(type == "pie"){
            defaultOpts = {
                grid: {
                    drawBorder: false,
                    drawGridlines: false,
                    background: '#ffffff',
                    shadow:false
                },
                seriesColors: ["rgba(191, 44, 227, 1)","rgba(191, 210, 217, 1)"],
                seriesDefaults: {
                    shadow: false,
                    renderer:$.jqplot.DonutRenderer,
                    rendererOptions:{
                        sliceMargin: 0,
                        startAngle: -90,
                        showDataLabels: false,
                        dataLabels: 'value'
                    }
                },
              legend: { show:false, location: 'e' }
            };
          }
           if(type == "trend"){
               defaultOpts = {
                    highlighter: {
                        show: true,
                        sizeAdjust: 1,
                        tooltipOffset: 9
                    },
                    grid: {
                        drawBorder: false,
                        shadow: false,
                        background: '#ffffff',
                        gridLineWidth: 1
                    },
                    legend: {
                        show: false,
                        placement: 'outside'
                    },
                    seriesDefaults: {
                        rendererOptions: {
                            smooth: true,
                            animation: {
                                show: true
                            }
                        },
                        showMarker: false
                    },
                    seriesColors: ["rgba(191, 210, 217, 0.8)"],
                    series: [
                        {
                            fill: false
                        }
                    ],
                    axesDefaults: {
                        rendererOptions: {
                            baselineWidth: 1.5,
                            drawBaseline: false
                        }
                    },
                    axes: {
                        xaxis: {
                            renderer: $.jqplot.DateAxisRenderer,
                            tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                            tickOptions: {
                                formatString: "%R",
                                angle: -45,
                                textColor: '#000',
                                fontSize:12 + "px"
                            },
                            min: "0:00",
                            max: "24:00",
                            tickInterval: "1 hour",
                            drawMajorGridlines: true
                        },
                        yaxis: {
                            tickOptions: {
                                textColor: '#000',
                                fontSize:12 + "px"
                            },
                            min: 0,
                            max: 100,
                            tickInterval: 20
                        }
                    }
                 };
          }
          var newOpts = $.extend(true,{},defaultOpts,opts);

          elem.jqplot(data, newOpts);
        };

        scope.$watch(attrs.uiChart, function () {
          renderChart();
        }, true);

        scope.$watch(attrs.chartOptions, function () {
          renderChart();
        });
      }
    };
  })
})(angular);


