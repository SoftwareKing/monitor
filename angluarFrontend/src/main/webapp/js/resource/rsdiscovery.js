(function(angular){

angular.module('resource.discovery', [])
.controller('resourceDiscoveryCtrl',['$scope','$rootScope','Util','$timeout','Modal','DiscoveryClient','Loading','LocationClient',function($scope,$rootScope,Util,$timeout,Modal,DiscoveryClient,Loading,LocationClient){

        LocationClient.queryJf(function (data) {
            $scope.locationsForJF = data;
            $scope.locationsForJFSearch = [
                {"id": -1, "name": " 未设置机房 "}
            ].concat(data);
        });
        LocationClient.query(function (data) {
            $scope.locations = data;
            $scope.locationsForSearch = [
                {"id": -1, "name": " 未设置区域 "}
            ].concat(data);
        });

    $rootScope.resource.showDiscoveryPage = function(fnDiscovery,fnGetResult,fnAfterDiscovery,fnCloseModal){
        $scope.fnDiscovery = fnDiscovery;
        $scope.fnGetResult = fnGetResult;
        $scope.fnAfterDiscovery = fnAfterDiscovery;
        $scope.fnCloseModal = fnCloseModal;
        $scope.discoveryPage.init();
        Modal.show($scope.discoveryPage.modal.settings.id);
    };
//discoveryPage部分
    //scope定义
    $scope.discoveryPage = {
        ipValidate : /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
        init : function(){
            $scope.discoveryPage.data = {
                communities : [],
                segments : [],
                type : 1
            };
            $scope.discoveryPage.dataForSave = {
                communities : [],
                segments : [],
                type : 1
            };
            $scope.discoveryPage.row = {
                ipBegin : "",
                ipEnd : "",
                community : "public",
                jfId:""
            };
            $scope.discoveryPage.ipCount = 0;
            $scope.discoveryPage.communityCount = 0;
            $scope.discoveryPage.checkAllRow = false;
            $scope.discoveryPage.checkedList = [];
            $scope.discoveryPage.communityCheckAllRow = false;
            $scope.discoveryPage.communityCheckedList = [];
            $scope.discoveryPage.ipTable = [];
            $scope.discoveryPage.communityTable = [];
            $scope.discoveryPage.result = [];
            $scope.discoveryPage.nodes = [];
            $scope.discoveryPage.isScan = false;
            $scope.discoveryPage.scanBtnText = "开始扫描";
            $scope.discoveryPage.progress = 0;
            $scope.discoveryPage.progressLast = 0;
            $scope.discoveryPage.progressStep = 0;
            $scope.discoveryPage.progressType = "info";
            $scope.discoveryPage.pic = "img/scan.jpg";
            $scope.discoveryPage.progressText = "";
            $scope.discoveryPage.countText="";
            $scope.discoveryPage.resultText="";
            $scope.discoveryPage.total=0;
            $scope.discoveryPage.loadLast();
        },
        loadLast: function(){
            DiscoveryClient.load(function(data){
                if(data.communities){
                    $scope.discoveryPage.data.type = data.type;
                    $scope.discoveryPage.dataForSave.type = data.type;
                    for(var i =0;i<data.communities.length;i++ ){
                        $scope.discoveryPage.communityTable.push({
                            id:i+1,
                            community : data.communities[i]
                        });
                    }
                    $scope.discoveryPage.communityCount = data.communities.length;
                    for(var i =0;i<data.segments.length;i++ ){
                        var jfObj = $rootScope.resource.getLocation(data.segments[i].id);
                        $scope.discoveryPage.ipTable.push({
                            id:i+1,
                            jfId:data.segments[i].id,
                            ipBegin : data.segments[i].ipBegin,
                            ipEnd : data.segments[i].ipEnd,
                            locDisplayName : jfObj==null?"":$rootScope.resource.getLocation(jfObj.pid).name,
                            jfDisplayName : jfObj==null?"":jfObj.name
                        });
                    }
                    $scope.discoveryPage.ipCount = data.segments.length;
                }
            });
        },
        modal : {
            settings : {
                id : "mo_discovery_modal_div",
                title:"自动发现",
                closeBtnText:"关闭",
                saveBtnHide : true,
                hiddenFn : function(){
                    $scope.discoveryPage.action.stop();
                    if($scope.fnCloseModal){
                        $scope.fnCloseModal();
                    }
                }
            }
        },
        action : {
            addIpRow : function(){
                    if(!Util.notNull($scope.discoveryPage.row.ipBegin) && !Util.notNull($scope.discoveryPage.row.ipEnd)){
                        $rootScope.$alert("请输入IP地址范围");
                        return;
                    }
                    if(Util.notNull($scope.discoveryPage.row.ipBegin) && !Util.notNull($scope.discoveryPage.row.ipEnd)){
                        $scope.discoveryPage.row.ipEnd = $scope.discoveryPage.row.ipBegin;
                    }
                    if(!Util.notNull($scope.discoveryPage.row.ipBegin) && Util.notNull($scope.discoveryPage.row.ipEnd)){
                        $scope.discoveryPage.row.ipBegin = $scope.discoveryPage.row.ipEnd;
                    }
                    if(!$scope.discoveryPage.ipValidate.test($scope.discoveryPage.row.ipBegin) || !$scope.discoveryPage.ipValidate.test($scope.discoveryPage.row.ipEnd) ){
                        $rootScope.$alert("IP地址格式不正确");
                        return;
                    }

                    for(var i=0;i<$scope.discoveryPage.ipTable.length;i++){
                        var row = $scope.discoveryPage.ipTable[i];
                        if(row.ipBegin==$scope.discoveryPage.row.ipBegin && row.ipEnd==$scope.discoveryPage.row.ipEnd){
                            $rootScope.$alert("该IP地址范围已存在");
                            return;
                        }
                    }
                    var jfObj = $rootScope.resource.getLocation($scope.discoveryPage.row.jfId);
                    $scope.discoveryPage.ipCount++;
                    $scope.discoveryPage.ipTable.push({
                        id:$scope.discoveryPage.ipCount,
                        jfId:$scope.discoveryPage.row.jfId,
                        ipBegin : $scope.discoveryPage.row.ipBegin,
                        ipEnd : $scope.discoveryPage.row.ipEnd,
                        locDisplayName : jfObj==null?"":$rootScope.resource.getLocation(jfObj.pid).name,
                        jfDisplayName : jfObj==null?"":jfObj.name
                    });
                    $scope.discoveryPage.checkedList.push($scope.discoveryPage.ipCount);
            },
            addCommunityRow : function(){
                if(Util.notNull($scope.discoveryPage.row.community)){
                    for(var i=0;i<$scope.discoveryPage.communityTable.length;i++){
                        var row = $scope.discoveryPage.communityTable[i];
                        if(row.community==$scope.discoveryPage.row.community){
                            return;
                        }
                    }

                    $scope.discoveryPage.communityCount++;
                    $scope.discoveryPage.communityTable.push({
                        id:$scope.discoveryPage.communityCount,
                        community : $scope.discoveryPage.row.community
                    });
                    $scope.discoveryPage.communityCheckedList.push($scope.discoveryPage.communityCount);
                }
            },
            deleteIpRow : function(id){
                for(var i=0;i<$scope.discoveryPage.ipTable.length;i++){
                    if($scope.discoveryPage.ipTable[i].id == id){
                        $scope.discoveryPage.ipTable.splice(i,1);
                        break;
                    }
                }
            },
            deleteCommunityRow : function(id){
                for(var i=0;i<$scope.discoveryPage.communityTable.length;i++){
                    if($scope.discoveryPage.communityTable[i].id == id){
                        $scope.discoveryPage.communityTable.splice(i,1);
                        break;
                    }
                }
            },
            scan : function(){
                if($scope.discoveryPage.isScan){
                    $scope.discoveryPage.isScan = false;
                    $scope.discoveryPage.scanBtnText = "开始扫描";
                    $scope.discoveryPage.action.stop();
                }else{
                    if($scope.discoveryPage.ipTable.length==0){
                        $rootScope.$alert("请添加IP地址范围");
                        return;
                    }
                    if($scope.discoveryPage.checkedList.length==0){
                        $rootScope.$alert("请选择要扫描的IP地址范围");
                        return;
                    }
                    if($scope.discoveryPage.communityTable.length==0){
                        $rootScope.$alert("请添加共同体名称");
                        return;
                    }
                    if($scope.discoveryPage.communityCheckedList.length==0){
                        $rootScope.$alert("请选择要扫描的共同体名称");
                        return;
                    }
                    $scope.discoveryPage.countText="";
                    $scope.discoveryPage.resultText="";
                    $scope.discoveryPage.miniTickerTime =  new Date().getTime();
                    $scope.discoveryPage.progress = 100;
                    $scope.discoveryPage.progressLast = 0;
                    $scope.discoveryPage.progressText = "下发扫描任务中...";
                    $scope.discoveryPage.progressStep = 0;
                    $scope.discoveryPage.isScan = true;
                    $scope.discoveryPage.tick = true;
                    $scope.discoveryPage.scanBtnText = "停止扫描";
                    $scope.discoveryPage.data.communities = [];
                    $scope.discoveryPage.data.segments = [];
                    $scope.discoveryPage.dataForSave.communities = [];
                    $scope.discoveryPage.dataForSave.segments = [];
                    $scope.discoveryPage.result = [];
                    $scope.discoveryPage.nodes = [];
                    $scope.discoveryPage.progressType = "info";
                    for(var i=0;i<$scope.discoveryPage.ipTable.length;i++){
                        var row = $scope.discoveryPage.ipTable[i];
                        if(Util.exist(row.id,$scope.discoveryPage.checkedList)){
                            $scope.discoveryPage.data.segments.push({
                                id:row.jfId,
                                ipBegin : row.ipBegin,
                                ipEnd : row.ipEnd
                            });
                        }
                        $scope.discoveryPage.dataForSave.segments.push({
                            id:row.jfId,
                            ipBegin : row.ipBegin,
                            ipEnd : row.ipEnd
                        });
                    }
                    for(var i=0;i<$scope.discoveryPage.communityTable.length;i++){
                        var row = $scope.discoveryPage.communityTable[i];
                        if(Util.exist(row.id,$scope.discoveryPage.communityCheckedList)){
                            $scope.discoveryPage.data.communities.push(row.community);
                        }
                        $scope.discoveryPage.dataForSave.communities.push(row.community);
                    }
                    Util.go($scope);
                    DiscoveryClient.save($scope.discoveryPage.dataForSave);
                    $scope.fnDiscovery($scope.discoveryPage.data,function(){
                        $scope.discoveryPage.action.start();
                    },function(error){
                        $scope.discoveryPage.tick = false;
                        $scope.discoveryPage.scanBtnText = "开始扫描";
                        $scope.discoveryPage.isScan = false;
                    });
                }
            },
            start : function(){
                var getResult = function(){
                    if($scope.discoveryPage.tick!=true){
                        $scope.discoveryPage.action.stop();
                    }
                    $scope.fnGetResult(function(data){
                        if($scope.discoveryPage.progressType == "info"){
                            $scope.discoveryPage.progress = 0;
                            $scope.discoveryPage.progressText = "";
                            $scope.discoveryPage.progressType = "success";
                        }
                        if(data.status>=3){
                            $scope.discoveryPage.progress = 100;
                            $scope.discoveryPage.progressType = "success";
                            $scope.discoveryPage.progressText = "扫描完成";
                            $scope.discoveryPage.resultText= " "+data.mos.length + " 个";
                            $scope.discoveryPage.result = [];
                            for(var i=0;i<data.mos.length;i++){
                                var isNew = false;
                                for(var j=0;j<data.newMos.length;j++){
                                    if(data.mos[i].id==data.newMos[j].id){
                                        isNew = true;
                                        break;
                                    }
                                }
                                $scope.discoveryPage.result.push({
                                    type : data.mos[i].mocDisplayName,
                                    ip : data.mos[i].ip,
                                    state: (isNew?"新增":"已存在")
                                });
                            }
                            $scope.discoveryPage.action.stop();
                            $scope.discoveryPage.scanBtnText = "返回";
                            if($scope.fnAfterDiscovery){
                                $scope.fnAfterDiscovery(data);
                            }
                        }else{
                            if(data.scan && data.scan.nodes && data.scan.nodes.length>0){
                                for(var i=0;i<data.scan.nodes.length;i++){
                                    if(Util.notNull(data.scan.nodes[i])){
                                        $scope.discoveryPage.nodes.unshift(data.scan.nodes[i]);
                                    }
                                }
                            }
                            if(data.scan && data.scan.current && data.scan.total){
                                if(data.scan.current == data.scan.total){
                                    $scope.discoveryPage.progress=100;
                                }
                                if($scope.discoveryPage.progress<99){
                                    $scope.discoveryPage.countText= data.scan.current+" / "+data.scan.total;
                                }
                                $scope.discoveryPage.total=data.scan.total;
                                if(data.scan.current < data.scan.total){
                                    if(data.scan.current>$scope.discoveryPage.progressLast){
                                        $scope.discoveryPage.progressLast=data.scan.current;
                                        var real = 100*data.scan.current/data.scan.total;
                                        $scope.discoveryPage.progressStep =
                                            500
                                            *(100-$scope.discoveryPage.progress)
                                            *real
                                            /(100-real)
                                            /(new Date().getTime()-$scope.discoveryPage.miniTickerTime);
                                    }else{
                                        $scope.discoveryPage.progressStep = (100*data.scan.current/data.scan.total-$scope.discoveryPage.progress)/6;
                                        if($scope.discoveryPage.progressStep<0){
                                            $scope.discoveryPage.progressStep=0;
                                        }
                                    }
                                }
                            }
                            $scope.discoveryPage.ticker = $timeout(getResult,3000);
                        }
                    },function(error){
//                        $rootScope.$alert("自动发现失败:"+error.data.message);
                        $scope.discoveryPage.scanBtnText = "返回";
                        $scope.discoveryPage.action.stop();
                    });
                }

                $scope.discoveryPage.tick = true;
                $scope.discoveryPage.ticker = $timeout(getResult,3000);

                var mini = function(){
                    if($scope.discoveryPage.progressType == "info"){
                        $scope.discoveryPage.miniTicker = $timeout(mini,500);
                        return;
                    }

                    if($scope.discoveryPage.progress>=99){
                        $scope.discoveryPage.countText= $scope.discoveryPage.total+" / "+$scope.discoveryPage.total;
                        $scope.discoveryPage.progressType="warning";
                        $scope.discoveryPage.progress=100;
                        $scope.discoveryPage.progressText="处理数据中...";
                    }else{
                        $scope.discoveryPage.progress+=$scope.discoveryPage.progressStep;
                        $scope.discoveryPage.progressText= Math.round(10*$scope.discoveryPage.progress)/10+"%";
                        $scope.discoveryPage.miniTicker = $timeout(mini,500);
                    }
                };
                $scope.discoveryPage.miniTicker = $timeout(mini,500);
            },
            stop : function(){
                $timeout.cancel( $scope.discoveryPage.ticker );
                $timeout.cancel( $scope.discoveryPage.miniTicker );
                $scope.discoveryPage.tick = false;
            }
        },
        tick : false,
        ticker : null,
        miniTicker : null,
        miniTickerTime : null
    };

    $scope.$on("$destroy",function( event ) {
        $timeout.cancel( $scope.discoveryPage.ticker );
        $timeout.cancel( $scope.discoveryPage.miniTicker );
    });

    //初始化
    $scope.discoveryPage.init();

    //watch
    $scope.$watch("discoveryPage.tick",function(newVal,oldVal){
        if(newVal){
            $scope.discoveryPage.pic = "img/scan.gif";
        }else{
            $scope.discoveryPage.pic = "img/scan.jpg";
        }
    });

    $scope.$watch("discoveryPage.checkAllRow",function(newVal,oldVal){
        if(newVal){
            $scope.discoveryPage.checkedList = Util.copyArray("id",$scope.discoveryPage.ipTable);
        }else{
            if($scope.discoveryPage.ipTable.length == $scope.discoveryPage.checkedList.length){
                $scope.discoveryPage.checkedList = [];
            }
        }
    },false);
    $scope.$watch("discoveryPage.checkedList",function(newVal,oldVal){
        $scope.discoveryPage.checkAllRow = newVal && newVal.length>0 && newVal.length==$scope.discoveryPage.ipTable.length;
    },true);

    $scope.$watch("discoveryPage.communityCheckAllRow",function(newVal,oldVal){
        if(newVal){
            $scope.discoveryPage.communityCheckedList = Util.copyArray("id",$scope.discoveryPage.communityTable);
        }else{
            if($scope.discoveryPage.communityTable.length == $scope.discoveryPage.communityCheckedList.length){
                $scope.discoveryPage.communityCheckedList = [];
            }
        }
    },false);
    $scope.$watch("discoveryPage.communityCheckedList",function(newVal,oldVal){
        $scope.discoveryPage.communityCheckAllRow = newVal && newVal.length>0 && newVal.length==$scope.discoveryPage.communityTable.length;
    },true);
}]);

})(angular);

