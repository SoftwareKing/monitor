(function(angular){
    angular.module('flow.controllers', ['flow.services','highcharts-ng'])
        .controller('iframeController',['$scope','log','Loading','Util','flow',function($scope,log,Loading,Util,flow){
         $scope.abc="http://172.16.3.25:3000";

            $scope.getIframe = function(){
                flow.getNTopUrl(function(data){
                    var iframe="http://";
                    iframe +=data.ip;
                    iframe+=":3000//"
                    jQuery("#myiframe4").attr("src",iframe+"?page=TopHosts");
                    jQuery("#myiframe").attr("src",iframe+"lua/hosts_stats.lua");
                    jQuery("#myiframe1").attr("src",iframe+"lua/flows_stats.lua");
                    jQuery("#myiframe2").attr("src",iframe+"?page=TopApplications");
                    jQuery("#myiframe3").attr("src",iframe+"?page=TopFlowSenders");
//                    document.myiframe.location = iframe+"lua/hosts_stats.lua";
//                    document.myiframe1.location = iframe+"lua/flows_stats.lua";
//                    document.myiframe2.location = iframe+"?page=TopApplications";
//                    document.myiframe3.location = iframe+"?page=TopFlowSenders";
//                    document.myiframe4.location = iframe+"?page=TopHosts";
                });
            };
            $scope.getIframe();
        }])
        .controller('netflowController', ['$scope','log','Loading','Util','flow',function($scope,log,Loading,Util,flow){

            $scope.timer = setInterval(function(){$scope.updateNetFlowData();},60*1000);
            $scope.chartSeries = [{
                "name": "数据包流量",
                "data": [],
                type: "column"
            }
            ];
            $scope.updateNetFlowData = function(){
                if( $scope.detailIP != null &&  $scope.detailIP != ""){
                    flow.getRealTime({ip:$scope.detailIP},function(data){
                        $scope.chartSeries[0].data = data.rows;
                    });
                    flow.getDataTcp({ip:$scope.detailIP},function(data){
                        $scope.chartSeriesTcp[0].data = data.rows;
                    });
                    flow.getDataUdp({ip:$scope.detailIP},function(data){
                        $scope.chartSeriesUdp[0].data = data.rows;
                    });

                    $scope.listPage.settings.reload();
                }

            };
            $scope.chartSeriesTcp = [{
                "name": "数据包", "data": []
            }];
            $scope.chartSeriesUdp = [{
                "name": "数据包", "data": []
            }];
//            $scope.chartStack = [
//                {"id": '', "title": "No"},
//                {"id": "normal", "title": "Normal"},
//                {"id": "percent", "title": "Percent"}
//            ];
            $scope.chartConfigColoum = {
                options: {
                    chart: {
                        type: 'column'
                        // margin: [0, 0, 0, 0] //距离上下左右的距离值
                    },
                    plotOptions: {
                        series: {
                            stacking: ''
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: '包数'
                    }
                },
                legend:{
                    align:'right'
                },
                series: $scope.chartSeries,
                title: {
                    text: '实时流量'
                },
                credits: {
                    enabled: false
                },
                loading: false,
                size: {height:300}
            };
            $scope.chartConfigTcp = {
                options: {
                    chart: {
                        type: 'pie'
                        //margin: [0, 0, 0, 0] //距离上下左右的距离值
                    },
                    plotOptions: {
                        series: {
                            stacking: ''
                        }
                    }
                },

                series: $scope.chartSeriesTcp,
                title: {
                    text: 'TCP流量图'
                },
                credits: {
                    enabled: false
                },
                loading: false,
                size: {height:300}
            };

            $scope.chartConfigUdp = {
                options: {
                    chart: {
                        type: 'pie'
                        //margin: [0, 0, 0, 0] //距离上下左右的距离值
                    },
                    plotOptions: {
                        series: {
                            stacking: ''
                        }
                    }
                },

                series: $scope.chartSeriesUdp,
                title: {
                    text: 'UDP流量图'
                },
                credits: {
                    enabled: false
                },
                loading: false,
                size: {height:300}
            };
            flow.getDataSrcIP(function(data){
                $scope.dataSrcIPS = data.rows;
                $scope.detailIP = $scope.dataSrcIPS[0];
            });

            $scope.$watch("detailIP",function(newVal, oldVal){
                if(Util.notNull(newVal)){
                    $scope.updateNetFlowData();
                }
            });
            $scope.reflow = function () {
                $scope.$broadcast('highchartsng.reflow');
            };

            $scope.searchPage = {
                limit:20,
                offset:0,
                orderBy:"",
                orderByType:""
            };
            //listPage部分
            //scope定义
            $scope.listPage = {
                data:[],
                checkedList : [],
                checkAllRow : false
            };


            $scope.listPage.settings = {
                reload : null,
                getData:function(search,fnCallback){
                    $scope.searchPage.limit = search.limit;
                    $scope.searchPage.offset = search.offset;
                    $scope.searchPage.orderBy = search.orderBy;
                    $scope.searchPage.orderByType = search.orderByType;
                    $scope.searchPage.ip = $scope.detailIP;
                    flow.getDetail( $scope.searchPage,function(data){
                        $scope.listPage.data = data.rows;
                        fnCallback(data);
                    });

                }, //getData应指定获取数据的函数
                columns : [
                    {
                        sTitle: "协议",
                        mData:"protocol",
                        mRender:function(mData,type,full) {
                            if(mData == 6) return 'TCP';
                            else if(mData == 17) return 'UDP';
                            else if(mData == 1) return 'ICMP';
                            else return '--';
                        }
                    },
                    {
                        sTitle: "源IP地址",
                        mData:"ipv4_src_addr"

                    },
                    {
                        sTitle: "源端口",
                        mData:"l4_src_port"
                    },
                    {
                        sTitle: "目的IP地址",
                        mData:"ipv4_dst_addr"
                    },
                    {
                        sTitle: "目的端口",
                        mData:"l4_dst_port"
                    },
                    {
                        sTitle: "包数",
                        mData:"in_pkts"
                    },
                    {
                        sTitle: "字节数",
                        mData:"in_bytes"
                    },
                    {
                        sTitle: "时间",
                        mData:"time"
                    }

                ] , //定义列的形式,mRender可返回html
                columnDefs : [
                    { bSortable: false, aTargets: [ 0] }  //第0、9列不可排序
                ] , //定义列的约束
                defaultOrderBy : [[ 7, "desc" ]]  //定义默认排序列为第8列倒序
            };
        }])
    ;
})(angular);