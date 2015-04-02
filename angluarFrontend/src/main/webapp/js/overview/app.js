(function (angular) {
    var api_path = "/dmonitor-webapi/";
    var overview = angular.module('overview-module', ['ngRoute', 'ngResource', 'itsm'])
    overview.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/overview', {
            templateUrl: 'views/overview/index.html',
            controller: 'overviewController'});
        $routeProvider.when('/index', {
            template: '<label></label>',
            controller: 'loginCtrl'});
        $routeProvider.otherwise({redirectTo: '/index'});
    }]);

    overview.controller('loginCtrl', ['$scope', '$rootScope', '$location', '$timeout', 'LoginService', function ($scope, $rootScope, $location, $timeout, Login) {
        if ($rootScope.isLogin) {
            $location.path("/overview");
        } else {
            Login.isLogin(function (data) {
                if (data) {
                    $rootScope.isLogin = true;
                    $location.path("/overview");
                } else location.href = "./login.html";
            });
        }
    }]);

    overview.factory('HistoryService', ['$resource', function (resource) {
        return resource("", {}, {
            getHistory: {url: api_path + "history/performance/home", method: 'GET', isArray: true},
            getHistoryWithColor: {url: api_path + "history/performance/home/metricColor", method: 'GET', isArray: true},
            getHistoryLineFlow: {url: api_path + "history/performance/lineFlow", method: 'GET', isArray: true},
            getHistoryHttp: {url: api_path + "history/performance/http", method: 'GET', isArray: true}
        });
    }]);
    overview.factory('AlarmService', ['$resource', function (resource) {
        return resource("", {}, {
            query: {url: api_path + "alarm/event/current", method: 'GET', isArray: false},
            queryCount: {url: api_path + "alarm/event/current/countNum", method: 'GET', isArray: true}
        });
    }]);

    overview.factory('PanelService', function ($resource) {
        return $resource(api_path + "overview/userPanel/:id", {}, {
            query: {method: "GET", isArray: false},
            update: {method: "PUT", isArray: false},
            remove: {method: "DELETE", isArray: false},
            addUserPanels: {method: "POST", url: api_path + "overview/userPanel/add", isArray: false},
            updateUserPanels: {method: "POST", url: api_path + "overview/userPanel/update", isArray: false},
            getUserPanels: {method: 'GET', url: api_path + "overview/userPanel/user", isArray: true},
            getAvailablePanels: {method: 'GET', url: api_path + "overview/panel", isArray: true}
        });
    });
    overview.factory('WorkOrderService', ['$resource', function (resource) {
        return resource("", {}, {
            query: {url: api_path + "itsm/form/group", method: 'GET', isArray: false}
        });
    }]);
    overview.factory('BusinessResourceService', ['$resource', function (resource) {
        return resource("", {}, {
            queryBusinessMo: {url: api_path + "resources/business/mo", method: 'GET', isArray: true}
        });
    }]);
    overview.factory('AssetAlarmService', ['$resource', function (resource) {
        return resource("", {}, {
            queryAbandonAsset: {url: api_path + "asset/alarm/abandon", method: 'GET', isArray: false},
            queryMaintainAsset: {url: api_path + "asset/alarm/maintain", method: 'GET', isArray: false}
        });
    }]);

    overview.directive('alarmChart', function () {
        return {
            restrict: 'E',
            transclude: true,
            template: '<div ui-chart="alarmStatistics.model.alarmData" id="canvasDiv" style="padding-bottom: 10px"></div>',
            replace: true,
            link: function (scope, elem, attrs) {
                var renderChart = function () {
                    var data = scope.$eval(attrs.uiChart);
                    if (!angular.isArray(data) || data.length == 0) {
                        return;
                    }

                    var chart = new iChart.Pie2D({
                        render: 'canvasDiv',
                        data: data,
                        //title : {
                        //	text : 'Mobile-Friendly Distribution',
                        //	height:40,
                        //	fontsize : 30,
                        //	color : '#282828'
                        //},
                        //footnote : {
                        //	text : 'ichartjs.com',
                        //	color : '#486c8f',
                        //	fontsize : 12,
                        //	padding : '0 38'
                        //},
                        sub_option: {
                            mini_label_threshold_angle: 360,//迷你label的阀值,单位:角度
                            mini_label: {//迷你label配置项
                                fontsize: 20,
                                fontweight: 600,
                                color: '#ffffff'
                            },
                            label: {
                                background_color: null,
                                sign: true,//设置禁用label的小图标
                                padding: '0 6',
                                border: {
                                    enable: false,
                                    color: '#000000'
                                },
                                fontsize: 14,
                                fontweight: 800,
                                color: '#000000'
                            },
                            border: {
                                width: 2,
                                color: '#ffffff'
                            },
                            listeners: {
                                parseText: function (d, t) {
                                    return d.get('value') + "";//自定义label文本
                                },
                                click:function(r,e,m){
                                    var level=4;
                                    var text = r.get("name");
                                    if(text=="提示"){
                                        level = 2;
                                    }else if(text=="低级"){
                                        level = 3;
                                    }else if(text=="中级"){
                                        level = 4;
                                    }else if(text=="高级"){
                                        level = 5;
                                    }else if(text=="紧急"){
                                        level = 6;
                                    }
                                    setTimeout(function(){
                                        window.open("#/alarmReal?level=" + level, "_blank");
                                    },200);
                                }
                            }
                        },
                        legend: {
                            enable: true,
                            padding: 0,
                            offsetx: 30,
                            offsety: 0,
                            color: '#3e576f',
                            fontsize: 15,//文本大小
                            sign_size: 15,//小图标大小
                            line_height: 28,//设置行高
                            sign_space: 10,//小图标与文本间距
                            border: false,
                            align: 'left',
                            background_color: null//透明背景
                        },
                        shadow: true,
                        shadow_blur: 6,
                        shadow_color: '#aaaaaa',
                        shadow_offsetx: 0,
                        shadow_offsety: 0,
                        background_color: '#f1f1f1',
                        align: 'right',//右对齐
                        offsetx: -90,//设置向x轴负方向偏移位置60px
                        offset_angle: -90,//逆时针偏移120度
                        width: document.getElementsByClassName("widget-main")[0].clientWidth - 20,
                        height: 460,
                        radius: 115
                    });
                    //利用自定义组件构造右侧说明文本
                    //chart.plugin(new iChart.Custom({
                    //		drawFn:function(){
                    //			//在右侧的位置，渲染说明文字
                    //			chart.target.textAlign('start')
                    //			.textBaseline('top')
                    //			.textFont('600 20px Verdana')
                    //			.fillText('Market Fragmentation:\nTop Mobile\nOperating Systems',120,80,false,'#be5985',false,24)
                    //			.textFont('600 12px Verdana')
                    //			.fillText('Source:ComScore,2012',120,160,false,'#999999');
                    //		}
                    //}));

                    chart.draw();
                };

                scope.$watch(attrs.uiChart, function () {
                    renderChart();
                }, true);
            }
        };
    });

    overview.controller('overviewController', ['$scope', '$rootScope', 'HistoryService', 'Util', 'MocClient', 'LoginService', 'AlarmService', '$timeout', 'ItsmService', 'PanelService', '$location', 'Modal', '$compile', 'MoClient', 'Loading', 'LocationClient','WorkOrderService','BusinessResourceService','AssetAlarmService', function ($scope, $rootScope, History, Util, MocClient, Login, Alarm, $timeout, Itsm, PanelService, $location, Modal, $compile, MoClient, Loading, LocationClient,WorkOrderService,BusinessResourceService,AssetAlarmService) {
        $scope.panelData = {
            postData: [],
            userPanels: {
                leftCol: [],
                rightCol: []
            },
            toAddPanels: [],
            sysPanels: []
        };

        //初始化展示
        PanelService.getUserPanels({}, {}, function (data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].panelColumn == 0) {
                    $scope.panelData.userPanels.leftCol.push(data[i]);
                } else if (data[i].panelColumn == 1) {
                    $scope.panelData.userPanels.rightCol.push(data[i]);
                }
            }
        });

        //设置/保存/删除
        $scope.toggleSetting = function () {
            var settingBtn = $("#setting");
            if (settingBtn.hasClass("setting-off")) {
                settingBtn.removeClass("setting-off");
                $(".settingBtn-div").animate({"width": "103px"}, 300, function () {
                    settingBtn.find("i").addClass("fa-spin");
                });
                $('.sortable-container').sortable("enable");
            } else {
                settingBtn.addClass("setting-off");
                $(".settingBtn-div").animate({"width": "34px"}, 300, function () {
                    settingBtn.find("i").removeClass("fa-spin");
                });
                $('.sortable-container').sortable("disable");
            }
        };
        $scope.savePanels = function () {
            Loading.show();
            $scope.panelData.postData = [];
            $(".left-col .widget-box").each(function (index, obj) {
                var panelId = $(obj).attr("data-panelId");
                var userPanel = {};
                userPanel.panelId = panelId;
                userPanel.panelColumn = 0;
                userPanel.panelRow = index;
                $scope.panelData.postData.push(userPanel);
            });
            $(".right-col .widget-box").each(function (index, obj) {
                var panelId = $(obj).attr("data-panelId");
                var userPanel = {};
                userPanel.panelId = panelId;
                userPanel.panelColumn = 1;
                userPanel.panelRow = index;
                $scope.panelData.postData.push(userPanel);
            });
            PanelService.updateUserPanels({}, $scope.panelData.postData, function (data) {
                Loading.hide();
                $rootScope.$alert("保存成功");
            }, function (error) {
                Loading.hide();
                $rootScope.$alert("保存失败");
            });
        };
        $scope.deletePanel = function (panelId) {
            $("#widget-" + panelId).animate({"height": "hide"}, 300, function () {
                $(this).remove();
            });
        };

        //增加dialog
        $scope.modalSetting = {
            id: "add-modal",
            title: "添加面板",
            saveBtnText: "保存",
            saveBtnHide: false,
            saveDisabled: false,
            save: function () {
                Loading.show();
                PanelService.addUserPanels({panelIds: $scope.panelData.toAddPanels}, {}, function (data) {
                    $scope.addTemplate();
                    Loading.hide();
                    $rootScope.$alert("添加成功");
                    Modal.hide($scope.modalSetting.id);
                }, function (error) {
                    Loading.hide();
                    $rootScope.$alert("添加失败");
                });
            }
        };

        $scope.addTemplate = function () {
            var addPanelResult = [];
            for (var i = 0; i < $scope.panelData.toAddPanels.length; i++) {
                for (var j = 0; j < $scope.panelData.sysPanels.length; j++) {
                    if ($scope.panelData.sysPanels[j].id == $scope.panelData.toAddPanels[i]) {
                        addPanelResult.push($scope.panelData.sysPanels[j]);
                    }
                }
            }

            var pos = 0;
            for (var i = 0; i < addPanelResult.length; i++) {
                var obj = addPanelResult[i];
                var html = '<widget-box id="' + "widget-" + obj.id + '"' + ' data-panelId="' + obj.id + '">' +
                    '<div ng-include src="' + '\'' + obj.url + '\'' + '"></div>' +
                    '</widget-box>';

                var template = angular.element(html);
                $compile(template)($scope);

                if (pos == 0) {
                    $(".left-col").append(template);
                    pos = 1;
                } else if (pos == 1) {
                    $(".right-col").append(template);
                    pos = 0;
                }
            }
        };

        $scope.showAddDialog = function () {
            PanelService.getAvailablePanels({}, {}, function (data) {
                $scope.panelData.sysPanels = data;
                Modal.show($scope.modalSetting.id);
            });
        };


// 模板内容
        //资产报废提醒
        $scope.abandonAssetGrid = {
            search:{},
            settings : {
                reload: null,
                pageSize : 10,
                getData:function(search,fnCallback){
                    $scope.abandonAssetGrid.search.limit = search.limit;
                    $scope.abandonAssetGrid.search.offset = search.offset;
                    $scope.abandonAssetGrid.search.orderBy = search.orderBy;
                    $scope.abandonAssetGrid.search.orderByType = search.orderByType;
                    AssetAlarmService.queryAbandonAsset($scope.abandonAssetGrid.search, function (data) {
                        fnCallback(data);
                    });
                }, //getData应指定获取数据的函数
                columns : [
                    {
                        sTitle: "编号",
                        mData:"serial",
                        mRender:function(mData,type,full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {
                        sTitle: "名称",
                        mData:"name",
                        mRender:function(mData,type,full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {
                        sTitle: "报废日期",
                        mData:"abandonDate",
                        mRender:function(mData,type,full) {
                            if(mData){
                                var d=new Date(mData);
                                return d.pattern("yyyy-MM-dd");
                            }else return "";
                        }
                    },
                    {
                        sTitle: "倒计时（天）",
                        mData:"leftDays",
                        mRender:function(mData,type,full) {
                            if(mData<0){
                                return "过期"+(-mData)+"天";
                            }else{
                                return Util.str2Html(mData+"");
                            }
                        }
                    },
                    {
                        sTitle: "优先级",
                        mData:"leftDays",
                        mRender:function(mData,type,full) {
                            if(mData<10){
                                return "<img src='img/asset/3.png'>";
                            }else if(mData >= 10 && mData<30){
                                return "<img src='img/asset/2.png'>";
                            }else if(mData >= 30 && mData<60){
                                return "<img src='img/asset/1.png'>";
                            }
                        }
                    }
                ] ,
                columnDefs : [
                    { bSortable: false,aTargets:[0,1,2,4]},//列不可排序
                    { sWidth: "80px", aTargets: [4]}
                ] , //定义列的约束
                defaultOrderBy :[]  //定义默认排序为第3列倒序
            }
        };

        //资产维保提醒
        $scope.maintainAssetGrid = {
            search:{},
            settings : {
                reload: null,
                pageSize : 10,
                getData:function(search,fnCallback){
                    $scope.maintainAssetGrid.search.limit = search.limit;
                    $scope.maintainAssetGrid.search.offset = search.offset;
                    $scope.maintainAssetGrid.search.orderBy = search.orderBy;
                    $scope.maintainAssetGrid.search.orderByType = search.orderByType;
                    AssetAlarmService.queryMaintainAsset($scope.maintainAssetGrid.search, function (data) {
                        fnCallback(data);
                    });
                }, //getData应指定获取数据的函数
                columns : [
                    {
                        sTitle: "编号",
                        mData:"serial",
                        mRender:function(mData,type,full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {
                        sTitle: "名称",
                        mData:"name",
                        mRender:function(mData,type,full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {
                        sTitle: "维保开始日期",
                        mData:"maintainStartDate",
                        mRender:function(mData,type,full) {
                            if(mData){
                                var d=new Date(mData);
                                return d.pattern("yyyy-MM-dd");
                            }else return "";
                        }
                    },
                    {
                        sTitle: "倒计时（天）",
                        mData:"leftDays",
                        mRender:function(mData,type,full) {
                            if(mData<0){
                                return "过期"+(-mData)+"天";
                            }else{
                                return Util.str2Html(mData+"");
                            }
                        }
                    },
                    {
                        sTitle: "优先级",
                        mData:"leftDays",
                        mRender:function(mData,type,full) {
                            if(mData<10){
                                return "<img src='img/asset/3.png'>";
                            }else if(mData >= 10 && mData<30){
                                return "<img src='img/asset/2.png'>";
                            }else if(mData >= 30 && mData<60){
                                return "<img src='img/asset/1.png'>";
                            }
                        }
                    }
                ] ,
                columnDefs : [
                    { bSortable: false,aTargets:[0,1,2,4]},//列不可排序
                    { sWidth: "80px", aTargets: [4]}
                ] , //定义列的约束
                defaultOrderBy :[]  //定义默认排序为第3列倒序
            }
        };

        //主机，网络
        var colorBarRender = function (mData, type, full, indicator) {
            var processor = "";
            if (mData == null || mData == "" || mData == "--" || mData == "-1") {
                processor = '<div class="gray" style="width:' + 100 + '%;"></div>';
                var html = '<div class="bar-label">' + "" + '</div>' + '<div class="bar-wrap"><div class="Bar" style="margin-top: -15px;">' + processor + '</div></div>';
                return html;
            } else {
                mData = parseFloat(mData).toFixed(2)
            }

            if (indicator == "CPU") {
                if (full.cpuReverse) {   //反转
                    if (mData < full.cpuPoint1) {
                        processor = '<div class="red" style="width:' + mData + '%;"></div>';
                    } else if ((mData == full.cpuPoint1 || mData > full.cpuPoint1) && (mData == full.cpuPoint2 || mData < full.cpuPoint2)) {
                        processor = '<div class="yellow" style="width:' + mData + '%;"></div>';
                    } else if (mData > full.cpuPoint2) {
                        processor = '<div class="green" style="width:' + mData + '%;"></div>';
                    }
                } else {
                    if (mData < full.cpuPoint1) {
                        processor = '<div class="green" style="width:' + mData + '%;"></div>';
                    } else if ((mData == full.cpuPoint1 || mData > full.cpuPoint1) && (mData == full.cpuPoint2 || mData < full.cpuPoint2)) {
                        processor = '<div class="yellow" style="width:' + mData + '%;"></div>';
                    } else if (mData > full.cpuPoint2) {
                        processor = '<div class="red" style="width:' + mData + '%;"></div>';
                    }
                }
            } else if (indicator == "MEM") {
                if (full.memReverse) {   //反转
                    if (mData < full.memPoint1) {
                        processor = '<div class="red" style="width:' + mData + '%;"></div>';
                    } else if ((mData == full.memPoint1 || mData > full.memPoint1) && (mData == full.memPoint2 || mData < full.memPoint2)) {
                        processor = '<div class="yellow" style="width:' + mData + '%;"></div>';
                    } else if (mData > full.memPoint2) {
                        processor = '<div class="green" style="width:' + mData + '%;"></div>';
                    }
                } else {
                    if (mData < full.memPoint1) {
                        processor = '<div class="green" style="width:' + mData + '%;"></div>';
                    } else if ((mData == full.memPoint1 || mData > full.memPoint1) && (mData == full.memPoint2 || mData < full.memPoint2)) {
                        processor = '<div class="yellow" style="width:' + mData + '%;"></div>';
                    } else if (mData > full.memPoint2) {
                        processor = '<div class="red" style="width:' + mData + '%;"></div>';
                    }
                }
            } else if (indicator == "HEALTH") {
                if (full.healthReverse) {   //反转
                    if (mData < full.healthPoint1) {
                        processor = '<div class="red" style="width:' + mData + '%;"></div>';
                    } else if ((mData == full.healthPoint1 || mData > full.healthPoint1) && (mData == full.healthPoint2 || mData < full.healthPoint2)) {
                        processor = '<div class="yellow" style="width:' + mData + '%;"></div>';
                    } else if (mData > full.healthPoint2) {
                        processor = '<div class="green" style="width:' + mData + '%;"></div>';
                    }
                } else {
                    if (mData < full.healthPoint1) {
                        processor = '<div class="green" style="width:' + mData + '%;"></div>';
                    } else if ((mData == full.healthPoint1 || mData > full.healthPoint1) && (mData == full.healthPoint2 || mData < full.healthPoint2)) {
                        processor = '<div class="yellow" style="width:' + mData + '%;"></div>';
                    } else if (mData > full.healthPoint2) {
                        processor = '<div class="red" style="width:' + mData + '%;"></div>';
                    }
                }
            } else if (indicator == "AVAILABILITY") {
                if (full.availabilityReverse) {   //反转
                    if (mData < full.availabilityPoint1) {
                        processor = '<div class="red" style="width:' + mData + '%;"></div>';
                    } else if ((mData == full.availabilityPoint1 || mData > full.availabilityPoint1) && (mData == full.availabilityPoint2 || mData < full.availabilityPoint2)) {
                        processor = '<div class="yellow" style="width:' + mData + '%;"></div>';
                    } else if (mData > full.availabilityPoint2) {
                        processor = '<div class="green" style="width:' + mData + '%;"></div>';
                    }
                } else {
                    if (mData < full.availabilityPoint1) {
                        processor = '<div class="green" style="width:' + mData + '%;"></div>';
                    } else if ((mData == full.availabilityPoint1 || mData > full.availabilityPoint1) && (mData == full.availabilityPoint2 || mData < full.availabilityPoint2)) {
                        processor = '<div class="yellow" style="width:' + mData + '%;"></div>';
                    } else if (mData > full.availabilityPoint2) {
                        processor = '<div class="red" style="width:' + mData + '%;"></div>';
                    }
                }
            }

            var html = '<div class="bar-label">' + mData + '</div>' + '<div class="bar-wrap"><div class="Bar">' + processor + '</div></div>';

            return html;
        };

        var onOffRender = function (mData, type, full) {
            if (mData == true) {
                return html = '<i title="正常" class="fa fa-check-circle status-icon statusOn"></i>';
            } else if (mData == false) {
                return html = '<i title="不可达" class="fa fa-minus-circle status-icon statusOff"></i>';
            } else {
                return html = '<i title="未取到值" class="fa fa-circle status-icon statuNull"></i>';
            }
        };

        $scope.openDashboard = function (id, mocpName, mocName) {
            $rootScope.openWindows.push(window.open("views/dashboard/dashboard.html?type=" + mocpName + "&moc_name=" + mocName + "&mo_id=" + id + "#/" + mocName, "_blank"));
        };

        //主机负载top10
        $scope.hostGrid = {
            search: {limit: 10, offset: 0, mocp_name: "host", orderBy: "value", orderByType: "desc", indicator_name1: "CPU", metric_name1: "Usage", indicator_name2: "MEM", metric_name2: "UsedUsage", main_indicator: "CPU"},
            settings: {
                paging: false,
                reload: null,
                getData: function (search, fnCallback) {
                    if (search.orderBy == "cpuValue") {
                        $scope.hostGrid.search.main_indicator = "CPU";
                        $scope.hostGrid.search.indicator_name1 = "CPU";
                        $scope.hostGrid.search.metric_name1 = "Usage";
                        $scope.hostGrid.search.indicator_name2 = "MEM";
                        $scope.hostGrid.search.metric_name2 = "UsedUsage";
                    } else if (search.orderBy == "memValue") {
                        $scope.hostGrid.search.main_indicator = "MEM";
                        $scope.hostGrid.search.indicator_name1 = "MEM";
                        $scope.hostGrid.search.metric_name1 = "UsedUsage";
                        $scope.hostGrid.search.indicator_name2 = "CPU";
                        $scope.hostGrid.search.metric_name2 = "Usage";
                    }
                    $scope.hostGrid.search.orderByType = search.orderByType;

                    History.getHistoryWithColor($scope.hostGrid.search, function (rows) {
                        var data = {};
                        data.rows = rows;
                        data.total = 10;
                        fnCallback(data);
                    });
                },
                columns: [
                    {sTitle: "资源名称", mData: "moName",
                        mRender: function (mData, type, full) {
                            return '<a href="javascript:void(0)" title="' + mData + '" class="active" ng-click="openDashboard(' + full.moId + ',\'' + "host" + '\',\'' + full.mocName + '\')">' + mData + '</a>';
                        }
                    },
                    {sTitle: "资源类型", mData: "mocDisplayName",
                        mRender: function (mData, type, full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {sTitle: "管理IP", mData: "moIp",
                        mRender: function (mData, type, full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {sTitle: "CPU利用率(%)",
                        mData: "cpuValue",
                        mRender: function (mData, type, full) {
                            return colorBarRender(mData, type, full, "CPU");
                        }
                    },
                    {sTitle: "MEM使用率(%)",
                        mData: "memValue",
                        mRender: function (mData, type, full) {
                            return colorBarRender(mData, type, full, "MEM");
                        }
                    },
                    {sTitle: "通断状态",
                        mData: "onOff",
                        mRender: function (mData, type, full) {
                            return onOffRender(mData, type, full);
                        }
                    }
                ],
                columnDefs: [
                    { bSortable: false, aTargets: [ 0, 1 , 2, 5] },
                    { sWidth: "25%", aTargets: [ 3 ] },
                    { sWidth: "25%", aTargets: [ 4 ] }
                ],
                defaultOrderBy: []
            },
            refresh: function(){
                if ($scope.hostGrid.settings.reload != null){
                    $scope.hostGrid.settings.reload(false);
                }
                $timeout($scope.hostGrid.refresh, 300000);
            }
        };
        $timeout(function(){
            $scope.hostGrid.refresh();
        },500);

        //网络负载top10
        $scope.nwGrid = {
            search: {limit: 10, offset: 0, mocp_name: "network", orderBy: "value", orderByType: "desc", indicator_name1: "CPU", metric_name1: "Usage", indicator_name2: "MEM", metric_name2: "Usage", main_indicator: "CPU"},
            settings: {
                paging: false,
                reload: null,
                getData: function (search, fnCallback) {
                    if (search.orderBy == "cpuValue") {
                        $scope.nwGrid.search.main_indicator = "CPU";
                        $scope.nwGrid.search.indicator_name1 = "CPU";
                        $scope.nwGrid.search.metric_name1 = "Usage";
                        $scope.nwGrid.search.indicator_name2 = "MEM";
                        $scope.nwGrid.search.metric_name2 = "Usage";
                    } else if (search.orderBy == "memValue") {
                        $scope.nwGrid.search.main_indicator = "MEM";
                        $scope.nwGrid.search.indicator_name1 = "MEM";
                        $scope.nwGrid.search.metric_name1 = "Usage";
                        $scope.nwGrid.search.indicator_name2 = "CPU";
                        $scope.nwGrid.search.metric_name2 = "Usage";
                    }
                    $scope.nwGrid.search.orderByType = search.orderByType;

                    History.getHistoryWithColor($scope.nwGrid.search, function (rows) {
                        var data = {};
                        data.rows = rows;
                        data.total = 10;
                        fnCallback(data);
                    });
                },
                columns: [
                    {sTitle: "资源名称", mData: "moName",
                        mRender: function (mData, type, full) {
                            return '<a href="javascript:void(0)" title="' + mData + '" class="active" ng-click="openDashboard(' + full.moId + ',\'' + "network" + '\',\'' + full.mocName + '\')">' + mData + '</a>';
                        }
                    },
                    {sTitle: "资源类型", mData: "mocDisplayName",
                        mRender: function (mData, type, full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {sTitle: "管理IP", mData: "moIp",
                        mRender: function (mData, type, full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {sTitle: "CPU利用率(%)",
                        mData: "cpuValue",
                        mRender: function (mData, type, full) {
                            return colorBarRender(mData, type, full, "CPU");
                        }
                    },
                    {sTitle: "MEM使用率(%)",
                        mData: "memValue",
                        mRender: function (mData, type, full) {
                            return colorBarRender(mData, type, full, "MEM");
                        }
                    },
                    {sTitle: "通断状态",
                        mData: "onOff",
                        mRender: function (mData, type, full) {
                            return onOffRender(mData, type, full);
                        }
                    }
                ],
                columnDefs: [
                    { bSortable: false, aTargets: [ 0, 1 , 2, 5] },
                    { sWidth: "25%", aTargets: [ 3 ] },
                    { sWidth: "25%", aTargets: [ 4 ] }
                ],
                defaultOrderBy: []
            },
            refresh: function(){
                if ($scope.nwGrid.settings.reload != null){
                    $scope.nwGrid.settings.reload(false);
                }
                $timeout($scope.nwGrid.refresh, 300000);
            }
        };
        $timeout(function(){
            $scope.nwGrid.refresh();
        },500);

        //线路流量top10
        $scope.lineflowGrid = {
            search: {limit: 10, offset: 0, mocp_name: "host,network", orderBy: "value", orderByType: "desc", indicator_name: "NIO,Interface", in_metric_name: "RX,InOctets", out_metric_name: "TX,OutOctets", sort_col: "inFlow"},
            settings: {
                paging: false,
                reload: null,
                getData: function (search, fnCallback) {
                    //host: NIO: RX,TX
                    //network, storage: Interface: InOctets, OutOctets
                    if (search.orderBy == "inFlow") {
                        $scope.lineflowGrid.search.sort_col = "inFlow";
                    } else if (search.orderBy == "outFlow") {
                        $scope.lineflowGrid.search.sort_col = "outFlow";
                    }
                    $scope.lineflowGrid.search.orderByType = search.orderByType;

                    //默认为按进流量排序
                    History.getHistoryLineFlow($scope.lineflowGrid.search, function (rows) {
                        var data = {};
                        data.rows = rows;
                        data.total = 10;
                        fnCallback(data);
                    });
                },
                columns: [
                    {sTitle: "上联设备", mData: "leftDisplayName",
                        mRender: function (mData, type, full) {
                            return '<a href="javascript:void(0)" title="' + mData + '" class="active" ng-click="openDashboard(' + full.leftMoId + ',\'' + full.leftMocpName + '\',\'' + full.leftMocName + '\')">' + mData + '</a>';
                        }
//                    mRender:function(mData,type,full) {
//                        return Util.str2Html(mData);
//                    }
                    },
                    {sTitle: "上联端口", mData: "leftPort",
                        mRender: function (mData, type, full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {sTitle: "下联设备", mData: "rightDisplayName",
                        mRender: function (mData, type, full) {
                            return '<a href="javascript:void(0)" title="' + mData + '" class="active" ng-click="openDashboard(' + full.rightMoId + ',\'' + full.rightMocpName + '\',\'' + full.rightMocName + '\')">' + mData + '</a>';
                        }
//                    mRender:function(mData,type,full) {
//                        return Util.str2Html(mData);
//                    }
                    },
                    {sTitle: "下联端口", mData: "rightPort",
                        mRender: function (mData, type, full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {sTitle: "入流量(KBIT/S)", mData: "inFlow"},
                    {sTitle: "出流量(KBIT/S)", mData: "outFlow"}
                ],
                columnDefs: [
                    { bSortable: false, aTargets: [ 0, 1 , 2, 3] }
                ],
                defaultOrderBy: []
            },
            refresh: function(){
                if ($scope.lineflowGrid.settings.reload != null){
                    $scope.lineflowGrid.settings.reload(false);
                }
                $timeout($scope.lineflowGrid.refresh, 300000);
            }
        };
        $timeout(function(){
            $scope.lineflowGrid.refresh();
        },500);


        //http响应时间
        $scope.httpGrid = {
            search: {mocp_name: "service", moc_name: "http", orderByType: "desc", indicator_name: "Response", metric_name: "Time"},
            settings: {
                paging: false,
                reload: null,
                getData: function (search, fnCallback) {
                    $scope.httpGrid.search.orderByType = search.orderByType;
                    History.getHistoryHttp($scope.httpGrid.search, function (rows) {
                        var data = {};
                        var realrows=[];
                        if(rows.length>10){
                            for(var i=0;i<10;i++){
                                realrows.push(rows[i]);
                            }
                            data.rows=realrows;
                        }else{
                            data.rows = rows;
                        }

                        data.total = 10;
                        fnCallback(data);
                    });
                },
                columns: [
                    {sTitle: "资源实例", mData: "moName",
                        mRender: function (mData, type, full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {sTitle: "通断状态",
                        mData: "onOff",
                        mRender: function (mData, type, full) {
                            return onOffRender(mData, type, full);
                        }
                    },
                    {sTitle: "响应时间(MS)", mData: "timeValue",
                        mRender: function (mData, type, full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {sTitle: "所属业务", mData: "business",
                        mRender: function (mData, type, full) {
                            return Util.str2Html(mData);
                        }
                    }
                ],
                columnDefs: [
                    { bSortable: false, aTargets: [ 0, 1 , 3] }
                ],
                defaultOrderBy: []
            },
            refresh: function(){
                if ($scope.httpGrid.settings.reload != null){
                    $scope.httpGrid.settings.reload(false);
                }
                $timeout($scope.httpGrid.refresh, 300000);
            }
        };
        $timeout(function(){
            $scope.httpGrid.refresh();
        },500);

        //业务统计
        $scope.businessGrid = {
            search: {limit: 150, offset: 120, orderBy: "value", orderByType: "desc"},
            settings: {
                paging: false,
                reload: null,
                getData: function (search, fnCallback) {
                    $scope.businessGrid.search.orderByType = search.orderByType;
                    $scope.businessGrid.search.orderBy = search.orderBy;
                    BusinessResourceService.queryBusinessMo($scope.businessGrid.search, {}, function (rows) {
                        var data = {};
                        data.rows = rows;
                        data.total = rows.length;
                        fnCallback(data);
                    });

                },
                columns: [
                    {sTitle: "业务系统名称", mData: "moName",
                        mRender: function (mData, type, full) {
                            return Util.str2Html(mData);
                        }
                    },
                    {sTitle: "健康度(%)",
                        mData: "healthValue",
                        mRender: function (mData, type, full) {
                            return colorBarRender(mData, type, full, "HEALTH");
                        }
                    },
                    {sTitle: "通断状态",
                        mData: "onOff",
                        mRender: function (mData, type, full) {
                            return onOffRender(mData, type, full);
                        }
                    },
                    {sTitle: "可用率(%)",
                        mData: "availabilityValue",
                        mRender: function (mData, type, full) {
                            return colorBarRender(mData, type, full, "AVAILABILITY");
                        }
                    },
                    {sTitle: "告警数量", mData: "alarmCount",
                        mRender: function (mData, type, full) {
                            return mData;
                        }
                    }
                ],
                columnDefs: [
                    { bSortable: false, aTargets: [ 0, 2 , 4] },
                    { sWidth: "25%", aTargets: [ 1 ] },
                    { sWidth: "25%", aTargets: [ 3 ] }
                ],
                defaultOrderBy: []
            },
            refresh: function(){
                if ($scope.businessGrid.settings.reload != null){
                    //console.log("reload" + new Date().toLocaleString());
                    $scope.businessGrid.settings.reload(false);
                }
                //console.log("reload更新" + new Date().toLocaleString());
                $timeout($scope.businessGrid.refresh, 300000);
            }
        };
        $timeout(function(){
            //console.log("触发reload更新" + new Date().toLocaleString());
            $scope.businessGrid.refresh();
        },500);

        //实时告警统计
        $scope.alarmChartOpts = {};
        var promiseAlarm;
        $scope.alarmStatistics = {
            model: {
                alarmData:[]
            },
            init: function (){
                //$scope.alarmStatistics.model.alarmData = [];
                Alarm.queryCount({}, {}, function (data) {
                    $scope.alarmStatistics.model.alarmData = [
                        {name: '提示', value: data[0].total, color: '#99cc66'},
                        {name: '低级', value: data[1].total, color: '#099ccc'},
                        {name: '中级', value: data[2].total, color: '#f8c63d'},
                        {name: '高级', value: data[3].total, color: '#ff9133'},
                        {name: '紧急', value: data[4].total, color: '#de4e43'}
                    ];
                });
                promiseAlarm = $timeout($scope.alarmStatistics.init, 300000);
            }
        };
        $scope.alarmStatistics.init();

        //机房动环设备统计
        $scope.roomChart = {
            config: {
                options: {
                    exporting: {
                        // 是否允许导出
                        enabled: false
                    },
                    chart: {
                        type: 'bar',
                        height: 500
                    },
                    plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true
                            }
                        },
                        column: {
                            colorByPoint: true,
                            events: {
                                click: function (event) {
                                }
                            }
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        enabled: false
                    }
                },

                title: {
                    text: ''
                },
                xAxis: {
                    categories: [],
                    labels: {
                        rotation: 0,
                        style: {
                            fontSize: 12
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '资源数(个)'
                    }
                },
                legend: {
                    enabled: false
                },
                series: [
                    {
                        data: []
                    }
                ]
            }
        };
        var promiseRoom;
        $scope.room = {
            initRoomCountData: function () {
                var colorArr = ['#00BFFF','#8bbc22', '#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1', '#FFFAFA', '#560f23', '#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE', '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92'];
                $scope.roomChart.config.xAxis.categories = [];
                $scope.roomChart.config.series = [];
                var n = 0;
                var countNumbers = [];
                MoClient.countJFAll({}, {}, function (data) {
                    for (var key in data) {
                        if (key.indexOf("$") == -1){
                            $scope.roomChart.config.xAxis.categories.push(key);
                            countNumbers.push({y: data[key], color: colorArr[0]});
                            if (data[key] > 0){
                                n = data[key];
                            }
                        }
                    }
                    if (n == 0){
                        $scope.roomChart.config.yAxis.max = 100;
                    }
                    $scope.roomChart.config.series.push({"data": countNumbers});
                });
                //console.log("promiseWorkOrder更新" + new Date().toLocaleString());
                promiseRoom = $timeout($scope.room.initRoomCountData, 300000);
            }
        };
        $scope.room.initRoomCountData();

        //我的任务工单面板
        $scope.workOrderChart = {
            config: {
                options: {
                    exporting: {
                        // 是否允许导出
                        enabled: false
                    },
                    chart: {
                        type: 'column'//,
//                        height: 520//,
//                        margin: 75,
//                        options3d: {
//                            enabled: true,
//                            alpha: 10,
//                            beta: 25,
//                            depth: 70
//                        }
                    },
                    plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true
                            }
                        },
                        column: {
//                            depth: 25,
                            colorByPoint: true,
                            events: {
                                click: function (event) {
                                    for (var i = 0; i < $scope.workOrder.model.workType.length; i++) {
                                        if ($scope.workOrder.model.workType[i].name == event.point.category) {
                                            window.location.href = 'index.html#/queryMyTask?childId=' + $scope.workOrder.model.workType[i].value + '&parentId=' + $scope.workOrder.model.workType[i].value.toString().substring(0, 1);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        enabled: false
                    }
                },

                title: {
                    text: ''
                },
                xAxis: {
                    categories: []//,
//                    labels: {
//                        rotation: -30,
//                        style: {
//                            fontSize: 12,
//                            fontWeight: 'normal'
//                        }
//                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '工单数(个)'
                    }
                },
                legend: {
                    enabled: false
                },
                series: [
                    {
                        data: []
                    }
                ]
            }
        };
        var promiseWorkOrder;
        $scope.workOrder = {
            model: {
                workType: [
                    {name: '故障工单-待签', value: 11},
                    {name: '故障工单-待办', value: 12},
                    {name: '问题工单-待签', value: 21},
                    {name: '问题工单-待办', value: 22},
                    {name: '变更工单-待签', value: 31},
                    {name: '变更工单-待办', value: 32}
                ]
            },
            initWorkOrderCountData: function () {
                $scope.workOrderChart.config.xAxis.categories = [];
                $scope.workOrderChart.config.series = [];
                WorkOrderService.query({flow:"incident,problem,change,knowledge"}, {}, function (data) {
                    var countNumbers = [];
                    var n = 0;
                    for (var i = 0; i < $scope.workOrder.model.workType.length; i++) {
                        $scope.workOrderChart.config.xAxis.categories.push($scope.workOrder.model.workType[i].name);
                        for (var key in data) {
                            if (key == $scope.workOrder.model.workType[i].value) {
                                countNumbers.push(data[key]);
                                if (data[key] > 0){
                                    n = data[key];
                                }
                            }
                        }
                    }
                    if (n == 0){
                        $scope.workOrderChart.config.yAxis.max = 100;
                    }
                    $scope.workOrderChart.config.series.push({"data": countNumbers});
                });
                //console.log("promiseWorkOrder更新" + new Date().toLocaleString());
                promiseWorkOrder = $timeout($scope.workOrder.initWorkOrderCountData, 300000);
            }
        };
        $scope.workOrder.initWorkOrderCountData();

        //  资源统计
        var promiseResourceCountByMocp;
        var promiseResourceCountByLocation;
        var promiseResourceCountByBusiness;
        $scope.resource = {
            ready: false,
            moc: [],
            locations: [],
            locationList: [],
            businesses: [],
            getMoc: function (mocId) {
                for (var i = 0; i < $scope.resource.moc.length; i++) {
                    if ($scope.resource.moc[i].id == mocId) {
                        return $scope.resource.moc[i];
                    }
                    for (var j = 0; j < $scope.resource.moc[i].children.length; j++) {
                        if ($scope.resource.moc[i].children[j].id == mocId) {
                            return $scope.resource.moc[i].children[j];
                        }
                    }
                }
                return null;
            },
            getLoc: function (locations, locId) {
                for (var i = 0; i < locations.length; i++) {
                    if (locations[i].id == locId) {
                        return locations[i];
                    }
                    if (locations[i].children) {
                        var result = $scope.resource.getLoc(locations[i].children, locId);
                        if (result != null) {
                            return result;
                        }
                    }
                }
                return null;
            },
            fillLocList: function (locations, list) {
                for (var i = 0; i < locations.length; i++) {
                    list.push(locations[i]);
                    if (locations[i].children && locations[i].children.length > 0) {
                        $rootScope.resource.fillLocList(locations[i].children, list);
                    }
                }
            },
            initResourceCountData: function () {
                MocClient.query(function (data) {
                        $scope.resource.moc = data;
                    },
                    function () {
                        //   alert("读取资源类型基础信息失败,请刷新重试");
                    }
                );
                LocationClient.queryAll(function (data) {
                    $scope.resource.locations = data;
                    $scope.resource.fillLocList(data, $scope.resource.locationList);
                });
                MoClient.query({mocpName: 'application'}, {}, function (data) {
                        $scope.resource.businesses = data.rows;
                    },
                    function () {
//                    alert("读取资源类型基础信息失败,请刷新重试");
                    }
                );
            },
            byMocpRefresh: function () {
                MoClient.countAll({"countBy": "mocp"}, {}, function (data) {
                    $scope.typeChart.config.xAxis.categories = [];
                    $scope.typeChart.config.series = [];
                    var countNumbers = [];
                    for (var key in data) {
                        var moc = $scope.resource.getMoc(Number(key));
                        if (moc) {
                            $scope.typeChart.config.xAxis.categories.push(moc.displayName);
                            countNumbers.push(data[key]);
                        }
                    }
                    $scope.typeChart.config.series.push({"data": countNumbers});
                });
                promiseResourceCountByMocp = $timeout($scope.resource.byMocpRefresh, 300000);
            },
            byLocationRefresh: function () {
                MoClient.countAll({"countBy": "locationPartMo"}, {}, function (data) {
                    var colorArr = ['#8bbc22', '#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1', '#FFFAFA', '#560f23', '#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE', '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92'];
                    $scope.locationChart.config.xAxis.categories = [];
                    $scope.locationChart.config.series = [];
                    var countNumbers = [];
                    var z = 0,n = 0,
                        len = $scope.resource.locations[0].children.length,
                        h, d;
                    for (; z < len; z++) {
                        for (h = 0; h < len; h++) {
                            if ($scope.resource.locations[0].children[z].orderBy < $scope.resource.locations[0].children[h].orderBy) {
                                d = $scope.resource.locations[0].children[h];
                                $scope.resource.locations[0].children[h] = $scope.resource.locations[0].children[z];
                                $scope.resource.locations[0].children[z] = d;
                            }
                        }
                    }
                    for (var i = 0; i < $scope.resource.locations[0].children.length; i++){
                        $scope.locationChart.config.xAxis.categories.push($scope.resource.locations[0].children[i].name);
                        var empty = true;
                        for (var key in data) {
                            if (key == $scope.resource.locations[0].children[i].id){
                                countNumbers.push({y: data[key], color: colorArr[0]});
                                empty = false;
                                n++;
                            }
                        }
                        if (empty){
                            countNumbers.push({y: 0, color: colorArr[0]});
                        }
                    }
                    for (var key in data) {
                        if (key == "-1") {
                            $scope.locationChart.config.xAxis.categories.push("未设置");
                            countNumbers.push({y: data[key], color: colorArr[0]});
                            n++;
                        }
                    }
                    if (n == 0){
                        $scope.locationChart.config.yAxis.max = 1000;
                    }
                    $scope.locationChart.config.series.push({"data": countNumbers});
                });
                promiseResourceCountByLocation = $timeout($scope.resource.byLocationRefresh, 300000);
            },
            byBusinessRefresh: function () {
                MoClient.countAll({"countBy": "business"}, {}, function (data) {
                    $scope.businessChart.config.xAxis.categories = [];
                    $scope.businessChart.config.series = [];
                    var countNumbers = [];
                    for (var key in data) {
                        if (key == "-1") {
                            $scope.businessChart.config.xAxis.categories.push("未设置业务");
                            countNumbers.push({"name": key, "y": data[key]});
                        } else {
                            for (var i = 0; i < $scope.resource.businesses.length; i++) {
                                if ($scope.resource.businesses[i].id == Number(key)) {
                                    $scope.businessChart.config.xAxis.categories.push($scope.resource.businesses[i].displayName);
                                    countNumbers.push({"name": key, "y": data[key]});
                                    break;
                                }
                            }
                        }
                    }
                    $scope.businessChart.config.series.push({"data": countNumbers});
                });
                promiseResourceCountByBusiness = $timeout($scope.resource.byBusinessRefresh, 300000);
            }
        };
        $scope.resource.initResourceCountData();

        //按类型统计
        $scope.typeChart = {
            config: {
                options: {
                    exporting: {
                        // 是否允许导出
                        enabled: false
                    },
                    chart: {
                        type: 'column'
                    },
                    plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true
                            }
                        },
                        column: {
//                    color:"red",
                            colorByPoint: true,
                            events: {
                                click: function (event) {
                                    for (var i = 0; i < $scope.resource.moc.length; i++) {
                                        if ($scope.resource.moc[i].displayName == event.point.category) {
                                            window.location.href = 'index.html#/sourceInstance?mocpId=' + $scope.resource.moc[i].id;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        enabled: false
                    }
                },

                title: {
                    text: ''
                },
                xAxis: {
                    categories: []
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '资源数(个)'
                    }
                },
                legend: {
                    enabled: false
                },
                series: [
                    {
                        data: []
                    }
                ]
            }
        };

        //按地域统计
        $scope.locationChart = {
            config: {
                options: {
                    exporting: {
                        // 是否允许导出
                        enabled: false
                    },
                    chart: {
                        type: 'bar',
                        height: 500
                    },
                    plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true
                            }
                        },
                        column: {
                            colorByPoint: true,
                            events: {
                                click: function (event) {
                                }
                            }
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        enabled: false
                    }
                },

                title: {
                    text: ''
                },
                xAxis: {
                    categories: [],
                    labels: {
                        rotation: 0,
                        style: {
                            fontSize: 12
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '资源数(个)'
                    }
                },
                legend: {
                    enabled: false
                },
                series: [
                    {
                        data: []
                    }
                ]
            }
        };

        //按业务统计
        $scope.businessChart = {
            config: {
                options: {
                    exporting: {
                        // 是否允许导出
                        enabled: false
                    },
                    chart: {
                        type: 'column'
                    },
                    plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true
                            }
                        },
                        column: {
                            colorByPoint: true,
                            events: {
                                click: function (event) {
                                    window.location.href = 'index.html#/sourceInstance?businessId=' + event.point.name;
                                }
                            }
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        enabled: false
                    }
                },

                title: {
                    text: '按业务统计资源实例'
                },
                xAxis: {
                    categories: []
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '资源数(个)'
                    }
                },
                legend: {
                    enabled: false
                },
                series: [
                    {
                        data: []
                    }
                ]
            }
        };

        Util.delay("resource.ready", function () {
            $scope.resource.byMocpRefresh();
            $scope.resource.byLocationRefresh();
            $scope.resource.byBusinessRefresh();
        }, $scope);

        $scope.$watch("[resource.moc.length,resource.locations.length,resource.businesses.length]", function (newValues, oldValues) {
            if (newValues[0] && newValues[1] && newValues[2] != null) {
                $scope.resource.ready = true;
            }
        }, true)

        //拖动
        $('.sortable-container').sortable({
            connectWith: ".sortable-container",
            forceHelperSize: true,
            revert: true,       //飘回原位
            dropOnEmpty: true,  //是否允许拖到空对象中
            opacity: 0.8,  //拖动时透明度
            tolerance: "intersect"  //超过50%时排序生效
            //handle: ".widget-header"   //定义手柄
            //cancel: ".widget-header"   //取消手柄
        });
        $('.sortable-container').sortable("disable");

        <!-- 跳转页面定时关闭 开始 -->
        $scope.$on('$locationChangeStart', function () {
            $timeout.cancel(promiseWorkOrder);
            $timeout.cancel(promiseResourceCountByMocp);
            $timeout.cancel(promiseResourceCountByLocation);
            $timeout.cancel(promiseResourceCountByBusiness);
            $timeout.cancel(promiseAlarm);
            $timeout.cancel(promiseRoom);
        });
    }]);

})(angular);