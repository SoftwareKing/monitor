(function(angular){

angular.module('resource.lib', [])
.controller('resourceInstanceCtrl',['$scope','$rootScope','Util','$timeout','MoClient','Modal','DiscoveryClient','Loading','$routeParams','ProbeClient',"LocationClient",'AssocClient','MocClient',function($scope,$rootScope,Util,$timeout,MoClient,Modal,DiscoveryClient,Loading,$routeParams,ProbeClient,LocationClient,AssocClient,MocClient){
    var SUB_PAGE_CODE="sourceInstance";

    LocationClient.queryJf(function(data){
        $scope.locationsForJF =data;
        $scope.locationsForJFSearch =[{"id":-1,"name":" 未设置机房 "}].concat(data);
    });
    LocationClient.query(function(data){
        $scope.locations = data;
        $scope.locationsForSearch =[{"id":-1,"name":" 未设置区域 "}].concat(data);
    });


//公共部分
    $scope.common = {
        action : {
            showEditPage:function(){
                if("environment" ==  $scope.editPage.accessCtr.type){
                    $scope.editPage.modal.settings.saveBtnHide = true;
                    $scope.listPage.action.initEquMoTree("environment");
                }else{
                    $scope.editPage.modal.settings.saveBtnHide = false;
                }
                if($scope.editPage.isEdit){
                    $scope.editPage.modal.settings.title = "编辑";
                }else{
                    $scope.editPage.modal.settings.title = "新增";
                }
                Modal.show($scope.editPage.modal.settings.id);
            }
        },
        alertSettings : {
            id : "alert_div",
            info : ""
        },
        confirmSettings : {
            id : "confirm_div",
            info : "",
            save:null
        },
        confirm : function(msg,fn,title){
            $scope.common.confirmSettings.info = msg;
            $scope.common.confirmSettings.save = fn;
            $scope.common.confirmSettings.title = title;
            Modal.show($scope.common.confirmSettings.id);
        }
    };

//editPage部分
    //scope定义
    $scope.editPage = {
        interfaceList:[],
        bandWidthList:[],
        editSn : false,
        postMoData:{},  // postMo： {mo:data{},,moIds:[]}
        data:{},
        relationShip: {
            moIds:[]  //业务树的关联设备id：右端moIds,  所属主机id：左端moIds
        },
        relationHostMoId:null, //左端moIds
        ipValidate : /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
        portValidate : /^\d+$/,
        emptyValidate : /^[\s\S]+$/,
        mode: ["POST"],
        isLoginChecked : true,
        accessCtr : {
            type:"host",
            mocName:"windows"
        },
        protocolData : {
            probeInfoId : null,  //when edit mo first, before change protocol
            protocolList : null,
            protocolValue : null
        },
        getProtocalList : function(mocName){
            ProbeClient.query( {mocName:mocName},{},function(rows){
                $scope.editPage.protocolData.protocolList = [];
                if(rows.length > 0){
                    $scope.editPage.protocolData.protocolList = rows;
                    if($scope.editPage.isEdit){
                        if($scope.editPage.protocolData.probeInfoId){
                            for(var i=0;i<rows.length;i++){
                                if(rows[i].id == $scope.editPage.protocolData.probeInfoId){
                                    $scope.editPage.protocolData.protocolValue = rows[i].accessType + "-" + $scope.editPage.protocolData.probeInfoId;
                                    $scope.editPage.access.protocol =rows[i].accessType;
                                    break;
                                }
                            }
                        }else{
                            //a mo auto discovery when has no protocol, then select first protocol
                            $scope.editPage.protocolData.protocolValue = rows[0].accessType + "-" + rows[0].id;
                            $scope.editPage.access.protocol =rows[0].accessType;
                        }
                        $scope.editPage.data.access.protocol =  $scope.editPage.access.protocol;
                        $scope.editPage.access = $scope.editPage.data.access;  //赋值,触发必填项校验
                    }else{
                        $scope.editPage.access.protocol =rows[0].accessType;
                        $scope.editPage.protocolData.protocolValue = rows[0].accessType + "-" + rows[0].id;  //select first protocol
                    }
                }
                $scope.editPage.loadProtocolDefaultData(mocName);
            });
        },

        loadProtocolDefaultData : function(mocName){
            if(Util.exist(mocName,["linux","aix","hpux","solaris"])){  //SSH
                if(!Util.notNull($scope.editPage.data.id) || !Util.notNull($scope.editPage.access.port)){
                    $scope.editPage.access.port=22;
                }
            }else if(Util.exist(mocName,["iis"])){  //WMI
                if(!Util.notNull($scope.editPage.data.id) || !Util.notNull($scope.editPage.access.port)){
                    $scope.editPage.access.port=135;
                }
            }else if(Util.exist(mocName,["windows"])){  //windows
                if(!Util.notNull($scope.editPage.data.id) || !Util.notNull($scope.editPage.access.port)){
                    if($scope.editPage.access.protocol=="wmi"){
                        $scope.editPage.access.port=135;
                    }else if($scope.editPage.access.protocol=="snmp"){
                        $scope.editPage.access.port=161;
                        $scope.editPage.access.version="V2C";
                    }
                }
                if($scope.editPage.access.protocol=="snmp"){
                    if(!Util.notNull($scope.editPage.data.id) || !Util.notNull($scope.editPage.access.community)){
                        $scope.editPage.access.community="public";
                    }
                }
            }else if(Util.exist(mocName,["tapearray","vtl"])){  //windows
                if(!Util.notNull($scope.editPage.data.id) || !Util.notNull($scope.editPage.access.port)){
                    $scope.editPage.access.port=161;
                }
                if(!Util.notNull($scope.editPage.data.id) || !Util.notNull($scope.editPage.access.community)){
                    $scope.editPage.access.community="public";
                }
                if(!Util.notNull($scope.editPage.data.id) || !Util.notNull($scope.editPage.access.version)){
                    $scope.editPage.access.version="V2C";
                }
            }else if(Util.exist(mocName,["router","switch2","switch3","loadbalancing","security","fcswitch"])){  //SNMP
                if(!Util.notNull($scope.editPage.data.id) || !Util.notNull($scope.editPage.access.port)){
                    $scope.editPage.access.port=161;
                }
                if(!Util.notNull($scope.editPage.data.id) || !Util.notNull($scope.editPage.access.community)){
                    $scope.editPage.access.community="public";
                }
                if(!Util.notNull($scope.editPage.data.id) || !Util.notNull($scope.editPage.access.version)){
                    $scope.editPage.access.version="V2C";
                }
            }else if(Util.exist(mocName,["mssql","sybase","oracle","oraclerac"])){  //JDBC
                if(!Util.notNull($scope.editPage.data.id) || !Util.notNull($scope.editPage.access.port)){
                    if(mocName=="oracle" || mocName=="oraclerac"){
                        $scope.editPage.access.port=1521;
                    }else if(mocName=="mssql"){
                        $scope.editPage.access.port=1433;
                        $scope.editPage.access.database = 'master';
                    }else if(mocName=="sybase"){
                        $scope.editPage.access.port=5000;
                    }
                }
            }else if(Util.exist(mocName,["weblogic"])){  //WEBLOGIC
                if(!Util.notNull($scope.editPage.data.id) || !Util.notNull($scope.editPage.access.port)){
                    $scope.editPage.access.port=7001;
                }
            }else if(Util.exist(mocName,["mq"])){  //WSMQ
                if(!Util.notNull($scope.editPage.data.id) || !Util.notNull($scope.editPage.access.port)){
                    $scope.editPage.access.port=1414;
                }
            }else if(Util.exist(mocName,["http"])){  //http
                if(!Util.notNull($scope.editPage.data.id) || !Util.notNull($scope.editPage.access.method)){
                    $scope.editPage.access.method="GET";
                }
            }else if(Util.exist(mocName,["apache"])){  //apache
                $scope.editPage.access.method="POST";
            }else if(Util.exist(mocName,["diskarray"])){
                $scope.editPage.access.port=5989;
            }
        },

        init : function(mo){
            $scope.editPage.editSn = false;
            $scope.editPage.editClusterName = false;
            $scope.editPage.editServerName = false;
            if(mo){
                $scope.editPage.init();
                Util.init($scope.editPage.data,mo);
            }else{
                Util.init($scope.editPage.data,{
                    id:null,
                    name:null,
                    displayName:null,
                    ip:null,
                    remark:null,
                    mocId:null,
                    mocName:null,
                    mocpId:null,
                    mocpName:null,
                    locId:null,
                    cabinet:null,
                    rack:null,
                    user:null,
                    userContact:null,
                    jfId : null,
                    access : null,
                    resource : null
                });
            }
        },
        initAccess : function(mocId){
            $scope.editPage.interfaceList = [];
            $scope.editPage.bandWidthList = [];
            if(mocId){
                var mocName;
                if($scope.editPage.isEdit){
                    $scope.editPage.accessCtr.type = $scope.editPage.data.mocpName;
                    $scope.editPage.access = {};
                    $scope.editPage.resource = $scope.editPage.data.resource;
                    if($scope.editPage.data.mocName == "elink"){
                        $scope.editPage.resource.sampleLeft = ''+ $scope.editPage.resource.sampleLeft;
                    }else if($scope.editPage.data.mocName == "diskarray"){
                        $scope.editPage.access.sn = $scope.editPage.data.access.sn;
                    }
                    mocName = $scope.editPage.data.mocName;
                }else{
                    $scope.editPage.access = {};
                    $scope.editPage.resource = {};
                    $scope.editPage.relationShip = {moIds:[]};
                    $scope.editPage.relationHostMoId = null;
                    $scope.listPage.relationHost = null;
                    $scope.editPage.data.mocId = mocId;

                    var moc = $rootScope.resource.getMoc(mocId);
                    if(moc){
                        mocName = moc.name;
                        if(mocName == "elink"){
                            $scope.editPage.resource.sampleLeft = 'true'; //default: 主
                        }
                    }
                }

                if(mocName){
                    $scope.editPage.accessCtr.mocName = mocName;
                    $scope.editPage.getProtocalList(mocName);

                    if($scope.editPage.accessCtr.type == "application"){
                        $scope.listPage.action.initBusMoTree("host,network,storage,database,middleware,service");
                    }
                    if(mocName == "weblogiccluster"){
                        MoClient.getResource( {mocpNames:"middleware"},function(data){
                            if (data.result == "success") {
                                $scope.listPage.bussinessTree.data = data.msg;
                                var len = data.msg[0].children.length;
                                for(var i=0;i<len;i++){
                                    if("weblogic" == data.msg[0].children[i].key){
                                        $scope.listPage.bussinessTree.data[0].children = [data.msg[0].children[i]];
                                        break;
                                    }
                                }
                            }
                        });
                    }else if(mocName == "oraclerac"){
                        MoClient.getResource( {mocpNames:"database"},function(data){
                            if (data.result == "success") {
                                $scope.listPage.bussinessTree.data = data.msg;
                                var len = data.msg[0].children.length;
                                for(var i=0;i<len;i++){
                                    if("oracle" == data.msg[0].children[i].key){
                                        $scope.listPage.bussinessTree.data[0].children = [data.msg[0].children[i]];
                                        break;
                                    }
                                }
                            }
                        });
                    }
                }
            }else{
                $scope.editPage.data = {};
            }
      },

        modal : {
            settings : {
                id : "mo_edit_modal_div",
                title:"新增",
                saveBtnText:"保存",
                saveBtnHide:true,
                saveDisabled:false,
                hiddenFn : function(){
                    $scope.editPage.init();
                    $scope.editPage.initAccess();
                    $scope.listPage.action.initResourceTreeData();
                    $scope.listPage.action.initProtocolData();
                    $scope.listPage.relationHost = null;
                    $scope.editPage.relationHostMoId = null;
                    $scope.editPage.relationShip.moIds = [];
                    $scope.listPage.snList = [];
                    $scope.listPage.clusterNameList = [];
                    $scope.listPage.serverNameList = [];

                    if($scope.editPage.accessCtr.type == "environment"){
                        $scope.listPage.action.revertCurrentMocChildren();
                    }
                    Util.go($scope);
                },
                save : function(){

                    if($scope.editPage.accessCtr.mocName == "elink"){
                        if($scope.editPage.resource.leftMoId == $scope.editPage.resource.rightMoId){
                            $rootScope.$alert("线路两端不能为同一设备，请重新选择！");
                            return false;
                        }
                    }

                    if($scope.editPage.accessCtr.mocName == "http"){
                        if($scope.editPage.access.method == "GET"){
                            $scope.editPage.access.loginUrl = null;
                            $scope.editPage.access.userNameKey = null;
                            $scope.editPage.access.userName = null;
                            $scope.editPage.access.passwordKey = null;
                            $scope.editPage.access.password = null;
                            $scope.editPage.access.loginCodeKey = null;
                            $scope.editPage.access.loginCode = null;
                        }else if($scope.editPage.access.method == "POST"){
                            if($scope.editPage.isLoginChecked == false){
                                $scope.editPage.access.loginUrl = null;
                                $scope.editPage.access.userNameKey = null;
                                $scope.editPage.access.userName = null;
                                $scope.editPage.access.passwordKey = null;
                                $scope.editPage.access.password = null;
                                $scope.editPage.access.loginCodeKey = null;
                                $scope.editPage.access.loginCode = null;
                                $scope.editPage.access.condition = null;
                            }
                        }
                    }

                    $scope.editPage.postMoData = {mo:{},moIds:null};
                    $scope.editPage.data.access = $scope.editPage.access;
                    if($scope.editPage.interfaceList.length){
                        var nioMap = {};
                        for(var i=0;i<$scope.editPage.interfaceList.length;i++){
                            nioMap[$scope.editPage.interfaceList[i]]=Number($scope.editPage.bandWidthList[i]);
                        }
                        $scope.editPage.data.access.reserve = JSON.stringify(nioMap);
                    }
                    $scope.editPage.data.resource = $scope.editPage.resource;
                    $scope.editPage.postMoData.mo = $scope.editPage.data;
                    if($scope.editPage.relationHostMoId){
                        $scope.editPage.relationShip.moIds.push($scope.editPage.relationHostMoId);
                    }
                    $scope.editPage.postMoData.moIds = $scope.editPage.relationShip.moIds;
                    Loading.show();

                    if($scope.editPage.isEdit){
                        MoClient.update({id:$scope.editPage.data.id},$scope.editPage.postMoData,function(data){
                            if($scope.editPage.isToRefresh){
                                $scope.listPage.action.refresh($scope.editPage.data.id,true);  //refresh
                            }
                            $scope.editPage.protocolData.protocolValue = null;
                            $scope.listPage.action.initResourceTreeData();
                            $scope.listPage.action.initProtocolData();
                            $scope.listPage.relationHost = null;
                            $scope.editPage.relationHostMoId = null;
                            $scope.editPage.relationShip.moIds = [];
                            $scope.listPage.snList = [];
                            $scope.listPage.clusterNameList = [];
                            $scope.listPage.serverNameList = [];
                            $scope.searchPage.action.search();
                            Loading.hide();
                            $rootScope.$alert("修改资源成功");
                            Modal.hide($scope.editPage.modal.settings.id);
                        },function(error){
                            Loading.hide();
//                            $rootScope.$alert("保存失败:"+error.data.message);
                        });
                    }else{
                        MoClient.save({},$scope.editPage.postMoData,function(data){
                            if($scope.editPage.isToRefresh){
                                $scope.listPage.action.refresh(data.mo.id,true);  //refresh
                            }
                            $scope.editPage.protocolData.protocolValue = null;
                            $scope.listPage.action.initResourceTreeData();
                            $scope.listPage.action.initProtocolData();
                            $scope.listPage.relationHost = null;
                            $scope.editPage.relationHostMoId = null;
                            $scope.editPage.relationShip.moIds = [];
                            $scope.listPage.snList = [];
                            $scope.listPage.clusterNameList = [];
                            $scope.listPage.serverNameList = [];
                            Loading.hide();
                            $rootScope.$alert("新增资源成功");
                            Modal.hide($scope.editPage.modal.settings.id);
                            $scope.searchPage.action.search(true);
                            $rootScope.resource.loadMocCount(); //刷新统计数据
                        },function(error){
                            Loading.hide();
//                            $rootScope.$alert("保存失败:"+error.data.message);
                        });
                    }
                }
            }
        },
        isEdit : false,
        leftType : "",
        rightType : "",
        editMocTreeData : []
    };
    $scope.editPage.action={
        testMo : function(){
            $scope.editPage.data.access = $scope.editPage.access;
            Loading.show();
            MoClient.test({},$scope.editPage.data,function(data){
                Loading.hide();
                if(data.success==true){
                    $rootScope.$alert("测试通过");
                }else{
                    $rootScope.$alert("测试未通过,请尝试修改连接参数后重试");
                }
            },function(error){
                Loading.hide();
//                $rootScope.$alert("测试失败:"+error.data.message);
            });
        }
    };

    //初始化
    $scope.editPage.init();
    $scope.editPage.initAccess();
    $rootScope.resource.loadMocCount();

    //watch
    $scope.$watch("[editPage.data.ip,editPage.access.port,editPage.access.user,editPage.access.sn,editPage.access.database,editPage.access.version,editPage.access.community,editPage.resource.leftPort,editPage.resource.rightPort,editPage.resource.leftMoId ,editPage.resource.rightMoId, editPage.access.url,editPage.access.loginUrl,editPage.access.userNameKey,editPage.access.userName,editPage.access.passwordKey,editPage.access.password,editPage.access.loginCodeKey,editPage.access.loginCode,editPage.access.condition,editPage.isLoginChecked,editPage.access.server,editPage.access.method ]",function(newVal){
        if($scope.editPage.access){
            if($scope.editPage.access.protocol == "jdbc"){
                $scope.editPage.modal.settings.saveDisabled = !Util.notNull(newVal[0],newVal[1],newVal[2],newVal[4]);
            }else if($scope.editPage.access.protocol == "smi-s"){
                $scope.editPage.modal.settings.saveDisabled = !Util.notNull(newVal[0],newVal[1],newVal[2],newVal[3]);
            }else if($scope.editPage.access.protocol == "snmp"){
                $scope.editPage.modal.settings.saveDisabled = !Util.notNull(newVal[0],newVal[1],newVal[5],newVal[6]);
            }else if(Util.exist($scope.editPage.access.protocol,["ssh","wmi","wsmq"])){
                $scope.editPage.modal.settings.saveDisabled = !Util.notNull(newVal[0],newVal[1],newVal[2]);
            }else if(Util.exist($scope.editPage.access.protocol,["weblogic8","weblogic"])){
                $scope.editPage.modal.settings.saveDisabled = !Util.notNull(newVal[0],newVal[1],newVal[2],newVal[21]);
            }else if($scope.editPage.access.protocol == "http" && $scope.editPage.data.mocId==72){
                $scope.editPage.modal.settings.saveDisabled = !Util.notNull(newVal[0],newVal[1],newVal[11]);
            }else if($scope.editPage.access.protocol == "http"){
                if($scope.editPage.access.method == "GET"){
                    $scope.editPage.modal.settings.saveDisabled = !Util.notNull(newVal[11],newVal[19]);
                }else if($scope.editPage.access.method == "POST"){
                    if($scope.editPage.isLoginChecked){
                        $scope.editPage.modal.settings.saveDisabled = !Util.notNull(newVal[11],newVal[12],newVal[13],newVal[14],newVal[15],newVal[16],newVal[17],newVal[18],newVal[19]);
                    }else{
                        $scope.editPage.modal.settings.saveDisabled = !Util.notNull(newVal[11]);
                    }
                }
            }
        }

        if($scope.editPage.accessCtr.type == "link"){
            if (!Util.notNull(newVal[7],newVal[8],newVal[9],newVal[10])){
                $scope.editPage.modal.settings.saveDisabled = true;
            } else {
                $scope.editPage.modal.settings.saveDisabled = false;
            }
        }else if($scope.editPage.accessCtr.type == "application"){
            $scope.editPage.modal.settings.saveDisabled = false;
        }
    },true);

    $scope.$watch("editPage.data.mocId",function(newVal){
        if(newVal){
            $scope.editPage.initAccess(newVal);
        }
    },false);

    $scope.$watch("editPage.protocolData.protocolValue",function(newVal) {
        if(newVal){
            if($scope.editPage.protocolData.probeInfoId > 0){   // edit方式进入人工添加的mo
                $scope.editPage.protocolData.probeInfoId = null;
            }else{   //add 方式 进入，或者是自动发现方式
                if(!$scope.editPage.isEdit){    // 自动发现的mo，不清除基本信息
                    var mocId = $scope.editPage.data.mocId;
                    $scope.editPage.data = {};
                    $scope.editPage.data.mocId = mocId;
                }
                $scope.editPage.access = {};
                var pos =  $scope.editPage.protocolData.protocolValue.lastIndexOf("-");
                $scope.editPage.access.protocol = $scope.editPage.protocolData.protocolValue.substring(0,pos);
                $scope.editPage.access.probeInfoId = $scope.editPage.protocolData.protocolValue.substring(pos+1);
            }
            $scope.editPage.loadProtocolDefaultData($scope.editPage.accessCtr.mocName);
        }
    },true);

    $scope.$watch("editPage.data.locId",function(newVal){
        if(newVal){
            LocationClient.queryJf({locId:newVal},{},function(data){
                $scope.listPage.jfList = data;
            });
        }
    },false);

//searchPage部分
    //scope定义
    $scope.searchPage = {
        canFresh:true,
        canOp:true,
        hasIp:true,
        hasLoc:true,
        selectMoc:null,
        selectMocP:null,
        isLeaf : function(nodeData){
            return nodeData.id==-1 || nodeData.isJF;
        },
        init : function(){
            $scope.searchPage.data = {
                displayName:"",
                ip:"",
                mocpId:"",
                mocId:"",
                locId:"",
                businessId:"",
                limit : 20, //每页条数(即取多少条数据)
                offset : 0 , //从第几条数据开始取
                orderBy : "",//排序字段
                orderByType : "" //排序顺序
            }
        },
        checkAllLevel:false
    };
    $scope.searchPage.action={};
    $scope.searchPage.action.search = function(cancelSort){
        if(!cancelSort){
            $rootScope.resource.loadBusiness();
        }
        $scope.listPage.settings.reload(cancelSort);
    };
    //初始化
    $scope.searchPage.init();
    //watch
    $scope.$watch("searchPage.data.mocpId",function(newVal,oldVal){
        var tempMocId = $scope.searchPage.data.mocId;
        $scope.searchPage.data.mocId = "";
        $scope.searchPage.resourceTypes = [];
        if(Util.notNull(newVal)){
            $scope.searchPage.resourceTypes = Util.findFromArray("id",newVal,$rootScope.resource.moc)["children"];
            if(Util.findFromArray("id",tempMocId,$scope.searchPage.resourceTypes)!=null){
                $timeout(function(){
                    $scope.searchPage.data.mocId = tempMocId;
                },200);
            }
            if($scope.listPage.isTableReady){
                $scope.listPage.settings.reload(true);
            };
        }

        //清除搜索项
        if(newVal!=null && newVal!=oldVal){
            $scope.searchPage.data.displayName="";
            $scope.searchPage.data.ip="";
            $scope.searchPage.data.locId="";
            $scope.searchPage.data.businessId="";
            $scope.searchPage.data.jfId="";
            $scope.searchPage.data.refreshStatus="";
        }

        //控制IP列的显示与隐藏
        if(newVal!=null){
            $scope.searchPage.canFresh = newVal!=6 && newVal!=7 && newVal!=8 && newVal!=10;
            $scope.searchPage.hasIp = newVal!=6 && newVal!=7 && newVal!=8 && newVal!=10;
            $scope.searchPage.canOp = newVal!=8;
            $scope.searchPage.hasLoc = newVal!=7;
            $scope.searchPage.hasBus = newVal!=10 && newVal!=7;
            try {
                $("#listPageDataTable").dataTable().fnSetColumnVis(2,$scope.searchPage.hasIp);
                $("#listPageDataTable").dataTable().fnSetColumnVis(7,$scope.searchPage.canFresh);
                $("#listPageDataTable").dataTable().fnSetColumnVis(8,$scope.searchPage.canOp);
                $("#listPageDataTable").dataTable().fnSetColumnVis(0,$scope.searchPage.canOp);
                $("#listPageDataTable").dataTable().fnSetColumnVis(5,$scope.searchPage.hasLoc);
                $("#listPageDataTable").dataTable().fnSetColumnVis(6,$scope.searchPage.hasBus);
            } catch(error) {
                //do nothing,产生原因是还没初始化完成
            }
        }
    },false);

    Util.delay("$root.resource.ready",function(){
        if($routeParams.mocpId || $routeParams.locId || $routeParams.businessId){
            Util.init($scope.searchPage.data,$routeParams);  //选中跳转的类型
        }else{
            $scope.searchPage.data.mocpId = $rootScope.resource.moc[0].id;  //默认选中资源树的第一种类型
        }
    },$scope);

//listPage部分
    //scope定义
    $scope.listPage = {
        isTableReady:false,
        data:[],
        checkedList : [],
        checkAllRow : false,
        leftTree: {
            data: [],
            returnData: [],
            treeId: 'leftResources',
            level: 3
        },
        rightTree: {
            data: [],
            returnData: [],
            treeId: 'rightResources',
            level: 3
        },
        equipmentsTree: {
            data: [],
            returnData: [],
            treeId: 'equipmentsTree',
            level: 3
        },
        bussinessTree: {
            data: [],
            returnData: [],
            treeId: 'bussinessTree',
            level: 3
        },
        leftPorts:[],
        rightPorts:[],
        jfList:[],
        roomEquipments: [],
        tempCurrentMocChildren:[],
        assocRoom:null,
        relationHost: null,
        snList:[],
        clusterNameList:[],
        serverNameList:[],
        openNebulaData : {
            storages : [],
            images : [],
            templates : []
        }
    };

    $scope.listPage.action = {
        mocNodeDom : function(data){
            return data.displayName + "(" + (data.moCount?data.moCount:0) + ")";
        },
        showDiscoveryPage : function(){
            $rootScope.resource.showDiscoveryPage(
                //下发自动发现任务
                function(segment,fnSuccess,fnError){
                    DiscoveryClient.discover({},segment,fnSuccess,fnError);
                },
                //获得自动发现结果
                function(fnSuccess,fnError){
                    DiscoveryClient.getResult({},{},fnSuccess,fnError);
                },
                //自动发现结束时处理结果
                function(result){

                },
                //modal框关闭时的动作
                function(){
                    $rootScope.resource.loadMocCount(); //刷新统计数据
                    $scope.listPage.settings.reload(true);
                }
            );
        },
        showRoomSyncPage : function(){
            $rootScope.resource.showRoomSyncPage(
            //同步结束后的动作
            function(){
                $scope.searchPage.action.search();
                MocClient.query(
                    function(data){
                        $rootScope.resource.moc = data;
                        $rootScope.resource.loadMocCount(); //刷新统计数据
                        $scope.listPage.action.filterByType("environment");
                    },
                    function(error){
                        $rootScope.alert("读取资源类型基础信息失败");
                    }
                );
            },
            //modal框关闭时的动作
            function(){

            });
         },
        openDashboard : function(id,mocpName,mocName){
            $rootScope.openWindows.push(window.open("views/dashboard/dashboard.html?type="+mocpName+"&moc_name="+mocName+"&mo_id="+id+"#/"+mocName,"_blank"));
        },
        initProtocolData: function(){
            $scope.editPage.protocolData = {
                probeInfoId : null,
                protocolList : null,
                protocolValue : null
            }
        },
        initResourceTreeData : function(){
            $scope.listPage.equipmentsTree.data = [];
            $scope.listPage.bussinessTree.data = [];
            $scope.listPage.leftTree.data = [];
            $scope.listPage.rightTree.data = [];
        },
        initEquMoTree : function(mocpNames){
            MoClient.getResource( {mocpNames:mocpNames},function(data){
                if (data.result == "success") {
                    $scope.listPage.equipmentsTree.data = data.msg;
                }
            });
        },
        getInterfaceList : function(){
            if($scope.editPage.data.ip && $scope.editPage.access.port && $scope.editPage.access.user){
                $scope.editPage.interfaceList = [];
                $scope.editPage.bandWidthList = [];
                Loading.show();
                $scope.editPage.data.access = $scope.editPage.access;
                MoClient.getInterfaceList({},$scope.editPage.data,function(data){   // data: {data:["网卡1","网卡2"]}
                    Loading.hide();
                    $scope.editPage.interfaceList = data.data;
                    $timeout(function(){
                        for(var i=0;i<$scope.editPage.interfaceList.length;i++){
                            $scope.editPage.bandWidthList.push("10");
                        }
                    },200);
                });
            }else{
                $rootScope.$alert("请输入必填项!");
            }
        },
        getSn : function(){
            $scope.listPage.snList = [];
            if($scope.editPage.data.ip && $scope.editPage.access.port && $scope.editPage.access.user){
                Loading.show();
                $scope.editPage.data.access = $scope.editPage.access;
                MoClient.getSn({},$scope.editPage.data,function(data){   // data: [{"SN":"000000C020200D24","IPAddr":"154.16.128.48"}]
                    Loading.hide();
                    $scope.listPage.snList = data;
                    if( data.length > 0 ){  //select first option default
                        $scope.editPage.editSn = true;
                        $scope.editPage.access.sn = $scope.listPage.snList[0].SN;
                    }else{
                        $rootScope.$alert("获取不到sn!");
                        $scope.editPage.editSn = false;
                    }
                });
            }else{
                $rootScope.$alert("请输入必填项!");
            }
        },
        getClusterName : function(){
            $scope.listPage.clusterNameList = [];
            if($scope.editPage.data.ip && $scope.editPage.access.port && $scope.editPage.access.user){
                Loading.show();
                $scope.editPage.data.access = $scope.editPage.access;
                MoClient.getClusterName({},$scope.editPage.data,function(data){   // data: ["name1","name2"]
                    Loading.hide();
                    $scope.listPage.clusterNameList = data;
                    if( data.length > 0 ){  //select first option default
                        $scope.editPage.editClusterName = true;
                        $scope.editPage.access.server = data[0].ClusterName;
                    }else{
                        $rootScope.$alert("获取不到集群名称!");
                        $scope.editPage.editClusterName = false;
                    }
                });
            }else{
                $rootScope.$alert("请输入必填项!");
            }
        },
        getServerName : function(){
            $scope.listPage.serverNameList = [];
            if($scope.editPage.data.ip && $scope.editPage.access.port && $scope.editPage.access.user){
                Loading.show();
                $scope.editPage.data.access = $scope.editPage.access;
                MoClient.getServerName({},$scope.editPage.data,function(data){   // data: ["name1","name2"]
                    Loading.hide();
                    $scope.listPage.serverNameList = data;
                    if( data.length > 0 ){  //select first option default
                        $scope.editPage.editServerName = true;
                        $scope.editPage.access.server = data[0].ServerName;
                    }else{
                        $rootScope.$alert("获取不到server!");
                        $scope.editPage.editServerName = false;
                    }
                });
            }else{
                $rootScope.$alert("请输入必填项!");
            }
        },
        getHost : function(){
            if($scope.editPage.data.ip){
                MoClient.getHost({ip:$scope.editPage.data.ip},{},function(data){
                    if(data.id){
                        if(data.id!=$scope.editPage.relationHostMoId){
                            $scope.editPage.relationHostMoId = data.id;
                            $scope.listPage.relationHost = data.displayName;
                        }
                    }else{
                        $scope.editPage.relationHostMoId = null;
                        $scope.listPage.relationHost = null;
                        $rootScope.$alert("获取不到主机!");
                    }
                });
            }else if($scope.editPage.access.url){
                MoClient.getHost({ip:$scope.editPage.access.url,isUrl:true},{},function(data){
                    if(data.id){
                        if(data.id!=$scope.editPage.relationHostMoId) {
                            $scope.editPage.relationHostMoId = data.id;
                            $scope.listPage.relationHost = data.displayName;
                        }
                    }else{
                        $scope.editPage.relationHostMoId = null;
                        $scope.listPage.relationHost = null;
                        $rootScope.$alert("获取不到主机!");
                    }
                });
            }
        },
        initBusMoTree : function(mocpNames){
            MoClient.getResource( {mocpNames:mocpNames},function(data){
                if (data.result == "success") {
                    $scope.listPage.bussinessTree.data = data.msg;
                }
            });
        },
        initLinkMoTree : function(){
            MoClient.getResource( {mocpNames:"host,network"},function(data){
                if (data.result == "success") {
                    $scope.listPage.leftTree.data = data.msg;
                    $scope.listPage.rightTree.data = data.msg;
                }
            });
        },
        revertCurrentMocChildren: function(){
            if($rootScope.resource.currentMoc){
                $rootScope.resource.currentMoc[0].children =  $scope.listPage.tempCurrentMocChildren;
            }
        },
        filterByType : function(type){
            var length = $rootScope.resource.moc.length;
            for(var i=0;i<length;i++){
                if(type == $rootScope.resource.moc[i].name){
                    $rootScope.resource.currentMoc =[];
                    $rootScope.resource.currentMoc.push($rootScope.resource.moc[i]);
                    break;
                }
            }
            if(type == "environment"){
                $scope.listPage.tempCurrentMocChildren = $rootScope.resource.currentMoc[0].children.slice(0);  //save a copy of children
                $rootScope.resource.currentMoc[0].children = [];
            }
        },
        add :function(){
            $scope.editPage.isEdit = false;
            $scope.editPage.isLoginChecked = true;  //默认选中状态
            $scope.editPage.accessCtr.type = $rootScope.resource.getMoc($scope.searchPage.data.mocpId).name;  //选择大类，新增按钮选择模板使用
            var type = $scope.editPage.accessCtr.type;
            $scope.listPage.action.filterByType(type);
            $scope.editPage.editMocTreeData = [];
            $scope.editPage.init();

            if(type == "link"){  //init link mo tree
                Loading.show();
                $scope.listPage.leftPorts = [];
                $scope.listPage.rightPorts = [];
                $scope.listPage.leftTree.data = [];
                $scope.listPage.rightTree.data = [];
                $scope.listPage.action.initLinkMoTree();
            }else if(type == "environment"){

            }else if(type == "opennebula"){    
                MoClient.query({mocName:"onedatastore"},function(data){
                    $scope.listPage.openNebulaData.storages = data.rows;
                },function(error){
                    Loading.hide();
                });
                MoClient.query({mocName:"oneimage"},function(data){
                    $scope.listPage.openNebulaData.images = data.rows;
                },function(error){
                    Loading.hide();
                });
                MoClient.query({mocName:"onetemplate"},function(data){
                    $scope.listPage.openNebulaData.templates = data.rows;
                },function(error){
                    Loading.hide();
                });
            }

            //select first node
            if($rootScope.resource.currentMoc[0].children.length > 0){
                var mocDefault = $rootScope.resource.currentMoc[0].children[0];
                $scope.editPage.data.mocId = mocDefault.id;
            }else{
                $scope.editPage.accessCtr.mocName = "room"; //add environment
            }
            if($scope.editPage.accessCtr.mocName == "room"){
                $scope.listPage.action.showRoomSyncPage();
            }else{
                $scope.common.action.showEditPage();
            }
            $timeout(function(){
                $scope.editPage.isToRefresh = $("#isToRefreshBtn").length>0 ? true:false;  // init refresh to true
            },100);
        },
        edit :function(moId){
            $scope.editPage.isEdit = true;
            MoClient.query({id:moId},{},function(data){
                var mo = data.mo;
                $scope.editPage.isLoginChecked = mo.access.loginUrl? true:false;
                for(var i=0;i<data.mos.length;i++){
                    if((mo.mocpName == "database" || mo.mocpName == "middleware" || mo.mocpName == "service") && data.mos[i].mocpName == "host"){  //所属主机：左端
                        $scope.listPage.relationHost = data.mos[i].displayName;
                        $scope.editPage.relationHostMoId = data.mos[i].id;
                    }else{
                        $scope.editPage.relationShip.moIds.push(data.mos[i].id);  //关联设备：右端
                    }
                }

                $scope.editPage.protocolData.probeInfoId = mo.access.probeInfoId;

                var moc = $rootScope.resource.getMoc(mo.mocId);
                var parentMoc = $rootScope.resource.getMoc(mo.mocpId);
                $scope.editPage.accessCtr.type = mo.mocpName;

                var newMoc = {};
                Util.init(newMoc,parentMoc);
                newMoc.children = [moc];
                $scope.editPage.editMocTreeData = [newMoc];

                $scope.editPage.init(mo);
                $scope.editPage.data.mocId = mo.mocId;
                if(mo.mocpName == "link"){
                    Loading.show();
                    $scope.listPage.leftPorts = [];
                    $scope.listPage.rightPorts = [];
                    $scope.listPage.leftTree.data = [];
                    $scope.listPage.rightTree.data = [];
                    $scope.listPage.action.initLinkMoTree();
                }
                if(mo.mocpName == "environment"){
                    AssocClient.query({rightMoId:moId},{},function(data){
                        $scope.listPage.assocRoom = data.leftDisplayName;
                    });
                }
                if(mo.mocName == "room"){
                    MoClient.getRoomEquipments({id:moId},{},function(data){
                        $scope.listPage.roomEquipments = data.rows;
                    });
                }
                if(mo.mocName == "diskarray"){
                    MoClient.getSn({},mo,function(data){   // data: map<sn,ip>
                        for(var key in data){
                            if(key == mo.access.sn){
                                $scope.listPage.snList.push(key);
                            }
                        }
                    });
                }
                if(mo.mocName == "weblogiccluster"){
                    MoClient.getClusterName({},mo,function(data){   // data: List<name>
                        for(var key in data){
                            if(key.ClusterName == mo.access.server){
                                $scope.listPage.clusterNameList.push(key);
                            }
                        }
                    });
                }
                if(mo.mocName == "weblogic"){
                    MoClient.getServerName({},mo,function(data){   // data: List<name>
                        for(var key in data){
                            if(key.ServerName == mo.access.server){
                                $scope.listPage.serverNameList.push(key);
                            }
                        }
                    });
                }
                if(mo.mocName == "linux"){
                    if(mo.access.reserve){
                        $timeout(function() {
                            var nioMap = JSON.parse(mo.access.reserve);
                            var valueList = [];
                            for (var k in nioMap) {
                                $scope.editPage.interfaceList.push(k);
                                valueList.push(nioMap[k]+"");
                            }
                            $timeout(function () {
                                $scope.editPage.bandWidthList = valueList;
                            }, 200);
                        },100);
                    }
                }

                $scope.common.action.showEditPage();
                $timeout(function(){
                    $scope.editPage.isToRefresh = $("#isToRefreshBtn").length>0 ? true:false;  // init refresh to true
                },100);
            },function(error){
                Loading.hide();
            });
        },
        batchDelete :function(){
            if($scope.listPage.checkedList.length==0){
                $rootScope.$alert("请选择要删除的资源");
            }else{
                $scope.common.confirm("确定要删除么？",function(){
                    Loading.show();
                    MoClient.batchRemove({ids:$scope.listPage.checkedList},{},function(data){
                        Loading.hide();
                        $rootScope.$alert("删除成功");
                        $scope.searchPage.action.search();
                        $rootScope.resource.loadMocCount(); //刷新统计数据
                    },function(error){
                        Loading.hide();
//                        $rootScope.$alert("删除失败:"+error.data.message);
                        $scope.searchPage.action.search();
                    });
                }," 删 除 ");
            }
        },
        del :function(moId){
            $scope.common.confirm("确定要删除么？",function(){
                Loading.show();
                MoClient.remove({id:moId},{},function(data){
                    Loading.hide();
                    $rootScope.$alert("删除成功");
                    $scope.searchPage.action.search();
                    $rootScope.resource.loadMocCount(); //刷新统计数据
                },function(error){
                    Loading.hide();
//                    $rootScope.$alert("删除失败:"+error.data.message);
                });
            }," 删 除 ");
        },
        refresh : function(moId,ignore){
            Loading.show();
            MoClient.refresh({id:moId,ignore:ignore?true:false},{},function(data){
                $scope.searchPage.action.search();
                Loading.hide();
                $rootScope.$alert("同步任务已下发");
            },function(error){
                Loading.hide();
//                $rootScope.$alert("同步任务下发失败:"+error.data.message);
            });
        },
        batchRefresh :function(){
            if($scope.listPage.checkedList.length==0){
                $rootScope.$alert("请选择要同步的资源");
            }else{
                Loading.show();
                MoClient.batchRefresh({ids:$scope.listPage.checkedList},{},function(data){
                    $scope.searchPage.action.search();
                    Loading.hide();
                    $rootScope.$alert("同步任务已下发");
                },function(error){
                    Loading.hide();
//                    $rootScope.$alert("同步任务下发失败:"+error.data.message);
                    $scope.searchPage.action.search();
                });
            }
        },
        syncToAsset : function(moId){
            $rootScope.openWindows.push(
                window.open("index.html#/assetManagement?moId="+ moId,"_blank")
            );
        }
    };

    $scope.listPage.settings = {
        reload : null,
        getData:function(search,fnCallback){
            $scope.searchPage.data.limit = search.limit;
            $scope.searchPage.data.offset = search.offset;
            $scope.searchPage.data.orderBy = search.orderBy;
            $scope.searchPage.data.orderByType = search.orderByType;
            Loading.show();
            Util.delay("$root.resource.ready",function(){
                $timeout(function(){
                    MoClient.query($scope.searchPage.data,function(data){
                        $scope.listPage.data = data.rows;
                        fnCallback(data);
                        $scope.listPage.checkedList = [];
                        $scope.listPage.checkAllRow = false;
                        Loading.hide();
                        $scope.listPage.isTableReady = true;
                    });
                },300);
            },$scope);
        }, //getData应指定获取数据的函数
        columns : [
            {
                sTitle: "<div class='checkbox'><label><input type='checkbox' ng-model='listPage.checkAllRow'><i></i></label></div>",
                mData:"id",
                mRender:function(mData,type,full) {
                    return '<div class="checkbox"><label><input type="checkbox" checklist-model="listPage.checkedList" checklist-value=\''+mData+'\' /><i></i></label></div>';
                }
            },
            {
                sTitle: "资源实例",
                mData:"displayName",
                mRender:function(mData,type,full) {
                    if(Util.exist(full.mocpName,['host','storage','network','database','middleware','service']) && full.mocName!='apache'){
                        return '<a href="javascript:void(0)" title="'+ mData +'" ng-click="listPage.action.openDashboard('+full.id+',\''+full.mocpName+'\',\''+full.mocName+'\')">'+mData+'</a>';
                    }else{
                        return Util.str2Html(mData);
                    }
                }
            },
            {
                sTitle: "管理IP",
                mData:"ip"
            },
            {
                sTitle: "资源类型组",
                mData:"mocpDisplayName"
            },
            {
                sTitle: "资源类型",
                mData:"mocDisplayName"
            },
            {
                sTitle: "所属区域",
                mData:"locId",
                mRender:function(mData,type,full) {
                    var loc = $rootScope.resource.getLocation(mData);
                    if(loc!=null){
                        return loc.name;
                    }else{
                        return mData;
                    }
                }
            },
            {
                sTitle: "所属机房",
                mData:"jfId",
                mRender:function(mData,type,full) {
                    var loc = $rootScope.resource.getLocation(mData);
                    if(loc!=null){
                        return loc.name;
                    }else{
                        return mData;
                    }
                }
            },
            {
                sTitle: "同步状态",
                mData:"refreshStatus",
                mRender:function(mData,type,full) {
                    if(mData==1){
                        return "<span class='green'>已同步</span>";
                    }if(mData==2){
                        return "<span class='yellow'>同步中</span>";
                    }if(mData==3){
                        return "<span class='red'>同步失败</span>";
                    }else{
                        return "";
                    }
                }
            },
            {
                sTitle:"操作",
                mData:"id",
                mRender:function(mData,type,full) {
                    var needRefresh = Util.exist(full.mocpName,['host','storage','network','database','middleware']);
                    var disabledOp = $rootScope.loginUserMenuMap[$rootScope.currentView];
                    if(disabledOp){
                        return '<i class="fa fa-pencil" disabled title="编辑"> </i>' +
                        (needRefresh?('<i class="fa fa-exchange" disabled title="同步"></i>'):("")) +
                        '<i class="fa fa-external-link" disabled title="同步到资产"></i>' +
                        '<i class="fa fa-trash-o" disabled title="删除"></i>';
                    }else{
                        return '<i class="fa fa-pencil" title="编辑" ng-click="listPage.action.edit(\''+mData+'\')"> </i>' +
                        (needRefresh?('<i class="fa fa-exchange" title="同步" ng-click="listPage.action.refresh(\''+mData+'\')"></i>'):("")) +
                        '<i class="fa fa-external-link" title="同步到资产" ng-click="listPage.action.syncToAsset(\''+mData+'\')"></i>' +
                        '<i class="fa fa-trash-o" title="删除" ng-click="listPage.action.del(\''+mData+'\')"></i>';
                    }
                }
            }
        ] , //定义列的形式,mRender可返回html
        columnDefs : [
            { bSortable: false, aTargets: [ 0,8 ] },  //不可排序
            { sWidth: "38px", aTargets: [ 0 ] },
            { sWidth: "120px", aTargets: [ 8 ] },
            { bVisible: false, aTargets: [ 3 ] }
        ], //定义列的约束
        defaultOrderBy : []  //定义默认排序列为第8列倒序
    };

    //初始化
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

//watch 页面操作权限
    $scope.$watch("$root.loginUserMenuMap[$root.currentView]",function(newVal,oldVal){
        $scope.editPage.modal.settings.saveBtnHide = newVal;
    },false);

}]);
})(angular);

