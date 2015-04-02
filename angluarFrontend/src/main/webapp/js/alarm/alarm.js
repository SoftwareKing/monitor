(function(angular){
var path = "/dmonitor-webapi";

var systemAlarm = angular.module('alarm.alarm', ['ngResource']);

systemAlarm.factory('alarm.DataLoader', function($resource){
        return $resource("data/alarm/:name", {}, {
            mocTree:{method:"GET",url:path+"/alarm/mocTree",isArray:true},
            alarmTree:{method:"GET",url:path+"/alarm/alarmTree",isArray:true},
            rooms:{method:"GET",url:path+"/operation/jf",isArray:true},

            add:{method:"POST",url:path+"/alarm/rules",isArray:false},
            edit:{method:"PUT",url:path+"/alarm/rules/:id",isArray:false},
            getRules: {method:'GET',url:path+"/alarm/rules",isArray:false},
            getRulesByLocation: {method:'GET',url:path+"/alarm/rules/location",isArray:false},
            getSampleIntervalRules: {method:'GET',url:path+"/alarm/sampleIntervalRules",isArray:false},
            remove:{method:"DELETE",url:path+"/alarm/rules",isArray:false},
            active:{method:'PUT',url:path+'/alarm/rules/active',isArray:false},
            getUsers:{method:'GET',url:path+'/operation/departUserTree',isArray:true},
            getIndexMetricValues:{method:'GET',url:path+'/resources/metric/index/values',isArray:false},
            getMetricByMocId:{method:'GET',url:path+'/resources/metric/select',isArray:true},
            getMo:{method:'GET',url:path+'/resources/mo/:moId',isArray:false},
            getMoByMocId:{method:'GET',url:path+'/resources/mo',isArray:false},
            getAllMoc:{method:'GET',url:path+"/resources/moc",isArray:true},
            confirmEventHistory:{method:"PUT",url:path+"/alarm/event/history/recover",isArray:false},
            getHistoryEvent: {method:'GET',url:path+'/alarm/event/history/recover',isArray:false},
            recoverEvent:{method:"PUT",url:path+"/alarm/event/current/recover",isArray:false},
            generateOrders:{method:"PUT",url:path+"/alarm/event/current/orders",isArray:false},
            confirmEventCurrent:{method:"PUT",url:path+"/alarm/event/current/confirm",isArray:false},
            getCurrentEvent: {method:'GET',url:path+'/alarm/event/current',isArray:false},
            getCurrentEventMo: {method:'GET',url:path+'/alarm/event/current/mo',isArray:true},
            getItsmAll: {method:'GET',url:path+'/itsm/findAll',isArray:false},
            getMoAllItsm: {method:'GET',url:path+'/itsm/incident/page',isArray:false},
            getUser: {method:'GET',url:path+'/users/:id',isArray:false},
            getPrepareRules:{method:'GET',url:path+'/alarm/rules/prepare',isArray:true},
            getMetric:{method:'GET',url:path+'/alarm/metric',isArray:false}
        });
    });

systemAlarm.run(['$rootScope','alarm.DataLoader',function($rootScope,DataLoader) {
        DataLoader.getAllMoc(function(data){
            $rootScope.alarm.mocTree = data;
            $rootScope.alarm.ready = true;
        });
    }]);

//告警规则设置============================================
systemAlarm.controller('alarmRuleCtrl',['$scope','$rootScope','alarm.DataLoader','$filter','Util',"Tools",'Loading','$routeParams','$timeout','$location','LocationClient',function($scope,$rootScope,DataLoader,$filter,Util,Tools,Loading,$routeParams,$timeout,$location,LocationClient){

    LocationClient.queryJf(function(data){
        $scope.locationsForJFSearch =[{"id":-1,"name":" 未设置机房 "}].concat(data);
    });
    /***************************添加**************************************/
    $scope.isLeaf = function(nodeData){
        return nodeData.id==-1 || nodeData.isJF;
    };
    $scope.addPage={};
    $scope.addPage.hidden = {};
    $scope.addPage.hidden.startT = 1;
    $scope.addPage.hidden.endT=1;
    $scope.addPage.datas = {};
    $scope.addPage.datas.metricTree = [];
    $scope.addPage.datas.moTree = [];
    $scope.addPage.datas.endTimes = [];
    $scope.addPage.data={};
    $scope.addPage.data.active = true;
    $scope.addPage.data.level = 4;
    $scope.addPage.data.mocId = "";
    $scope.addPage.data.metricId = "";
    $scope.addPage.data.moId = "";
    $scope.addPage.data.occursDelay = 3;
    $scope.addPage.data.startTime = 0;
    $scope.addPage.data.endTime = 24;
    $scope.addPage.data.workingDay = [1, 2, 3, 4, 5, 6, 7];
    $scope.addPage.data.notifyWay = [];
    $scope.addPage.data.notifier = "";
    $scope.addPage.isLeaf = function(nodeData){
        if (nodeData.isParent != null && nodeData.isParent){
            return false;
        }else{
            return true;
        }
    };
    $scope.alarmAddDialog=Tools.dialog({
        id:"alarmAddDialog",
        title:"新增",
        hiddenButton:true,
        save:function(){
            Loading.show();

            var addlist = [];
            var x = 0;
            $.each($scope.addPage.data.allData,function(i,v){
                if(v.checked){
                    v.active = $scope.addPage.data.active;
                    v.level = $scope.addPage.data.level;
                    if($scope.addPage.data.unit=='分钟'){
                        v.sampleInterval = $scope.addPage.data.sampleInterval*60;
                    }else{
                        v.sampleInterval = $scope.addPage.data.sampleInterval*60*60;
                    }
                    v.active = $scope.addPage.data.active;
                    v.occursDelay = $scope.addPage.data.occursDelay;
                    v.workingTime=$scope.addPage.data.startTime+"-"+$scope.addPage.data.endTime;
                    if(Util.notNull($scope.addPage.data.workingDay))
                        v.workingDay=$scope.addPage.data.workingDay.toString();
                    v.notifier=$scope.addPage.data.notifier.toString();
                    v.notifyWay=$scope.addPage.data.notifyWay.toString();
                    addlist[x] = v;
                    x++;
                }
            });

           DataLoader.add(addlist,function(data){
                if(data.result=="success"){
                    $scope.alarmAddDialog.hide();
                    $scope.listPage.settings.reload(true);
                    $scope.searchPage.refreshTree();
                    DataLoader.getSampleIntervalRules($scope.searchPage.data,{},function(data){
                        $scope.searchPage.datas.sampleIntervals = [];
                        var obj;
                        for (var i = 0; i < data.rows.length; i++) {
                            obj = new Object();
                            obj.id = data.rows[i] + "";
                            if(data.rows[i]<3600){
                                obj.displayName = data.rows[i]/60+"分钟";
                            }else{
                                obj.displayName = data.rows[i]/3600+"小时";
                            }
                            $scope.searchPage.datas.sampleIntervals.push(obj);
                        }
                    });
                }
            },function(error){
                $scope.alarmAddDialog.hide();
                $scope.listPage.settings.reload(true);
            });

        }
    });

    $scope.$watch("addPage.data.mocId",function(newVal, oldVal){
        $scope.addPage.data.metricsId = [];
        $scope.addPage.data.mosId = [];
        if(oldVal!=newVal && Util.notNull(newVal)) {
            DataLoader.getMetricByMocId({rule: 'alarm', mocId: newVal}, {}, function (data) {
                $scope.addPage.datas.metricTree = data;
            });
            DataLoader.getMoByMocId({mocId:newVal,orderBy:"displayName"},{},function(data){
                var mocName="";
                $.each($rootScope.alarm.mocTree,function(a,v){
                    $.each(v.children,function(b,v2){
                        if(v2.id==newVal){
                            mocName = v2.displayName;
                            return ;
                        }
                    });
                });
                $scope.addPage.datas.moTree = [{id:-1,displayName:mocName,children:data.rows}];
            });
        }
    },false);

    $scope.$watch("addPage.data.checkedList",function(newVal, oldVal){
        if(Util.notNull(newVal) && newVal.length>0){
            $scope.addPage.hidden.checkedList = 1;
        }else{
            $scope.addPage.hidden.checkedList = "";
        }
    },true);

    $scope.$watch("addPage.data.metricsId", function (newVal, oldVal) {
        if (Util.notNull(newVal) && newVal.length > 0) {
            $scope.addPage.hidden.metric = 1;
            $scope.listPreparePage.settings.btnHit = false;
        } else {
            $scope.addPage.hidden.metric = "";
            $scope.listPreparePage.settings.btnHit = true;
        }
    }, true);

    $scope.$watch("addPage.data.mosId", function (newVal, oldVal) {
        $scope.addPage.datas.molist = [];
        if (Util.notNull(newVal) && newVal.length > 0) {
            $scope.listPreparePage.settings.btnHit = false;
            $scope.addPage.hidden.mo = 1;
            //填充搜索框中的mos
            var zTree2 = angular.element.fn.zTree.getZTreeObj("moTree");
            if (!Util.notNull(zTree2))
                return;
            var checknodes2 = zTree2.getCheckedNodes(true);
            var k = 0;
            $.each(checknodes2, function (i, checkVal) {
                if (checkVal.level == 1) {
                    $scope.addPage.datas.molist[k] = checkVal.data;
                    k++;
                }
            });
        } else {
            $scope.addPage.hidden.mo = "";
            $scope.listPreparePage.settings.btnHit = true;
        }
    }, true);

    var buildIndicatorList = function(){
        var x = 0;
        $scope.addPage.data.indicatorlistId="";
        $scope.addPage.datas.indicatorlist = [];
        $scope.addPage.datas.metriclist = [];
        if($scope.addPage.data.allData != null){
            $.each($scope.addPage.data.allData,function(i,v1){
                //判断是否存在相同指标
                var flag = false;
                $.each($scope.addPage.datas.indicatorlist,function(j,vv){
                    if(v1.indicatorId==vv.id){
                        flag = true;
                        return;
                    }
                });
                if(!flag){
                    $scope.addPage.datas.indicatorlist[x] = {id:v1.indicatorId,displayName:v1.indicatorName};
                    x++;
                }
            });
        }
    }

    $scope.$watch("addPage.data.indicatorlistId",function(newVal, oldVal){
        $scope.addPage.data.metriclistId="";
        $scope.addPage.datas.metriclist = [];
        if(Util.notNull(newVal)){
            var x = 0;
            if($scope.addPage.data.allData != null){
                $.each($scope.addPage.data.allData,function(i,v1){
                    if(newVal==v1.indicatorId){
                        //判断是否存在相同指标
                        var flag = false;
                        $.each($scope.addPage.datas.metriclist,function(j,vv){
                            if(v1.metricId==vv.id){
                                flag = true;
                                return;
                            }
                        });
                        if(!flag){
                            $scope.addPage.datas.metriclist[x] = {id:v1.metricId,displayName:v1.metricName};
                            x++;
                        }
                    }
                });
            }
        }
    },false);

    $scope.$watch("addPage.data.unit",function(newVal, oldVal){

        if(newVal=='分钟'){
            $scope.addPage.datas.intervals = $filter('loop')([],1,59,1);
        }else if(newVal=='小时'){
            $scope.addPage.datas.intervals = $filter('loop')([],1,24,1);
        }

    },false);

    $scope.listPreparePage = {
        data:[],
        checkedList : [],
        checkAllRow : false,
        action : {
            addsd:function(){
                if(jQuery("#bbb").css('display')=='none'){
                    jQuery("#bbb").show();
                    jQuery("#downadd").hide();
                    jQuery("#upadd").show();
                    $timeout(function(){
                        jQuery("#endT option[value='24']").attr("selected","selected");
                    },500);
                }else{
                    jQuery("#bbb").hide();
                    jQuery("#downadd").show();
                    jQuery("#upadd").hide();
                }
            },
            editsd:function(){
                if(jQuery("#ccc").css('display')=='none'){
                    jQuery("#ccc").show();
                    jQuery("#downedit").hide();
                    jQuery("#upedit").show();
                }else{
                    jQuery("#ccc").hide();
                    jQuery("#downedit").show();
                    jQuery("#upedit").hide();
                }
            },
            editsdlx:function(){
                if(jQuery("#ccclx").css('display')=='none'){
                    jQuery("#ccclx").show();
                    jQuery("#downeditlx").hide();
                    jQuery("#upeditlx").show();
                }else{
                    jQuery("#ccclx").hide();
                    jQuery("#downeditlx").show();
                    jQuery("#upeditlx").hide();
                }
            },
            metricNodeDom:function(data){
                var htmlStr = "";
                if("string"==data.valType){
                    htmlStr =  "<span style='width:130px;display: inline-block;'>"+data.displayName+"</span>" +
                        "<span style='width:80px;display: inline-block;'><select id='a"+data.id+"' style='width:80px;height: 20px;line-height: 20px;padding: 0px 0px;'><option value=''>请选择</option><option value='=='>==</option><option value='包含'>包含</option></select></span>" +
                        "<span style='width:80px;display: inline-block;'><input id='b"+data.id+"' placeholder='请输入' type='text' style='width:80px;height: 20px;line-height: 20px;padding: 0px 0px;'/></span>" +
                        "<span style='width:30px;display: inline-block;'>"+(data.unit?data.unit:"")+"</span>";
                }else if("enum"==data.valType){
                    var opt = "";
                    $.each(data.enumMap,function(k,v){
                        if (k == 'normal'){
                            opt += "<option value='"+k+"'>"+"正常"+"</option>";
                        } else if (k == 'warning'){
                            opt += "<option value='"+k+"'>"+"警告"+"</option>";
                        } else if (k == 'critical'){
                            opt += "<option value='"+k+"'>"+"危急"+"</option>";
                        } else if (k == 'shutdown'){
                            opt += "<option value='"+k+"'>"+"关闭"+"</option>";
                        } else if (k == 'notPresent'){
                            opt += "<option value='"+k+"'>"+"不存在"+"</option>";
                        } else if (k == 'notFunctioning'){
                            opt += "<option value='"+k+"'>"+"不工作"+"</option>";
                        } else {
                            opt += "<option value='"+k+"'>"+k+"</option>";
                        }
                    });
                    htmlStr =  "<span style='width:130px;display: inline-block;'>"+data.displayName+"</span>" +
                        "<span style='width:80px;display: inline-block;'><select id='a"+data.id+"' style='width:80px;height: 20px;line-height: 20px;padding: 0px 0px;'><option value=''>请选择</option><option value='=='>==</option><option value='!='>!=</option></select></span>" +
                        "<span style='width:80px;display: inline-block;'><select id='b"+data.id+"' style='width:80px;height: 20px;line-height: 20px;padding: 0px 0px;'><option value=''>请选择</option>"+opt+"</select></span>" +
                        "<span style='width:30px;display: inline-block;'>"+(data.unit?data.unit:"")+"</span>";
                }
//                else if("int"==data.valType || "long"==data.valType) {
//                    htmlStr = "<span style='width:130px;display: inline-block;'>" + data.displayName + "</span>" +
//                        "<span style='width:80px;display: inline-block;'><select id='a" + data.id + "' style='width:80px;height: 20px;line-height: 20px;padding: 0px 0px;'><option value=''>请选择</option><option value='=='>==</option><option value='>'>></option><option value='<'><</option><option value='<='><=</option><option value='>='>>=</option></select></span>" +
//                        '<span style="width:80px;display: inline-block;"><input id="b' + data.id + '" placeholder="请输入" maxlength="10" type="text" style="width:80px;height: 20px;line-height: 20px;padding: 0px 0px;" onkeyup="javascript:b(this);" onafterpaste="javascript:c(this);"/></span>' +
//                        "<span style='width:30px;display: inline-block;'>" + (data.unit?data.unit:"") + "</span>";
//                }
                else{//double
                    htmlStr =  "<span style='width:130px;display: inline-block;'>"+data.displayName+"</span>" +
                        "<span style='width:80px;display: inline-block;'><select id='a"+data.id+"' style='width:80px;height: 20px;line-height: 20px;padding: 0px 0px;'><option value=''>请选择</option><option value='=='>==</option><option value='>'>></option><option value='<'><</option><option value='<='><=</option><option value='>='>>=</option></select></span>" +
                        '<span style="width:80px;display: inline-block;"><input id="b'+data.id+'" placeholder="请输入" maxlength="10" type="text" style="width:80px;height: 20px;line-height: 20px;padding: 0px 0px;" onkeyup="javascript:a(this);"/></span>' +
                        "<span style='width:30px;display: inline-block;'>"+(data.unit?data.unit:"")+"</span>";
                 }
                return htmlStr;
            },
            remove:function(id){
                $.each($scope.addPage.data.allData,function(i,v){
                    if(v.id==id){
                        $scope.addPage.data.allData[i].checked=false;
                        return;
                    }
                });
                $scope.addPage.hidden.checkedList = null;
                $.each($scope.addPage.data.allData,function(i,v){
                    if(v.checked){
                        $scope.addPage.hidden.checkedList = 1;
                        return;
                    }
                });
                $scope.listPreparePage.settings.reload(true);
            },
            getData:function(){
                jQuery("#aaa").show();
                var zTree1 =angular.element.fn.zTree.getZTreeObj("metricTree");
                var zTree2 =angular.element.fn.zTree.getZTreeObj("moTree");
                var j = 0;
                var metricsId = [];
                var k = 0;
                var mosId = [];
                if(zTree1!=null && zTree2!=null){
                    var checknodes = zTree1.getCheckedNodes(true);
                    var checknodes2 = zTree2.getCheckedNodes(true);
                    $.each(checknodes,function(i,checkVal){
                        if(checkVal.level==1){
                            metricsId[j] = checkVal.data.id;
                            j++;
                            return;
                        }
                    });
                    $.each(checknodes2,function(i,checkVal){
                        if(checkVal.level==1){
                            mosId[k] = checkVal.data.id;
                            k++;
                            return ;
                        }
                    });
                }
                DataLoader.getPrepareRules({mosId:mosId,metricsId:metricsId},{},function(data){
                    $scope.addPage.data.allData = [];
                    var x = 0;
                    $.each(data,function(i,v){
                        v.comparision = jQuery("#a"+ v.metricId).val()+"#"+jQuery("#b"+ v.metricId).val()+"#"+ (v.unit?v.unit:"");
                        if(Util.notNull(jQuery("#a"+ v.metricId).val()) && Util.notNull(jQuery("#b"+ v.metricId).val())){
                            $scope.addPage.data.allData[x]=v;
                            x++;
                        }
                    });
                    $scope.addPage.data.checkedList = new Array();
                    $.each(data,function(i,v){
                        $scope.addPage.data.checkedList.push(v.id);
                        $scope.addPage.hidden.checkedList = 1;
                    });
                    $scope.listPreparePage.settings.reload(true);
                    buildIndicatorList();
                    Loading.hide();
                },function(error){
                    Loading.hide();
                });
            },
            search:function(search,fnCallback){
                if($scope.addPage.data.allData != null){
                    var moId = $scope.addPage.data.molistId;
                    var indicatorId = $scope.addPage.data.indicatorlistId;
                    var metricId = $scope.addPage.data.metriclistId;
                    var tiaojian = [];
                    $.each($scope.addPage.data.allData,function(i,v) {
                        if (v.checked) {
                            if (moId != null && moId != "" && moId != v.moId){
                                return;
                            }
                            if (indicatorId != null && indicatorId != "" && indicatorId != v.indicatorId){
                                return;
                            }
                            if (metricId != null && metricId != "" && metricId != v.metricId){
                                return;
                            }
                            tiaojian.push(v);
                        }
                    });
                    var max = tiaojian.length<(search.offset+search.limit)?tiaojian.length:(search.offset+search.limit);
                    var rows = new Array();
                    for(var i=search.offset;i<max;i++){
                        rows.push(tiaojian[i]);
                    }
                    //填充表格数据
                    var ddd = {total:tiaojian.length,rows:rows};
                    $scope.listPreparePage.data =ddd.rows;
                    fnCallback(ddd);
                }

            }
        }
    };

    $scope.listPreparePage.settings = {
        btnHit : true,
        reload : null,
        getData:$scope.listPreparePage.action.search, //getData应指定获取数据的函数
        columns : [
            {
                sTitle: "规则名称",
                mData:"displayName",
                mRender:function(mData,type,full) {
                    return "<label class='td-text' style='margin-top: 0px' title='"+mData+"' style='width: 120px;'>"+mData+"</label>";
                }
            },
            {
                sTitle: "资源实例",
                mData:"moName",
                mRender:function(mData,type,full) {
                    return "<label class='td-text' style='margin-top: 0px' title='"+mData+"' style='width: 100px;'>"+mData+"</label>";
                }
            },
            {
                sTitle: "指标类型组",
                mData:"indicatorName"
            },
            {
                sTitle: "指标类型",
                mData:"metricName",
                mRender:function(mData,type,full) {
                    return "<label class='td-text' style='margin-top: 0px' title='"+mData+"' style='width: 100px;'>"+mData+"</label>";
                }
            },
            {
                sTitle: "索引值",
                mData:"metricsArgs"
            },
            {
                sTitle: "检测条件",
                mData:"comparision",
                mRender: function (mData, type, full) {
                    var comparisionValue;
                    if (full.indicatorName == "风扇状态" || full.indicatorName == "电源状态" || full.indicatorName == "温度状态") {
                        if (mData.split("#")[1] == 'normal') {
                            comparisionValue = "正常";
                        } else if (mData.split("#")[1] == 'warning') {
                            comparisionValue = "警告";
                        } else if (mData.split("#")[1] == 'critical') {
                            comparisionValue = "危急";
                        } else if (mData.split("#")[1] == 'shutdown') {
                            comparisionValue = "关闭";
                        } else if (mData.split("#")[1] == 'notPresent') {
                            comparisionValue = "不存在";
                        } else if (mData.split("#")[1] == 'notFunctioning') {
                            comparisionValue = "不工作";
                        } else {
                            comparisionValue = mData.split("#")[1];
                        }
                    } else {
                        comparisionValue = mData.split("#")[1];
                    }
                    return mData.split("#")[0] + comparisionValue + mData.split("#")[2];
                }
            },
            {
                sTitle: "操作",
                mData:"id",
                mRender:function(mData,type,full) {
                    return '<i title="删除" class="fa fa-trash-o" ng-click="listPreparePage.action.remove(\''+mData+'\')"></i>';
                }
            }
        ] , //定义列的形式,mRender可返回html
        columnDefs : [
            { bSortable: false,aTargets:[0,1,2,3,4,5,6]},//列不可排序
            { sWidth: "50px", aTargets: [6]}
        ] , //定义列的约束
        defaultOrderBy :[]  //定义默认排序列为第8列倒序
    };

    $scope.$watch("addPage.data.startTime",function(newVal, oldVal){
        if(newVal){
            $scope.addPage.datas.endTimes = $filter('loop')([],Number(newVal)+1,24,1);
            if (Number(newVal) >= Number($scope.addPage.data.endTime)){
                $scope.addPage.data.endTime = Number(newVal)+1;
            }
        }else{
            $scope.addPage.data.endTime="";
            $scope.addPage.datas.endTimes=new Array();
        }
    });

    $scope.$watch("addPage.data.startTime",function(newVal, oldVal){
        if(Util.notNull(newVal) && Util.notNull($scope.addPage.data.endTime)) {
            $scope.addPage.hidden.startT = 1;
            $scope.addPage.hidden.endT=1;
        }else if(!Util.notNull(newVal) && Util.notNull($scope.addPage.data.endTime)){
            $scope.addPage.hidden.startT = "";
            $scope.addPage.hidden.endT="";
        }else if(Util.notNull(newVal) && !Util.notNull($scope.addPage.data.endTime)){
            $scope.addPage.hidden.startT = "";
            $scope.addPage.hidden.endT="";
        }else if(!Util.notNull(newVal) && !Util.notNull($scope.addPage.data.endTime)){
            $scope.addPage.hidden.startT = 1;
            $scope.addPage.hidden.endT=1;
        }
    },false);

    $scope.$watch("addPage.data.endTime",function(newVal, oldVal){
        if(Util.notNull(newVal) && Util.notNull($scope.addPage.data.startTime)) {
            $scope.addPage.hidden.startT = 1;
            $scope.addPage.hidden.endT=1;
        }else if(!Util.notNull(newVal) && Util.notNull($scope.addPage.data.startTime)){
            $scope.addPage.hidden.startT = "";
            $scope.addPage.hidden.endT="";
        }else if(Util.notNull(newVal) && !Util.notNull($scope.addPage.data.startTime)){
            $scope.addPage.hidden.startT = "";
            $scope.addPage.hidden.endT="";
        }else if(!Util.notNull(newVal) && !Util.notNull($scope.addPage.data.startTime)){
            $scope.addPage.hidden.startT = 1;
            $scope.addPage.hidden.endT=1;
        }
    },false);
/***************************编辑**************************************/
$scope.editPage={};
$scope.editPage.hidden={};
$scope.editPage.data={}
$scope.editPage.datas={}
$scope.editPage.data.threshold={};

$scope.alarmEditDialog=Tools.dialog({
    id:"alarmEditDialog",
    title:"编辑",
    hiddenButton:true,
    save:function(){
        Loading.show();
        var alarmArg = {};
        alarmArg.displayName = $scope.editPage.data.displayName;
        if(alarmArg.displayName.indexOf("<")>-1 || alarmArg.displayName.indexOf(">")>-1){
            alarmArg.displayName=alarmArg.displayName.replace(/</g,"");
            alarmArg.displayName=alarmArg.displayName.replace(/>/g,"");
        }
        alarmArg.active=$scope.editPage.data.active
        if(Util.notNull($scope.editPage.data.notifier))
            alarmArg.notifier=$scope.editPage.data.notifier.toString();
        if(Util.notNull($scope.editPage.data.notifyWay))
            alarmArg.notifyWay=$scope.editPage.data.notifyWay.toString();
        if(Util.notNull($scope.editPage.data.workingDay))
            alarmArg.workingDay=$scope.editPage.data.workingDay.toString();
        alarmArg.thresholdUnit=$scope.editPage.data.threshold.unit;
        if(Util.notNull($scope.editPage.data.startTime) && Util.notNull($scope.editPage.data.endTime))
            alarmArg.workingTime=$scope.editPage.data.startTime+"-"+$scope.editPage.data.endTime;
        else
            alarmArg.workingTime = "";
        if($scope.editPage.data.unit=='分钟'){
            alarmArg.sampleInterval = $scope.editPage.data.sampleInterval*60;
        }else{
            alarmArg.sampleInterval = $scope.editPage.data.sampleInterval*60*60;
        }
        //alarmArg.sampleInterval = $scope.editPage.data.sampleInterval;
        alarmArg.comparision=$scope.editPage.data.threshold.exp+"#"+jQuery("#metricVal").val();
        alarmArg.occursDelay=$scope.editPage.data.occursDelay;
        alarmArg.level = $scope.editPage.data.level;
        alarmArg.malfunction = $scope.editPage.data.malfunction;
        DataLoader.edit({id:$scope.editPage.data.id},alarmArg,function(data){
            if(data.result=="success"){
                //$scope.searchPage.init();
                $scope.alarmEditDialog.hide();
                $scope.listPage.settings.reload(true);
            }
        },function(error){
            $scope.alarmEditDialog.hide();
            $scope.listPage.settings.reload(true);
        });
    }
});

    $scope.$watch("editPage.data.startTime",function(newVal, oldVal){
        if(newVal){
            $scope.editPage.datas.endTimes = $filter('loop')([],Number(newVal)+1,24,1);
            if (Number(newVal) >= Number($scope.editPage.data.endTime)){
                $scope.editPage.data.endTime = Number(newVal)+1;
            }
            $timeout(function(){
                jQuery("#endT option[value='"+$scope.editPage.data.endTime+"']").attr("selected","selected");
            },1000);
        }else{
            $scope.editPage.data.endTime="";
            $scope.editPage.datas.endTimes=new Array();
        }
    });

    $scope.$watch("editPage.data.startTime",function(newVal, oldVal){
        if(Util.notNull(newVal) && Util.notNull($scope.editPage.data.endTime)) {
            $scope.editPage.hidden.startT = 1;
            $scope.editPage.hidden.endT=1;
        }else if(!Util.notNull(newVal) && Util.notNull($scope.editPage.data.endTime)){
            $scope.editPage.hidden.startT = "";
            $scope.editPage.hidden.endT="";
        }else if(Util.notNull(newVal) && !Util.notNull($scope.editPage.data.endTime)){
            $scope.editPage.hidden.startT = "";
            $scope.editPage.hidden.endT="";
        }else if(!Util.notNull(newVal) && !Util.notNull($scope.editPage.data.endTime)){
            $scope.editPage.hidden.startT = 1;
            $scope.editPage.hidden.endT=1;
        }
    },false);

    $scope.$watch("editPage.data.endTime",function(newVal, oldVal){
        if(Util.notNull(newVal) && Util.notNull($scope.editPage.data.startTime)) {
            $scope.editPage.hidden.startT = 1;
            $scope.editPage.hidden.endT=1;
        }else if(!Util.notNull(newVal) && Util.notNull($scope.editPage.data.startTime)){
            $scope.editPage.hidden.startT = "";
            $scope.editPage.hidden.endT="";
        }else if(Util.notNull(newVal) && !Util.notNull($scope.editPage.data.startTime)){
            $scope.editPage.hidden.startT = "";
            $scope.editPage.hidden.endT="";
        }else if(!Util.notNull(newVal) && !Util.notNull($scope.editPage.data.startTime)){
            $scope.editPage.hidden.startT = 1;
            $scope.editPage.hidden.endT=1;
        }
    },false);

    $scope.$watch("editPage.data.unit",function(newVal, oldVal){
        $scope.editPage.datas.intervals = $filter('loop')([],1,59,1);
        if(newVal=='分钟'){
            $scope.editPage.datas.intervals = $filter('loop')([],1,59,1);
        }else if(newVal=='小时'){
            $scope.editPage.datas.intervals = $filter('loop')([],1,24,1);
        }

    },false);

/***************************查询**************************************/
$scope.type=0;
$scope.rooms=[];
DataLoader.rooms({locId:-1},function(rows){
    $scope.rooms=rows;
});

$scope.searchPage = {
    init : function(){
        $scope.searchPage.datas={};
        $scope.searchPage.data = {
            mocpId:"",
            mocId:"",
            jfId:"",
            moName : "",
            active:"",
            displayName:"",
            indicatorId:"",
            metricId : "",
            level:[2,3,4,5,6],
            limit : 20, //每页条数(即取多少条数据)
            offset : 0 , //从第几条数据开始取
            orderBy : "updated",//排序字段
            orderByType : "desc" //排序顺序
        };
        $scope.searchPage.initTree();
    },
    initTree:function(){
        var moId=$location.$$search.moId;
        DataLoader.mocTree(function(data){
            $scope.mocTree.data=data;
            if(moId)return;
            if(""==$scope.searchPage.data.mocpId){
                $scope.searchPage.data.mocpId=data[0].id;
                $timeout(function(){
                    var treeObj = angular.element.fn.zTree.getZTreeObj($scope.mocTree.treeId);
                    treeObj.selectNode(treeObj.getNodes()[0]);
                },1000);
                $scope.searchPage.action.search();
            }else{
                $timeout(function(){
                    var treeObj = angular.element.fn.zTree.getZTreeObj($scope.mocTree.treeId);
                    var nodes=treeObj.getNodes();
                    for(var i=0;i<nodes.length;i++){
                        if(nodes[i].id==$scope.searchPage.data.mocpId){
                            treeObj.selectNode(nodes[i]);
                            break;
                        }
                    }
                },1000);
            }
        });
    },
    refreshTree:function(){
        var moId=$location.$$search.moId;
        DataLoader.mocTree(function(data){
            $scope.mocTree.data=data;
            //if(moId)return;
            if(""==$scope.searchPage.data.mocpId){
                $scope.searchPage.data.mocpId=data[0].id;
                $timeout(function(){
                    var treeObj = angular.element.fn.zTree.getZTreeObj($scope.mocTree.treeId);
                    treeObj.selectNode(treeObj.getNodes()[0]);
                },1000);
                $scope.searchPage.action.search();
            }else{
                $timeout(function(){
                    var treeObj = angular.element.fn.zTree.getZTreeObj($scope.mocTree.treeId);
                    var nodes=treeObj.getNodes();
                    for(var i=0;i<nodes.length;i++){
                        if(nodes[i].id==$scope.searchPage.data.mocpId){
                            treeObj.selectNode(nodes[i]);
                            break;
                        }
                    }
                },1000);
            }
        });
    }
};

$scope.mocTree={
    data:[],
    checked:"",
    crossParent:"true",
    treeId: 'smocTree',
    checkType: { "Y" : "", "N" : "" },
    checkbox:null,
    treeClick:function(node){
        if(node.mocName=="environment"){
            $scope.type=1;
        }else $scope.type=0;
        $scope.searchPage.data.mocpId=node.id;
        $scope.searchPage.data.moName = "";
        $scope.searchPage.data.displayName = "";
        $scope.searchPage.data.starttime = "";
        $scope.searchPage.data.endtime = "";
        $scope.searchPage.data.active = "";
        $scope.searchPage.data.jfId = "";
        $scope.searchPage.data.level = [2,3,4,5,6];
        $scope.$apply();
        if($scope.type==0) $scope.searchPage.action.search();
    }
};

$scope.searchPage.action={};
$scope.searchPage.action.search = function(){
    $scope.listPage.settings.reload(true);
};
$scope.searchPage.init();

$scope.$watch("searchPage.data.mocpId",function(newVal,oldVal){
    if(newVal==null || !$scope.alarmSetting){
        $scope.searchPage.data.mocId = "";
        $scope.searchPage.data.sampleInterval = "";
    }
    $scope.searchPage.datas.mocs = [];
    $scope.searchPage.datas.sampleIntervals = [];
    if(newVal!=oldVal){
        $scope.searchPage.data.mocId='';
        $scope.searchPage.data.sampleInterval = "";
    }
    if(newVal){
        Util.delay("alarm.ready",function(){
            $scope.searchPage.datas.mocs = Util.findFromArray("id",newVal,$rootScope.alarm.mocTree)["children"];
            DataLoader.getSampleIntervalRules($scope.searchPage.data,{},function(data){
                var obj;
                for (var i = 0; i < data.rows.length; i++) {
                    obj = new Object();
                    obj.id = data.rows[i] + "";
                    if(data.rows[i]<3600){
                        obj.displayName = data.rows[i]/60+"分钟";
                    }else{
                        obj.displayName = data.rows[i]/3600+"小时";
                    }
                    $scope.searchPage.datas.sampleIntervals.push(obj);
                }
            });
            if($scope.alarmSetting){
                $timeout(function(){
                    jQuery("#jmocid option[value='"+$scope.searchPage.data.mocId+"']").attr("selected","selected");
                },1000);
            };
        },$rootScope);
    }
},true);

$scope.$watch("searchPage.data.mocId",function(newVal, oldVal){
    $scope.searchPage.data.indicatorId = "";
    $scope.searchPage.datas.indicators = [];
    if(Util.notNull(newVal)){
        DataLoader.getMetricByMocId({rule:'alarm',mocId:newVal},{},function(data){
            $scope.searchPage.datas.indicators = data;
        });
    }
},false);

$scope.$watch("searchPage.data.indicatorId",function(newVal,oldVal){
    $scope.searchPage.data.metricId = "";
    $scope.searchPage.datas.metrics = [];
    if(Util.notNull(newVal)){
        $scope.searchPage.datas.metrics = Util.findFromArray("id",newVal,$scope.searchPage.datas.indicators)["children"];
    }
},false);

//listPage部分
//scope定义
$scope.listPage = {
    data:[],
    checkedList : [],
    checkAllRow : false
};

$scope.alarmSetting = false;

$scope.listPage.action = {
    add: function () {
        Loading.show();
        //$scope.addPage.hidden = {};
        $scope.addPage.hidden.startT = "1";
        $scope.addPage.hidden.endT= "1";
        $scope.addPage.datas = {};
        $scope.addPage.datas.metricTree = [];
        $scope.addPage.datas.moTree = [];
        $scope.addPage.datas.endTimes = [];
        $scope.addPage.data={};
        $scope.addPage.data.active = true;
        $scope.addPage.data.level = 4;
        $scope.addPage.data.unit = '分钟';
        $scope.addPage.data.sampleInterval=1;
        $scope.addPage.datas.intervals = $filter('loop')([],1,59,1);
        $scope.addPage.data.metricId = "";
        $scope.addPage.data.moId = "";
        $scope.addPage.data.occursDelay = 3;
        $scope.addPage.data.startTime = 0;

        $scope.addPage.data.workingDay = [1, 2, 3, 4, 5, 6, 7];
        $scope.addPage.data.notifyWay = [];
        $scope.addPage.data.notifier = "";
        $scope.addPage.data.allData = [];
        $scope.addPage.data.mocId ='';
        $timeout(function(){
            $scope.addPage.data.mocId =$scope.searchPage.datas.mocs.length>0?$scope.searchPage.datas.mocs[0].id:null;
            jQuery("#jmocid2 option[value='"+$scope.addPage.data.mocId+"']").attr("selected","selected");
            jQuery("#jmocid2 option[value='? string: ?']").remove();
        },300);

        $.each($scope.addPage.data.workingDay,function(i,v){
            jQuery("[name='week']").eq(i).attr("checked","true");
        });

        DataLoader.getUsers(function (data) {
            foeachArray(data);
            $scope.addPage.datas.notifyUsers = data;
            function foeachArray(rows){
                for(var i=0;i<rows.length;i++){
                    var row=rows[i];
                    if((row.id+'').indexOf("u_")==-1){
                        row.nocheck=true;
                        row.isParent=true;
                        row.id = "loc_"+row.id;
                    }else{
                        row.id = Number((row.id+'').replace("u_",""));
                    }
                    if(row.children && row.children.length>0){
                        foeachArray(row.children);
                    }
                }
            }
        });
        $scope.listPreparePage.settings.reload(true);

        $scope.alarmAddDialog.show();
        $timeout(function(){
            $scope.addPage.datas.endTimes = $filter('loop')([],1,24,1);
            $scope.addPage.data.endTime = 24;
            $timeout(function(){
                jQuery("#endT option[value='24']").attr("selected","selected");
            },500);
        },500);
        Loading.hide();
    },
    edit :function(id){
        $scope.editPage.hidden.startT = 1;
        $scope.editPage.hidden.endT=1;
        for(var i=0;i<$scope.listPage.data.length;i++){
            if(id == $scope.listPage.data[i].id){
                var editPagedata = $scope.listPage.data[i];
                if(editPagedata.metricsArgs != null){
                    DataLoader.getIndexMetricValues({mocName:editPagedata.moc,indicatorName:editPagedata.indicator},function(data){
                        var dd = [];
                        if(data.values != null){
                            for(var i=0;i<data.values.length;i++){
                                dd[i] = {k:data.values[i],v:data.values[i]};
                            }
                        }
                        $scope.editPage.metricsArgs = (data.index.displayName+"="+editPagedata.metricsArgs);
                    });
                }else{
                    $scope.editPage.metricsArgs = null;
                }
                $scope.editPage.datas.notifyUsers = null;
                DataLoader.getUsers(function (data) {
                    foeachArray(data);
                    $scope.editPage.datas.notifyUsers = data;
                    function foeachArray(rows){
                        for(var i=0;i<rows.length;i++){
                            var row=rows[i];
                            if((row.id+'').indexOf("u_")==-1){
                                row.nocheck=true;
                                row.isParent=true;
                                row.id = "loc_"+row.id;
                            }else{
                                row.id = Number((row.id+'').replace("u_",""));
                            }
                            if(row.children && row.children.length>0){
                                foeachArray(row.children);
                            }
                        }
                    }
                });

                $scope.editPage.data.id = editPagedata.id;
                $scope.editPage.data.displayName = editPagedata.displayName;
                $scope.editPage.data.level = editPagedata.level;
                $scope.editPage.data.malfunction = editPagedata.malfunction;
               // $scope.editPage.data.sampleInterval = editPagedata.sampleInterval;
                if(editPagedata.sampleInterval<3600){
                    $scope.editPage.data.unit = "分钟";
                    $scope.editPage.data.sampleInterval = editPagedata.sampleInterval/60;
                    $timeout(function(){
                        jQuery("#interval option[value="+$scope.editPage.data.sampleInterval+"]").attr("selected","selected");
                    },500);
                }else{
                    $scope.editPage.data.unit = "小时";
                    $scope.editPage.data.sampleInterval = editPagedata.sampleInterval/60/60;
                    $timeout(function(){
                        jQuery("#interval option[value="+$scope.editPage.data.sampleInterval+"]").attr("selected","selected");
                    },500);
                }
                $scope.editPage.data.active = editPagedata.active;
                $scope.editPage.data.mocpName = editPagedata.mocpName;
                $scope.editPage.data.mocName = editPagedata.mocName;
                $scope.editPage.data.indicatorName = editPagedata.indicatorName;
                $scope.editPage.data.metricName = editPagedata.metricName;
                $scope.editPage.data.moName = editPagedata.moName;
                $scope.editPage.data.occursDelay = editPagedata.occursDelay;
                $scope.editPage.data.workingDay = new Array();
                $scope.editPage.data.notifyWay = new Array();
                $scope.editPage.data.notifier = new Array();
                if(Util.notNull(editPagedata.workingDay)){
                    $.each(editPagedata.workingDay.split(","),function(i,v){
                        $scope.editPage.data.workingDay[i]=Number(v);
                    });
                }

                if(Util.notNull(editPagedata.notifyWay)){
                    $.each(editPagedata.notifyWay.split(","),function(i,v){
                        $scope.editPage.data.notifyWay[i]=v;
                    });
                }
                if(Util.notNull(editPagedata.notifier)){
                    $.each(editPagedata.notifier.split(","),function(i,v){
                        $scope.editPage.data.notifier[i]=Number(v);
                    });
                }
                $scope.editPage.data.occursDelay =editPagedata.occursDelay;
                $scope.editPage.data.threshold.unit = editPagedata.thresholdUnit;

                if(editPagedata.valType=="string"){
                    $scope.editPage.data.threshold.expList=["==","包含"];
                    jQuery("#vvv").html("<input class='s' type='text' id='metricVal' required style='width: 70px'/>");
                }else if(editPagedata.valType=="enum"){
                    $scope.editPage.data.threshold.expList=["==","!="];
                    var opt = "";
                    DataLoader.getMetric({moc:editPagedata.moc,indicator:editPagedata.indicator,metric:editPagedata.metric},{},function(data){
                        $.each(data.enumMap,function(k,v){
                            if(k==editPagedata.comparision.split("#")[1]){
                                if (k == 'normal'){
                                    opt += "<option selected value='"+k+"'>"+"正常"+"</option>";
                                } else if (k == 'warning'){
                                    opt += "<option selected value='"+k+"'>"+"警告"+"</option>";
                                } else if (k == 'critical'){
                                    opt += "<option selected value='"+k+"'>"+"危急"+"</option>";
                                } else if (k == 'shutdown'){
                                    opt += "<option selected value='"+k+"'>"+"关闭"+"</option>";
                                } else if (k == 'notPresent'){
                                    opt += "<option selected value='"+k+"'>"+"不存在"+"</option>";
                                } else if (k == 'notFunctioning'){
                                    opt += "<option selected value='"+k+"'>"+"不工作"+"</option>";
                                } else {
                                    opt += "<option selected value='"+k+"'>"+k+"</option>";
                                }
                            }
                            else{
                                if (k == 'normal'){
                                    opt += "<option value='"+k+"'>"+"正常"+"</option>";
                                } else if (k == 'warning'){
                                    opt += "<option value='"+k+"'>"+"警告"+"</option>";
                                } else if (k == 'critical'){
                                    opt += "<option value='"+k+"'>"+"危急"+"</option>";
                                } else if (k == 'shutdown'){
                                    opt += "<option value='"+k+"'>"+"关闭"+"</option>";
                                } else if (k == 'notPresent'){
                                    opt += "<option value='"+k+"'>"+"不存在"+"</option>";
                                } else if (k == 'notFunctioning'){
                                    opt += "<option value='"+k+"'>"+"不工作"+"</option>";
                                } else {
                                    opt += "<option value='"+k+"'>"+k+"</option>";
                                }
                            }
                        });
                        jQuery("#vvv").html("<select id='metricVal' style='width:70px;'>"+opt+"</select>");
                    });
                }
                else if("int"==editPagedata.valType || "long"==editPagedata.valType) {
                    $scope.editPage.data.threshold.expList=["==",">","<",">=","<="];
                    jQuery("#vvv").html('<input class="s" type="text" id="metricVal" maxlength="5" required style="width: 70px" onkeyup="this.value=this.value.replace(/[^0-9]/g,\'\')" onafterpaste="this.value=this.value.replace(/[^0-9]/g,\'\')"/>');
                }else{//double
                    $scope.editPage.data.threshold.expList=["==",">","<",">=","<="];
                    jQuery("#vvv").html('<input class="s" type="text" id="metricVal" maxlength="5" required style="width: 70px" onkeyup="javascript:a(this);"/>');
                }

                if(Util.notNull(editPagedata.comparision) && editPagedata.comparision.split("#").length>=2){
                    $scope.editPage.data.threshold.exp = editPagedata.comparision.split("#")[0];
                    jQuery("#metricVal").val(editPagedata.comparision.split("#")[1]);
                    //$scope.editPage.data.threshold.metricVal = editPagedata.comparision.split("#")[1];
                }
                $timeout(function(){
                    jQuery("#jexp option[value='"+ $scope.editPage.data.threshold.exp+"']").attr("selected","selected");
                },1000);
                if(Util.notNull(editPagedata.workingTime) && editPagedata.workingTime.split("-").length==2){
                    $scope.editPage.data.startTime = editPagedata.workingTime.split("-")[0]+"" ;
                    $scope.editPage.data.endTime = editPagedata.workingTime.split("-")[1]+"";
                }

                break;
            }
        }
        $scope.alarmEditDialog.show();
    },
    remove :function(id){
        $rootScope.$confirm("确定要删除吗？",function(){
            Loading.show();
            DataLoader.remove({ids:[id]},{},function(data){
                if (data.result == "success") {
                    $scope.listPage.settings.reload(true);
                    $scope.searchPage.refreshTree();
                }
            }, function (error) {
                Loading.hide();
            });
        },'删除');
    },
    batchRemove :function(){
        if($scope.listPage.checkedList.length==0){
            $rootScope.$alert("请选择规则");
        }else{
            $rootScope.$confirm("确定要删除吗？",function(){
                Loading.show();
                DataLoader.remove({ids:$scope.listPage.checkedList},{},function(data){
                    Loading.hide();
                    if(data.result== true){
                    }
                    $scope.listPage.settings.reload();
                    $scope.searchPage.refreshTree();
                }, function (error) {
                    Loading.hide();
                });
            },'删除');
        }
    },
    batchActive :function(flag){
        if($scope.listPage.checkedList.length==0){
            $rootScope.$alert("请选择规则");
        }else{
            Loading.show();
            DataLoader.active({ids:$scope.listPage.checkedList,active:flag},{},function(data){
                $scope.listPage.settings.reload(true);
            },function(error){
                Loading.hide();
            });
        }
    },
    active :function(id,flag){
        Loading.show();
        DataLoader.active({ids:[id],active:flag},{},function(data){
            if(data.result=="success"){
                $scope.listPage.settings.reload(true);
            }
        },function(error){
            Loading.hide();
        });
    },
    search:function(search,fnCallback){
        $scope.searchPage.data.limit = search.limit;
        $scope.searchPage.data.offset = search.offset;
        $scope.searchPage.data.orderBy = search.orderBy;
        $scope.searchPage.data.orderByType  = search.orderByType;
        $scope.searchPage.data.moId="";
        var moId=$location.$$search.moId;
        if (moId && !$scope.alarmSetting){
            $scope.alarmSetting = true;
            if($location.$$search.type && $location.$$search.type==1){
                DataLoader.getMo({moId:moId},{},function(data){
                    var jfId = data.mo.jfId;
                    if(jfId){
                        $scope.searchPage.data.jfId=jfId;
                        $scope.searchPage.data.mocpId="";
                        $timeout(function(){
                            jQuery("#jfId option[value='"+$scope.searchPage.data.jfId+"']").attr("selected","selected");
                        },2000);
                    }
                    Loading.show();
                    DataLoader.getRules($scope.searchPage.data,function(data){
                        $scope.listPage.data =data.rows;
                        fnCallback(data);
                        $scope.listPage.checkedList = [];
                        $scope.listPage.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                    $timeout(function () {
                        jQuery(".search-link").trigger("click");
                    }, 500);
                });
            }
            else{
                $scope.searchPage.data.moId = moId;
                DataLoader.getMo({moId:moId},{},function(data){
                    $scope.searchPage.data.mocpId = data.mo.mocpId;
                    $scope.searchPage.data.mocId = data.mo.mocId;
                    $timeout(function(){
                        jQuery("#jmocid option[value="+data.mo.mocId+"]").attr("selected","selected");
                    },3000);
                    $scope.searchPage.data.moName=data.mo.displayName;
                    DataLoader.getRules($scope.searchPage.data,function(data){
                        $scope.listPage.data =data.rows;
                        fnCallback(data);
                        $scope.listPage.checkedList = [];
                        $scope.listPage.checkAllRow = false;
                    });
                    $timeout(function(){
                        var treeObj = angular.element.fn.zTree.getZTreeObj($scope.mocTree.treeId);
                        var nodes=treeObj.getNodes();
                        if(nodes.length>0){
                            for(var i=0;i<nodes.length;i++){
                                if(nodes[i].id==$scope.searchPage.data.mocpId){
                                    treeObj.selectNode(nodes[i]);
                                    break;
                                }
                            }
                        }
                    },1000);
                    $timeout(function(){
                        jQuery(".search-link").trigger("click");
                    },500);
                    DataLoader.getMetricByMocId({rule:'alarm',mocId:$scope.searchPage.data.mocId},{},function(data){
                        $scope.searchPage.datas.indicators = data;
                    });
                });
            }
        }else{
            Loading.show();
            DataLoader.getRules($scope.searchPage.data,function(data){
                $scope.listPage.data =data.rows;
                fnCallback(data);
                $scope.listPage.checkedList = [];
                $scope.listPage.checkAllRow = false;
                Loading.hide();
            },function(error){
                Loading.hide();
            });
        }
    }
};

$scope.listPage.settings = {
    reload : null,
    getData:$scope.listPage.action.search, //getData应指定获取数据的函数
    columns : [
        {
            sTitle: "<div class='checkbox'><label><input type='checkbox' ng-model='listPage.checkAllRow'><i></i></label></div>",
            mData:"id",
            mRender:function(mData,type,full) {
                return '<div class="checkbox"><label><input type="checkbox" checklist-model="listPage.checkedList" checklist-value="'+mData+'" /><i></i></label></div>';
            }
        },
        {
            sTitle: "规则名称",
            mData:"displayName",
            mRender:function(mData,type,full) {
                return Util.str2Html(mData);
            }
        },
        {
            sTitle: "规则状态",
            mData:"active",
            mRender:function(mData,type,full) {
                if(mData){
                    return "<span style='color:green'>启用</span>";
                }else{
                    return "<span style='color:red'>停用</span>";
                }
            }
        },
        {
            sTitle: "告警等级",
            mData:"level",
            mRender:function(mData,type,full) {
                return Util.findFromArray("value",mData,$rootScope.alarm.const.levels)["label"];
            }
        },
        {
            sTitle: "资源实例",
            mData:"moName",
            mRender:function(mData,type,full) {
                return Util.str2Html(mData);
            }
        },
        {
            sTitle: "资源类型",
            mData:"mocName",
            mRender:function(mData,type,full) {
                return Util.str2Html(mData);
            }
        },
        {
            sTitle: "资源指标组",
            mData:"indicatorName",
            mRender:function(mData,type,full) {
                return Util.str2Html(mData);
            }
        },
        {
            sTitle: "资源指标",
            mData:"metricName",
            mRender:function(mData,type,full) {
                return Util.str2Html(mData);
            }
        },
        {
            sTitle: "轮询间隔",
            mData:"sampleInterval",
            mRender:function(mData,type,full) {
                if(mData<3600){
                    return Util.str2Html(mData/60+"分钟");
                }else{
                    return Util.str2Html(mData/3600+"小时");
                }
            }
        },
        {
            sTitle: "更新时间",
            mData:"updated",
            mRender:function(mData,type,full) {
                return Util.str2Html(mData);
            }
        },
        {
            sTitle: "阈值条件",
            mData:"comparision",
            mRender:function(mData,type,full) {
                var comparisionValue;
                if (full.indicatorName == "风扇状态" || full.indicatorName == "电源状态" || full.indicatorName == "温度状态") {
                    if (mData.split("#")[1] == 'normal') {
                        comparisionValue = "正常";
                    } else if (mData.split("#")[1] == 'warning') {
                        comparisionValue = "警告";
                    } else if (mData.split("#")[1] == 'critical') {
                        comparisionValue = "危急";
                    } else if (mData.split("#")[1] == 'shutdown') {
                        comparisionValue = "关闭";
                    } else if (mData.split("#")[1] == 'notPresent') {
                        comparisionValue = "不存在";
                    } else if (mData.split("#")[1] == 'notFunctioning') {
                        comparisionValue = "不工作";
                    } else {
                        comparisionValue = mData.split("#")[1];
                    }
                } else {
                    comparisionValue = mData.split("#")[1];
                }
                return mData.split("#")[0] + comparisionValue + (full.thresholdUnit?full.thresholdUnit:"");
            }
        },
        {
            sTitle: "操作",
            mData:"id",
            mRender:function(mData,type,full) {
                var disabledOp = $rootScope.loginUserMenuMap[$rootScope.currentView];
                if(disabledOp){
                    return '<i title="编辑" class="fa fa-pencil" ng-disabled="loginUserMenuMap[\''+$rootScope.currentView+'\']"> </i>' +
                        '<i title="'+(full.active?'停用':'启用')+'" class="'+(full.active?'fa fa-stop':'fa fa-play')+'" ng-disabled="loginUserMenuMap[\''+$rootScope.currentView+'\']"></i>' +
                        '<i title="删除" class="fa fa-trash-o" ng-disabled="loginUserMenuMap[\''+$rootScope.currentView+'\']"></i>';
                }else{
                    return '<i title="编辑" class="fa fa-pencil" ng-click="listPage.action.edit(\''+mData+'\')" > </i>' +
                        '<i title="'+(full.active?'停用':'启用')+'" class="'+(full.active?'fa fa-stop':'fa fa-play')+'" ng-click="listPage.action.active(\''+mData+'\','+(full.active?'false':'true')+')"></i>' +
                        '<i title="删除" class="fa fa-trash-o" ng-click="listPage.action.remove(\''+mData+'\')"></i>';
                }
            }
        }
    ] , //定义列的形式,mRender可返回html
    columnDefs : [
        { bSortable: false, aTargets: [ 0,10,11 ] },  //第 0,11,12列不可排序
        { sWidth: "38px", aTargets: [ 0 ] },
        { sWidth: "85px", aTargets: [ 3 ] },
        { sWidth: "100px", aTargets: [ 11 ] }
    ] , //定义列的约束
    defaultOrderBy : []  //定义默认排序列为第8列倒序
};

$scope.$watch("listPage.checkAllRow",function(newVal,oldVal){
    if(newVal){
        $scope.listPage.checkedList = Util.copyArray("id",$scope.listPage.data);
    }else{
        if($scope.listPage.data.length == $scope.listPage.checkedList.length){
            $scope.listPage.checkedList = [];
        }
    }
},false);

$scope.$watch("listPage.checkedList",function(newVal,oldVal){
    $scope.listPage.checkAllRow = newVal && newVal.length>0 && newVal.length==$scope.listPage.data.length;
},true);
}]);

//实时告警============================================
systemAlarm.controller('alarmRealCtrl',['$scope','$rootScope','alarm.DataLoader','Util','Loading','$routeParams','$timeout','Tools','$location','LocationClient',function($scope,$rootScope,DataLoader,Util,Loading,$routeParams,$timeout,Tools,$location,LocationClient){

    LocationClient.queryJf(function(data){
        $scope.locationsForJFSearch =[{"id":-1,"name":" 未设置机房 "}].concat(data);
    });

    $scope.isLeaf = function(nodeData){
        return nodeData.id==-1 || nodeData.isJF;
    };
    $scope.handJump = false;
    $scope.ifSearchLink = true;
    $scope.alarmType=0;
    $scope.type=0;
    $scope.eventDetailDialog=Tools.dialog({
        id:"eventDetailDialog",
        title:"告警详情",
        hiddenButton:true
    });
    $scope.rooms=[];
    DataLoader.rooms({locId:-1},function(rows){
        $scope.rooms=rows;
    });

    $scope.searchPage = {
        init : function(){
            $scope.searchPage.datas={};
            $scope.searchPage.data = {
                type:0,
                mocpId:"",
                mocId:"",
                jfId:"",
                moName : "",
                confirmStatus:"",
                indicatorId:"",
                metricId : "",
                level:[2,3,4,5,6],
                limit : 20, //每页条数(即取多少条数据)
                offset : 0 , //从第几条数据开始取
                orderBy : "alarmTime",//排序字段
                orderByType : "desc" //排序顺序
            };
            $scope.searchPage.jump = {
                jumpWay : "url"
            };
            $scope.searchPage.initTree();
        },
        initTree:function(){
            var moId=$location.$$search.moId;
            var level=$location.$$search.level;
            DataLoader.alarmTree(function(data){
                $scope.mocTree.data=data;
                if(moId)return;
                if(level && !$scope.handJump){
                    $scope.handJump = true;
                    $(".search-head").show();
                    $timeout(function(){
                        var treeObj = angular.element.fn.zTree.getZTreeObj($scope.mocTree.treeId);
                        treeObj.selectNode(treeObj.getNodes()[0]);
                    },1000);
                    return;
                }
                if($scope.searchPage.data.mocpId==null || $scope.searchPage.data.mocpId==""){
                    $scope.searchPage.data.mocpId=data[0].children[0].id;
                    $timeout(function(){
                        var treeObj = angular.element.fn.zTree.getZTreeObj($scope.mocTree.treeId);
                        treeObj.selectNode(treeObj.getNodes()[0].children[0]);
                    },1000);
                    $scope.searchPage.action.search();
                }
            });
        },
        refreshTree:function(){
            var moId=$location.$$search.moId;
            var level=$location.$$search.level;
            DataLoader.alarmTree(function(data){
                $scope.mocTree.data=data;
                //if(moId)return;
                if(level && !$scope.handJump){
                    $scope.handJump = true;
                    $(".search-head").show();
                    $timeout(function(){
                        var treeObj = angular.element.fn.zTree.getZTreeObj($scope.mocTree.treeId);
                        treeObj.selectNode(treeObj.getNodes()[0]);
                    },1000);
                    return;
                }
                if($scope.searchPage.data.mocpId==null || $scope.searchPage.data.mocpId==""){
                    $scope.searchPage.data.mocpId=data[0].children[0].id;
                    $timeout(function(){
                        var treeObj = angular.element.fn.zTree.getZTreeObj($scope.mocTree.treeId);
                        treeObj.selectNode(treeObj.getNodes()[0].children[0]);
                    },1000);
                    $scope.searchPage.action.search();
                }else{
                    $timeout(function(){
                        var treeObj = angular.element.fn.zTree.getZTreeObj($scope.mocTree.treeId);
                        var nodes=treeObj.transformToArray(treeObj.getNodes());
                        for(var i=0;i<nodes.length;i++){
                            if(nodes[i].id==$scope.searchPage.data.mocpId){
                                treeObj.selectNode(nodes[i]);
                                break;
                            }
                        }
                    },1000);
                }
            });
        }
    };
    $scope.mocTree = {
        data: [],
        checked: "",
        crossParent: "true",
        treeId: 'smocTree',
        checkType: { "Y": "", "N": "" },
        checkbox: null,
        treeClick: function (node) {
            if (node.isParent){
                $scope.alarmType = 0;
                $scope.type = node.type;
                $scope.searchPage.data.type = node.type;
                $scope.searchPage.data.mocpId = "";
                $scope.searchPage.data.moName = "";
                $scope.searchPage.data.jfId = "";
                $scope.searchPage.data.starttime = null;
                $scope.searchPage.data.endtime = null;
                $scope.searchPage.jump.jumpWay = "page";
                $scope.$apply();
                $scope.searchPage.action.search();
                return;
            }
            if (node.mocName == "environment") {
                $scope.alarmType = 1;
            } else $scope.alarmType = 0;
            $scope.type = node.type;
            $scope.searchPage.data.type = node.type;
            $scope.searchPage.data.mocpId = node.id;
            $scope.searchPage.data.moName = "";
            $scope.searchPage.data.jfId = "";
            $scope.searchPage.data.starttime = null;
            $scope.searchPage.data.endtime = null;
            $scope.searchPage.jump.jumpWay = "page";
            $scope.$apply();
            if ($scope.alarmType == 0) {
                $scope.searchPage.action.search();
            }
        }
    };
    $scope.searchPage.action={};
    $scope.searchPage.action.search = function(){
        $scope.listPage.settings.reload(true);
    };
    $scope.searchPage.action.advancedSearch = function(){
        $scope.searchPage.jump.jumpWay = "page";
        $scope.listPage.settings.reload(true);
    };
    $scope.searchPage.init();

    $scope.$watch("searchPage.data.mocpId",function(newVal,oldVal){
        if(!Util.notNull(newVal) || !$scope.alarmSetting){
            $scope.searchPage.data.mocId = "";
        }
        if(newVal!=oldVal)$scope.searchPage.data.mocId='';
        $scope.searchPage.datas.mocs = [];
        if(Util.notNull(newVal)){
            if( Util.findFromArray("id",newVal,$rootScope.alarm.mocTree))
                $scope.searchPage.datas.mocs = Util.findFromArray("id",newVal,$rootScope.alarm.mocTree)["children"];
            if($scope.alarmSetting){
                $timeout(function(){
                    jQuery("#jmocid option[value='"+$scope.searchPage.data.mocId+"']").attr("selected","selected");
                },1000);
            }
        }
    },false);

    $scope.$watch("searchPage.data.mocId",function(newVal, oldVal){
        $scope.searchPage.data.indicatorId = "";
        $scope.searchPage.datas.indicators = [];
        if(Util.notNull(newVal)){
            DataLoader.getMetricByMocId({rule:'alarm',mocId:newVal},{},function(data){
                $scope.searchPage.datas.indicators = data;
            });
        }
    },false);

    $scope.$watch("searchPage.data.indicatorId",function(newVal,oldVal){
        $scope.searchPage.data.metricId="";
        $scope.searchPage.datas.metrics = [];
        if(Util.notNull(newVal)){
            $scope.searchPage.datas.metrics = Util.findFromArray("id",newVal,$scope.searchPage.datas.indicators)["children"];
        }
    },false);


    //listPage部分
    //scope定义
    $scope.listPage = {
        data:[],
        checkedList : [],
        checkAllRow : false,
        users: [],
        ready : false
    };

    $scope.alarmSetting = false;


    $scope.eventDetail={};

    $scope.listPage.action = {
        historybatchConfirm :function(){
            if($scope.listPage.checkedList.length==0){
                $rootScope.$alert("请选择记录");
            }else{
                Loading.show();
                $scope.searchPage.data.starttime = null;
                $scope.searchPage.data.endtime = null;
                DataLoader.confirmEventHistory({ids:$scope.listPage.checkedList},{},function(data){
                    $scope.listPage.settings.reload(true);
                });
            }
        },
        historyconfirm :function(id){
            Loading.show();
            $scope.searchPage.data.starttime = null;
            $scope.searchPage.data.endtime = null;
            DataLoader.confirmEventHistory({ids:[id]},{},function(data){
                $scope.listPage.settings.reload(true);
            });
            $scope.listPage.checkedList = [];
        },
        batchConfirm :function(){
            if($scope.listPage.checkedList.length==0){
                $rootScope.$alert("请选择记录");
            }else{
                Loading.show();
                $scope.searchPage.data.starttime = null;
                $scope.searchPage.data.endtime = null;
                DataLoader.confirmEventCurrent({ids:$scope.listPage.checkedList},{},function(data){
                    Loading.hide();
                    if(data.result== true){
                    }
                    $scope.ifSearchLink = false;
                    $scope.listPage.settings.reload(true);
                });
            }
        },
        batchClear :function(){
            if($scope.listPage.checkedList.length==0){
                $rootScope.$alert("请选择记录");
            }else{
                Loading.show();
                $scope.searchPage.data.starttime = null;
                $scope.searchPage.data.endtime = null;
                DataLoader.recoverEvent({ids:$scope.listPage.checkedList},{},function(data){
                    Loading.hide();
                    if(data.result== true){
                    }
                    $scope.listPage.settings.reload(true);
                    $scope.searchPage.refreshTree();
                });
            }
        },
        batchGenerateOrders :function(){
            if($scope.listPage.checkedList.length==0){
                $rootScope.$alert("请选择记录");
            }else{
                Loading.show();
                $scope.searchPage.data.starttime = null;
                $scope.searchPage.data.endtime = null;
                DataLoader.generateOrders({ids:$scope.listPage.checkedList},{},function(data){
                    Loading.hide();
                    if(data.result== true){
                    }
                    $scope.listPage.settings.reload(true);
                });
            }
        },
        confirm :function(ruleId){
            Loading.show();
            $scope.searchPage.data.starttime = null;
            $scope.searchPage.data.endtime = null;
            DataLoader.confirmEventCurrent({ids:[ruleId]},{},function(data){
                Loading.hide();
                if(data.result== true){
                }
                $scope.ifSearchLink = false;
                $scope.listPage.settings.reload();
            });
            $scope.listPage.checkedList = [];
        },
        clear :function(ruleId){
            Loading.show();
            $scope.searchPage.data.starttime = null;
            $scope.searchPage.data.endtime = null;
            DataLoader.recoverEvent({ids:[ruleId]},{},function(data){
                Loading.hide();
                if(data.result== true){
                }
                $scope.listPage.settings.reload();
                $scope.searchPage.refreshTree();
            });
            $scope.listPage.checkedList = [];
        },
        generateOrders :function(ruleId){
            Loading.show();
            $scope.searchPage.data.starttime = null;
            $scope.searchPage.data.endtime = null;
            $scope.listPage.checkedList = [];
            DataLoader.generateOrders({ids: [ruleId]}, {}, function (data) {
                Loading.hide();
                if (data.result == true) {
                }
                $scope.listPage.settings.reload();
            }, function (error) {
                Loading.hide();
            });
        },
        clickDetail:function(id){
            Loading.show();
            var ruleId = "";
            var moId = "";
            var rootMoId = "";
            $.each($scope.listPage.data,function(i,val){
                if(id==val.id){
                    ruleId = val.ruleId;
                    moId = val.moId;
                    rootMoId = val.rootMoId;
                    $scope.eventDetail.detail={};
                    $scope.eventDetail.detail.moName=val.moName;
                    jQuery("#level").html("<img src='img/alarm/"+val.level+".png'/>");
                    $scope.eventDetail.detail.mocpName=val.mocpName;
                    $scope.eventDetail.detail.mocName=val.mocName;
                    $scope.eventDetail.detail.indicatorName=val.indicatorName;
                    $scope.eventDetail.detail.metricName=val.metricName;
                    $scope.eventDetail.detail.alarmTime=val.alarmTime;
                    $scope.eventDetail.detail.alarmValue=val.alarmValue;
                    $scope.eventDetail.detail.confirmUser=val.confirmUser;
                    $scope.eventDetail.detail.confirmTime=val.confirmTime;
                    $scope.eventDetail.detail.notifyUser="";
                    if(Util.notNull(val.notifier)){
                        $.each(val.notifier.split(','),function(i,v){
                            DataLoader.getUser({id:v},{},function(data){
                                if(data != null){
                                    if($scope.eventDetail.detail.notifyUser == "")
                                        $scope.eventDetail.detail.notifyUser=data.realName;
                                    else
                                        $scope.eventDetail.detail.notifyUser+=","+data.realName;
                                }
                            }, function (error) {
                                Loading.hide();
                            });
                        });
                    }
                    if (val.rootMoId > 0) {
                        DataLoader.getMo({moId: val.rootMoId}, {}, function (data) {
                            if (data != null && data.mo != null)
                                $scope.eventDetail.detail.rootMo = data.mo.displayName;
                                $scope.eventDetail.detail.rootAnalysis = "【" + $scope.eventDetail.detail.rootMo + "】的【" + $scope.eventDetail.detail.rootField + "】是【" + $scope.eventDetail.detail.rootValue + "】";
                        }, function (error) {
                            Loading.hide();
                        });
                    } else {
                        $scope.eventDetail.detail.rootAnalysis = "";
                    }
                    $scope.eventDetail.detail.rootField=(val.rootField=='Status'?'通断状态':'');
                    if(val.rootValue=='1'){
                        $scope.eventDetail.detail.rootValue='可达';
                    }
                    if(val.rootValue=='0'){
                        $scope.eventDetail.detail.rootValue='不可达';
                    }
                    $scope.eventDetail.detail.notifyWay=(val.notifyWay!=null?val.notifyWay.replace("SMS","短信").replace("Email","邮件"):"");
                    if(val.confirmStatus==1)
                        jQuery("#confirmStatus").html("<span style='color:green'>已确认</span>");
                    else
                        jQuery("#confirmStatus").html("<span style='color:red'>未确认</span>");
                }
            });
            //历史告警
            jQuery("#one").html("");
            var one_table = '';
            one_table += "<thead class='ng-scope'>";
            one_table += "<tr>";
            one_table += "<th style='width: 90px;'>资源实例</th>";
            one_table += "<th style='width: 70px;'>告警等级</th>";
            one_table += "<th style='width: 120px;'>指标类型组</th>";
            one_table += "<th style='width: 100px;'>指标类型</th>";
            one_table += "<th style='width: 90px;'>告警时间</th>";
            one_table += "<th style='width: 90px;'>告警内容</th>";
            one_table += "</tr>";
            one_table += "</thead>";

            var searchone = {};
            searchone.offset=0;
            searchone.limit=10000;
            searchone.alarmRuleId=ruleId;
            DataLoader.getHistoryEvent(searchone,function(data){
                one_table += "<tbody>";
                $.each(data.rows,function(i,val){
                    one_table += "<tr>";
                    one_table += "<td style='width: 90px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;' title='"+val.moName+"'>"+val.moName+"</td>";
                    one_table += "<td><img src='img/alarm/"+val.level+".png'/></td>";
                    one_table += "<td>"+val.indicatorName+"</td>";
                    one_table += "<td style='width: 90px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;' title='"+val.metricName+"'>"+val.metricName+"</td>";
                    one_table += "<td style='width: 90px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;' title='"+val.alarmTime+"'>"+val.alarmTime+"</td>";
                    one_table += "<td style='width: 90px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;' title='"+val.alarmValue+"'>"+val.alarmValue+"</td>";
                    one_table += "</tr>";
                });
                one_table += "</tbody>";
                jQuery("#one").append(one_table);
            }, function (error) {
                Loading.hide();
            });


            //实时告警
            jQuery("#two").html("");
            var two_table = '';
            two_table += "<thead class='ng-scope'>";
            two_table += "<tr>";
            two_table += "<th style='width: 90px;'>资源实例</th>";
            two_table += "<th style='width: 70px;'>告警等级</th>";
            two_table += "<th style='width: 120px;'>指标类型组</th>";
            two_table += "<th style='width: 100px;'>指标类型</th>";
            two_table += "<th style='width: 90px;'>告警时间</th>";
            two_table += "<th style='width: 90px;'>告警内容</th>";
            two_table += "</tr>";
            two_table += "</thead>";

            var searchtwo = {};
            searchtwo.offset=0;
            searchtwo.limit=10000;
            searchtwo.moId=moId;
            DataLoader.getCurrentEvent(searchtwo,function(data){
                two_table += "<tbody>";
                $.each(data.rows,function(i,val){
                    two_table += "<tr>";
                    two_table += "<td style='width: 90px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;' title='"+val.moName+"'>"+val.moName+"</td>";
                    two_table += "<td><img src='img/alarm/"+val.level+".png'/></td>";
                    two_table += "<td>"+val.indicatorName+"</td>";
                    two_table += "<td style='width: 90px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;' title='"+val.metricName+"'>"+val.metricName+"</td>";
                    two_table += "<td style='width: 90px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;' title='"+val.alarmTime+"'>"+val.alarmTime+"</td>";
                    two_table += "<td style='width: 90px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;' title='"+val.alarmValue+"'>"+val.alarmValue+"</td>";
                    two_table += "</tr>";
                });
                two_table += "</tbody>";
                jQuery("#two").append(two_table);
            }, function (error) {
                Loading.hide();
            });

            //资源列表
//            jQuery("#three").html("");
//            var three_table = '';
//            three_table += "<thead class='ng-scope'>";
//            three_table += "<tr>";
//            three_table += "<th style='width: 92px;'>资源实例</th>";
//            three_table += "<th style='width: 92px;'>管理IP</th>";
//            three_table += "<th style='width: 92px;'>资源类型组</th>";
//            three_table += "<th style='width: 92px;'>资源类型</th>";
//            three_table += "</tr>";
//            three_table += "</thead>";
//
//            if(rootMoId>0){
//                var searchthree = {};
//                searchthree.rootMoId=rootMoId;
//                DataLoader.getCurrentEventMo(searchthree,function(data){
//                    three_table += "<tbody>";
//                    $.each(data,function(i,val){
//                        three_table += "<tr>";
//                        three_table += "<td style='width: 92px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;' title='"+val.displayName+"'>"+val.displayName+"</td>";
//                        three_table += "<td>"+val.ip+"</td>";
//                        three_table += "<td>"+val.mocpDisplayName+"</td>";
//                        three_table += "<td>"+val.mocDisplayName+"</td>";
//                        three_table += "</tr>";
//                    });
//                    three_table += "</tbody>";
//                    jQuery("#three").append(three_table);
//                });
//            }else{
//                jQuery("#three").append(three_table);
//            }


            //故障单列表
            jQuery("#four").html("");
            var four_table = '';
            four_table += "<thead class='ng-scope'>";
            four_table += "<tr>";
            four_table += "<th style='width: 90px;'>标题</th>";
            four_table += "<th >报告人</th>";
            four_table += "<th >优先级</th>";
            four_table += "<th style='width: 90px;'>资源类型</th>";
            four_table += "<th style='width: 90px;'>资源实例</th>";
            four_table += "<th >处理人</th>";
            four_table += "<th >状态</th>";
            four_table += "<th style='width: 90px;'>创建时间</th>";
            four_table += "</tr>";
            four_table += "</thead>";

            var searchfour = {};
            searchfour.moId=moId;
            searchfour.offset=0;
            searchfour.limit=10000;
            DataLoader.getMoAllItsm(searchfour,function(data){
                four_table += "<tbody>";
                $.each(data.rows,function(i,val){
                    four_table += "<tr>";
                    four_table += "<td style='width: 90px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;' title='"+val.title+"'>"+val.title+"</td>";
                    four_table += "<td>"+val.reporter+"</td>";
                    four_table += "<td>"+val.params.priority+"</td>";
                    four_table += "<td style='width: 90px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;' title='"+val.params.mocId+"'>"+val.params.mocId+"</td>";
                    four_table += "<td style='width: 90px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;' title='"+val.params.moId+"'>"+val.params.moId+"</td>";
                    four_table += "<td>"+val.resolveUser+"</td>";
                    four_table += "<td>"+val.status+"</td>";
                    four_table += "<td style='width: 90px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;' title='"+val.applyTime+"'>"+val.applyTime+"</td>";
                    four_table += "</tr>";
                });
                four_table += "</tbody>";
                jQuery("#four").append(four_table);
            }, function (error) {
                Loading.hide();
            });


            $scope.eventDetailDialog.show();
            Loading.hide();
        },
        search: function (search, fnCallback) {
            $scope.searchPage.data.limit = search.limit;
            $scope.searchPage.data.offset = search.offset;
            $scope.searchPage.data.orderBy = search.orderBy;
            $scope.searchPage.data.orderByType = search.orderByType;
            if ($scope.searchPage.jump.jumpWay == "url"){
                var moId = $location.$$search.moId;
                $scope.searchPage.data.moId = "";
                var level = $location.$$search.level;
                if(level && !$scope.handJump){
                    $scope.searchPage.data.level = [Number(level)];
                }
                if (moId) {
                    $scope.alarmSetting = true;
                    if ($location.$$search.type && $location.$$search.type == 1) {
                        DataLoader.getMo({moId: moId}, {}, function (data) {
                            var jfId = data.mo.jfId;
                            if (jfId) {
                                $scope.searchPage.data.jfId = jfId;
                                $scope.searchPage.data.mocpId = "";
                                $timeout(function () {
                                    jQuery("#jfId option[value='" + $scope.searchPage.data.jfId + "']").attr("selected", "selected");
                                }, 2000);
                                Loading.show();
                                DataLoader.getCurrentEvent($scope.searchPage.data, function (data) {
                                    $scope.listPage.data = data.rows;
                                    fnCallback(data);
                                    $scope.listPage.checkedList = [];
                                    $scope.listPage.checkAllRow = false;
                                    Loading.hide();
                                }, function (error) {
                                    Loading.hide();
                                });
                                if ($scope.ifSearchLink){
                                    $timeout(function () {
                                        jQuery(".search-link").trigger("click");
                                    }, 500);
                                }
                            }
                        });
                    } else {
                        $scope.searchPage.data.moId = moId;
                        DataLoader.getMo({moId: moId}, {}, function (data) {
                            $scope.searchPage.data.mocpId = data.mo.mocpId;
                            $scope.searchPage.data.mocId = data.mo.mocId;
                            $timeout(function () {
                                jQuery("#jmocid option[value=" + data.mo.mocId + "]").attr("selected", "selected");
                            }, 3000);
                            $scope.searchPage.data.moName = data.mo.displayName;
                            DataLoader.getCurrentEvent($scope.searchPage.data, function (data) {
                                $scope.listPage.data = data.rows;
                                fnCallback(data);
                                $scope.listPage.checkedList = [];
                                $scope.listPage.checkAllRow = false;
                            });
                            $timeout(function () {
                                var treeObj = angular.element.fn.zTree.getZTreeObj($scope.mocTree.treeId);
                                var nodess = treeObj.getNodes();
                                if (nodess.length > 0) {
                                    var nodes = nodess[0].children;
                                    for (var i = 0; i < nodes.length; i++) {
                                        if (nodes[i].id == $scope.searchPage.data.mocpId) {
                                            treeObj.selectNode(nodes[i]);
                                            break;
                                        }
                                    }
                                }
                            }, 2000);
                            //2459BUG要求放开
                            if ($scope.ifSearchLink){
                                $timeout(function () {
                                    jQuery(".search-link").trigger("click");
                                }, 500);
                            }
                            DataLoader.getMetricByMocId({rule:'alarm',mocId:$scope.searchPage.data.mocId},{},function(data){
                                $scope.searchPage.datas.indicators = data;
                            });
                        });
                    }
                } else {
                    Loading.show();
                    DataLoader.getCurrentEvent($scope.searchPage.data, function (data) {
                        $scope.listPage.data = data.rows;
                        fnCallback(data);
                        $scope.listPage.checkedList = [];
                        $scope.listPage.checkAllRow = false;
                        if ($scope.type == 1) {
                            $("#alarmEventlistDataTable").dataTable().fnSetColumnVis(9, false);
                            $("#alarmEventlistDataTable").dataTable().fnSetColumnVis(12, false);
                            $("#alarmEventlistDataTable").dataTable().fnSetColumnVis(13, true);
                            $("#alarmEventlistDataTable").dataTable().fnSetColumnVis(14, true);
                        } else if ($scope.type == 0){
                            $("#alarmEventlistDataTable").dataTable().fnSetColumnVis(9, true);
                            $("#alarmEventlistDataTable").dataTable().fnSetColumnVis(12, true);
                            $("#alarmEventlistDataTable").dataTable().fnSetColumnVis(13, false);
                            $("#alarmEventlistDataTable").dataTable().fnSetColumnVis(14, false);
                        }
                        Loading.hide();
                    }, function (error) {
                        Loading.hide();
                    });
                }
            } else if ($scope.searchPage.jump.jumpWay == "page"){
                $scope.searchPage.data.moId = "";
                Loading.show();
                DataLoader.getCurrentEvent($scope.searchPage.data, function (data) {
                    $scope.listPage.data = data.rows;
                    fnCallback(data);
                    $scope.listPage.checkedList = [];
                    $scope.listPage.checkAllRow = false;
                    if ($scope.type == 1) {
                        $("#alarmEventlistDataTable").dataTable().fnSetColumnVis(9, false);
                        $("#alarmEventlistDataTable").dataTable().fnSetColumnVis(12, false);
                        $("#alarmEventlistDataTable").dataTable().fnSetColumnVis(13, true);
                        $("#alarmEventlistDataTable").dataTable().fnSetColumnVis(14, true);
                    } else if ($scope.type == 0){
                        $("#alarmEventlistDataTable").dataTable().fnSetColumnVis(9, true);
                        $("#alarmEventlistDataTable").dataTable().fnSetColumnVis(12, true);
                        $("#alarmEventlistDataTable").dataTable().fnSetColumnVis(13, false);
                        $("#alarmEventlistDataTable").dataTable().fnSetColumnVis(14, false);
                    }
                    Loading.hide();
                }, function (error) {
                    Loading.hide();
                });
            }
        }
    };
    $scope.listPage.settings = {
        reload : null,
        getData:$scope.listPage.action.search,//getData应指定获取数据的函数
        columns : [
            {
                sTitle: "<div class='checkbox'><label><input type='checkbox' ng-model='listPage.checkAllRow'><i></i></label></div>",
                mData:"id",
                mRender:function(mData,type,full) {
                    return '<div class="checkbox"><label><input type="checkbox" checklist-model="listPage.checkedList" checklist-value="'+mData+'" /><i></i></label></div>';
                }
            },
            {
                sTitle: "规则名称",
                mData:"ruleDisplayName",
                mRender:function(mData,type,full) {
                    return '<a href="javascript:;" title="'+ mData +'" ng-click="listPage.action.clickDetail('+full.id+')" >'+mData+'</a>';
                }
            },
            {
                sTitle: "资源实例",
                mData:"moName",
                mRender:function(mData,type,full) {
                    return Util.str2Html(mData);
                }
            },
            {
                sTitle: "告警等级",
                mData:"level",
                mRender:function(mData,type,full) {
                    return Util.findFromArray("value",mData,$rootScope.alarm.const.levels)["label"];
                }
            },
            {
                sTitle: "资源类型",
                mData:"mocName",
                mRender:function(mData,type,full) {
                    return Util.str2Html(mData);
                }
            },
            {
                sTitle: "资源指标组",
                mData:"indicatorName",
                mRender:function(mData,type,full) {
                    return Util.str2Html(mData);
                }
            },
            {
                sTitle: "资源指标",
                mData:"metricName",
                mRender:function(mData,type,full) {
                    return Util.str2Html(mData);
                }
            },
            {
                sTitle: "告警时间",
                mData:"alarmTime",
                mRender:function(mData,type,full) {
                    return Util.str2Html(mData);
                }
            },
            {
                sTitle: "告警内容",
                mData:"alarmValue",
                mRender:function(mData,type,full) {
                    return Util.str2Html(mData);
                }
            },
            {
                sTitle: "通知方式",
                mData:"notifyWay",
                mRender:function(mData,type,full) {
                    if(Util.notNull(mData)){
                        return mData.replace("SMS","短信").replace("Email","邮件");
                    }else{
                        return "";
                    }
                }
            },
            {
                sTitle: "确认状态",
                mData:"confirmStatus",
                mRender:function(mData,type,full) {
                    if(mData==1){
                        return "<span style='color:green'>已确认</span>";
                    }else{
                        return "<span style='color:red'>未确认</span>";
                    }
                }
            },
            {
                sTitle: "确认人",
                mData:"confirmUser"
            },
            {
                sTitle: "确认时间",
                mData:"confirmTime",
                mRender:function(mData,type,full) {
                    return Util.str2Html(mData);
                }
            },
            {
                sTitle: "恢复内容",
                mData: "recoveryValue",
                mRender: function (mData, type, full) {
                    return Util.str2Html(mData);
                }
            },
            {
                sTitle: "恢复时间",
                mData: "recoveryTime",
                mRender: function (mData, type, full) {
                    return Util.str2Html(mData);
                }
            },
            {
                sTitle: "操作",
                mData:"id",
                mRender:function(mData,type,full) {
                    if($scope.type==0){
                        var disabledOp = $rootScope.loginUserMenuMap[$rootScope.currentView];
                        if(disabledOp){
                            return (full.confirmStatus==1 ? '<i title="已确认" class="fa fa-check-circle Black" ></i>':'<i title="确认" class="fa fa-check-circle blue" ng-disabled="loginUserMenuMap[\''+$rootScope.currentView+'\']"></i>')
                                +'<i title="人工恢复" class="fa fa-male" ng-disabled="loginUserMenuMap[\''+$rootScope.currentView+'\']"></i>'
                                +'<i title="生成工单" class="fa fa-table" ng-disabled="loginUserMenuMap[\''+$rootScope.currentView+'\']"></i>';
                        }else{
                            return (full.confirmStatus==1 ? '<i title="已确认" class="fa fa-check-circle Black" ></i>':'<i title="确认" class="fa fa-check-circle blue" ng-click="listPage.action.confirm(\''+mData+'\')"></i>')
                                +'<i title="人工恢复" class="fa fa-male" ng-click="listPage.action.clear(\''+mData+'\')"></i>'
                                +'<i title="生成工单" class="fa fa-table" ng-click="listPage.action.generateOrders(\''+mData+'\')"></i>';
                        }
                    }else{
                        var disabledOp = $rootScope.loginUserMenuMap[$rootScope.currentView];
                        if(disabledOp){
                            return (full.confirmStatus==1 ? '<i title="已确认" class="fa fa-check-circle Black"></i>':'<i title="确认" class="fa fa-check-circle blue" ng-disabled="loginUserMenuMap[\''+$rootScope.currentView+'\']"></i>');
                        }else{
                            return (full.confirmStatus==1 ? '<i title="已确认" class="fa fa-check-circle Black"></i>':'<i title="确认" class="fa fa-check-circle blue" ng-click="listPage.action.historyconfirm(\''+mData+'\')"></i>');
                        };
                    }
                }
            }

        ] , //定义列的形式,mRender可返回html
        columnDefs : [
            { bSortable: false, aTargets: [ 0,8,9,13,15] },  //列不可排序
            { sWidth: "38px", aTargets: [ 0 ] },
            { sWidth: "85px", aTargets: [ 3,9 ] },
            { sWidth: "100px", aTargets: [ 5 ] },
            { sWidth: "70px", aTargets: [ 13 ] },
            { bVisible: false, aTargets: [ 13,14 ] }
        ] , //定义列的约束
        defaultOrderBy : [[ 8, "desc" ]]  //定义默认排序列为第7列倒序
    };

    //watch
    $scope.$watch("listPage.checkAllRow",function(newVal,oldVal){
        if(newVal){
            $scope.listPage.checkedList = Util.copyArray("id",$scope.listPage.data);
        }else{
            if($scope.listPage.data.length == $scope.listPage.checkedList.length){
                $scope.listPage.checkedList = [];
            }
        }
    },false);
    $scope.$watch("listPage.checkedList",function(newVal,oldVal){
        $scope.listPage.checkAllRow = newVal && newVal.length>0 && newVal.length==$scope.listPage.data.length;
    },true);


}]);

})(angular);