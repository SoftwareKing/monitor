(function(angular){

angular.module('resource.type', [])
.controller('resourceTypeCtrl',['$scope','$rootScope','Util','$timeout','ProbeClient','MetricColorClient','Modal','Loading','MocClient',function($scope,$rootScope,Util,$timeout,ProbeClient,MetricColorClient,Modal,Loading,MocClient){
    $scope.treePage = {
        modal : {
            show:function(){
                $("#mocIconUploadInput").val("");
                Modal.show($scope.treePage.modal.settings.id,400,160);
            },
            restoreIcon :function (mocName) {
                Loading.show();
                MocClient.restoreIcon({mocName:mocName},{},function(){
                    $rootScope.resource.loadMoc();
                    Loading.hide();
                    $rootScope.$alert("恢复默认图标成功");
                    Modal.hide($scope.treePage.modal.settings.id);
                },function(){
                    Loading.hide();
                    $rootScope.$alert("恢复默认图标失败");
                });
            },
            upload :function (mocName) {
                Loading.show();
                var postUrl = "../dmonitor-webapi/resources/moc/"+mocName+"/icon";
                jQuery.ajaxFileUpload({
                    url: postUrl,
                    fileElementId: "mocIconUploadInput",
                    dataType: 'json',
                    success: function (data, status) {
                        Loading.hide();
                        if(data.errorCode){
                            if(data.message.indexOf("SizeLimitExceededException") > 0){
                                $rootScope.$alert("更换图标失败:图片大小超过了2MB限制");
                            }else{
                                $rootScope.$alert(data.message);
                            }
                        }else{
                            $rootScope.resource.loadMoc();
                            $rootScope.$alert("更换图标成功");
                            Modal.hide($scope.treePage.modal.settings.id);
                        }
                    },
                    error: function (data, status, e) {
                        Loading.hide();
                        $rootScope.$alert("更换图标失败:未知错误");
                    }
                });
            },
            settings : {
                id : "moc_icon_modal_div",
                title:"更换图标",
                saveBtnText:"保存",
                save : function(){
                    if($scope.treePage.mocId!=""){
                        var moc = $rootScope.resource.getMoc($scope.treePage.mocId);
                        if(moc){
                            $scope.treePage.modal.upload(moc.name);
                        }
                    }
                },
                btn1BtnShow:true,
                btn1BtnText:"恢复默认",
                btn1 : function(){
                    if($scope.treePage.mocId!=""){
                        var moc = $rootScope.resource.getMoc($scope.treePage.mocId);
                        if(moc){
                            $scope.treePage.modal.restoreIcon(moc.name);
                        }
                    }
                }
            }
        },
        mocId : "",
        metricData : [],
        metricGroupId : "",
        metricId : "",
        probeData : [],
        mocNodeDom : function(data){
            return "<label style='width:250px;' title='"+data.displayName+"'>"+data.displayName+"</label><label style='width:100px;' class='center' title=''>"+(data.system?"是":"否")+"</label><label style='width:210px;' class='center' title='' for='none'><button ng-disabled='$root.loginUserMenuMap[$root.currentView]' ng-click='treePage.modal.show()' title=''>更换图标</button></label>"
        },
        metricNodeDom : function(data){
            var metricType = "性能指标";
            if(data.type==0){
                metricType = "索引指标";
            }else if(data.type==1){
                metricType = "配置指标";
            }
            var valType = data.valType;
            if(data.valType=="string"){
                valType = "字符型";
            }else if(data.valType=="enum"){
                valType = "枚举型";
            }else if(data.valType=="int"){
                valType = "整型";
            }else if(data.valType=="long"){
                valType = "长整型";
            }else if(data.valType=="float"){
                valType = "浮点型";
            }else if(data.valType=="double"){
                valType = "双精度浮点型";
            }
            var canHistory = data.rule==2 || data.rule==3;
            var canAlarm = data.rule==1 || data.rule==3;
            var htmlStr = "<label style='width:112px;' title='"+data.displayName+"'>"+Util.shortStr(data.displayName,17)+"</label>"
                +"<label style='width:80px;' title=''>"+metricType+"</label>"
                +"<label style='width:80px;' title=''>"+(data.unit?data.unit:"")+"</label>";
            if(data.valType=="enum"){
                var tip = "";
                for(var key in data.enumMap){
                    tip+=key+":"+data.enumMap[key]+"&#10;";
                }
                htmlStr+="<label style='width:100px;' title='"+tip+"'>"+valType+"</label>"
            }else{
                htmlStr+="<label style='width:100px;' title=''>"+valType+"</label>"
            }
            if(canHistory){
                htmlStr+="<label style='width:100px;' class='green'>是</label>";
            }else{
                htmlStr+="<label style='width:100px;' class='red'>否</label>";
            }
            if(canAlarm){
                htmlStr+="<label style='width:100px;' class='green'>是</label>";
            }else{
                htmlStr+="<label style='width:100px;' class='red'>否</label>";
            }
            return htmlStr;
        }
    };

    $scope.$watch("treePage.mocId",function(newVal, oldVal){
        if(Util.notNull(newVal)){
            $scope.treePage.metricData = Util.findAllFromArray("mocId",newVal,$rootScope.resource.metric);

            var mocName = $rootScope.resource.getMoc(newVal).name;
            if(mocName == "elink"){
                MetricColorClient.getElink({},{},function(rows){     //包含topoTag=3,4 的线路
                    $scope.rowType = "line";
                    $scope.metricColorList = {}
                    rows.forEach(function(obj){
                        if($scope.metricColorList[obj.mocName]){
                            $scope.metricColorList[obj.mocName].push(obj);
                        }else{
                            $scope.metricColorList[obj.mocName] = [];
                            $scope.metricColorList[obj.mocName].push(obj);
                        }
                    });

                    $scope.listColor = [];
                    var keys = ["windows","linux","aix","hpux","solaris","router","switch2","switch3","security"];   //列表排列顺序
                    keys.forEach(function(key){
                        $scope.listColor.push($scope.metricColorList[key]);
                    });
                });
            }else{
                MetricColorClient.query({mocName:mocName},{},function(rows){
                    $scope.rowType = "node";
                    $scope.metricColorList = [];
                    for(var i=0;i<rows.length;i++){
                        var row = rows[i];
                        if(row.topoTag == 0 || row.topoTag == 1 || row.topoTag == 2){  // 0:普通节点， 包含范围>=topo节点
                            $scope.metricColorList.push(row);
                        }
                    }
                });
            }

            ProbeClient.query( {mocName:$rootScope.resource.getMoc(newVal).name},{},function(data){
                $scope.treePage.probeData = data;
            });
        }else{
            $scope.treePage.probeData = [];
        }
    },false);

    function init(){
        if($rootScope.resource.ready){
            $scope.treePage.mocId = $rootScope.resource.moc[0].children[0].id;
            $timeout(function(){
                $scope.treePage.metricId = $scope.treePage.metricData[0].children[0].id;
            },200);
        }else{
            $timeout(init,200);
        }
    }
    $timeout(init,200);

    $scope.$watch("treePage.metricId",function(newVal, oldVal){
        if(Util.notNull(newVal)){
            ProbeClient.queryMetric( {metricId:newVal},{},function(data){
                $scope.treePage.probeData = data;
            });
        }
    },false);

    var composePostData = function(list, postData){
        $("#editColorForm .data-row").each(function(index,obj){
            var firstValue = parseInt($(obj).find(".first-value").val());
            var secondValue = parseInt($(obj).find(".second-value").val());

            var topoTag = 0;
            if($(obj).find(".topoNodeTag").length > 0){
                topoTag = $(obj).find(".topoNodeTag:checked").val() ? 1:2;
            }else if($(obj).find(".topoLineTag").length > 0){
                topoTag = $(obj).find(".topoLineTag:checked").val() ? 3:4;
            }

            var reverse = $(obj).find(".reverse").val();
            var mc =list[index];
            var dataObj = {};
            dataObj.mocName = mc.mocName;
            dataObj.mocpName = mc.mocpName;
            dataObj.indicatorName = mc.indicatorName;
            dataObj.metricName = mc.metricName;
            dataObj.point1 = firstValue;
            dataObj.point2 = secondValue;
            dataObj.topoTag = topoTag;
            dataObj.reverse = reverse;
            postData.push(dataObj);
        });
    };

/*    $scope.toggleValue = function(target){    //取消选中radio
      if(target.checked = true){
          target.checked = false;
      }
    };*/

    $scope.saveMetricColor = function(){
        var postData = [];
        if($scope.rowType == "line"){
            var list = [];
            $scope.listColor.forEach(function(obj){
                list = list.concat(obj);
            });
            composePostData(list,postData);
        }else{
            composePostData($scope.metricColorList,postData);
        }

        MetricColorClient.saveAll({},postData,function(data){
            $rootScope.$alert("保存成功");
        },function(error){
            $rootScope.$alert("保存失败");
        });
    };

}])

})(angular);