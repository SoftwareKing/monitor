(function(angular){
    var api_path="/dmonitor-webapi";
    var itsmControllers = angular.module('itsm.controllers', []);

    itsmControllers.run(['$rootScope','ItsmService','OperateService',function($rootScope,ItsmService,Operate) {
        ItsmService.getLocItsm(function(data){
            $rootScope.resource.locationsItsm = data;
        });
        Operate.getUserLocs(function(rows){
            $rootScope.locationData=rows;
        });
        $rootScope.isLeafNode=function(node){return (node.id+'').indexOf('u_')!=-1;}
        $rootScope.applyUserData=[];
        $rootScope.$watch("loginUser.userName", function (newVal) {
            if (newVal!=null) {
                var roles=$rootScope.loginUser.roles;
                var ids="";
                if(roles!=null){
                    for(var i=0;i<roles.length;i++){
                        ids+=ids==""?roles[i].locId:","+roles[i].locId;
                    }
                    if(ids.length>0){
                        Operate.getDepartUsers({locIds:ids},function(data){
                            $rootScope.applyUserData=data;
                            jQuery("#applyUser5").val("");
                        });
                    }
                }
            }
        }, true);
        $rootScope.getStep=function(full,type){
            var name=full.step;
            if(name=='新建'){
                return "待提交";
            }else if(name=='提交'){
                return "待提交";
            }else if(name=='审核'){
                return "待审核";
            }else if(name=='区县审核'){
                return "待审核";
            }else if(name=='市州审核'){
                return "待审核";
            }else if(name=='省审核'){
                return "待审核";
            }else if(name=='解决'){
                return "待解决";
            }else if(name=='处理'){
                return "待解决";
            }else if(name=='确认'){
                return "待关闭";
            }else if(name=='关闭'){
                return "已关闭";
            }else if(name=='计划'){
                return "待计划";
            }else if(name=='实施'){
                return "待实施";
            }else if(name=="审批"){
                return "待审批";
            }else if(name=="[知识库经理]审批"){
                return "待发布";
            }else if(name=='编辑'){
                return "已发布";
            }else if(name=='发布'){
                return "已发布";
            }
        }
    }]);

    itsmControllers.controller('mytaskController',['$scope','$rootScope','$location','$timeout','ItsmService','Util','Loading',function($scope,$rootScope,$location,$timeout,ItsmService,Util,Loading){
        $scope.isMyTaskPage = true;
        var childId=$location.$$search.childId==null?"11":$location.$$search.childId;
        var parentId=$location.$$search.parentId==null?"1":$location.$$search.parentId;

        $scope.hideTask=function(){
              document.location.href="./index.html#/myTask";
        };

        $scope.taskList = {
            childId:childId,
            parentId:parentId,
            status:null
        };
        $scope.taskTree = [
            {
                "id":"1",
                "displayName":"故障",
                "children":[{"id":"11","displayName":"待签","status":"1"},{"id":"12","displayName":"待办","status":"2"},{"id":"13","displayName":"参与","status":"3"},{"id":"14","displayName":"关闭","status":"4"}]
            },
            {
                "id":"2",
                "displayName":"问题",
                "children":[{"id":"21","displayName":"待签","status":"1"},{"id":"22","displayName":"待办","status":"2"},{"id":"23","displayName":"参与","status":"3"},{"id":"24","displayName":"关闭","status":"4"}]
            },
            {
                "id":"3",
                "displayName":"变更",
                "children":[{"id":"31","displayName":"待签","status":"1"},{"id":"32","displayName":"待办","status":"2"},{"id":"33","displayName":"参与","status":"3"},{"id":"34","displayName":"关闭","status":"4"}]
            },
            {
                "id":"4",
                "displayName":"知识",
                "children":[{"id":"41","displayName":"待签","status":"1"},{"id":"42","displayName":"待办","status":"2"},{"id":"43","displayName":"参与","status":"3"},{"id":"44","displayName":"发布","status":"4"}]
            }
        ];
        ItsmService.taskGroup({flow:"incident,problem,change,knowledge"},function(data){
            for(var i=0;i<$scope.taskTree.length;i++){
                for(var j=0;j<$scope.taskTree[i].children.length;j++){
                    var count=data[$scope.taskTree[i].children[j].id];
                    var index=$scope.taskTree[i].children[j].displayName.indexOf("(")
                    if(index>-1)
                        $scope.taskTree[i].children[j].displayName=$scope.taskTree[i].children[j].displayName.substring(0,index)+"("+count+")";
                    else
                        $scope.taskTree[i].children[j].displayName=$scope.taskTree[i].children[j].displayName+"("+count+")";
                }
            }
        });
    }]);

    itsmControllers.controller('incidentController',['$scope','$rootScope','$location','$timeout','ItsmService','Util','Loading','$location','Tools',function($scope,$rootScope,$location,$timeout,ItsmService,Util,Loading,$location,Tools){
        var taskKey=$location.$$search.taskKey==null?"sid-C19D8AFC-A279-4F23-9297-E73243193FBD":$location.$$search.taskKey;
        var id=$location.$$search.id;
        var taskId = $location.$$search.taskId;
        $scope.childId = $location.$$search.childId;
        $timeout(function(){
            if($location.$$search.moId)angular.element(".search-head").show();
        },2000);
        $scope.taskId=taskId;
        $scope.initData = {};
        $scope.formData = {urgency:2};
        $scope.hiddenData = {};
        $scope.alarmSearchPage ={};
        $scope.alarmSearchPage.data={};
        $scope.alarmSearchPage.data.level=[2,3,4,5,6];
        $scope.alarmSearchPage.datas={};
        $scope.uploadFile = new Array();
        $scope.formData.attachment = new Array();
        $scope.alarmData = [];
        $scope.formData.alarms = [];
        $scope.showAlarms=false;
        $scope.eventDetail={};
        $scope.incidentSearchPage = {
            init : function(){
                $scope.incidentSearchPage.data = {
                    limit : 20, //每页条数(即取多少条数据)
                    offset : 0 , //从第几条数据开始取
                    orderBy : "",//排序字段
                    orderByType : "" //排序顺序
                }
            },
            search:function(){
                $scope.incidentList.settings.reload(true);
            }
        };
        $scope.incidentSearchPage.datas = {};

        $scope.knowledgeSearchPage = {
            init : function(){
                $scope.knowledgeSearchPage.data = {
                    table:"KnowledgeLib",
                    limit : 20, //每页条数(即取多少条数据)
                    offset : 0 , //从第几条数据开始取
                    orderBy : "",//排序字段
                    orderByType : "" //排序顺序
                }
            },
            search:function(){
                $scope.knowledgeList.settings.reload(true);
            }
        };
        $scope.knowledgeSearchPage.init();
        $scope.knowledgelibDialog = Tools.dialog({
            id:"knowledgelibDialog",
            title:"查询",
            hiddenButton:true
        });

        $scope.knowledgeListPage = {
            data:[],  //table 数据
            checkedList: [],
            checkAllRow:false
        };

        $scope.knowledgeListPage.settings = {
            reload : null,
            getData:function(search,fnCallback){
                $scope.knowledgeSearchPage.data.limit = search.limit;
                $scope.knowledgeSearchPage.data.offset = search.offset;
                $scope.knowledgeSearchPage.data.orderBy = search.orderBy;
                $scope.knowledgeSearchPage.data.orderByType = search.orderByType;
                Loading.show();
                ItsmService.getKnowledge($scope.knowledgeSearchPage.data,function(data){
                    $scope.knowledgeListPage.data = data.rows;
                    fnCallback(data);
                    $scope.knowledgeListPage.checkedList = [];
                    $scope.knowledgeListPage.checkAllRow = false;
                    Loading.hide();
                },function(error){
                    Loading.hide();
                });
                Loading.hide();
            },
            columns : [
                {
                    sTitle: "知识单号",
                    mData:"orderId"
                },
                {
                    sTitle: "知识标题",
                    mData:"title",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "关键字",
                    mData:"keyWord",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "创建人",
                    mData:"applyUser",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.applyUser);
                    }
                },
                {
                    sTitle:"创建时间",
                    mData:"applyTime",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [ ] },  //不可排序
                { sWidth: "140px", aTargets: [ 4] },
                { sWidth: "400px", aTargets: [ 1 ] }
            ], //定义列的约束
            defaultOrderBy : []  //定义默认排序列为第8列倒序
        };

//        $timeout(function(){
//            var height=angular.element(window).height()-210;
//            angular.element(".form-wrapper").height(height);
//        },1000);


        ItsmService.getAllMoc(function(data){
            $scope.initData.mocp = data;
            var rows=[];
            for(var i=0;i<data.length;i++){
                if(data[i].name!='link')rows[rows.length]=data[i];
            }
            $scope.alarmSearchPage.datas.mocp = rows;
            $scope.incidentSearchPage.datas.mocp = data;
        });

        //去表单页面
        if(Util.notNull(taskKey)) {
            //短信内容
            //$scope.formData.params.smsContent = "你妹";


            //影响度
            ItsmService.getItsmDefInfluenceType({processType: "incident"}, {}, function (data) {
                $scope.initData.ItsmDefInfluenceType = data;
            });
            //紧急度
            ItsmService.getItsmDefEmergencyType({processType: "incident"}, {}, function (data) {
                $scope.initData.ItsmDefEmergencyType = data;
            });
            //故障单关闭代码
            ItsmService.getItsmDefCloseCode({processType: "incident"}, {}, function (data) {
                $scope.initData.ItsmDefCloseCode = data;
            });
            //创建人
            $rootScope.$watch("loginUser.userName", function (newVal, oldVal) {
                if (Util.notNull(newVal)) {
                    $scope.formData.applyUser = newVal;
                    if($scope.formData.params)
                        $scope.formData.params.applyUser=$rootScope.loginUser.realName;
                    else
                        $scope.formData.params={applyUser:$rootScope.loginUser.realName};
                }
            }, false);
            //创建时间
            ItsmService.getTime(function (data) {
                $scope.formData.applyTime = data.time;
                if (id == null) {
                    $scope.formData.time=angular.copy(data.time);
                }
            });

            //获取用户组
           // ItsmService.getUsergroup(function (data) {
           //     $scope.initData.usergroup = data.rows;
           // });

            //获取当前用户对应区域中的用户组
            ItsmService.getUsergroupValue(function (data) {
                $scope.initData.usergroup = data;
            });

            //获取用户
            ItsmService.getUsers(function (data) {
                $scope.initData.users = data.rows;
            });
            //动态控制字段
            $scope.fields = [];
            ItsmService.getForm({task: taskKey, flow: "incident"}, {}, function (data) {
                $scope.fields = data;
                $scope.find = function (name) {
                    var o = {disabled: true, required: false,show:false};
                    for (var i = 0; i < $scope.fields.length; i++) {
                        if (name == $scope.fields[i].fieldName) {
                            o = {show: true, required: $scope.fields[i].required,disabled:$scope.fields[i].disabled};
                        }
                    }
                    return o;
                }
            });
            if (id != null) {//searchId
                ItsmService.querySingleIncident({id: id}, {}, function (data) {
                    $scope.formData = data;
                    $timeout(function(){
                        jQuery("select[name='effect'] option[value="+$scope.formData.effect+"]").attr("selected","selected");//强制刷新 effect影响度
                        jQuery("select[name='urgency'] option[value="+$scope.formData.urgency+"]").attr("selected","selected");//urgency 紧急度
                    },500);
                    //closeCode原因
                    $scope.formData.closeCode = ($scope.formData.closeCode == null ? "" : $scope.formData.closeCode);
                    $scope.formData.taskId=taskId;
                    $("#locationText").attr("value", $scope.formData.location);
                    $scope.alarmData = angular.copy($scope.formData.params.alarms);
                    $scope.uploadFile = angular.copy($scope.formData.attachment);
                    ItsmService.getIncidentHistory({procId: $scope.formData.processId,id:id}, {}, function (data) {
                        $scope.historyProcess = data.rows;
                        if(data.rows.length>0)$scope.currentStep=data.rows[data.rows.length-1].name;
                    });
                });
            }else{
                //监控选择

                $rootScope.$watch("loginUser.locId",function(n){
                    if(n){
                        $scope.formData.reporter=$rootScope.loginUser.realName;
                        $scope.formData.reporterPhone=$rootScope.loginUser.mobile;
                        $scope.formData.reporterEmail=$rootScope.loginUser.email;
                        ItsmService.getLocation({id:$rootScope.loginUser.locId},{},function(data){
                            $scope.formData.location=data.bean.id;
                            $scope.formData.params.location=data.bean.name;
                        });
                    }
                },true);
                $scope.$watch("initData.ItsmDefEmergencyType.length",function(n){
                    if(n>0){
                        $timeout(function(){
                            $scope.formData['urgency']=2;
                            $scope.formData['effect']=2;
                            jQuery("select[name='effect'] option[value="+$scope.formData.effect+"]").attr("selected","selected");
                            jQuery("select[name='urgency'] option[value="+$scope.formData.urgency+"]").attr("selected","selected");
                        },1000);
                    }
                },true)
                var moClear=true,mocClear=true;
                if($location.$$search.moId){
                    ItsmService.getMoById({moId:$location.$$search.moId},{},function(data) {
                        moClear=false;
                        mocClear=false;
                        $scope.formData.mocpId= data.mo.mocpId;
                        $scope.formData.mocId= data.mo.mocId;
                        $scope.formData.moId= data.mo.id;
                    });
                }
            }

            //判断按钮 是否显示
            $scope.findShow = function(s){
                var re = false;
                if(s == taskKey){
                    re = true;
                }
                return re;
            }
            $scope.findShowSave = function(){
                var re = true;
                if("sid-E21AC1DF-6D03-47E0-A2BE-014ECEC5CC8D" == taskKey || 'sid-C19D8AFC-A279-4F23-9297-E73243193FBD' == taskKey){
                    re = false;
                }
                return re;
            }

            $scope.$watch("formData.urgency",function(newVal, oldVal){
                if(Util.notNull(newVal) && Util.notNull($scope.formData.effect)){
                    ItsmService.getItsmDefPriorityMatrix({processType:"incident",influcenceCode:$scope.formData.effect,emergencyCode:newVal},{},function(data){
                        $scope.formData.priority = data.id;
                        $("#priority").attr("value",data.priority);
                    });
                }else{
                    $scope.formData.priority="";
                    $("#priority").attr("value","");
                }
            },false);

            $scope.$watch("formData.effect",function(newVal, oldVal){
                if(Util.notNull(newVal) && Util.notNull($scope.formData.urgency)){
                    ItsmService.getItsmDefPriorityMatrix({processType:"incident",influcenceCode:newVal,emergencyCode:$scope.formData.urgency},{},function(data){
                        $scope.formData.priority = data.id;
                        $("#priority").attr("value",data.priority);
                    });
                }else{
                    $scope.formData.priority="";
                    $("#priority").attr("value","");
                }
            },false);

            $scope.$watch("formData.mocpId",function(newVal,oldVal){
                $scope.initData.moc = [];
                if(!Util.notNull(id) && mocClear){
                    $scope.formData.mocId = "";
                    $scope.formData.moId = "";
                }
                if(!mocClear)mocClear=true;
                if(Util.notNull(newVal)){
                    $scope.initData.moc = Util.findFromArray("id",newVal,$scope.initData.mocp)['children'];
                    if(Util.notNull($scope.formData.mocId)){
                        $timeout(function(){
                            jQuery("select[name='mocId'] option[value="+$scope.formData.mocId+"]").attr("selected","selected");
                        },1000);
                    }
                }
            },false);

            $scope.$watch("formData.mocId",function(newVal,oldVal){
                $scope.initData.mo = [];
                if(!Util.notNull(id) && moClear) {
                    $scope.formData.moId = "";
                }
                if(!moClear)moClear=true;
                if(Util.notNull(newVal)){
                    Loading.show();
                    ItsmService.getMoByMocId({mocId:newVal,orderBy:'displayName',orderByType:'asc'},{},function(data){
                        $scope.initData.mo = data.rows;
                        if(Util.notNull($scope.formData.mocId)){
                            $timeout(function(){
                                jQuery("select[name='moId'] option[value="+$scope.formData.moId+"]").attr("selected","selected");
                            },200);
                        }
                        Loading.hide();
                    },function(data){
                        Loading.hide();
                    });
                }
            },false);

            $scope.$watch("formData.resolveGroup",function(newVal,oldVal){
                $scope.initData.groupUser = [];
                if(!Util.notNull(id)) {
                    $scope.formData.resolveUser = "";
                }
                if(Util.notNull(newVal)){
                    ItsmService.getUserByGroup({groupName:newVal},{},function(data){
                        $scope.initData.groupUser = data;
                        if(Util.notNull($scope.formData.resolveGroup)){
                            $timeout(function(){
                                jQuery("select[name='resolveUser'] option[value="+$scope.formData.resolveUser+"]").attr("selected","selected");
                            },1000);
                        }
                    });
                }else{
                    $scope.formData.resolveUser = "";
                }
            },false);



            $scope.$watch("alarmData",function(newVal,oldVal){
                if(Util.notNull(newVal) && newVal.length>0){
                    $scope.hiddenData.alarms = 1;
                }else{
                    $scope.hiddenData.alarms = "";
                }
            },true);

            $scope.$watch("uploadFile",function(newVal,oldVal){
                if(Util.notNull(newVal) && newVal.length>0){
                    $scope.hiddenData.attachment = 1;
                }else{
                    $scope.hiddenData.attachment = "";
                }
            },true);
        }

        $scope.$watch("taskList.childId",function(newVal,oldVal){
            if(Util.notNull(newVal) && (newVal == 11 || newVal == 12 || newVal == 13 || newVal == 14)){
                $scope.incidentSearchPage.search();
                setResolveUserTree();
            }
        },false);

        $scope.action = {
            delete:function(id,type){
                $rootScope.$confirm("确定要删除吗？",function(){
                    Loading.show();
                    ItsmService.deleteFlow({id:id,type:type},function(data){
                        $rootScope.$alert(" 删除成功!");
                        Loading.hide();
                        $scope.incidentList.settings.reload(true);
                    },function(data){
                        Loading.hide();
                    });
                },"删除");
            },
          save:function(taskId){
              if(taskId > 0){
                  ItsmService.updateIncident({id:taskId},$scope.formData,function(data){
                      $rootScope.$alert(" 保存成功!");
                  });
                  Loading.hide();
              }else{
                  ItsmService.saveIncident({},$scope.formData,function(data){
                      $rootScope.$alert(" 保存成功!");
                  });
                  Loading.hide();
              }
          },
          start: function(){//提交和保存
              Loading.show();
              ItsmService.startIncident({},$scope.formData,function(data){
                  Loading.hide();
                  window.location.href = "#/queryMyTask?childId=12&parentId=1";
              },function(data){
                  Loading.hide();
              });
          },
          claim: function(taskId){
              ItsmService.claimIncident({id:taskId},{},function(data){
                  $scope.incidentSearchPage.search();
                  $scope.$alert(" 签收成功!");
                  ItsmService.taskGroup({flow:"incident,problem,change,knowledge"},function(data){
                      for(var i=0;i<$scope.taskTree.length;i++){
                          for(var j=0;j<$scope.taskTree[i].children.length;j++){
                              var count=data[$scope.taskTree[i].children[j].id];
                              $scope.taskTree[i].children[j].displayName=($scope.taskTree[i].children[j].displayName.split("(")[0]+"("+count+")");
                          }
                      }
                  });
              });
              Loading.hide();
          },
          claimForward: function(taskId){
              Loading.show();
              ItsmService.claimIncident({id:taskId},{},function(data){
                  Loading.hide();
                 window.location.href = "#/queryMyTask?childId=12&parentId=1";
              },function(data){
                  Loading.hide();
              });
          },
          back:function(){
              if($scope.childId=='00'){
                  window.location.href = "#/queryIncident";
              }else{
                  var childId = $scope.childId==null?"11":$scope.childId;
                  var parentId = $scope.childId==null?"1":$scope.childId.substring(0,1)
                  window.location.href = "#/queryMyTask?childId="+childId+"&parentId="+parentId;
              }
          },
          process:function(flag){
              if(flag){//关闭
                    if($scope.formData.closeCode== null || $scope.formData.closeCode==""){
                        $rootScope.$alert("请选择原因");
                        return ;
                    }
                  $scope.formData.pass=flag;
              }
              if(flag==false){//重开
                  if($scope.formData.closeRemark == null || $scope.formData.closeRemark==""){
                      $rootScope.$alert("请输入说明");
                      return ;
                  }
                  $scope.formData.pass=flag;
              }
              Loading.show();
              $scope.formData.taskId = taskId;
              ItsmService.processIncident({},$scope.formData,function(data){
                  Loading.hide();
                    window.location.href = "#/queryMyTask?childId=12&parentId=1";
              },function(data){
                  Loading.hide();
              });
          },
          preProcess:function(id,taskKey,taskId){
              window.location.href = '#/createIncident?taskKey='+taskKey+"&id="+id+"&taskId="+taskId+"&childId="+(typeof($scope.taskList) == "undefined"?"00":$scope.taskList.childId);
          },
          showFlow:function(processId,pid){
              $("#pid").hide();
              //window.open('/dmonitor-webapi/itsm/workflow/resource/read?processDefinitionId='+processId+'&resourceType=image',"",null);
              $("#img").attr("src",'/dmonitor-webapi/itsm/workflow/resource/read?processDefinitionId='+processId+'&resourceType=image&r='+(new Date()).getTime());
              ItsmService.getImagePosition({pid:pid,r:(new Date()).getTime()},{},function(data){
                  $.each(data,function(i,v){
                      if(v.currentActiviti){
                          $("#pid").show();
                          $("#pid").css("height",v.height+10);
                          $("#pid").css("width",v.width+10);
                          $("#pid").css("left",v.x-4);//25
                          var img = new Image();
                          img.src=$("#img").attr("src");
                          img.onload = function(){
                              this.onload=null;
                              $("#pid").css("top",v.y-this.height-4);//10
                          }
                          $("#pid").css("position","relative");
                          $("#pid").css("border","solid 5px red");
                      }
                  });
              });
              $scope.imageDialog.show();
          },
          addAlarm:function(){
              $scope.alarmSearchPage.data.mocpId = angular.copy($scope.formData.mocpId);
              $scope.alarmSearchPage.data.moName = ($("select[name='moId']").find("option:selected").text()=='请选择'?"":$("select[name='moId']").find("option:selected").text());
              $scope.alarmDialog.show();
              $timeout(function(){
                  $scope.alarmSearchPage.data.mocId = angular.copy($scope.formData.mocId);
                  jQuery("#alarmMocId option[value="+$scope.alarmSearchPage.data.mocId+"]").attr("selected","selected");
                  $scope.alarmListPage.settings.reload(true);
              },200);
          },
          deleteAlarm:function(id){
              $rootScope.$confirm("确定要删除吗？",function() {
                  var alarmData = [];
                  $scope.formData.alarms = [];
                  var x = 0;
                  $.each($scope.alarmData, function (i, v) {
                      if (v.id != id) {
                          alarmData[x] = v;
                          $scope.formData.alarms.push({"alarmId": v.id});
                          x++;
                      }
                  });
                  $scope.alarmData = alarmData;
              },"删除");
          },
          uploadFile:function(){
              $('#file').attr("value","");
              $scope.fileDialog.show();
          },
          deleteFile:function(id){
              $rootScope.$confirm("确定要删除吗？",function(){
                  var uploadFile = [];
                  var x = 0;
                  $.each($scope.uploadFile,function(i,v){
                      if(v.id != id){
                          uploadFile[x] = v;
                          x++;
                      }
                  });
                  $scope.uploadFile = angular.copy(uploadFile);
                  $scope.formData.attachment = angular.copy(uploadFile);
              },"删除");
          },
          clickDetail:function(id){
                var ruleId = "";
                var moId = "";
                var rootMoId = "";
                $.each($scope.alarmListPage.data,function(i,val){
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
                                ItsmService.getUser({id:v},{},function(data){
                                    if(data != null){
                                        if($scope.eventDetail.detail.notifyUser == "")
                                            $scope.eventDetail.detail.notifyUser=data.realName;
                                        else
                                            $scope.eventDetail.detail.notifyUser+=","+data.realName;
                                    }
                                });
                            });
                        }
                        if(val.rootMoId>0){
                            ItsmService.getMoById({moId:val.rootMoId},{},function(data){
                                if(data!=null && data.mo!=null)
                                    $scope.eventDetail.detail.rootMo = data.mo.displayName;
                            });
                        }
                        $scope.eventDetail.detail.rootField=(val.rootField=='Status'?'状态':'');
                        if(val.rootValue=='1'){
                            $scope.eventDetail.detail.rootValue='可用';
                        }
                        if(val.rootValue=='0'){
                            $scope.eventDetail.detail.rootValue='不可用';
                        }
                        if (val.rootMoId > 0) {
                            $scope.eventDetail.detail.rootAnalysis = "【" + $scope.eventDetail.detail.rootMo + "】的【" + $scope.eventDetail.detail.rootField + "】是【" + $scope.eventDetail.detail.rootValue + "】";
                        } else {
                            $scope.eventDetail.detail.rootAnalysis = "";
                        }
                        $scope.eventDetail.detail.notifyWay=(val.notifyWay!=null?val.notifyWay.replace("SMS","短信").replace("Email","邮件"):"");
                        if(val.confirmStatus==1){
                            jQuery("#confirmStatus").html("<span style='color:green'>已确认</span>");
                        }else {
                            jQuery("#confirmStatus").html("<span style='color:red'>未确认</span>");
                        }
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
              ItsmService.getHistoryEvent(searchone,function(data){
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
              ItsmService.getCurrentEvent(searchtwo,function(data){
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
                });

                //资源列表
//                jQuery("#three").html("");
//                var three_table = '';
//                three_table += "<thead class='ng-scope'>";
//                three_table += "<tr>";
//                three_table += "<th style='width: 92px;'>资源实例</th>";
//                three_table += "<th style='width: 92px;'>管理IP</th>";
//                three_table += "<th style='width: 92px;'>资源类型组</th>";
//                three_table += "<th style='width: 92px;'>资源类型</th>";
//                three_table += "</tr>";
//                three_table += "</thead>";
//
//                if(rootMoId>0){
//                    var searchthree = {};
//                    searchthree.rootMoId=rootMoId;
//                    ItsmService.getCurrentEventMo(searchthree,function(data){
//                        three_table += "<tbody>";
//                        $.each(data,function(i,val){
//                            three_table += "<tr>";
//                            three_table += "<td style='width: 92px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;' title='"+val.displayName+"'>"+val.displayName+"</td>";
//                            three_table += "<td>"+val.ip+"</td>";
//                            three_table += "<td>"+val.mocpDisplayName+"</td>";
//                            three_table += "<td>"+val.mocDisplayName+"</td>";
//                            three_table += "</tr>";
//                        });
//                        three_table += "</tbody>";
//                        jQuery("#three").append(three_table);
//                    });
//                }else{
//                    jQuery("#three").append(three_table);
//                }


                //故障单列表
                jQuery("#four").html("");
                var four_table = '';
                four_table += "<thead class='ng-scope'>";
                four_table += "<tr>";
                four_table += "<th >工单名称</th>";
                four_table += "<th >请求人</th>";
                four_table += "<th >优先级</th>";
                four_table += "<th >资源类型</th>";
                four_table += "<th >资源实例</th>";
                four_table += "<th >SLA策略</th>";
                four_table += "<th >处理人</th>";
                four_table += "<th >工单状态</th>";
                four_table += "<th >更新时间</th>";
                four_table += "</tr>";
                four_table += "</thead>";

                var searchfour = {};
                searchfour.moId=moId;
                searchfour.type=1;
                searchfour.offset=0;
                searchfour.limit=10000;
                $scope.eventDetailDialog.show();
            }
        };

        $scope.forwardDialog = Tools.dialog({
            id:"forwardDialog",
            title:"委派",
            resolveGroup:"",
            resolveUser:"",
            agentUser:"",
            hiddenButton:true,
            users:[],
            save:function(){
//                if($scope.forwardDialog.resolveGroup==null || $scope.forwardDialog.resolveGroup==""){
//                    $rootScope.$alert("请选择处理组");
//                    return;
//                }
//                $scope.formData.taskId = taskId;
//                $scope.formData.resolveGroup=$scope.forwardDialog.resolveGroup;
//                $scope.formData.resolveUser=$scope.forwardDialog.resolveUser;
                $scope.formData.agentUser=$scope.forwardDialog.agentUser;
                $scope.formData.taskId = taskId;
                $scope.forwardDialog.hide();
                ItsmService.forwardIncident({},$scope.formData,function(data){
                    window.location.href = "#/queryMyTask?childId=12&parentId=1";
                });
                Loading.hide();
            }
        });

        ItsmService.queryAgent(function(rows){
            $scope.forwardDialog.users=rows;
        });

        $scope.$watch("forwardDialog.resolveGroup",function(newVal,oldVal){
            $scope.initData.groupUser = [];
            if(!Util.notNull(id)) {
                $scope.forwardDialog.resolveUser = "";
            }
            if(Util.notNull(newVal)){
                ItsmService.getUserByGroup({groupName:newVal},{},function(data){
                    $scope.initData.groupUser = data;
                    if(Util.notNull($scope.forwardDialog.resolveGroup)){
                        $timeout(function(){
                            jQuery("select[name='resolveUser1'] option[value="+$scope.forwardDialog.resolveUser+"]").attr("selected","selected");
                        },1000);
                    }
                });
            }else{
                $scope.forwardDialog.resolveUser = "";
            }
        },false);

        $scope.imageDialog = Tools.dialog({
            id:"imageDialog",
            title:"流程图",
            hiddenButton:true,
            save:function(){
                $scope.imageDialog.hide();
            }
        });

        $scope.fileDialog = Tools.dialog({
            id:"fileDialog",
            title:"上传文件",
            save:function(){
                if(angular.element("#file").val()==null || angular.element("#file").val()==""){
                    $rootScope.$alert("请选择需要上传的文件");
                    return;
                }
                Loading.show();
                var step='新建';
                if($scope.historyProcess && $scope.historyProcess.length>1){
                    step=$scope.historyProcess[$scope.historyProcess.length-1].name;
                }
                $.ajaxFileUpload({
                    url: '/dmonitor-webapi/itsm/form/upload?type=incident&step='+step, //用于文件上传的服务器端请求地址
                    secureuri: false, //是否需要安全协议，一般设置为false
                    fileElementId: 'file', //文件上传域的ID
                    dataType: 'json', //返回值类型 一般设置为json
                    success: function (data){
                        Loading.hide();
                        if(data != null && data.id!=null){
                            $scope.uploadFile.push(data);
                            $scope.formData.attachment.push(data);
                            $rootScope.$alert(" 上传成功!");
                        }else if(data.message && data.message.indexOf("Maximum upload size of")>-1){
                            $rootScope.$alert(" 上传失败,上传文件不能大于2M");
                        }else{
                            $rootScope.$alert(" 上传失败!");
                        }
                        $scope.$apply();
                        $rootScope.$apply();
                    },error: function (data, status, e){
                        Loading.hide();
                        $rootScope.$alert(" 上传失败!");
                        //$rootScope.$apply();
                    }
                });
                $scope.fileDialog.hide();
            }
        });

        $scope.alarmDialog = Tools.dialog({
            id:"alarmDialog",
            title:"告警",
            save:function(){
                var alarmData = [];
                var alarms = [];
                var x = 0;
                for(var i=0;i<$scope.alarmListPage.checkedList.length;i++){
                    $.each($scope.alarmListPage.data,function(j,v){
                        if($scope.alarmListPage.checkedList[i]== v.id){
                            var flag = false;
                            $.each($scope.alarmData,function(ii,vv){
                                if(vv.id== v.id){
                                    flag = true;
                                }
                            });
                            if(!flag){
                                alarmData[x]={"id":v.id,"name": v.ruleDisplayName,"alarmValue": v.alarmValue};
                                alarms[x] = {"alarmId":v.id};
                                x++;
                            }
                        }
                    });
                }

                $.each(alarmData,function(i,v){
                    $scope.alarmData.push(v);
                    $scope.formData.alarms.push({"alarmId":v.id});
                });
                $scope.alarmDialog.hide();
            }
        });

        $scope.eventDetailDialog=Tools.dialog({
            id:"eventDetailDialog",
            title:"告警详情",
            hiddenButton:true
        });

        $scope.$watch("alarmSearchPage.data.mocpId",function(newVal,oldVal){
            $scope.alarmSearchPage.data.mocId="";
            $scope.alarmSearchPage.datas.moc = [];
            if(Util.notNull(newVal)){
                $scope.alarmSearchPage.datas.moc = Util.findFromArray("id",newVal,$scope.alarmSearchPage.datas.mocp)['children'];
            }
        },false);


        $scope.$watch("alarmSearchPage.data.mocId",function(newVal, oldVal){
            $scope.alarmSearchPage.data.indicatorId = "";
            $scope.alarmSearchPage.datas.indicators = [];
            if(Util.notNull(newVal)){
                ItsmService.getMetricByMocId({rule:'alarm',mocId:newVal},{},function(data){
                    $scope.alarmSearchPage.datas.indicators = data;
                });
            }
        },false);

        $scope.$watch("alarmSearchPage.data.indicatorId",function(newVal,oldVal){
            $scope.alarmSearchPage.data.metricId="";
            $scope.alarmSearchPage.datas.metrics = [];
            if(Util.notNull(newVal)){
                $scope.alarmSearchPage.datas.metrics = Util.findFromArray('id',newVal,$scope.alarmSearchPage.datas.indicators)['children'];
            }
        },false);

        $scope.alarmListPage = {
            data:[],
            checkedList : [],
            checkAllRow : false,
            action:{
                search:function(search,fnCallback){
                    $scope.alarmSearchPage.data.limit = search.limit;
                    $scope.alarmSearchPage.data.offset = search.offset;
                    $scope.alarmSearchPage.data.orderBy = search.orderBy;
                    $scope.alarmSearchPage.data.orderByType  = search.orderByType;
                    Loading.show();
                    ItsmService.getCurrentEvent($scope.alarmSearchPage.data,function(data){
                        $scope.alarmListPage.data =data.rows;
                        fnCallback(data);
                        $scope.alarmListPage.checkedList = [];
                        $scope.alarmListPage.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }
            }
        };

        $scope.alarmListPage.settings = {
            reload : null,
            getData:$scope.alarmListPage.action.search,//getData应指定获取数据的函数
            columns : [
                {
                    sTitle: "<div class='checkbox'><label><input type='checkbox' ng-model='alarmListPage.checkAllRow'><i></i></label></div>",
                    mData:"id",
                    mRender:function(mData,type,full) {
                        return '<div class="checkbox"><label><input type="checkbox" checklist-model="alarmListPage.checkedList" checklist-value="'+mData+'" /><i></i></label></div>';
                    }
                },
                {
                    sTitle: "规则名称",
                    mData:"ruleDisplayName",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
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
                }

            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [ 0,9] },  //列不可排序
                { sWidth: "38px", aTargets: [ 0 ] },
                { sWidth: "80px", aTargets: [ 4 ] }
            ] , //定义列的约束
            defaultOrderBy : [[ 8, "desc" ]]  //定义默认排序列为第7列倒序
        };

        $scope.$watch("alarmListPage.checkAllRow",function(newVal,oldVal){
            if(newVal){
                $scope.alarmListPage.checkedList = Util.copyArray("id",$scope.alarmListPage.data);
            }else{
                if($scope.alarmListPage.data.length == $scope.alarmListPage.checkedList.length){
                    $scope.alarmListPage.checkedList = [];
                }
            }
        },false);

       // ****************  list page  ***************
        $scope.redirect = false;
        $scope.incidentList = {
          data:[],  //table 数据
          checkedList: [],
          checkAllRow:false
        };


        $scope.incidentSearchPage.init();

        $scope.incidentList.settings = {
            reload : null,
            getData:function(search,fnCallback){
                $scope.incidentSearchPage.data.limit = search.limit;
                $scope.incidentSearchPage.data.offset = search.offset;
                $scope.incidentSearchPage.data.orderBy = search.orderBy;
                $scope.incidentSearchPage.data.orderByType = search.orderByType;
                Loading.show();
                if(typeof($scope.taskList)=="undefined"){
                    var moId=$location.$$search.moId;
                    //从其他页面带有mo参数跳转过来
                    if(moId && !$scope.redirect){
                        $scope.redirect = true;
                        if($location.$$search.type && $location.$$search.type==1){//该mo所属机房所有的mo
                            ItsmService.getMoById({moId:moId},{},function(data) {
                                $scope.incidentSearchPage.data.jfId = data.mo.jfId;
//                                $scope.incidentSearchPage.data.mocpId = data.mo.mocpId;
//                                $scope.incidentSearchPage.data.mocId = data.mo.mocId;
                                $scope.$watch("rooms", function (n) {
                                    if (n && n.length > 0) {
                                        $timeout(function () {
                                            jQuery("#jfId option[value='" + (data.mo.jfId == null ? "" : data.mo.jfId) + "']").attr("selected", "selected");
                                        }, 100);
                                    }
                                }, true);
                                $scope.incidentSearchPage.data.jf=$location.$$search.type;
                                ItsmService.getIncident($scope.incidentSearchPage.data,function(data){
                                    $scope.incidentList.data =data.rows;
                                    fnCallback(data);
                                    $scope.incidentList.checkedList = [];
                                    $scope.incidentList.checkAllRow = false;
                                    Loading.hide();
                                },function(error){
                                    Loading.hide();
                                });
                            });
                        }else{//该mo的数据
                            $scope.redirect = true;
                            ItsmService.getMoById({moId:moId},{},function(data){
                                $scope.incidentSearchPage.data.mocpId = data.mo.mocpId;
                                $scope.incidentSearchPage.data.mocId = data.mo.mocId;
                                $scope.incidentSearchPage.data.moId = moId;
                                $timeout(function(){
                                    jQuery("#mocpId option[value='"+$scope.incidentSearchPage.data.mocpId+"']").attr("selected","selected");
                                    jQuery("#mocId option[value='"+$scope.incidentSearchPage.data.mocId+"']").attr("selected","selected");
                                    jQuery("#moId option[value='"+$scope.incidentSearchPage.data.moId+"']").attr("selected","selected");
                                },2000);
                                ItsmService.getIncident($scope.incidentSearchPage.data,function(data){
                                    $scope.incidentList.data =data.rows;
                                    fnCallback(data);
                                    $scope.incidentList.checkedList = [];
                                    $scope.incidentList.checkAllRow = false;
                                    Loading.hide();
                                },function(error){
                                    Loading.hide();
                                });
                            });
                        }
                    }else{
                        ItsmService.getIncident($scope.incidentSearchPage.data,function(data){
                            $scope.incidentList.data =data.rows;
                            fnCallback(data);
                            $scope.incidentList.checkedList = [];
                            $scope.incidentList.checkAllRow = false;
                            Loading.hide();
                        },function(error){
                            Loading.hide();
                        });
                    }
                }else if($scope.taskList.childId==11){
                    $scope.claim=true;
                    ItsmService.queryClaimingIncident($scope.incidentSearchPage.data,function(data){
                        $scope.incidentList.data = data.rows;
                        fnCallback(data);
                        $scope.incidentList.checkedList = [];
                        $scope.incidentList.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }else if($scope.taskList.childId==12){
                    ItsmService.queryTaskIncident($scope.incidentSearchPage.data,function(data){
                        $scope.incidentList.data = data.rows;
                        fnCallback(data);
                        $scope.incidentList.checkedList = [];
                        $scope.incidentList.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }else if($scope.taskList.childId==13){
                    ItsmService.queryRunningIncident($scope.incidentSearchPage.data,function(data){
                        $scope.incidentList.data = data.rows;
                        fnCallback(data);
                        $scope.incidentList.checkedList = [];
                        $scope.incidentList.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }else if($scope.taskList.childId==14){
                    ItsmService.queryFinishedIncident($scope.incidentSearchPage.data,function(data){
                        $scope.incidentList.data = data.rows;
                        fnCallback(data);
                        $scope.incidentList.checkedList = [];
                        $scope.incidentList.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }
            },
            columns : [
                {
                    sTitle: "故障单号",
                    mData:"orderId"
                },
                {
                    sTitle: "故障标题",
                    mData:"title",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "资源类型",
                    mData:"params.mocId",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.mocId);
                    }
                },
                {
                    sTitle: "资源实例",
                    mData:"params.moId",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.moId);
                    }
                },
                {
                    sTitle: "优先级",
                    mData:"priority",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.priority);
                    }
                },
                {
                    sTitle: "报告人",
                    mData:"reporter",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                }
                /*{
                    sTitle: '<label ng-show="currentView==\'queryMyTask\'"><b>报告人</b></label>',//<label ng-show="currentView!=\'queryMyTask\'"><b>处理人</b></label>
                    mData:"resolveUser",
                    mRender:function(mData,type,full) {
                        return '<span ng-show="currentView==\'queryMyTask\'">'+Util.str2Html(full.reporter)+'</span>';//<span ng-show="currentView!=\'queryMyTask\'">'+Util.str2Html(full.params.resolveUser)+'</span>
                    }
                }*/,
                {
                    sTitle:"状态",
                    mData:"step",
                    mRender:function(mData,type,full) {
                        return Util.str2Html($rootScope.getStep(full,"incident"));
                    }
                },
                {
                    sTitle:"发生时间",
                    mData:"time",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle:"创建人",
                    mData:"applyUser",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.applyUser);
                    }
                },
                {
                    sTitle:"处理人",
                    mData:"resolveUser",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.resolveUser);
                    }
                },
                {
                    sTitle:"创建时间",
                    mData:"applyTime",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle:"操作",
                    mData:"id",
                    mRender:function(mData,type,full) {
                        var str = "";
                        var taskKey = typeof(full.params.taskKey)!='undefined'?full.params.taskKey:"sid-E21AC1DF-6D03-47E0-A2BE-014ECEC5CC8D";
                        if(full.params.assignee == null && (typeof($scope.taskList) == "undefined" || $scope.taskList.childId==13 || $scope.taskList.childId==14)){
                            str = '<i class="fa fa-search" title="查看" ng-click="action.preProcess('+mData+',\''+taskKey+'\',\''+full.taskId+'\')"> </i>';
                        }
                        else if(full.params.assignee == null){
                            str += '<i ng-disabled="loginUserMenuMap[currentView]" class="fa fa-edit" title="签收" ng-click="action.claim(\''+full.taskId+'\')"> </i>';
                            str += '<i class="fa fa-search" title="查看" ng-click="action.preProcess('+mData+',\'sid-E21AC1DF-6D03-47E0-A2BE-014ECEC5CC8D\',\''+full.taskId+'\')"> </i>';
                        }else{
                            str = '<i ng-disabled="loginUserMenuMap[currentView]" class="fa fa-pencil" title="处理" ng-click="action.preProcess('+mData+',\''+taskKey+'\',\''+full.taskId+'\')"> </i>';
                        }
                        if(typeof($scope.taskList)!="undefined")
                            str += '<i class="fa fa-code-fork" title="流程图" ng-click="action.showFlow(\''+full.processId+'\',\''+full.params.pid+'\')"></i>';
                        if(typeof($scope.taskList)=="undefined")
                            str += '<i class="fa fa-trash-o" ng-show="loginUser.userName==\'admin\'" title="删除" ng-click="action.delete(\''+full.id+'\',\'incident\')"></i>';
                        return str;
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [ 10] },  //不可排序
                { sWidth: "100px", aTargets: [ 0 ] },
                { sWidth: "140px", aTargets: [ 9 ] },
                { sWidth: "100px", aTargets: [ 10 ] }
            ], //定义列的约束
            defaultOrderBy : []  //定义默认排序列为第8列倒序
        }

        setResolveUserTree();
        //获取当前列表中 所有的处理人
        function setResolveUserTree(){
            $('#resolveUser').attr("disabled",false)//将input元素设置为disabled
            $('#resolveUser1').attr("disabled",false)//将input元素设置为disabled
            if(typeof($scope.taskList)=="undefined"){
                ItsmService.getResolveUser(function(data){
                    if(data.rows.length==0){//没有处理人
                        $scope.resolveUserData=[];
                        $('#resolveUser').attr("disabled",true)//将input元素设置为disabled
                        $('#resolveUser1').attr("disabled",true)//将input元素设置为disabled
                    }else{
                        var name = null;
                        for(var i=0;i<data.rows.length;i++){
                            if(name==null){
                                name = data.rows[i];
                            }else{
                                name = name + "," + data.rows[i];
                            }
                        }
                        ItsmService.getResolveUserByLocToUser({displayName:name},function(data){
                            $scope.resolveUserData=data;
                        });
                    }
                });
            }else if($scope.taskList.childId=="11"){
                $scope.claim=true;
                ItsmService.queryClaimingIncident($scope.incidentSearchPage.data,function(data){
                    if(data.rows.length==0){//列表无数据
                        $scope.resolveUserData=[];
                        $('#resolveUser').attr("disabled",true)//将input元素设置为disabled
                        $('#resolveUser1').attr("disabled",true)//将input元素设置为disabled
                    }else{
                        var name = null;
                        for(var i=0;i<data.rows.length;i++){
                            if(name==null){
                                name = data.rows[i].resolveUser;
                            }else{
                                name = name + "," + data.rows[i].resolveUser;
                            }
                        }
                        ItsmService.getResolveUserByLocToUser({displayName:name},function(data){
                            $scope.resolveUserData=data;
                        });
                    }
                    Loading.hide();
                },function(error){
                    Loading.hide();
                });
            }else if($scope.taskList.childId=="12"){
                ItsmService.queryTaskIncident($scope.incidentSearchPage.data,function(data){
                    if(data.rows.length==0){//列表无数据
                        $scope.resolveUserData=[];
                        $('#resolveUser').attr("disabled",true)//将input元素设置为disabled
                        $('#resolveUser1').attr("disabled",true)//将input元素设置为disabled
                    }else{
                        var name = null;
                        for(var i=0;i<data.rows.length;i++){
                            if(name==null){
                                name = data.rows[i].resolveUser;
                            }else{
                                name = name + "," + data.rows[i].resolveUser;
                            }
                        }
                        ItsmService.getResolveUserByLocToUser({displayName:name},function(data){
                            $scope.resolveUserData=data;
                        });
                    }
                    Loading.hide();
                },function(error){
                    Loading.hide();
                });
            }else if($scope.taskList.childId=="13"){
                ItsmService.queryRunningIncident($scope.incidentSearchPage.data,function(data){
                    if(data.rows.length==0){//列表无数据
                        $scope.resolveUserData=[];
                        $('#resolveUser').attr("disabled",true)//将input元素设置为disabled
                        $('#resolveUser1').attr("disabled",true)//将input元素设置为disabled
                    }else{
                        var name = null;
                        for(var i=0;i<data.rows.length;i++){
                            if(name==null){
                                name = data.rows[i].resolveUser;
                            }else{
                                name = name + "," + data.rows[i].resolveUser;
                            }
                        }
                        ItsmService.getResolveUserByLocToUser({displayName:name},function(data){
                            $scope.resolveUserData=data;
                        });
                    }
                    Loading.hide();
                },function(error){
                    Loading.hide();
                });
            }else if($scope.taskList.childId=="14"){
                ItsmService.queryFinishedIncident($scope.incidentSearchPage.data,function(data){
                    if(data.rows.length==0){//列表无数据
                        $scope.resolveUserData=[];
                        $('#resolveUser').attr("disabled",true)//将input元素设置为disabled
                        $('#resolveUser1').attr("disabled",true)//将input元素设置为disabled
                    }else{
                        var name = null;
                        for(var i=0;i<data.rows.length;i++){
                            if(name==null){
                                name = data.rows[i].resolveUser;
                            }else{
                                name = name + "," + data.rows[i].resolveUser;
                            }
                        }
                        ItsmService.getResolveUserByLocToUser({displayName:name},function(data){
                            $scope.resolveUserData=data;
                        });
                    }
                    Loading.hide();
                },function(error){
                    Loading.hide();
                });
            }
            /*var zTree = angular.element.fn.zTree.getZTreeObj("resolveUser");
            var nodes = zTree.getNodes();
            for(var i =0;i<nodes.length;i++){
                zTree.cancelSelectedNode(nodes[i]);
            }*/
        }

        $scope.$watch("incidentSearchPage.data.mocpId",function(newVal,oldVal){
            if(!$scope.redirect || !Util.notNull(newVal)){
                $scope.incidentSearchPage.data.mocId = "";
                $scope.incidentSearchPage.data.moId = "";
            }
            $scope.incidentSearchPage.datas.moc = [];
            $scope.incidentSearchPage.datas.mos = [];
            if(Util.notNull(newVal)){
                $scope.incidentSearchPage.datas.moc = Util.findFromArray("id",newVal,$scope.initData.mocp)['children'];
                if($scope.redirect){
                    $timeout(function(){
                        jQuery("#mocId option[value='"+$scope.incidentSearchPage.data.mocId+"']").attr("selected","selected");
                    },1000);
                }
            }
        },false);

        $scope.$watch("incidentSearchPage.data.mocId",function(newVal, oldVal){
            if(!$scope.redirect || !Util.notNull(newVal)){
                $scope.incidentSearchPage.data.moId = "";
            }
            $scope.incidentSearchPage.datas.mos = [];
            if(Util.notNull(newVal)){
                ItsmService.getMoByMocId({mocId:newVal,orderBy:'displayName',orderByType:'asc'},{},function(data){
                    $scope.incidentSearchPage.datas.mos = data.rows;
                    if($scope.redirect){
                        $timeout(function(){
                            jQuery("#moId option[value='"+$scope.incidentSearchPage.data.moId+"']").attr("selected","selected");
                        },1000);
                    }
                });
            }
        },false);

    }]);

    itsmControllers.controller('problemController',['$scope','$rootScope','$location','$timeout','ItsmService','Util','Loading','$location','Tools',function($scope,$rootScope,$location,$timeout,ItsmService,Util,Loading,$location,Tools){
        var taskKey=$location.$$search.taskKey==null?"sid-7E6EA8D8-9AFF-4649-9191-B21D4A077884":$location.$$search.taskKey;
        var id=$location.$$search.id;
        var taskId = $location.$$search.taskId;
        $scope.childId = $location.$$search.childId;
        $timeout(function(){
            if($location.$$search.moId)angular.element(".search-head").show();
        },2000);
        $scope.taskId=taskId;
        $scope.initData = {};
        $scope.formData = {};
        $scope.uploadFile = new Array();
        $scope.formData.attachment = new Array();
        $scope.incidentData = [];
        $scope.formData.incidents = [];
        $scope.incidentSearchPage = {};
        $scope.incidentSearchPage.data={};
        $scope.incidentSearchPage.datas={};
        $scope.hiddenData = {};
//        $timeout(function(){
//            var height=angular.element(window).height()-210;
//            angular.element(".form-wrapper").height(height);
//        },1000);

        $scope.problemSearchPage = {
            init : function(){
                $scope.problemSearchPage.data = {
                    limit : 20, //每页条数(即取多少条数据)
                    offset : 0 , //从第几条数据开始取
                    orderBy : "",//排序字段
                    orderByType : "" //排序顺序
                }
            },
            search:function(){
                $scope.problemList.settings.reload(true);
            }
        };
        $scope.problemSearchPage.datas = {};

        $scope.knowledgeSearchPage = {
            init : function(){
                $scope.knowledgeSearchPage.data = {
                    table:"KnowledgeLib",
                    limit : 20, //每页条数(即取多少条数据)
                    offset : 0 , //从第几条数据开始取
                    orderBy : "",//排序字段
                    orderByType : "" //排序顺序
                }
            },
            search:function(){
                $scope.knowledgeList.settings.reload(true);
            }
        };
        $scope.knowledgeSearchPage.init();
        $scope.knowledgelibDialog = Tools.dialog({
            id:"knowledgelibDialog",
            title:"查询",
            hiddenButton:true
        });

        $scope.knowledgeListPage = {
            data:[],  //table 数据
            checkedList: [],
            checkAllRow:false
        };

        $scope.knowledgeListPage.settings = {
            reload : null,
            getData:function(search,fnCallback){
                $scope.knowledgeSearchPage.data.limit = search.limit;
                $scope.knowledgeSearchPage.data.offset = search.offset;
                $scope.knowledgeSearchPage.data.orderBy = search.orderBy;
                $scope.knowledgeSearchPage.data.orderByType = search.orderByType;
                Loading.show();
                ItsmService.getKnowledge($scope.knowledgeSearchPage.data,function(data){
                    $scope.knowledgeListPage.data = data.rows;
                    fnCallback(data);
                    $scope.knowledgeListPage.checkedList = [];
                    $scope.knowledgeListPage.checkAllRow = false;
                    Loading.hide();
                },function(error){
                    Loading.hide();
                });
                Loading.hide();
            },
            columns : [
                {
                    sTitle: "知识单号",
                    mData:"orderId"
                },
                {
                    sTitle: "知识标题",
                    mData:"title",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "关键字",
                    mData:"keyWord",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "创建人",
                    mData:"applyUser",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.applyUser);
                    }
                },
                {
                    sTitle:"创建时间",
                    mData:"applyTime",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [ ] },  //不可排序
                { sWidth: "140px", aTargets: [ 4] },
                { sWidth: "400px", aTargets: [ 1 ] }
            ], //定义列的约束
            defaultOrderBy : []  //定义默认排序列为第8列倒序
        };

        ItsmService.getAllMoc(function(data){
            $scope.initData.mocp = data;
            $scope.incidentSearchPage.datas.mocp = data;
            $scope.problemSearchPage.datas.mocp = data;
        });

        //去表单页面
        if(Util.notNull(taskKey)){
            ItsmService.getItsmDefInfluenceType({processType:"problem"},{},function(data){
                $scope.initData.ItsmDefInfluenceType = data;
            });
            ItsmService.getItsmDefEmergencyType({processType:"problem"},{},function(data){
                $scope.initData.ItsmDefEmergencyType = data;
            });
            ItsmService.getItsmDefCloseCode({processType:"problem"},{},function(data){
                $scope.initData.ItsmDefCloseCode = data;
            });

            $rootScope.$watch("loginUser.userName", function (newVal, oldVal) {
                if (Util.notNull(newVal)) {
                    $scope.formData.applyUser = newVal;
                    if($scope.formData.params)
                        $scope.formData.params.applyUser=$rootScope.loginUser.realName;
                    else
                        $scope.formData.params={applyUser:$rootScope.loginUser.realName};
                }
            }, false);

            ItsmService.getTime(function(data){
                $scope.formData.applyTime = data.time;
                if (id == null) {
                    $scope.formData.time=angular.copy(data.time);
                }
            });


            ItsmService.getUsergroupValue(function (data) {
                $scope.initData.usergroup = data;
            });
           /* ItsmService.getUsergroup(function(data){
                $scope.initData.usergroup = data;
                *//*$timeout(function(){
                    jQuery("select[name='resolveGroup'] option[value="+$scope.formData.resolveGroup+"]").attr("selected","selected");
                },1000);*//*
            });*/
            ItsmService.getUsers(function(data){
                $scope.initData.users = data.rows;
               /* $timeout(function(){
                    jQuery("select[name='resolveUser'] option[value="+$scope.formData.resolveUser+"]").attr("selected","selected");
                },1000);*/
            });
            //动态控制字段
            $scope.fields=[];
            ItsmService.getForm({task:taskKey,flow:"problem"},{},function(data){
                $scope.fields=data;
                $scope.find=function(name){
                    var o = {disabled: true, required: false,show:false};
                    for (var i = 0; i < $scope.fields.length; i++) {
                        if (name == $scope.fields[i].fieldName) {
                            o = {show: true, required: $scope.fields[i].required,disabled:$scope.fields[i].disabled};
                        }
                    }
                    return o;
                }
            });
            if(id!=null){
                ItsmService.querySingleProblem({id:id},{},function(data){
                    $scope.formData = data;
                    $scope.formData.closeCode=($scope.formData.closeCode==null?"":$scope.formData.closeCode);
                    $scope.formData.taskId=taskId;
                    $("#locationText").attr("value",$scope.formData.location);
                    $scope.incidentData = angular.copy($scope.formData.params.incidents);
                    $scope.uploadFile = angular.copy($scope.formData.attachment);
                    ItsmService.getProblemHistory({procId:$scope.formData.processId,id:id},{},function(data){
                        $scope.historyProcess = data.rows;
                        if(data.rows.length>0)$scope.currentStep=data.rows[data.rows.length-1].name;
                    });
                });
            }else{
                $rootScope.$watch("loginUser.locId",function(n){
                    if(n){
                        $scope.formData.reporter=$rootScope.loginUser.realName;
                        $scope.formData.reporterPhone=$rootScope.loginUser.mobile;
                        $scope.formData.reporterEmail=$rootScope.loginUser.email;
                        ItsmService.getLocation({id:$rootScope.loginUser.locId},{},function(data){
                            $scope.formData.location=data.bean.id;
                            $scope.formData.params.location=data.bean.name;
                        });
                    }
                },true);
                $scope.$watch("initData.ItsmDefEmergencyType.length",function(n){
                    if(n>0){
                        $timeout(function(){
                            $scope.formData['urgency']=2;
                            $scope.formData['effect']=2;
                            jQuery("select[name='effect'] option[value="+$scope.formData.effect+"]").attr("selected","selected");
                            jQuery("select[name='urgency'] option[value="+$scope.formData.urgency+"]").attr("selected","selected");
                        },1000);
                    }
                },true)
            }
            var moClear=true,mocClear=true;
            if($location.$$search.moId){
                ItsmService.getMoById({moId:$location.$$search.moId},{},function(data) {
                    moClear=false;
                    mocClear=false;
                    $scope.formData.mocpId= data.mo.mocpId;//资源大类型ID
                    $scope.formData.mocId= data.mo.mocId;//资源小类型ID
                    $scope.formData.moId= data.mo.id;//资源实例ID
                });
            }

            //判断按钮 是否显示
            $scope.findShow = function(s){
                var re = false;
                if(s == taskKey){
                    re = true;
                }
                return re;
            }
            $scope.findShowSave = function(){
                var re = true;
                if("sid-7E6EA8D8-9AFF-4649-9191-B21D4A077884" == taskKey || 'sid-A97EF687-33E2-43C3-A36F-76D724D99892' == taskKey){
                    re = false;
                }
                return re;
            }

            //当紧急度下拉框的值改变后 优先级中的值 需要做改变
            $scope.$watch("formData.urgency",function(newVal, oldVal){
                if(Util.notNull(newVal) && Util.notNull($scope.formData.effect)){//当紧急度或者影响度有一个为空时 优先级文本框也为空
                    ItsmService.getItsmDefPriorityMatrix({processType:"problem",influcenceCode:$scope.formData.effect,emergencyCode:newVal},{},function(data){
                        $scope.formData.priority = data.id;
                        $("#priority").attr("value",data.priority);
                    });
                }else{
                    $scope.formData.priority="";
                    $("#priority").attr("value","");
                }
            },false);
            //监控影响度变化而修改优先级
            $scope.$watch("formData.effect",function(newVal, oldVal){
                if(Util.notNull(newVal) && Util.notNull($scope.formData.urgency)){
                    ItsmService.getItsmDefPriorityMatrix({processType:"problem",influcenceCode:newVal,emergencyCode:$scope.formData.urgency},{},function(data){
                        $scope.formData.priority = data.id;
                        $("#priority").attr("value",data.priority);
                    });
                }else{
                    $scope.formData.priority="";
                    $("#priority").attr("value","");
                }
            },false);

            //监控大资源类型的改变对小资源类型和资源实例的影响
            $scope.$watch("formData.mocpId",function(newVal,oldVal){
                $scope.initData.moc = [];
                if(!Util.notNull(id) && mocClear){
                    $scope.formData.mocId = "";
                    $scope.formData.moId = "";
                }
                if(!mocClear)mocClear=true;
                if(Util.notNull(newVal)){
                    $scope.initData.moc = Util.findFromArray("id",newVal,$scope.initData.mocp)['children'];
                    if(Util.notNull($scope.formData.mocId)){
                        $timeout(function(){
                            jQuery("select[name='mocId'] option[value="+$scope.formData.mocId+"]").attr("selected","selected");//强制刷新
                        },1000);
                    }
                }
            },false);
            //小资源类型的改变对资源实例的影响
            $scope.$watch("formData.mocId",function(newVal,oldVal){
                $scope.initData.mo = [];
                if(!Util.notNull(id) && moClear) {
                    $scope.formData.moId = "";
                }
                if(!moClear)moClear=true;
                if(Util.notNull(newVal)){
                    Loading.show();
                    ItsmService.getMoByMocId({mocId:newVal,orderBy:'displayName',orderByType:'asc'},{},function(data){
                        $scope.initData.mo = data.rows;
                        if(Util.notNull($scope.formData.mocId)){
                            $timeout(function(){
                                jQuery("select[name='moId'] option[value="+$scope.formData.moId+"]").attr("selected","selected");
                            },200);
                        }
                        Loading.hide();
                    },function(data){
                        Loading.hide();
                    });
                }
            },false);

            //处理组的改变对处理人的影响
            $scope.$watch("formData.resolveGroup",function(newVal,oldVal){
                $scope.initData.groupUser = [];
                if(!Util.notNull(id)) {
                    $scope.formData.resolveUser = "";
                }
                if(Util.notNull(newVal)){
                    ItsmService.getUserByGroup({groupName:newVal},{},function(data){
                        $scope.initData.groupUser = data;
                        if(Util.notNull($scope.formData.resolveGroup)){
                            $timeout(function(){
                                jQuery("select[name='resolveUser'] option[value="+$scope.formData.resolveUser+"]").attr("selected","selected");
                            },1000);
                        }
                    });
                }else{
                    $scope.formData.resolveUser = "";
                }
            },false);


            $scope.$watch("uploadFile",function(newVal,oldVal){
                if(Util.notNull(newVal) && newVal.length>0){
                    $scope.hiddenData.attachment = 1;
                }else{
                    $scope.hiddenData.attachment = "";
                }
            },true);

            //事件数据的监控
            $scope.$watch("incidentData",function(newVal,oldVal){
                if(Util.notNull(newVal) && newVal.length>0){
                    $scope.hiddenData.incidents = 1;
                }else{
                    $scope.hiddenData.incidents = "";
                }
            },true);
        }


        //我的任务页子节点刷新而刷新页面
        $scope.$watch("taskList.childId",function(newVal,oldVal){
            if(Util.notNull(newVal) && (newVal == 21 || newVal == 22 || newVal == 23 || newVal == 24)){
                $scope.problemSearchPage.search();
                setResolveUserTreeProblem();
             }
        },false);


        //页面事件触发模块
        $scope.action = {
            delete:function(id,type){
                $rootScope.$confirm("确定要删除吗？",function(){
                    Loading.show();
                    ItsmService.deleteFlow({id:id,type:type},function(data){
                        $rootScope.$alert(" 删除成功!");
                        Loading.hide();
                        $scope.problemList.settings.reload(true);
                    },function(data){
                        Loading.hide();
                    });
                },"删除");
            },
            save:function(taskId){
                if(taskId > 0){
                    ItsmService.updateProblem({id:taskId},$scope.formData,function(data){
                        $rootScope.$alert(" 保存成功!");
                    });
                    Loading.hide();
                }else{
                    ItsmService.saveProblem({},$scope.formData,function(data){
                        $rootScope.$alert(" 保存成功!");
                    });
                    Loading.hide();
                }
            },
            start: function(){
                Loading.show();
                ItsmService.startProblem({},$scope.formData,function(data){
                    Loading.hide();
                    window.location.href = "#/queryMyTask?childId=22&parentId=2";
                },function(data){
                    Loading.hide();
                });
            },
            claim: function(taskId){
                ItsmService.claimProblem({id:taskId},{},function(data){
                    $scope.problemSearchPage.search();
                    Loading.hide();
                    $rootScope.$alert(" 签收成功!");
                    ItsmService.taskGroup({flow:"incident,problem,change,knowledge"},function(data){
                        for(var i=0;i<$scope.taskTree.length;i++){
                            for(var j=0;j<$scope.taskTree[i].children.length;j++){
                                var count=data[$scope.taskTree[i].children[j].id];
                                $scope.taskTree[i].children[j].displayName=($scope.taskTree[i].children[j].displayName.split("(")[0]+"("+count+")");
                            }
                        }
                    });
                });
                Loading.hide();
            },
            claimForward: function(taskId){
                Loading.show();
                ItsmService.claimProblem({id:taskId},{},function(data){
                    Loading.hide();
                    window.location.href = "#/queryMyTask?childId=22&parentId=2";
                },function(data){
                    Loading.hide();
                });
            },
            back:function(){
                if($scope.childId=='00'){
                    window.location.href = "#/queryProblem";
                }else{
                    var childId = $scope.childId==null?"21":$scope.childId;
                    var parentId = $scope.childId==null?"2":$scope.childId.substring(0,1)
                    window.location.href = "#/queryMyTask?childId="+childId+"&parentId="+parentId;
                }
            },
            process:function(flag){
                if(flag){//关闭
                    if($scope.formData.closeCode== null || $scope.formData.closeCode==""){
                        $rootScope.$alert("请选择原因");
                        return ;
                    }
                    $scope.formData.action='关闭';
                }
                if(flag==false){//重开
                    if($scope.formData.closeRemark == null || $scope.formData.closeRemark==""){
                        $rootScope.$alert("请输入说明");
                        return ;
                    }
                    $scope.formData.action='拒绝';
                }
                Loading.show();
                $scope.formData.taskId = taskId;
                ItsmService.processProblem({},$scope.formData,function(data){
                    Loading.hide();
                    window.location.href = "#/queryMyTask?childId=22&parentId=2";
                },function(data){
                    Loading.hide();
                });
            },
            preProcess:function(id,taskKey,taskId){
                window.location.href = '#/createProblem?taskKey='+taskKey+"&id="+id+"&taskId="+taskId+"&childId="+(typeof($scope.taskList) == "undefined"?"00":$scope.taskList.childId);
            },
            showFlow:function(processId,pid){//显示流程图
                $("#pid").hide();
                //window.open('/dmonitor-webapi/itsm/workflow/resource/read?processDefinitionId='+processId+'&resourceType=image',"",null);
                $("#img").attr("src",'/dmonitor-webapi/itsm/workflow/resource/read?processDefinitionId='+processId+'&resourceType=image&r='+(new Date()).getTime());
                ItsmService.getImagePosition({pid:pid,r:(new Date()).getTime()},{},function(data){
                    $.each(data,function(i,v){
                        if(v.currentActiviti){
                            $("#pid").show();
                            $("#pid").css("height",v.height+10);
                            $("#pid").css("width",v.width+10);
                            $("#pid").css("left",v.x-4);
                            var img = new Image();
                            img.src=$("#img").attr("src");
                            img.onload = function(){
                                this.onload=null;
                                $("#pid").css("top",v.y-this.height-4);//10
                            }
                            $("#pid").css("position","relative");
                            $("#pid").css("border","solid 5px red");
                        }
                    });
                });
                $scope.imageDialog.show();
            },
            addIncident:function(){//新增故障工单
                $scope.incidentSearchPage.data={};
                $scope.incidentListPage.settings.reload(true);
                $scope.incidentDialog.show();
            },
            deleteIncident:function(id){//删除故障工单
                $rootScope.$confirm("确定要删除吗？",function() {
                    var incidentData = [];
                    $scope.formData.incidents = [];
                    var x = 0;
                    $.each($scope.incidentData, function (i, v) {
                        if (v.id != id) {
                            incidentData[x] = v;
                            $scope.formData.incidents[x] = {"incidentId": v.id};
                            x++;
                        }
                    });
                    $scope.incidentData = incidentData;
                },"删除");
            },
            uploadFile:function(){//上传文件
                $('#file').attr("value","");
                $scope.fileDialog.show();
            },
            deleteFile:function(id){//删除文件
                $rootScope.$confirm("确定要删除吗？",function() {
                    var uploadFile = [];
                    var x = 0;
                    $.each($scope.uploadFile, function (i, v) {
                        if (v.id != id) {
                            uploadFile[x] = v;
                            x++;
                        }
                    });
                    $scope.uploadFile = angular.copy(uploadFile);
                    $scope.formData.attachment = angular.copy(uploadFile);
                },"删除");
            }
        };

        $scope.forwardDialog = Tools.dialog({
            id:"forwardDialog",
            title:"转派",
            resolveGroup:"",
            resolveUser:"",
            agentUser:"",
            users:[],
            hiddenButton:true,
            save:function(){
//                if($scope.forwardDialog.resolveGroup==null || $scope.forwardDialog.resolveGroup==""){
//                    $rootScope.$alert("请选择处理组");
//                    return;
//                }
//                $scope.forwardDialog.hide();
//                $scope.formData.taskId = taskId;
//                $scope.formData.resolveGroup=$scope.forwardDialog.resolveGroup;
//                $scope.formData.resolveUser=$scope.forwardDialog.resolveUser;
                $scope.formData.agentUser=$scope.forwardDialog.agentUser;
                $scope.formData.taskId = taskId;
                $scope.forwardDialog.hide();
                ItsmService.forwardProblem({},$scope.formData,function(data){
                    window.location.href = "#/queryMyTask?childId=22&parentId=2";
                });
                Loading.hide();
            }
        });
        ItsmService.queryAgent(function(rows){
            $scope.forwardDialog.users=rows;
        });
        $scope.$watch("forwardDialog.resolveGroup",function(newVal,oldVal){
            $scope.initData.groupUser = [];
            if(!Util.notNull(id)) {
                $scope.forwardDialog.resolveUser = "";
            }
            if(Util.notNull(newVal)){
                ItsmService.getUserByGroup({groupName:newVal},{},function(data){
                    $scope.initData.groupUser = data;
                    if(Util.notNull($scope.forwardDialog.resolveGroup)){
                        $timeout(function(){
                            jQuery("select[name='resolveUser1'] option[value="+$scope.forwardDialog.resolveUser+"]").attr("selected","selected");
                        },1000);
                    }
                });
            }else{
                $scope.forwardDialog.resolveUser = "";
            }
        },false);

        $scope.imageDialog = Tools.dialog({
            id:"imageDialog",
            title:"流程图",
            hiddenButton:true,
            save:function(){
                $scope.imageDialog.hide();
            }
        });

    $scope.fileDialog = Tools.dialog({
        id:"fileDialog",
        title:"上传文件",
        save:function(){
            if(angular.element("#file").val()==null || angular.element("#file").val()==""){
                $rootScope.$alert("请选择需要上传的文件");
                return;
            }
            Loading.show();
            var step='新建';
            if($scope.historyProcess && $scope.historyProcess.length>1){
                step=$scope.historyProcess[$scope.historyProcess.length-1].name;
            }
            $.ajaxFileUpload({
                url: '/dmonitor-webapi/itsm/form/upload?type=problem&step='+step, //用于文件上传的服务器端请求地址
                secureuri: false, //是否需要安全协议，一般设置为false
                fileElementId: 'file', //文件上传域的ID
                dataType: 'json', //返回值类型 一般设置为json
                success: function (data, status){
                    Loading.hide();
                    if(data != null && data.id!=null){
                        $scope.uploadFile.push(data);
                        $scope.formData.attachment.push(data);
                        $rootScope.$alert(" 上传成功!");
                    }else if(data.message && data.message.indexOf("Maximum upload size of")>-1){
                        $rootScope.$alert(" 上传失败,上传文件不能大于2M");
                    }else{
                        $rootScope.$alert(" 上传失败!");
                    }
                    $scope.$apply();
                    $rootScope.$apply();
                },error: function (data, status, e){
                    Loading.hide();
                    $rootScope.$alert(" 上传失败!");
                    $rootScope.$apply();
                }
            });
            $scope.fileDialog.hide();
        }
    });

        $scope.incidentDialog = Tools.dialog({
        id:"incidentDialog",
        title:"故障单",
        save:function(){
            var incidentData = [];
            var incidents = [];
            var x = 0;
            for(var i=0;i<$scope.incidentListPage.checkedList.length;i++){
                $.each($scope.incidentListPage.data,function(j,v){
                    if($scope.incidentListPage.checkedList[i]== v.id){
                        var flag = false;
                        $.each($scope.incidentData,function(ii,vv){
                            if(vv.id== v.id){
                                flag = true;
                            }
                        });
                        if(!flag){
                            incidentData[x]={"id":v.id,"orderId":v.orderId,"name": v.title,"resolveUser": v.params.resolveUser};;
                            incidents[x] = {"incidentId":v.id};
                            x++;
                        }
                    }
                });
            }

            $.each(incidentData,function(i,v){
                $scope.incidentData.push(v);
                $scope.formData.incidents.push({"incidentId":v.id});
            });

            $scope.incidentDialog.hide();
        }
    });

        $scope.$watch("incidentSearchPage.data.mocpId",function(newVal,oldVal){
            $scope.incidentSearchPage.data.mocId = "";
            $scope.incidentSearchPage.datas.moc = [];
            $scope.incidentSearchPage.data.moId = "";
            $scope.incidentSearchPage.datas.mos = [];
            if(Util.notNull(newVal)){
                $scope.incidentSearchPage.datas.moc = Util.findFromArray("id",newVal,$scope.incidentSearchPage.datas.mocp)['children'];
            }
        },false);

        $scope.$watch("incidentSearchPage.data.mocId",function(newVal, oldVal){
            $scope.incidentSearchPage.data.moId = "";
            $scope.incidentSearchPage.datas.mos = [];
            if(Util.notNull(newVal)){
                ItsmService.getMoByMocId({mocId:newVal,orderBy:'displayName',orderByType:'asc'},{},function(data){
                    $scope.incidentSearchPage.datas.mos = data.rows;
                });
            }
        },false);

        $scope.incidentListPage = {
            data:[],
            checkedList : [],
            checkAllRow : false,
            action:{
                search:function(search,fnCallback){
                    $scope.incidentSearchPage.data.limit = search.limit;
                    $scope.incidentSearchPage.data.offset = search.offset;
                    $scope.incidentSearchPage.data.orderBy = search.orderBy;
                    $scope.incidentSearchPage.data.orderByType  = search.orderByType;
                    $scope.incidentSearchPage.data.status="已关闭";
                    Loading.show();
                    ItsmService.getIncident($scope.incidentSearchPage.data,function(data){
                        $scope.incidentListPage.data =data.rows;
                        fnCallback(data);
                        $scope.incidentListPage.checkedList = [];
                        $scope.incidentListPage.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }
            }
        };

        $scope.incidentListPage.settings = {
            reload : null,
            getData:$scope.incidentListPage.action.search,//getData应指定获取数据的函数
            columns : [
                {
                    sTitle: "<div class='checkbox'><label><input type='checkbox' ng-model='incidentListPage.checkAllRow'><i></i></label></div>",
                    mData:"id",
                    mRender:function(mData,type,full) {
                        return '<div class="checkbox"><label><input type="checkbox" checklist-model="incidentListPage.checkedList" checklist-value="'+mData+'" /><i></i></label></div>';
                    }
                },
                {
                    sTitle: "故障单号",
                    mData:"orderId"
                },
                {
                    sTitle: "故障标题",
                    mData:"title",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "资源类型",
                    mData:"params.mocId",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.mocId);
                    }
                },
                {
                    sTitle: "资源实例",
                    mData:"params.moId",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.moId);
                    }
                },
                {
                    sTitle: "优先级",
                    mData:"priority",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.priority);
                    }
                },
                {
                    sTitle: "报告人",
                    mData:"reporter",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle:"状态",
                    mData:"step",
                    mRender:function(mData,type,full) {
                        return Util.str2Html($rootScope.getStep(full,"incident"));
                    }
                },
                {
                    sTitle:"发生时间",
                    mData:"time",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle:"创建人",
                    mData:"applyUser",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.applyUser);
                    }
                },
                {
                    sTitle:"处理人",
                    mData:"resolveUser",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.resolveUser);
                    }
                },
                {
                    sTitle:"创建时间",
                    mData:"applyTime",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [ 0] },  //列不可排序
                { sWidth: "38px", aTargets: [ 0 ] },
                { sWidth: "70px", aTargets: [ 7 ] },
                { sWidth: "70px", aTargets: [ 8 ] },
                { sWidth: "70px", aTargets: [ 10 ] }
            ] , //定义列的约束
            defaultOrderBy : [[ 9, "desc" ]]  //定义默认排序列为第7列倒序
        };


        setResolveUserTreeProblem();
        //获取当前列表中 所有的处理人
        function setResolveUserTreeProblem(){
            $('#resolveUser5').attr("disabled",false)//将input元素设置为disabled
            $('#resolveUser6').attr("disabled",false)//将input元素设置为disabled
            if(typeof($scope.taskList)=="undefined"){
                ItsmService.getResolveUserProblem(function(data){
                    if(data.rows.length==0){//没有处理人
                        $scope.resolveUserData=[];
                        $('#resolveUser5').attr("disabled",true)//将input元素设置为disabled
                        $('#resolveUser6').attr("disabled",true)//将input元素设置为disabled
                    }else{
                        var name = null;
                        for(var i=0;i<data.rows.length;i++){
                            if(name==null){
                                name = data.rows[i];
                            }else{
                                name = name + "," + data.rows[i];
                            }
                        }
                        ItsmService.getResolveUserByLocToUser({displayName:name},function(data){
                            $scope.resolveUserData=data;
                        });
                    }
                });
            }else if($scope.taskList.childId=="21"){
                $scope.claim=true;
                ItsmService.queryClaimingProblem($scope.problemSearchPage.data,function(data){
                    if(data.rows.length==0){//列表无数据
                        $scope.resolveUserData=[];
                        $('#resolveUser5').attr("disabled",true)//将input元素设置为disabled
                        $('#resolveUser6').attr("disabled",true)//将input元素设置为disabled
                    }else{
                        var name = null;
                        for(var i=0;i<data.rows.length;i++){
                            if(name==null){
                                name = data.rows[i].resolveUser;
                            }else{
                                name = name + "," + data.rows[i].resolveUser;
                            }
                        }
                        ItsmService.getResolveUserByLocToUser({displayName:name},function(data){
                            $scope.resolveUserData=data;
                        });
                    }
                    Loading.hide();
                },function(error){
                    Loading.hide();
                });
            }else if($scope.taskList.childId=="22"){
                ItsmService.queryTaskProblem($scope.problemSearchPage.data,function(data){
                    if(data.rows.length==0){//列表无数据
                        $scope.resolveUserData=[];
                        $('#resolveUser5').attr("disabled",true)//将input元素设置为disabled
                        $('#resolveUser6').attr("disabled",true)//将input元素设置为disabled
                    }else{
                        var name = null;
                        for(var i=0;i<data.rows.length;i++){
                            if(name==null){
                                name = data.rows[i].resolveUser;
                            }else{
                                name = name + "," + data.rows[i].resolveUser;
                            }
                        }
                        ItsmService.getResolveUserByLocToUser({displayName:name},function(data){
                            $scope.resolveUserData=data;
                        });
                    }
                    Loading.hide();
                },function(error){
                    Loading.hide();
                });
            }else if($scope.taskList.childId=="23"){
                ItsmService.queryRunningProblem($scope.problemSearchPage.data,function(data){
                    if(data.rows.length==0){//列表无数据
                        $scope.resolveUserData=[];
                        $('#resolveUser5').attr("disabled",true)//将input元素设置为disabled
                        $('#resolveUser6').attr("disabled",true)//将input元素设置为disabled
                    }else{
                        var name = null;
                        for(var i=0;i<data.rows.length;i++){
                            if(name==null){
                                name = data.rows[i].resolveUser;
                            }else{
                                name = name + "," + data.rows[i].resolveUser;
                            }
                        }
                        ItsmService.getResolveUserByLocToUser({displayName:name},function(data){
                            $scope.resolveUserData=data;
                        });
                    }
                    Loading.hide();
                },function(error){
                    Loading.hide();
                });
            }else if($scope.taskList.childId=="24"){
                ItsmService.queryFinishedProblem($scope.problemSearchPage.data,function(data){
                    if(data.rows.length==0){//列表无数据
                        $scope.resolveUserData=[];
                        $('#resolveUser5').attr("disabled",true)//将input元素设置为disabled
                        $('#resolveUser6').attr("disabled",true)//将input元素设置为disabled
                    }else{
                        var name = null;
                        for(var i=0;i<data.rows.length;i++){
                            if(name==null){
                                name = data.rows[i].resolveUser;
                            }else{
                                name = name + "," + data.rows[i].resolveUser;
                            }
                        }
                        ItsmService.getResolveUserByLocToUser({displayName:name},function(data){
                            $scope.resolveUserData=data;
                        });
                    }
                    Loading.hide();
                },function(error){
                    Loading.hide();
                });
            }
            /*var zTree = angular.element.fn.zTree.getZTreeObj("resolveUser6");
            var nodes = zTree.getNodes();
            for(var i =0;i<nodes.length;i++){
                zTree.cancelSelectedNode(nodes[i]);
            }*/
        }

        $scope.$watch("incidentListPage.checkAllRow",function(newVal,oldVal){
            if(newVal){
                $scope.incidentListPage.checkedList = Util.copyArray("id",$scope.incidentListPage.data);
            }else{
                if($scope.incidentListPage.data.length == $scope.incidentListPage.checkedList.length){
                    $scope.incidentListPage.checkedList = [];
                }
            }
        },false);

        // ****************  list page  ***************
        $scope.redirect = false;
        $scope.problemList = {
            data:[],  //table 数据
            checkedList: [],
            checkAllRow:false
        };

        $scope.problemSearchPage.init();

        $scope.problemList.settings = {
            reload : null,
            getData:function(search,fnCallback){
                $scope.problemSearchPage.data.limit = search.limit;
                $scope.problemSearchPage.data.offset = search.offset;
                $scope.problemSearchPage.data.orderBy = search.orderBy;
                $scope.problemSearchPage.data.orderByType = search.orderByType;
                Loading.show();
                if(typeof($scope.taskList)=="undefined"){
                    var moId=$location.$$search.moId;
                    //从其他页面带有mo参数跳转过来
                    if(moId && !$scope.redirect){
                        $scope.redirect = true;
                        if($location.$$search.type && $location.$$search.type==1){//该mo所属机房所有的mo
                            ItsmService.getMoById({moId:moId},{},function(data) {
//                                $scope.problemSearchPage.data.mocpId = data.mo.mocpId;
//                                $scope.problemSearchPage.data.mocId = data.mo.mocId;
                                $scope.problemSearchPage.data.jfId = data.mo.jfId;
                                $scope.$watch("rooms", function (n) {
                                    if (n && n.length > 0) {
                                        $timeout(function () {
                                            jQuery("#jfId option[value='" + (data.mo.jfId == null ? "" : data.mo.jfId) + "']").attr("selected", "selected");
                                        }, 100);
                                    }
                                }, true);
                                $scope.problemSearchPage.data.jf=$location.$$search.type;
                                ItsmService.getProblem($scope.problemSearchPage.data,function(data){
                                    $scope.problemList.data =data.rows;
                                    fnCallback(data);
                                    $scope.problemList.checkedList = [];
                                    $scope.problemList.checkAllRow = false;
                                    Loading.hide();
                                },function(error){
                                    Loading.hide();
                                });
                            });
                        }else{//该mo的数据
                            $scope.redirect = true;
                            ItsmService.getMoById({moId:moId},{},function(data){
                                $scope.problemSearchPage.data.mocpId = data.mo.mocpId;
                                $scope.problemSearchPage.data.mocId = data.mo.mocId;
                                $scope.problemSearchPage.data.moId = moId;
                                $timeout(function(){
                                    jQuery("#mocpId option[value='"+$scope.problemSearchPage.data.mocpId+"']").attr("selected","selected");
                                    jQuery("#mocId option[value='"+$scope.problemSearchPage.data.mocId+"']").attr("selected","selected");
                                    jQuery("#moId option[value='"+$scope.problemSearchPage.data.moId+"']").attr("selected","selected");
                                },2000);
                                ItsmService.getProblem($scope.problemSearchPage.data,function(data){
                                    $scope.problemList.data =data.rows;
                                    fnCallback(data);
                                    $scope.problemList.checkedList = [];
                                    $scope.problemList.checkAllRow = false;
                                    Loading.hide();
                                },function(error){
                                    Loading.hide();
                                });
                            });
                        }
                    }else{
                        ItsmService.getProblem($scope.problemSearchPage.data,function(data){
                            $scope.problemList.data =data.rows;
                            fnCallback(data);
                            $scope.problemList.checkedList = [];
                            $scope.problemList.checkAllRow = false;
                            Loading.hide();
                        },function(error){
                            Loading.hide();
                        });
                    }
                }else if($scope.taskList.childId==21){
                    ItsmService.queryClaimingProblem($scope.problemSearchPage.data,function(data){
                        $scope.problemList.data = data.rows;
                        fnCallback(data);
                        $scope.problemList.checkedList = [];
                        $scope.problemList.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }else if($scope.taskList.childId==22){
                    ItsmService.queryTaskProblem($scope.problemSearchPage.data,function(data){
                        $scope.problemList.data = data.rows;
                        fnCallback(data);
                        $scope.problemList.checkedList = [];
                        $scope.problemList.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }else if($scope.taskList.childId==23){
                    ItsmService.queryRunningProblem($scope.problemSearchPage.data,function(data){
                        $scope.problemList.data = data.rows;
                        fnCallback(data);
                        $scope.problemList.checkedList = [];
                        $scope.problemList.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }else if($scope.taskList.childId==24){
                    ItsmService.queryFinishedProblem($scope.problemSearchPage.data,function(data){
                        $scope.problemList.data = data.rows;
                        fnCallback(data);
                        $scope.problemList.checkedList = [];
                        $scope.problemList.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }
            },
            columns : [
                {
                    sTitle: "问题单号",
                    mData:"orderId"
                },
                {
                    sTitle: "问题标题",
                    mData:"title",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "资源类型",
                    mData:"params.mocId",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.mocId);
                    }
                },
                {
                    sTitle: "资源实例",
                    mData:"params.moId",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.moId);
                    }
                },
                {
                    sTitle: "优先级",
                    mData:"priority",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.priority);
                    }
                },
                {
                    sTitle: "报告人",
                    mData:"reporter",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                }
                /*{
                 sTitle: '<label ng-show="currentView==\'queryMyTask\'"><b>报告人</b></label>',//<label ng-show="currentView!=\'queryMyTask\'"><b>处理人</b></label>
                 mData:"resolveUser",
                 mRender:function(mData,type,full) {
                 return '<span ng-show="currentView==\'queryMyTask\'">'+Util.str2Html(full.reporter)+'</span>';//<span ng-show="currentView!=\'queryMyTask\'">'+Util.str2Html(full.params.resolveUser)+'</span>
                 }
                 }*/
                ,
                {
                    sTitle:"状态",
                    mData:"step",
                    mRender:function(mData,type,full) {
                        return Util.str2Html($rootScope.getStep(full,"problem"));
                    }
                },
                {
                    sTitle:"发生时间",
                    mData:"time",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle:"创建人",
                    mData:"applyUser",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.applyUser);
                    }
                },
                {
                    sTitle:"处理人",
                    mData:"resolveUser",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.resolveUser);
                    }
                },
                {
                    sTitle:"创建时间",
                    mData:"applyTime",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle:"操作",
                    mData:"id",
                    mRender:function(mData,type,full) {
                        var str = "";
                        var taskKey = typeof(full.params.taskKey)!='undefined'?full.params.taskKey:"sid-A97EF687-33E2-43C3-A36F-76D724D99892";
                        if(full.params.assignee == null && (typeof($scope.taskList) == "undefined" || $scope.taskList.childId==23 || $scope.taskList.childId==24)){
                            str = '<i class="fa fa-search" title="查看" ng-click="action.preProcess('+mData+',\''+taskKey+'\',\''+full.taskId+'\')"> </i>';
                        }
                        else if(full.params.assignee == null){
                            str = '<i ng-disabled="loginUserMenuMap[currentView]" class="fa fa-edit" title="签收" ng-click="action.claim(\''+full.taskId+'\')"> </i>';
                            str += '<i class="fa fa-search" title="查看" ng-click="action.preProcess('+mData+',\'sid-A97EF687-33E2-43C3-A36F-76D724D99892\',\''+full.taskId+'\')"> </i>';
                        }else{
                            str = '<i ng-disabled="loginUserMenuMap[currentView]" class="fa fa-pencil" title="处理" ng-click="action.preProcess('+mData+',\''+taskKey+'\',\''+full.taskId+'\')"> </i>';
                        }
                        if(typeof($scope.taskList)!="undefined")
                            str += '<i class="fa fa-code-fork" title="流程图" ng-click="action.showFlow(\''+full.processId+'\',\''+full.params.pid+'\')"></i>';
                        if(typeof($scope.taskList)=="undefined")
                            str += '<i class="fa fa-trash-o" ng-show="loginUser.userName==\'admin\'" title="删除" ng-click="action.delete(\''+full.id+'\',\'problem\')"></i>';
                        return str;
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [10 ] },  //不可排序
                { sWidth: "100px", aTargets: [ 0 ] },
                { sWidth: "140px", aTargets: [ 9 ] },
                { sWidth: "100px", aTargets: [ 10 ] }
            ], //定义列的约束
            defaultOrderBy : []  //定义默认排序列为第8列倒序
        }

        $scope.$watch("problemSearchPage.data.mocpId",function(newVal,oldVal){
            if(!$scope.redirect || !Util.notNull(newVal)){
                $scope.problemSearchPage.data.mocId = "";
                $scope.problemSearchPage.data.moId = "";
            }
            $scope.problemSearchPage.datas.moc = [];
            $scope.problemSearchPage.datas.mos = [];
            if(Util.notNull(newVal)){
                $scope.problemSearchPage.datas.moc = Util.findFromArray("id",newVal,$scope.initData.mocp)['children'];
                if($scope.redirect){
                    $timeout(function(){
                        jQuery("#mocId option[value='"+$scope.problemSearchPage.data.mocId+"']").attr("selected","selected");
                    },1000);
                }
            }
        },false);

        $scope.$watch("problemSearchPage.data.mocId",function(newVal, oldVal){
            if(!$scope.redirect || !Util.notNull(newVal)) {
                $scope.problemSearchPage.data.moId = "";
            }
            $scope.problemSearchPage.datas.mos = [];
            if(Util.notNull(newVal)){
                ItsmService.getMoByMocId({mocId:newVal,orderBy:'displayName',orderByType:'asc'},{},function(data){
                    $scope.problemSearchPage.datas.mos = data.rows;if($scope.redirect){
                        $timeout(function(){
                            jQuery("#moId option[value='"+$scope.problemSearchPage.data.moId+"']").attr("selected","selected");
                        },1000);
                    }
                });
            }
        },false);

    }]);

    itsmControllers.controller('changeController',['$scope','$rootScope','$location','$timeout','ItsmService','Util','Loading','$location','Tools',function($scope,$rootScope,$location,$timeout,ItsmService,Util,Loading,$location,Tools){
        Date.prototype.pattern=function(fmt) {
            var o = {
                "M+" : this.getMonth()+1, //月份
                "d+" : this.getDate(), //日
                "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
                "H+" : this.getHours(), //小时
                "m+" : this.getMinutes(), //分
                "s+" : this.getSeconds(), //秒
                "q+" : Math.floor((this.getMonth()+3)/3), //季度
                "S" : this.getMilliseconds() //毫秒
            };
            var week = {
                "0" : "/u65e5",
                "1" : "/u4e00",
                "2" : "/u4e8c",
                "3" : "/u4e09",
                "4" : "/u56db",
                "5" : "/u4e94",
                "6" : "/u516d"
            };
            if(/(y+)/.test(fmt)){
                fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
            }
            if(/(E+)/.test(fmt)){
                fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
            }
            for(var k in o){
                if(new RegExp("("+ k +")").test(fmt)){
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                }
            }
            return fmt;
        };
        var taskKey=$location.$$search.taskKey==null?"sid-B0B4D832-41CE-4266-8983-0B4B4E2F02CF":$location.$$search.taskKey;
        var id=$location.$$search.id;
        var taskId = $location.$$search.taskId;
        $scope.childId = $location.$$search.childId;
        $timeout(function(){
            if($location.$$search.moId)angular.element(".search-head").show();
        },2000);
        $scope.taskId=taskId;
        $scope.initData = {};
        $scope.nowDate=(new Date()).pattern("yyyy-MM-dd HH:mm:ss");
        $scope.formData = {};
        $scope.uploadFile = new Array();
        $scope.formData.attachment = new Array();
        $scope.moData = [];
        $scope.formData.mos = [];
        $scope.incidentData = [];
        $scope.formData.incidents = [];
        $scope.incidentSearchPage = {};
        $scope.incidentSearchPage.data={};
        $scope.incidentSearchPage.datas={};
        $scope.problemData = [];
        $scope.formData.problems = [];
        $scope.problemSearchPage = {};
        $scope.problemSearchPage.data={};
        $scope.problemSearchPage.datas={};
        $scope.hiddenData = {};


        $scope.knowledgeSearchPage = {
            init : function(){
                $scope.knowledgeSearchPage.data = {
                    table:"KnowledgeLib",
                    limit : 20, //每页条数(即取多少条数据)
                    offset : 0 , //从第几条数据开始取
                    orderBy : "",//排序字段
                    orderByType : "" //排序顺序
                }
            },
            search:function(){
                $scope.knowledgeList.settings.reload(true);
            }
        };
        $scope.knowledgeSearchPage.init();
        $scope.knowledgelibDialog = Tools.dialog({
            id:"knowledgelibDialog",
            title:"查询",
            hiddenButton:true
        });
        $scope.knowledgeListPage = {
            data:[],  //table 数据
            checkedList: [],
            checkAllRow:false
        };

        $scope.knowledgeListPage.settings = {
            reload : null,
            getData:function(search,fnCallback){
                $scope.knowledgeSearchPage.data.limit = search.limit;
                $scope.knowledgeSearchPage.data.offset = search.offset;
                $scope.knowledgeSearchPage.data.orderBy = search.orderBy;
                $scope.knowledgeSearchPage.data.orderByType = search.orderByType;
                Loading.show();
                ItsmService.getKnowledge($scope.knowledgeSearchPage.data,function(data){
                    $scope.knowledgeListPage.data = data.rows;
                    fnCallback(data);
                    $scope.knowledgeListPage.checkedList = [];
                    $scope.knowledgeListPage.checkAllRow = false;
                    Loading.hide();
                },function(error){
                    Loading.hide();
                });
                Loading.hide();
            },
            columns : [
                {
                    sTitle: "知识单号",
                    mData:"orderId"
                },
                {
                    sTitle: "知识标题",
                    mData:"title",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "关键字",
                    mData:"keyWord",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "创建人",
                    mData:"applyUser",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.applyUser);
                    }
                },
                {
                    sTitle:"创建时间",
                    mData:"applyTime",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [ ] },  //不可排序
                { sWidth: "140px", aTargets: [ 4] },
                { sWidth: "400px", aTargets: [ 1 ] }
            ], //定义列的约束
            defaultOrderBy : []  //定义默认排序列为第8列倒序
        };
//        $timeout(function(){
//            var height=angular.element(window).height()-210;
//            angular.element(".form-wrapper").height(height);
//        },1000);
        //去表单页面
        if(Util.notNull(taskKey)){
            ItsmService.getItsmDefInfluenceType({processType:"change"},{},function(data){
                $scope.initData.ItsmDefInfluenceType = data;
            });
            ItsmService.getItsmDefEmergencyType({processType:"change"},{},function(data){
                $scope.initData.ItsmDefEmergencyType = data;
            });
            ItsmService.getItsmDefCloseCode({processType:"change"},{},function(data){
                $scope.initData.ItsmDefCloseCode = data;
            });
           ItsmService.getItsmDefChangeType(function(data){
                $scope.initData.ItsmDefChangeType = data;
            });

            $rootScope.$watch("loginUser.userName", function (newVal, oldVal) {
                if (Util.notNull(newVal)) {
                    $scope.formData.applyUser = newVal;
                    if($scope.formData.params)
                        $scope.formData.params.applyUser=$rootScope.loginUser.realName;
                    else
                        $scope.formData.params={applyUser:$rootScope.loginUser.realName};
                }
            }, false);

            ItsmService.getAllMoc(function(data){
                $scope.incidentSearchPage.datas.mocp = data;
                $scope.problemSearchPage.datas.mocp = data;
            });

            ItsmService.getUsergroupValue(function (data) {
                $scope.initData.usergroup = data;
            });

            /*ItsmService.getUsergroup(function(data){
                $scope.initData.usergroup = data;
               *//* $timeout(function(){
                    jQuery("#resolveGroup option[value="+$scope.formData.resolveGroup+"]").attr("selected","selected");
                },1000);*//*
            });*/
            ItsmService.getUsers(function(data){
                $scope.initData.users = data.rows;
                /*$timeout(function(){
                    jQuery("#resolveUser option[value="+$scope.formData.resolveUser+"]").attr("selected","selected");
                },1000);*/
            });
            //动态控制字段
            $scope.fields=[];
            ItsmService.getForm({task:taskKey,flow:"change"},{},function(data){
                $scope.fields=data;
                $scope.find=function(name){
                    var o = {disabled: true, required: false,show:false};
                    for (var i = 0; i < $scope.fields.length; i++) {
                        if (name == $scope.fields[i].fieldName) {
                            o = {show: true, required: $scope.fields[i].required,disabled:$scope.fields[i].disabled};
                        }
                    }
                    return o;
                }
            });
            if(id!=null){
                ItsmService.querySingleChange({id:id},{},function(data){
                    $scope.formData = data;
                    $scope.formData.closeCode=($scope.formData.closeCode==null?"":$scope.formData.closeCode);
                    $scope.formData.typeId=($scope.formData.typeId==null?"":$scope.formData.typeId);
                    $scope.formData.taskId=taskId;
                    $("#locationText").attr("value",$scope.formData.location);
                    $scope.uploadFile = angular.copy($scope.formData.attachment);
                    $scope.moData = angular.copy($scope.formData.params.mos);
                    $scope.incidentData = angular.copy($scope.formData.params.incidents);
                    $scope.problemData = angular.copy($scope.formData.params.problems);
                    ItsmService.getChangeHistory({procId:$scope.formData.processId,id:id},{},function(data){
                        $scope.historyProcess = data.rows;
                        if(data.rows.length>0)$scope.currentStep=data.rows[data.rows.length-1].name;
                    });
                });
            }else{
                ItsmService.getTime(function(data){
                    $scope.formData.applyTime = data.time;
//                    $scope.formData.time=angular.copy(data.time);
                });
                $rootScope.$watch("loginUser.locId",function(n){
                    if(n){
                        $scope.formData.reporter=$rootScope.loginUser.realName;
                        $scope.formData.reporterPhone=$rootScope.loginUser.mobile;
                        $scope.formData.reporterEmail=$rootScope.loginUser.email;
                        ItsmService.getLocation({id:$rootScope.loginUser.locId},{},function(data){
                            $scope.formData.location=data.bean.id;
                            $scope.formData.params.location=data.bean.name;
                        });
                    }
                },true);
                $scope.$watch("initData.ItsmDefEmergencyType.length",function(n){
                    if(n>0){
                        $timeout(function(){
                            $scope.formData['urgency']=2;
                            $scope.formData['effect']=2;
                            jQuery("select[name='effect'] option[value="+$scope.formData.effect+"]").attr("selected","selected");
                            jQuery("select[name='urgency'] option[value="+$scope.formData.urgency+"]").attr("selected","selected");
                        },1000);
                    }
                },true);
            }
            if($location.$$search.moId){
                ItsmService.getMoById({moId:$location.$$search.moId},{},function(data) {
                    var v=data.mo;
                    var moData={"id":v.id,"name": v.displayName,"mocName":v.mocName,"mocpName":v.mocpName,"ip":v.ip,"mocDisplayName":v.mocDisplayName};
                    $scope.moData.push(moData)
                    $scope.formData.mos.push({"moId":v.id});
                });
            }
            //判断按钮 是否显示
            $scope.findShow = function(s){
                var re = false;
                if(s == taskKey){
                    re = true;
                }
                return re;
            }
            $scope.findShowSave = function(){
                var re = true;
                if("sid-B0B4D832-41CE-4266-8983-0B4B4E2F02CF" == taskKey || 'sid-1100727C-0CC4-45BB-8763-73DD3D56539C' == taskKey){
                    re = false;
                }
                return re;
            }

            $scope.$watch("formData.urgency",function(newVal, oldVal){
                if(Util.notNull(newVal) && Util.notNull($scope.formData.effect)){
                    ItsmService.getItsmDefPriorityMatrix({processType:"change",influcenceCode:$scope.formData.effect,emergencyCode:newVal},{},function(data){
                        $scope.formData.priority = data.id;
                        $("#priority").attr("value",data.priority);
                    });
                }else{
                    $scope.formData.priority="";
                    $("#priority").attr("value","");
                }
            },false);

            $scope.$watch("formData.effect",function(newVal, oldVal){
                if(Util.notNull(newVal) && Util.notNull($scope.formData.urgency)){
                    ItsmService.getItsmDefPriorityMatrix({processType:"change",influcenceCode:newVal,emergencyCode:$scope.formData.urgency},{},function(data){
                        $scope.formData.priority = data.id;
                        $("#priority").attr("value",data.priority);
                    });
                }else{
                    $scope.formData.priority="";
                    $("#priority").attr("value","");
                }
            },false);

            $scope.$watch("formData.resolveGroup",function(newVal,oldVal){
                $scope.initData.groupUser = [];
                if(!Util.notNull(id)) {
                    $scope.formData.resolveUser = "";
                }
                if(Util.notNull(newVal)){
                    ItsmService.getUserByGroup({groupName:newVal},{},function(data){
                        $scope.initData.groupUser = data;
                        if(Util.notNull($scope.formData.resolveGroup)){
                            $timeout(function(){
                                jQuery("select[name='resolveUser'] option[value="+$scope.formData.resolveUser+"]").attr("selected","selected");
                            },1000);
                        }
                    });
                }else{
                    $scope.formData.resolveUser = "";
                }
            },false);

            $scope.$watch("moData",function(newVal,oldVal){
                if(Util.notNull(newVal) && newVal.length>0){
                    $scope.hiddenData.mos = 1;
                }else{
                    $scope.hiddenData.mos = "";
                }
            },true);

            $scope.$watch("problemData",function(newVal,oldVal){
                if(Util.notNull(newVal) && newVal.length>0){
                    $scope.hiddenData.problems = 1;
                }else{
                    $scope.hiddenData.problems = "";
                }
            },true);

            $scope.$watch("incidentData",function(newVal,oldVal){
                if(Util.notNull(newVal) && newVal.length>0){
                    $scope.hiddenData.incidents = 1;
                }else{
                    $scope.hiddenData.incidents = "";
                }
            },true);

            $scope.$watch("uploadFile",function(newVal,oldVal){
                if(Util.notNull(newVal) && newVal.length>0){
                    $scope.hiddenData.attachment = 1;
                }else{
                    $scope.hiddenData.attachment = "";
                }
            },true);
        }

        $scope.$watch("taskList.childId",function(newVal,oldVal){
            if(Util.notNull(newVal) && (newVal == 31 || newVal == 32 || newVal == 33 || newVal == 34)){
                $scope.changeSearchPage.search();
                setResolveUserTreeChange();
            }
        },false);

        $scope.action = {
            delete:function(id,type){
                $rootScope.$confirm("确定要删除吗？",function(){
                    Loading.show();
                    ItsmService.deleteFlow({id:id,type:type},function(data){
                        $rootScope.$alert(" 删除成功!");
                        Loading.hide();
                        $scope.changeList.settings.reload(true);
                    },function(data){
                        Loading.hide();
                    });
                },"删除");
            },
            save:function(taskId){
                if(taskId > 0){
                    ItsmService.updateChange({id:taskId},$scope.formData,function(data){
                        $rootScope.$alert(" 保存成功!");
                    });
                    Loading.hide();
                }else{
                    ItsmService.saveChange({},$scope.formData,function(data){
                        $rootScope.$alert(" 保存成功!");
                    });
                    Loading.hide();
                }
            },
            start: function(){
                Loading.show();
                ItsmService.startChange({},$scope.formData,function(data){
                    Loading.hide();
                    window.location.href = "#/queryMyTask?childId=32&parentId=3";
                },function(data){
                    Loading.hide();
                });
            },
            claim: function(taskId){
                ItsmService.claimChange({id:taskId},{},function(data){
                    $scope.changeSearchPage.search();
                    Loading.hide();
                    $rootScope.$alert(" 签收成功!");
                    ItsmService.taskGroup({flow:"incident,problem,change,knowledge"},function(data){
                        for(var i=0;i<$scope.taskTree.length;i++){
                            for(var j=0;j<$scope.taskTree[i].children.length;j++){
                                var count=data[$scope.taskTree[i].children[j].id];
                                $scope.taskTree[i].children[j].displayName=($scope.taskTree[i].children[j].displayName.split("(")[0]+"("+count+")");
                            }
                        }
                    });
                });
                Loading.hide();
            },
            claimForward: function(taskId){
                Loading.show();
                ItsmService.claimChange({id:taskId},{},function(data){
                    Loading.hide();
                    window.location.href = "#/queryMyTask?childId=32&parentId=3";
                },function(data){
                    Loading.hide();
                });
            },
            back:function(){
                if($scope.childId=='00'){
                    window.location.href = "#/queryChange";
                }else{
                    var childId = $scope.childId==null?"31":$scope.childId;
                    var parentId = $scope.childId==null?"3":$scope.childId.substring(0,1);
                    window.location.href = "#/queryMyTask?childId="+childId+"&parentId="+parentId;
                }
            },
            process:function(flag){
                if(flag){//关闭
                    if($scope.formData.closeCode== null || $scope.formData.closeCode==""){
                        $rootScope.$alert("请选择原因");
                        return ;
                    }
                }
                if(flag==false){//重开
                    if($scope.formData.closeRemark == null || $scope.formData.closeRemark==""){
                        $rootScope.$alert("请输入说明");
                        return ;
                    }
                }
                Loading.show();
                $scope.formData.taskId = taskId;
                $scope.formData.resolve=flag;
                ItsmService.processChange({},$scope.formData,function(data){
                    Loading.hide();
                    window.location.href = "#/queryMyTask?childId=32&parentId=3";
                },function(data){
                    Loading.hide();
                });
            },
            check:function(flag){
                $scope.formData.taskId = taskId;
                $scope.formData.allow=flag;
                ItsmService.processChange({},$scope.formData,function(data){
                    window.location.href = "#/queryMyTask?childId=32&parentId=3";
                });
                Loading.hide();
            },
            preProcess:function(id,taskKey,taskId){
                window.location.href = '#/createChange?taskKey='+taskKey+"&id="+id+"&taskId="+taskId+"&childId="+(typeof($scope.taskList) == "undefined"?"00":$scope.taskList.childId);
            },
            showFlow:function(processId,pid){
                $("#pid").hide();
                //window.open('/dmonitor-webapi/itsm/workflow/resource/read?processDefinitionId='+processId+'&resourceType=image',"",null);
                $("#img").attr("src",'/dmonitor-webapi/itsm/workflow/resource/read?processDefinitionId='+processId+'&resourceType=image&r='+(new Date()).getTime());
                ItsmService.getImagePosition({pid:pid,r:(new Date()).getTime()},{},function(data){
                    $.each(data,function(i,v){
                        if(v.currentActiviti){
                            $("#pid").show();
                            $("#pid").css("height",v.height+10);
                            $("#pid").css("width",v.width+10);
                            $("#pid").css("left",v.x-4);
                            var img = new Image();
                            img.src=$("#img").attr("src");
                            img.onload = function(){
                                this.onload=null;
                                $("#pid").css("top",v.y-this.height-4);//10
                            }
                            $("#pid").css("position","relative");
                            $("#pid").css("border","solid 5px red");
                        }
                    });
                });
                $scope.imageDialog.show();
            },
            addMo:function(){
                $scope.moSearchPage.data={};
                $scope.moListPage.settings.reload(true);
                $scope.moDialog.show();
            },
            deleteMo:function(id){
                $rootScope.$confirm("确定要删除吗？",function() {
                    var moData = [];
                    $scope.formData.mos = [];
                    var x = 0;
                    $.each($scope.moData, function (i, v) {
                        if (v.id != id) {
                            moData[x] = v;
                            $scope.formData.mos[x] = {"moId": v.id};
                            x++;
                        }
                    });
                    $scope.moData = moData;
                },"删除");
            },
            uploadFile:function(){
                $('#file').attr("value","");
                $scope.fileDialog.show();
            },
            deleteFile:function(id){
                $rootScope.$confirm("确定要删除吗？",function() {
                    var uploadFile = [];
                    var x = 0;
                    $.each($scope.uploadFile, function (i, v) {
                        if (v.id != id) {
                            uploadFile[x] = v;
                            x++;
                        }
                    });
                    $scope.uploadFile = angular.copy(uploadFile);
                    $scope.formData.attachment = angular.copy(uploadFile);
                },"删除");
            },
            addIncident:function(){
                $scope.incidentSearchPage.data={};
                $scope.incidentListPage.settings.reload(true);
                $scope.incidentDialog.show();
            },
            deleteIncident:function(id){
                $rootScope.$confirm("确定要删除吗？",function() {
                    var incidentData = [];
                    $scope.formData.incidents = [];
                    var x = 0;
                    $.each($scope.incidentData, function (i, v) {
                        if (v.id != id) {
                            incidentData[x] = v;
                            $scope.formData.incidents[x] = {"incidentId": v.id};
                            x++;
                        }
                    });
                    $scope.incidentData = incidentData;
                },"删除");
            },
            addProblem:function(){
                $scope.problemSearchPage.data={};
                $scope.problemListPage.settings.reload(true);
                $scope.problemDialog.show();
            },
            deleteProblem:function(id){
                $rootScope.$confirm("确定要删除吗？",function() {
                    var problemData = [];
                    $scope.formData.problems = [];
                    var x = 0;
                    $.each($scope.problemData, function (i, v) {
                        if (v.id != id) {
                            problemData[x] = v;
                            $scope.formData.problems[x] = {"problemId": v.id};
                            x++;
                        }
                    });
                    $scope.problemData = problemData;
                },"删除");
            }
        };

        $scope.forwardDialog = Tools.dialog({
            id:"forwardDialog",
            title:"转派",
            resolveGroup:"",
            resolveUser:"",
            agentUser:"",
            hiddenButton:true,
            users:[],
            save:function(){
//                if($scope.forwardDialog.resolveGroup==null || $scope.forwardDialog.resolveGroup==""){
//                    $rootScope.$alert("请选择处理组");
//                    return;
//                }
//                $scope.forwardDialog.hide();
//                $scope.formData.taskId = taskId;
//                $scope.formData.resolveGroup=$scope.forwardDialog.resolveGroup;
//                $scope.formData.resolveUser=$scope.forwardDialog.resolveUser;
                $scope.formData.agentUser=$scope.forwardDialog.agentUser;
                $scope.formData.taskId = taskId;
                $scope.forwardDialog.hide();
                ItsmService.forwardChange({},$scope.formData,function(data){
                    window.location.href = "#/queryMyTask?childId=32&parentId=3";
                });
                Loading.hide();
            }
        });
        ItsmService.queryAgent(function(rows){
            $scope.forwardDialog.users=rows;
        });
        $scope.$watch("forwardDialog.resolveGroup",function(newVal,oldVal){
            $scope.initData.groupUser = [];
            if(!Util.notNull(id)) {
                $scope.forwardDialog.resolveUser = "";
            }
            if(Util.notNull(newVal)){
                ItsmService.getUserByGroup({groupName:newVal},{},function(data){
                    $scope.initData.groupUser = data;
                    if(Util.notNull($scope.forwardDialog.resolveGroup)){
                        $timeout(function(){
                            jQuery("select[name='resolveUser1'] option[value="+$scope.forwardDialog.resolveUser+"]").attr("selected","selected");
                        },1000);
                    }
                });
            }else{
                $scope.forwardDialog.resolveUser = "";
            }
        },false);

        $scope.imageDialog = Tools.dialog({
            id:"imageDialog",
            title:"流程图",
            hiddenButton:true,
            save:function(){
                $scope.imageDialog.hide();
            }
        });

        $scope.moDialog = Tools.dialog({
            id:"moDialog",
            title:"资源实例",
            save:function(){
                var moData = [];
                var mos = [];
                var x = 0;
                for(var i=0;i<$scope.moListPage.checkedList.length;i++){
                    $.each($scope.moListPage.data,function(j,v){
                        if($scope.moListPage.checkedList[i]== v.id){
                            var flag = false;
                            $.each($scope.moData,function(ii,vv){
                                if(vv.id== v.id){
                                    flag = true;
                                }
                            });
                            if(!flag){
                                moData[x]={"id":v.id,"name": v.displayName,"mocName":v.mocName,"mocpName":v.mocpName,"ip":v.ip,"mocDisplayName":v.mocDisplayName};
                                mos[x] = {"moId":v.id};
                                x++;
                            }
                        }
                    });
                }

                $.each(moData,function(i,v){
                    $scope.moData.push(v);
                    $scope.formData.mos.push({"moId":v.id});
                });
                $scope.moDialog.hide();
            }
        });

        $scope.fileDialog = Tools.dialog({
            id:"fileDialog",
            title:"上传文件",
            save:function(){
                if(angular.element("#file").val()==null || angular.element("#file").val()==""){
                    $rootScope.$alert("请选择需要上传的文件");
                    return;
                }
                Loading.show();
                var step='新建';
                if($scope.historyProcess && $scope.historyProcess.length>1){
                    step=$scope.historyProcess[$scope.historyProcess.length-1].name;
                }
                $.ajaxFileUpload({
                    url: '/dmonitor-webapi/itsm/form/upload?type=change&step='+step, //用于文件上传的服务器端请求地址
                    secureuri: false, //是否需要安全协议，一般设置为false
                    fileElementId: 'file', //文件上传域的ID
                    dataType: 'json', //返回值类型 一般设置为json
                    success: function (data, status){
                        Loading.hide();
                        if(data != null && data.id!=null){
                            $scope.uploadFile.push(data);
                            $scope.formData.attachment.push(data);
                            $rootScope.$alert(" 上传成功!");
                        }else if(data.message && data.message.indexOf("Maximum upload size of")>-1){
                            $rootScope.$alert(" 上传失败,上传文件不能大于2M");
                        }else{
                            $rootScope.$alert(" 上传失败!");
                        }
                        $scope.$apply();
                        $rootScope.$apply();
                    },error: function (data, status, e){
                        Loading.hide();
                        $rootScope.$alert(" 上传失败!");
                        $rootScope.$apply();
                    }
                });
                $scope.fileDialog.hide();
            }
        });

        $scope.moListPage = {};
        $scope.moListPage.data = {};
        $scope.moSearchPage = {};
        $scope.moSearchPage.data={};
        $scope.moSearchPage.datas={};
        $scope.moListPage.checkedList = [];

        $scope.$watch("moSearchPage.data.mocpId",function(newVal,oldVal){
            $scope.moSearchPage.data.mocId = "";
            $scope.moSearchPage.datas.moc = [];
            if(Util.notNull(newVal)){
                $scope.moSearchPage.datas.moc = Util.findFromArray("id",newVal,$rootScope.resource.moc)['children'];
            }
        },false);

        $scope.moListPage.settings = {
            reload : null,
            getData:function(search,fnCallback){
                $scope.moSearchPage.data.limit = search.limit;
                $scope.moSearchPage.data.offset = search.offset;
                $scope.moSearchPage.data.orderBy = search.orderBy;
                $scope.moSearchPage.data.orderByType = search.orderByType;
                Loading.show();
                ItsmService.getMo($scope.moSearchPage.data,function(data){
                    $scope.moListPage.data = data.rows;
                    fnCallback(data);
                    $scope.moListPage.checkedList = [];
                    $scope.moListPage.checkAllRow = false;
                    Loading.hide();
                },function(error){
                    Loading.hide();
                });
            }, //getData应指定获取数据的函数
            columns : [
                {
                    sTitle: "<div class='checkbox'><label><input type='checkbox' ng-model='moListPage.checkAllRow'><i></i></label></div>",
                    mData:"id",
                    mRender:function(mData,type,full) {
                        return '<div class="checkbox"><label><input type="checkbox" checklist-model="moListPage.checkedList" checklist-value=\''+mData+'\' /><i></i></label></div>';
                    }
                },
                {
                    sTitle: "资源实例",
                    mData:"displayName",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
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
                        //原来代码var loc = $rootScope.resource.getLoc($rootScope.resource.locations,mData);
                        var loc = $rootScope.resource.getLoc($rootScope.resource.locationsItsm,mData);
                        if(loc!=null){
                            return loc.name;
                        }else{
                            return mData;
                        }
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [ 0 ] },  //不可排序
                { sWidth: "38px", aTargets: [ 0 ] }
            ], //定义列的约束
            defaultOrderBy : []  //定义默认排序列为第8列倒序
        };

        $scope.$watch("moListPage.checkAllRow",function(newVal,oldVal){
            if(newVal){
                $scope.moListPage.checkedList = Util.copyArray("id",$scope.moListPage.data);
            }else{
                if($scope.moListPage.data.length == $scope.moListPage.checkedList.length){
                    $scope.moListPage.checkedList = [];
                }
            }
        },false);
        $scope.$watch("moListPage.checkedList",function(newVal,oldVal){
            $scope.moListPage.checkAllRow = newVal && newVal.length>0 && newVal.length==$scope.moListPage.data.length;

        },true);

//////////==
        $scope.incidentDialog = Tools.dialog({
            id:"incidentDialog",
            title:"故障单",
            save:function(){
                var incidentData = [];
                var incidents = [];
                var x = 0;
                for(var i=0;i<$scope.incidentListPage.checkedList.length;i++){
                    $.each($scope.incidentListPage.data,function(j,v){
                        if($scope.incidentListPage.checkedList[i]== v.id){
                            var flag = false;
                            $.each($scope.incidentData,function(ii,vv){
                                if(vv.id== v.id){
                                    flag = true;
                                }
                            });
                            if(!flag){
                                incidentData[x]={"id":v.id,"orderId":v.orderId,"name": v.title,"resolveUser": v.params.resolveUser};;
                                incidents[x] = {"incidentId":v.id};
                                x++;
                            }
                        }
                    });
                }
                $.each(incidentData,function(i,v){
                    $scope.incidentData.push(v);
                    $scope.formData.incidents.push({"incidentId":v.id});
                });

                $scope.incidentDialog.hide();
            }
        });

        $scope.$watch("incidentSearchPage.data.mocpId",function(newVal,oldVal){
            $scope.incidentSearchPage.data.mocId = "";
            $scope.incidentSearchPage.datas.moc = [];
            $scope.incidentSearchPage.data.moId = "";
            $scope.incidentSearchPage.datas.mos = [];
            if(Util.notNull(newVal)){
                $scope.incidentSearchPage.datas.moc = Util.findFromArray("id",newVal,$scope.incidentSearchPage.datas.mocp)['children'];
            }
        },false);

        $scope.$watch("incidentSearchPage.data.mocId",function(newVal, oldVal){
            $scope.incidentSearchPage.data.moId = "";
            $scope.incidentSearchPage.datas.mos = [];
            if(Util.notNull(newVal)){
                ItsmService.getMoByMocId({mocId:newVal,orderBy:'displayName',orderByType:'asc'},{},function(data){
                    $scope.incidentSearchPage.datas.mos = data.rows;
                });
            }
        },false);

        $scope.incidentListPage = {
            data:[],
            checkedList : [],
            checkAllRow : false,
            action:{
                search:function(search,fnCallback){
                    $scope.incidentSearchPage.data.limit = search.limit;
                    $scope.incidentSearchPage.data.offset = search.offset;
                    $scope.incidentSearchPage.data.orderBy = search.orderBy;
                    $scope.incidentSearchPage.data.orderByType  = search.orderByType;
                    $scope.incidentSearchPage.data.status="已关闭";
                    Loading.show();
                    ItsmService.getIncident($scope.incidentSearchPage.data,function(data){
                        $scope.incidentListPage.data =data.rows;
                        fnCallback(data);
                        $scope.incidentListPage.checkedList = [];
                        $scope.incidentListPage.checkAllRow = false;
                    },function(error){
                        Loading.hide();
                    });
                    Loading.hide();
                }
            }
        };

        $scope.incidentListPage.settings = {
            reload : null,
            getData:$scope.incidentListPage.action.search,//getData应指定获取数据的函数
            columns : [
                {
                    sTitle: "<div class='checkbox'><label><input type='checkbox' ng-model='incidentListPage.checkAllRow'><i></i></label></div>",
                    mData:"id",
                    mRender:function(mData,type,full) {
                        return '<div class="checkbox"><label><input type="checkbox" checklist-model="incidentListPage.checkedList" checklist-value="'+mData+'" /><i></i></label></div>';
                    }
                },
                {
                    sTitle: "故障单号",
                    mData:"orderId"
                },
                {
                    sTitle: "故障标题",
                    mData:"title",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "资源类型",
                    mData:"params.mocId",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.mocId);
                    }
                },
                {
                    sTitle: "资源实例",
                    mData:"params.moId",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.moId);
                    }
                },
                {
                    sTitle: "优先级",
                    mData:"priority",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.priority);
                    }
                },
                {
                    sTitle: "报告人",
                    mData:"reporter",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle:"状态",
                    mData:"step",
                    mRender:function(mData,type,full) {
                        return Util.str2Html($rootScope.getStep(full,"incident"));
                    }
                },
                {
                    sTitle:"发生时间",
                    mData:"time",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle:"创建人",
                    mData:"applyUser",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.applyUser);
                    }
                },
                {
                    sTitle:"处理人",
                    mData:"resolveUser",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.resolveUser);
                    }
                },
                {
                    sTitle:"创建时间",
                    mData:"applyTime",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [ 0] },  //列不可排序
                { sWidth: "38px", aTargets: [ 0 ] },
                { sWidth: "80px", aTargets: [ 1 ] },
                { sWidth: "80px", aTargets: [ 2 ] },
                { sWidth: "80px", aTargets: [ 3 ] },
                { sWidth: "80px", aTargets: [ 4 ] },
                { sWidth: "80px", aTargets: [ 5 ] },
                { sWidth: "80px", aTargets: [ 6 ] },
                { sWidth: "80px", aTargets: [ 7 ] },
                { sWidth: "80px", aTargets: [ 8 ] },
                { sWidth: "80px", aTargets: [ 9 ] },
                { sWidth: "80px", aTargets: [ 10 ] }
            ] , //定义列的约束
            defaultOrderBy : [[ 9, "desc" ]]  //定义默认排序列为第7列倒序
        };

        $scope.$watch("incidentListPage.checkAllRow",function(newVal,oldVal){
            if(newVal){
                $scope.incidentListPage.checkedList = Util.copyArray("id",$scope.incidentListPage.data);
            }else{
                if($scope.incidentListPage.data.length == $scope.incidentListPage.checkedList.length){
                    $scope.incidentListPage.checkedList = [];
                }
            }
        },false);

        $scope.$watch("incidentListPage.checkedList",function(newVal,oldVal){
            $scope.incidentListPage.checkAllRow = newVal && newVal.length>0 && newVal.length==$scope.incidentListPage.data.length;

        },true);

        $scope.problemDialog = Tools.dialog({
            id:"problemDialog",
            title:"问题单",
            save:function(){
                var problemData = [];
                var problems = [];
                var x = 0;
                for(var i=0;i<$scope.problemListPage.checkedList.length;i++){
                    $.each($scope.problemListPage.data,function(j,v){
                        if($scope.problemListPage.checkedList[i]== v.id){
                            var flag = false;
                            $.each($scope.problemData,function(ii,vv){
                                if(vv.id== v.id){
                                    flag = true;
                                }
                            });
                            if(!flag){
                                problemData[x]={"id":v.id,"orderId":v.orderId,"name": v.title,"resolveUser": v.params.resolveUser};;
                                problems[x] = {"problemId":v.id};
                                x++;
                            }
                        }
                    });
                }
                $.each(problemData,function(i,v){
                    $scope.problemData.push(v);
                    $scope.formData.problems.push({"problemId":v.id});
                });
                $scope.problemDialog.hide();
            }
        });

        $scope.problemListPage = {
            data:[],
            checkedList : [],
            checkAllRow : false,
            action:{
                search:function(search,fnCallback){
                    $scope.problemSearchPage.data.limit = search.limit;
                    $scope.problemSearchPage.data.offset = search.offset;
                    $scope.problemSearchPage.data.orderBy = search.orderBy;
                    $scope.problemSearchPage.data.orderByType  = search.orderByType;
                    $scope.problemSearchPage.data.status="已关闭";
                    Loading.show();
                    ItsmService.getProblem($scope.problemSearchPage.data,function(data){
                        $scope.problemListPage.data =data.rows;
                        fnCallback(data);
                        $scope.problemListPage.checkedList = [];
                        $scope.problemListPage.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }
            }
        };

        $scope.problemListPage.settings = {
            reload : null,
            getData:$scope.problemListPage.action.search,//getData应指定获取数据的函数
            columns : [
                {
                    sTitle: "<div class='checkbox'><label><input type='checkbox' ng-model='problemListPage.checkAllRow'><i></i></label></div>",
                    mData:"id",
                    mRender:function(mData,type,full) {
                        return '<div class="checkbox"><label><input type="checkbox" checklist-model="problemListPage.checkedList" checklist-value="'+mData+'" /><i></i></label></div>';
                    }
                },
                {
                    sTitle: "问题单号",
                    mData:"orderId"
                },
                {
                    sTitle: "问题标题",
                    mData:"title",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "资源类型",
                    mData:"params.mocId",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.mocId);
                    }
                },
                {
                    sTitle: "资源实例",
                    mData:"params.moId",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.moId);
                    }
                },
                {
                    sTitle: "优先级",
                    mData:"priority",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.priority);
                    }
                },
                {
                    sTitle: "报告人",
                    mData:"reporter",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle:"状态",
                    mData:"step",
                    mRender:function(mData,type,full) {
                        return Util.str2Html($rootScope.getStep(full,"problem"));
                    }
                },
                {
                    sTitle:"发生时间",
                    mData:"time",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle:"创建人",
                    mData:"applyUser",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.applyUser);
                    }
                },
                {
                    sTitle:"处理人",
                    mData:"resolveUser",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.resolveUser);
                    }
                },
                {
                    sTitle:"创建时间",
                    mData:"applyTime",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [ 0] },  //列不可排序
                { sWidth: "38px", aTargets: [ 0 ] },
                { sWidth: "80px", aTargets: [ 1 ] },
                { sWidth: "80px", aTargets: [ 2 ] },
                { sWidth: "80px", aTargets: [ 3 ] },
                { sWidth: "80px", aTargets: [ 4 ] },
                { sWidth: "80px", aTargets: [ 5 ] },
                { sWidth: "80px", aTargets: [ 6 ] },
                { sWidth: "80px", aTargets: [ 7 ] },
                { sWidth: "80px", aTargets: [ 8 ] },
                { sWidth: "80px", aTargets: [ 9 ] },
                { sWidth: "80px", aTargets: [ 10 ] }
            ] , //定义列的约束
            defaultOrderBy : [[ 8, "desc" ]]  //定义默认排序列为第7列倒序
        };

        $scope.$watch("problemListPage.checkAllRow",function(newVal,oldVal){
            if(newVal){
                $scope.problemListPage.checkedList = Util.copyArray("id",$scope.problemListPage.data);
            }else{
                if($scope.problemListPage.data.length == $scope.problemListPage.checkedList.length){
                    $scope.problemListPage.checkedList = [];
                }
            }
        },false);

        $scope.$watch("problemListPage.checkedList",function(newVal,oldVal){
            $scope.problemListPage.checkAllRow = newVal && newVal.length>0 && newVal.length==$scope.problemListPage.data.length;

        },true);

        $scope.$watch("problemSearchPage.data.mocpId",function(newVal,oldVal){
            $scope.problemSearchPage.data.mocId = "";
            $scope.problemSearchPage.datas.moc = [];
            $scope.problemSearchPage.data.moId = "";
            $scope.problemSearchPage.datas.mos = [];
            if(Util.notNull(newVal)){
                $scope.problemSearchPage.datas.moc = Util.findFromArray("id",newVal,$scope.problemSearchPage.datas.mocp)['children'];
            }
        },false);

        $scope.$watch("problemSearchPage.data.mocId",function(newVal, oldVal){
            $scope.problemSearchPage.data.moId = "";
            $scope.problemSearchPage.datas.mos = [];
            if(Util.notNull(newVal)){
                ItsmService.getMoByMocId({mocId:newVal,orderBy:'displayName',orderByType:'asc'},{},function(data){
                    $scope.problemSearchPage.datas.mos = data.rows;
                });
            }
        },false);

        // ****************  list page  ***************
        $scope.changeList = {
            data:[],  //table 数据
            checkedList: [],
            checkAllRow:false
        };

        $scope.changeSearchPage = {
            init : function(){
                $scope.changeSearchPage.data = {
                    limit : 20, //每页条数(即取多少条数据)
                    offset : 0 , //从第几条数据开始取
                    orderBy : "",//排序字段
                    orderByType : "" //排序顺序
                }
            },
            search:function(){
                $scope.changeList.settings.reload(true);
            }
        };
        $scope.changeSearchPage.init();

        $scope.changeList.settings = {
            reload : null,
            getData:function(search,fnCallback){
                $scope.changeSearchPage.data.limit = search.limit;
                $scope.changeSearchPage.data.offset = search.offset;
                $scope.changeSearchPage.data.orderBy = search.orderBy;
                $scope.changeSearchPage.data.orderByType = search.orderByType;
                Loading.show();

                if(typeof($scope.taskList)=="undefined"){
                    var moId=$location.$$search.moId;
                    //从其他页面带有mo参数跳转过来
                    if(moId && !$scope.redirect){
                        $scope.redirect = true;
                        if($location.$$search.type && $location.$$search.type==1){//该mo所属机房所有的mo
                            ItsmService.getMoById({moId:moId},{},function(data) {
                                $scope.changeSearchPage.data.jfId = data.mo.jfId;
                                $scope.changeSearchPage.data.jf=$location.$$search.type;
                                $scope.$watch("rooms", function (n) {
                                    if (n && n.length > 0) {
                                        $timeout(function () {
                                            jQuery("#jfId option[value='" + (data.mo.jfId == null ? "" : data.mo.jfId) + "']").attr("selected", "selected");
                                        }, 100);
                                    }
                                }, true);
                                ItsmService.getChange($scope.changeSearchPage.data,function(data){
                                    $scope.changeList.data = data.rows;
                                    fnCallback(data);
                                    $scope.changeList.checkedList = [];
                                    $scope.changeList.checkAllRow = false;
                                    Loading.hide();
                                },function(error){
                                    Loading.hide();
                                });
                            });
                        }else{//该mo的数据
                            $scope.redirect = true;
                            $scope.changeSearchPage.data.moId =moId;
                            ItsmService.getChange($scope.changeSearchPage.data,function(data){
                                $scope.changeList.data = data.rows;
                                fnCallback(data);
                                $scope.changeList.checkedList = [];
                                $scope.changeList.checkAllRow = false;
                                Loading.hide();
                            },function(error){
                                Loading.hide();
                            });
                        }
                    }else{
                        ItsmService.getChange($scope.changeSearchPage.data,function(data){
                            $scope.changeList.data = data.rows;
                            fnCallback(data);
                            $scope.changeList.checkedList = [];
                            $scope.changeList.checkAllRow = false;
                            Loading.hide();
                        },function(error){
                            Loading.hide();
                        });
                    }
                   /* ItsmService.getChange($scope.changeSearchPage.data,function(data){
                        $scope.changeList.data = data.rows;
                        fnCallback(data);
                        $scope.changeList.checkedList = [];
                        $scope.changeList.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });*/
                }else if($scope.taskList.childId==31){
                    ItsmService.queryClaimingChange($scope.changeSearchPage.data,function(data){
                        $scope.changeList.data = data.rows;
                        fnCallback(data);
                        $scope.changeList.checkedList = [];
                        $scope.changeList.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }else if($scope.taskList.childId==32){
                    ItsmService.queryTaskChange($scope.changeSearchPage.data,function(data){
                        $scope.changeList.data = data.rows;
                        fnCallback(data);
                        $scope.changeList.checkedList = [];
                        $scope.changeList.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }else if($scope.taskList.childId==33){
                    ItsmService.queryRunningChange($scope.changeSearchPage.data,function(data){
                        $scope.changeList.data = data.rows;
                        fnCallback(data);
                        $scope.changeList.checkedList = [];
                        $scope.changeList.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }else if($scope.taskList.childId==34){
                    ItsmService.queryFinishedChange($scope.changeSearchPage.data,function(data){
                        $scope.changeList.data = data.rows;
                        fnCallback(data);
                        $scope.changeList.checkedList = [];
                        $scope.changeList.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }
            },
            columns : [
                {
                    sTitle: "变更单号",
                    mData:"orderId"
                },
                {
                    sTitle: "变更标题",
                    mData:"title",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "优先级",
                    mData:"priority",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.priority);
                    }
                },
                {
                    sTitle: "报告人",
                    mData:"reporter",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                }
                /*{
                    sTitle: '<label ng-show="currentView==\'queryMyTask\'"><b>报告人</b></label>',//<label ng-show="currentView!=\'queryMyTask\'"><b>处理人</b></label>
                    mData:"resolveUser",
                    mRender:function(mData,type,full) {
                        return '<span ng-show="currentView==\'queryMyTask\'">'+Util.str2Html(full.reporter)+'</span>';//<span ng-show="currentView!=\'queryMyTask\'">'+Util.str2Html(full.params.resolveUser)+'</span>
                    }
                }*/,
                {
                    sTitle:"状态",
                    mData:"step",
                    mRender:function(mData,type,full) {
                        return Util.str2Html($rootScope.getStep(full,"change"));
                    }
                },
                {
                    sTitle:"计划开始时间",
                    mData:"startTime",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle:"计划结束时间",
                    mData:"endTime",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle:"创建人",
                    mData:"applyUser",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.applyUser);
                    }
                },
                {
                    sTitle:"处理人",
                    mData:"resolveUser",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.resolveUser);
                    }
                },
                {
                    sTitle:"创建时间",
                    mData:"applyTime",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle:"操作",
                    mData:"id",
                    mRender:function(mData,type,full) {
                        var str = "";
                        var taskKey = typeof(full.params.taskKey)!='undefined'?full.params.taskKey:"sid-1100727C-0CC4-45BB-8763-73DD3D56539C";
                        if(full.params.assignee == null && (typeof($scope.taskList)=="undefined" || $scope.taskList.childId==33 || $scope.taskList.childId==34)){
                            str = '<i class="fa fa-search" title="查看" ng-click="action.preProcess('+mData+',\''+taskKey+'\',\''+full.taskId+'\')"> </i>';
                        }
                        else if(full.params.assignee == null){
                            str += '<i ng-disabled="loginUserMenuMap[currentView]" class="fa fa-edit" title="签收" ng-click="action.claim(\''+full.taskId+'\')"> </i>';
                            str += '<i class="fa fa-search" title="查看" ng-click="action.preProcess('+mData+',\'sid-1100727C-0CC4-45BB-8763-73DD3D56539C\',\''+full.taskId+'\')"> </i>';
                        }else{
                            str = '<i ng-disabled="loginUserMenuMap[currentView]" class="fa fa-pencil" title="处理" ng-click="action.preProcess('+mData+',\''+taskKey+'\',\''+full.taskId+'\')"> </i>';
                        }
                        if(typeof($scope.taskList)!="undefined")
                            str += '<i class="fa fa-code-fork" title="流程图" ng-click="action.showFlow(\''+full.processId+'\',\''+full.params.pid+'\')"></i>';
                        if(typeof($scope.taskList)=="undefined")
                            str += '<i class="fa fa-trash-o" ng-show="loginUser.userName==\'admin\'" title="删除" ng-click="action.delete(\''+full.id+'\',\'change\')"></i>';
                        return str;
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [ 9 ] },  //不可排序
                { sWidth: "100px", aTargets: [ 0 ] },
                { sWidth: "130px", aTargets: [ 5 ] },
                { sWidth: "130px", aTargets: [ 6 ] },
                { sWidth: "140px", aTargets: [ 8 ] },
                { sWidth: "100px", aTargets: [ 9 ] }
            ], //定义列的约束
            defaultOrderBy : []  //定义默认排序列为第8列倒序
        }

        setResolveUserTreeChange();
        //获取当前列表中 所有的处理人
        function setResolveUserTreeChange(){
            $('#resolveUser3').attr("disabled",false)//将input元素设置为disabled
            $('#resolveUser4').attr("disabled",false)//将input元素设置为disabled
            if(typeof($scope.taskList)=="undefined"){
                ItsmService.getResolveUserChange(function(data){
                    if(data.rows.length==0){//没有处理人
                        $scope.resolveUserData=[];
                        $('#resolveUser3').attr("disabled",true)//将input元素设置为disabled
                        $('#resolveUser4').attr("disabled",true)//将input元素设置为disabled
                    }else{
                        var name = null;
                        for(var i=0;i<data.rows.length;i++){
                            if(name==null){
                                name = data.rows[i];
                            }else{
                                name = name + "," + data.rows[i];
                            }
                        }
                        ItsmService.getResolveUserByLocToUser({displayName:name},function(data){
                            $scope.resolveUserData=data;
                        });
                    }
                });
            }else if($scope.taskList.childId=="31"){
                $scope.claim=true;
                ItsmService.queryClaimingChange($scope.changeSearchPage.data,function(data){
                    if(data.rows.length==0){//列表无数据
                        $scope.resolveUserData=[];
                        $('#resolveUser3').attr("disabled",true)//将input元素设置为disabled
                        $('#resolveUser4').attr("disabled",true)//将input元素设置为disabled
                    }else{
                        var name = null;
                        for(var i=0;i<data.rows.length;i++){
                            if(name==null){
                                name = data.rows[i].resolveUser;
                            }else{
                                name = name + "," + data.rows[i].resolveUser;
                            }
                        }
                        ItsmService.getResolveUserByLocToUser({displayName:name},function(data){
                            $scope.resolveUserData=data;
                        });
                    }
                    Loading.hide();
                },function(error){
                    Loading.hide();
                });
            }else if($scope.taskList.childId=="32"){
                ItsmService.queryTaskChange($scope.changeSearchPage.data,function(data){
                    if(data.rows.length==0){//列表无数据
                        $scope.resolveUserData=[];
                        $('#resolveUser3').attr("disabled",true)//将input元素设置为disabled
                        $('#resolveUser4').attr("disabled",true)//将input元素设置为disabled
                    }else{
                        var name = null;
                        for(var i=0;i<data.rows.length;i++){
                            if(name==null){
                                name = data.rows[i].resolveUser;
                            }else{
                                name = name + "," + data.rows[i].resolveUser;
                            }
                        }
                        ItsmService.getResolveUserByLocToUser({displayName:name},function(data){
                            $scope.resolveUserData=data;
                        });
                    }
                    Loading.hide();
                },function(error){
                    Loading.hide();
                });
            }else if($scope.taskList.childId=="33"){
                ItsmService.queryRunningChange($scope.changeSearchPage.data,function(data){
                    if(data.rows.length==0){//列表无数据
                        $scope.resolveUserData=[];
                        $('#resolveUser3').attr("disabled",true)//将input元素设置为disabled
                        $('#resolveUser4').attr("disabled",true)//将input元素设置为disabled
                    }else{
                        var name = null;
                        for(var i=0;i<data.rows.length;i++){
                            if(name==null){
                                name = data.rows[i].resolveUser;
                            }else{
                                name = name + "," + data.rows[i].resolveUser;
                            }
                        }
                        ItsmService.getResolveUserByLocToUser({displayName:name},function(data){
                            $scope.resolveUserData=data;
                        });
                    }
                    Loading.hide();
                },function(error){
                    Loading.hide();
                });
            }else if($scope.taskList.childId=="34"){
                ItsmService.queryFinishedChange($scope.changeSearchPage.data,function(data){
                    if(data.rows.length==0){//列表无数据
                        $scope.resolveUserData=[];
                        $('#resolveUser3').attr("disabled",true)//将input元素设置为disabled
                        $('#resolveUser4').attr("disabled",true)//将input元素设置为disabled
                    }else{
                        var name = null;
                        for(var i=0;i<data.rows.length;i++){
                            if(name==null){
                                name = data.rows[i].resolveUser;
                            }else{
                                name = name + "," + data.rows[i].resolveUser;
                            }
                        }
                        ItsmService.getResolveUserByLocToUser({displayName:name},function(data){
                            $scope.resolveUserData=data;
                        });
                    }
                    Loading.hide();
                },function(error){
                    Loading.hide();
                });
            }
            /*var zTree = angular.element.fn.zTree.getZTreeObj("resolveUser4");
            var nodes = zTree.getNodes();
            for(var i =0;i<nodes.length;i++){
                zTree.cancelSelectedNode(nodes[i]);
            }*/
        }
    }]);

    itsmControllers.controller('libController',['$scope','$rootScope','$location','$timeout','ItsmService','Util','Loading','Tools',function($scope,$rootScope,$location,$timeout,ItsmService,Util,Loading,Tools){

        var taskKey=$location.$$search.taskKey==null?"sid-AFCD5180-FD80-4EC3-8F24-B7DA2A01715A":$location.$$search.taskKey;
        var id=$location.$$search.id;
        var taskId = $location.$$search.taskId;
        $scope.childId = $location.$$search.childId;
        $scope.taskId=taskId;

        $scope.initData = {};
        $scope.formData = {};
        $scope.uploadFile = new Array();
        $scope.formData.attachment = new Array();
        $scope.formData.operate = "创建";
        $scope.hiddenData = {};

        $scope.incidentData = [];
        $scope.formData.incidents = [];
        $scope.incidentSearchPage = {};
        $scope.incidentSearchPage.data={};
        $scope.incidentSearchPage.datas={};
        $scope.problemData = [];
        $scope.formData.problems = [];
        $scope.problemSearchPage = {};
        $scope.problemSearchPage.data={};
        $scope.problemSearchPage.datas={};
        $scope.changeData = [];
        $scope.formData.changes = [];
        $scope.changeSearchPage = {};
        $scope.changeSearchPage.data={};
        $scope.changeSearchPage.datas={};
//        $timeout(function(){
//            var height=angular.element(window).height()-210;
//            angular.element(".form-wrapper").height(height);
//        },1000);
        //去表单页面
        if(Util.notNull(taskKey)){
            $rootScope.$watch("loginUser.userName", function (newVal, oldVal) {
                if (Util.notNull(newVal)) {
                    $scope.formData.applyUser = newVal;
                    if($scope.formData.params)
                        $scope.formData.params.applyUser=$rootScope.loginUser.realName;
                    else
                        $scope.formData.params={applyUser:$rootScope.loginUser.realName};
                }
            }, false);

            ItsmService.getTime(function(data){
                $scope.formData.applyTime = data.time;
            });
            ItsmService.getUsers(function(data){
                $scope.initData.users = data.rows;
                $timeout(function(){
                    jQuery("#resolveUser option[value="+$scope.formData.checkUser+"]").attr("selected","selected");
                },1000);
            });
            //动态控制字段
            $scope.fields=[];
            ItsmService.getForm({task:taskKey,flow:"knowledge"},{},function(data){
                $scope.fields=data;
                $scope.find=function(name){
                    var o = {disabled: true, required: false,show:false};
                    for (var i = 0; i < $scope.fields.length; i++) {
                        if (name == $scope.fields[i].fieldName) {
                            o = {show: true, required: $scope.fields[i].required,disabled:$scope.fields[i].disabled};
                        }
                    }
                    return o;
                }
            });
            if(id!=null){
                ItsmService.querySingleKnowledge({id:id},{},function(data){
                    $scope.formData = data;
                    $scope.formData.taskId=taskId;
                    $scope.uploadFile = angular.copy($scope.formData.attachment);
                    $scope.incidentData = angular.copy($scope.formData.params.incidents);
                    $scope.problemData = angular.copy($scope.formData.params.problems);
                    $scope.changeData = angular.copy($scope.formData.params.changes);
                    ItsmService.getKnowledgeHistory({procId:($location.$$search.insId && $location.$$search.insId!='')?$location.$$search.insId:$scope.formData.instanceId,id:id},{},function(data){
                        $scope.historyProcess = data.rows;
                        if(data.rows.length>0)$scope.currentStep=data.rows[data.rows.length-1].name;
                    });
                });
            }
        }

        //判断按钮 是否显示
        $scope.findShow = function(s){
            var re = false;
            if(s == taskKey){
                re = true;
            }
            return re;
        }
        $scope.findShowSave = function(){
            var re = true;
            if("sid-AFCD5180-FD80-4EC3-8F24-B7DA2A01715A" == taskKey || 'sid-777EE48E-2B08-47C6-B6CD-08500CD95654' == taskKey){
                re = false;
            }
            return re;
        }

        $scope.$watch("taskList.childId",function(newVal,oldVal){
            if(Util.notNull(newVal) && (newVal == 41 || newVal == 42 || newVal == 43 || newVal == 44)){
                $scope.knowledgeSearchPage.search();
            }
        },false);

        $scope.$watch("uploadFile",function(newVal,oldVal){
            if(Util.notNull(newVal) && newVal.length>0){
                $scope.hiddenData.attachment = 1;
            }else{
                $scope.hiddenData.attachment = "";
            }
        },true);

        $scope.action = {
            delete:function(id,type){
                $rootScope.$confirm("确定要删除吗？",function(){
                    Loading.show();
                    ItsmService.deleteFlow({id:id,type:type},function(data){
                        $rootScope.$alert(" 删除成功!");
                        Loading.hide();
                        $scope.knowledgeList.settings.reload(true);
                    },function(data){
                        Loading.hide();
                    });
                },"删除");
            },
            save:function(taskId){
                if(taskId > 0){
                    ItsmService.updateKnowledge({id:taskId},$scope.formData,function(data){
                        $rootScope.$alert(" 保存成功!");
                    });
                    Loading.hide();
                }else{
                    ItsmService.saveKnowledge({},$scope.formData,function(data){
                        $rootScope.$alert(" 保存成功!");
                    });
                    Loading.hide();
                }
            },
            start: function(){
                Loading.show();
                ItsmService.startKnowledge({},$scope.formData,function(data){
                    Loading.hide();
                    window.location.href = "#/queryMyTask?childId=42&parentId=4";
                },function(data){
                    Loading.hide();
                });
            },
            claim: function(taskId){
                ItsmService.claimKnowledge({id:taskId},{},function(data){
                    $scope.knowledgeSearchPage.search();
                    $rootScope.$alert(" 签收成功!");
                    ItsmService.taskGroup({flow:"incident,problem,change,knowledge"},function(data){
                        for(var i=0;i<$scope.taskTree.length;i++){
                            for(var j=0;j<$scope.taskTree[i].children.length;j++){
                                var count=data[$scope.taskTree[i].children[j].id];
                                $scope.taskTree[i].children[j].displayName=($scope.taskTree[i].children[j].displayName.split("(")[0]+"("+count+")");
                            }
                        }
                    });
                });
                Loading.hide();
            },
            claimForward: function(taskId){
                Loading.show();
                ItsmService.claimKnowledge({id:taskId},{},function(data){
                    Loading.hide();
                    window.location.href = "#/queryMyTask?childId=42&parentId=4";
                },function(data){
                    Loading.hide();
                });
            },
            back:function(){
                if($scope.childId=='00'){
                    window.location.href = "#/queryKnowledgeLib";
                }else{
                    var childId = $scope.childId==null?"41":$scope.childId;
                    var parentId = $scope.childId==null?"4":$scope.childId.substring(0,1)
                    window.location.href = "#/queryMyTask?childId="+childId+"&parentId="+parentId;
                }
            },
            process:function(flag){
                Loading.show();
                $scope.formData.taskId = taskId;
                $scope.formData.resolve=flag;
                ItsmService.processKnowledge({},$scope.formData,function(data){
                    Loading.hide();
                    window.location.href = "#/queryMyTask?childId=42&parentId=4";
                },function(data){
                    Loading.hide();
                });
            },
            preProcess:function(id,taskKey,taskId,insId){
                window.location.href = '#/createKnowledgeLib?insId='+insId+'&taskKey='+taskKey+"&id="+id+"&taskId="+taskId+"&childId="+(typeof($scope.taskList) == "undefined"?"00":$scope.taskList.childId);
            },
            showFlow:function(processId,pid){
                $("#pid").hide();
                //window.open('/dmonitor-webapi/itsm/workflow/resource/read?processDefinitionId='+processId+'&resourceType=image',"",null);
                $("#img").attr("src",'/dmonitor-webapi/itsm/workflow/resource/read?processDefinitionId='+processId+'&resourceType=image&r='+(new Date()).getTime());
                ItsmService.getImagePosition({pid:pid,r:(new Date()).getTime()},{},function(data){
                    $.each(data,function(i,v){
                        if(v.currentActiviti){
                            $("#pid").show();
                            $("#pid").css("height",v.height+10);
                            $("#pid").css("width",v.width+10);
                            $("#pid").css("left",v.x-4);
                            var img = new Image();
                            img.src=$("#img").attr("src");
                            img.onload = function(){
                                this.onload=null;
                                $("#pid").css("top",v.y-this.height-4);//10
                            }
                            $("#pid").css("position","relative");
                            $("#pid").css("border","solid 5px red");
                        }
                    });
                });
                $scope.imageDialog.show();
            },
            uploadFile:function(){
                $('#file').attr("value","");
                $scope.fileDialog.show();
            },
            deleteFile:function(id){
                $rootScope.$confirm("确定要删除吗？",function() {
                    var uploadFile = [];
                    var x = 0;
                    $.each($scope.uploadFile, function (i, v) {
                        if (v.id != id) {
                            uploadFile[x] = v;
                            x++;
                        }
                    });
                    $scope.uploadFile = angular.copy(uploadFile);
                    $scope.formData.attachment = angular.copy(uploadFile);
                },"删除");
            },
            operation:function(){
                var operate = $("input[name='operate']:checked").val();
                $("#create").hide();
                $("#change").hide();
                if(operate=="创建"){
                    $("#create").show();
                    $scope.formData.id="";
                    $scope.formData.title="";
                    $scope.formData.keyWord="";
                    $scope.formData.content="";
                    $scope.formData.checkUser="";
                    $scope.formData.updateTime=null;
                    $scope.formData.updateUser=null;
                    $scope.formData.resolve=false;
                    $scope.formData.status=null;
                    $scope.formData.step=null;
                    $scope.uploadFile=[];
                    $scope.formData.operate = "创建";
                }
                if(operate=="编辑"){
                    $("#change").show();
                    $scope.knowledgeListPage.settings.reload(true);
                    $scope.knowledgelibDialog.show();
                }
            },
            addIncident:function(){
                $scope.incidentSearchPage.data={};
                $scope.incidentListPage.settings.reload(true);
                $scope.incidentDialog.show();
            },
            deleteIncident:function(id){
                $rootScope.$confirm("确定要删除吗？",function() {
                    var incidentData = [];
                    $scope.formData.incidents = [];
                    var x = 0;
                    $.each($scope.incidentData, function (i, v) {
                        if (v.id != id) {
                            incidentData[x] = v;
                            $scope.formData.incidents[x] = {"incidentId": v.id};
                            x++;
                        }
                    });
                    $scope.incidentData = incidentData;
                },"删除");
            },
            addProblem:function(){
                $scope.problemSearchPage.data={};
                $scope.problemListPage.settings.reload(true);
                $scope.problemDialog.show();
            },
            deleteProblem:function(id){
                $rootScope.$confirm("确定要删除吗？",function() {
                    var problemData = [];
                    $scope.formData.problems = [];
                    var x = 0;
                    $.each($scope.problemData, function (i, v) {
                        if (v.id != id) {
                            problemData[x] = v;
                            $scope.formData.problems[x] = {"problemId": v.id};
                            x++;
                        }
                    });
                    $scope.problemData = problemData;
                },"删除");
            },
            addChange:function(){
                $scope.changeSearchPage.data={};
                $scope.changeListPage.settings.reload(true);
                $scope.changeDialog.show();
            },
            deleteChange:function(id){
                $rootScope.$confirm("确定要删除吗？",function() {
                    var changeData = [];
                    $scope.formData.changes = [];
                    var x = 0;
                    $.each($scope.changeData, function (i, v) {
                        if (v.id != id) {
                            changeData[x] = v;
                            $scope.formData.changes[x] = {"changeId": v.id};
                            x++;
                        }
                    });
                    $scope.changeData = changeData;
                },"删除");
            }
        };

        $scope.imageDialog = Tools.dialog({
            id:"imageDialog",
            title:"流程图",
            hiddenButton:true,
            save:function(){
                $scope.imageDialog.hide();
            }
        });

        $scope.fileDialog = Tools.dialog({
            id:"fileDialog",
            title:"上传文件",
            save:function(){
                if(angular.element("#file").val()==null || angular.element("#file").val()==""){
                    $rootScope.$alert("请选择需要上传的文件");
                    return;
                }
                Loading.show();
                var step='新建';
                if($scope.historyProcess && $scope.historyProcess.length>1){
                    step=$scope.historyProcess[$scope.historyProcess.length-1].name;
                }
                $.ajaxFileUpload({
                    url: '/dmonitor-webapi/itsm/form/upload?type=knowledge&step='+step, //用于文件上传的服务器端请求地址
                    secureuri: false, //是否需要安全协议，一般设置为false
                    fileElementId: 'file', //文件上传域的ID
                    dataType: 'json', //返回值类型 一般设置为json
                    success: function (data, status){
                        Loading.hide();
                        if(data != null && data.id!=null){
                            $scope.uploadFile.push(data);
                            $scope.formData.attachment.push(data);
                            $rootScope.$alert(" 上传成功!");
                        }else if(data.message && data.message.indexOf("Maximum upload size of")>-1){
                            $rootScope.$alert(" 上传失败,上传文件不能大于2M");
                        }else{
                            $rootScope.$alert(" 上传失败!");
                        }
                        $scope.$apply();
                        $rootScope.$apply();
                    },error: function (data, status, e){
                        Loading.hide();
                        $rootScope.$alert(" 上传失败!");
                        $rootScope.$apply();
                    }
                });
                $scope.fileDialog.hide();
            }
        });

        $scope.knowledgelibDialog = Tools.dialog({
            id:"knowledgelibDialog",
            title:"查询",
            hiddenButton:true
        });

        $scope.knowledgeListPage = {
            data:[],  //table 数据
            checkedList: [],
            checkAllRow:false
        };

        $scope.knowledgeListPage.settings = {
            reload : null,
            getData:function(search,fnCallback){
                $scope.knowledgeSearchPage.data.limit = search.limit;
                $scope.knowledgeSearchPage.data.offset = search.offset;
                $scope.knowledgeSearchPage.data.orderBy = search.orderBy;
                $scope.knowledgeSearchPage.data.orderByType = search.orderByType;
                Loading.show();
                ItsmService.getKnowledge($scope.knowledgeSearchPage.data,function(data){
                    $scope.knowledgeListPage.data = data.rows;
                    fnCallback(data);
                    $scope.knowledgeListPage.checkedList = [];
                    $scope.knowledgeListPage.checkAllRow = false;
                    Loading.hide();
                },function(error){
                    Loading.hide();
                });
                Loading.hide();
            },
            columns : [
                {
                    sTitle: "知识单号",
                    mData:"orderId"
                },
                {
                    sTitle: "知识标题",
                    mData:"title",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "关键字",
                    mData:"keyWord",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "创建人",
                    mData:"applyUser",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.applyUser);
                    }
                },
                {
                    sTitle:"创建时间",
                    mData:"applyTime",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [ ] },  //不可排序
                { sWidth: "140px", aTargets: [ 4] },
                { sWidth: "400px", aTargets: [ 1 ] }
            ], //定义列的约束
            defaultOrderBy : []  //定义默认排序列为第8列倒序
        };

        //关联项
        $scope.incidentDialog = Tools.dialog({
            id:"incidentDialog",
            title:"故障单",
            save:function(){
                var incidentData = [];
                var incidents = [];
                var x = 0;
                for(var i=0;i<$scope.incidentListPage.checkedList.length;i++){
                    $.each($scope.incidentListPage.data,function(j,v){
                        if($scope.incidentListPage.checkedList[i]== v.id){
                            var flag = false;
                            $.each($scope.incidentData,function(ii,vv){
                                if(vv.id== v.id){
                                    flag = true;
                                }
                            });
                            if(!flag){
                                incidentData[x]={"id":v.id,"orderId":v.orderId,"name": v.title,"resolveUser": v.params.resolveUser};;
                                incidents[x] = {"incidentId":v.id};
                                x++;
                            }
                        }
                    });
                }
                $.each(incidentData,function(i,v){
                    $scope.incidentData.push(v);
                    $scope.formData.incidents.push({"incidentId":v.id});
                });

                $scope.incidentDialog.hide();
            }
        });

        $scope.$watch("incidentSearchPage.data.mocpId",function(newVal,oldVal){
            $scope.incidentSearchPage.data.mocId = "";
            $scope.incidentSearchPage.datas.moc = [];
            $scope.incidentSearchPage.data.moId = "";
            $scope.incidentSearchPage.datas.mos = [];
            if(Util.notNull(newVal)){
                $scope.incidentSearchPage.datas.moc = Util.findFromArray("id",newVal,$scope.incidentSearchPage.datas.mocp)['children'];
            }
        },false);

        $scope.$watch("incidentSearchPage.data.mocId",function(newVal, oldVal){
            $scope.incidentSearchPage.data.moId = "";
            $scope.incidentSearchPage.datas.mos = [];
            if(Util.notNull(newVal)){
                ItsmService.getMoByMocId({mocId:newVal,orderBy:'displayName',orderByType:'asc'},{},function(data){
                    $scope.incidentSearchPage.datas.mos = data.rows;
                });
            }
        },false);

        $scope.incidentListPage = {
            data:[],
            checkedList : [],
            checkAllRow : false,
            action:{
                search:function(search,fnCallback){
                    $scope.incidentSearchPage.data.limit = search.limit;
                    $scope.incidentSearchPage.data.offset = search.offset;
                    $scope.incidentSearchPage.data.orderBy = search.orderBy;
                    $scope.incidentSearchPage.data.orderByType  = search.orderByType;
                    $scope.incidentSearchPage.data.status="已关闭";
                    Loading.show();
                    ItsmService.getIncident($scope.incidentSearchPage.data,function(data){
                        $scope.incidentListPage.data =data.rows;
                        fnCallback(data);
                        $scope.incidentListPage.checkedList = [];
                        $scope.incidentListPage.checkAllRow = false;
                    },function(error){
                        Loading.hide();
                    });
                    Loading.hide();
                }
            }
        };

        $scope.incidentListPage.settings = {
            reload : null,
            getData:$scope.incidentListPage.action.search,//getData应指定获取数据的函数
            columns : [
                {
                    sTitle: "<div class='checkbox'><label><input type='checkbox' ng-model='incidentListPage.checkAllRow'><i></i></label></div>",
                    mData:"id",
                    mRender:function(mData,type,full) {
                        return '<div class="checkbox"><label><input type="checkbox" checklist-model="incidentListPage.checkedList" checklist-value="'+mData+'" /><i></i></label></div>';
                    }
                },
                {
                    sTitle: "故障单号",
                    mData:"orderId"
                },
                {
                    sTitle: "故障标题",
                    mData:"title",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "资源类型",
                    mData:"params.mocId",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.mocId);
                    }
                },
                {
                    sTitle: "资源实例",
                    mData:"params.moId",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.moId);
                    }
                },
                {
                    sTitle: "优先级",
                    mData:"priority",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.priority);
                    }
                },
                {
                    sTitle: "报告人",
                    mData:"reporter",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle:"状态",
                    mData:"step",
                    mRender:function(mData,type,full) {
                        return Util.str2Html($rootScope.getStep(full,"incident"));
                    }
                },
                {
                    sTitle:"发生时间",
                    mData:"time",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle:"创建人",
                    mData:"applyUser",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.applyUser);
                    }
                },
                {
                 sTitle:"处理人",
                 mData:"resolveUser",
                 mRender:function(mData,type,full) {
                 return Util.str2Html(full.params.resolveUser);
                 }
                 },
                {
                    sTitle:"创建时间",
                    mData:"applyTime",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [ 0] },  //列不可排序
                { sWidth: "38px", aTargets: [ 0 ] },
                { sWidth: "80px", aTargets: [ 7 ] },
                { sWidth: "80px", aTargets: [ 8 ] },
                { sWidth: "80px", aTargets: [ 10 ] }
            ] , //定义列的约束
            defaultOrderBy : [[ 9, "desc" ]]  //定义默认排序列为第7列倒序
        };

        $scope.$watch("incidentListPage.checkAllRow",function(newVal,oldVal){
            if(newVal){
                $scope.incidentListPage.checkedList = Util.copyArray("id",$scope.incidentListPage.data);
            }else{
                if($scope.incidentListPage.data.length == $scope.incidentListPage.checkedList.length){
                    $scope.incidentListPage.checkedList = [];
                }
            }
        },false);

        $scope.$watch("incidentListPage.checkedList",function(newVal,oldVal){
            $scope.incidentListPage.checkAllRow = newVal && newVal.length>0 && newVal.length==$scope.incidentListPage.data.length;

        },true);
        ////////////////
        $scope.problemDialog = Tools.dialog({
            id:"problemDialog",
            title:"问题单",
            save:function(){
                var problemData = [];
                var problems = [];
                var x = 0;
                for(var i=0;i<$scope.problemListPage.checkedList.length;i++){
                    $.each($scope.problemListPage.data,function(j,v){
                        if($scope.problemListPage.checkedList[i]== v.id){
                            var flag = false;
                            $.each($scope.problemData,function(ii,vv){
                                if(vv.id== v.id){
                                    flag = true;
                                }
                            });
                            if(!flag){
                                problemData[x]={"id":v.id,"orderId":v.orderId,"name": v.title,"resolveUser": v.params.resolveUser};;
                                problems[x] = {"problemId":v.id};
                                x++;
                            }
                        }
                    });
                }
                $.each(problemData,function(i,v){
                    $scope.problemData.push(v);
                    $scope.formData.problems.push({"problemId":v.id});
                });
                $scope.problemDialog.hide();
            }
        });

        $scope.problemListPage = {
            data:[],
            checkedList : [],
            checkAllRow : false,
            action:{
                search:function(search,fnCallback){
                    $scope.problemSearchPage.data.limit = search.limit;
                    $scope.problemSearchPage.data.offset = search.offset;
                    $scope.problemSearchPage.data.orderBy = search.orderBy;
                    $scope.problemSearchPage.data.orderByType  = search.orderByType;
                    $scope.problemSearchPage.data.status="已关闭";
                    Loading.show();
                    ItsmService.getProblem($scope.problemSearchPage.data,function(data){
                        $scope.problemListPage.data =data.rows;
                        fnCallback(data);
                        $scope.problemListPage.checkedList = [];
                        $scope.problemListPage.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }
            }
        };

        $scope.problemListPage.settings = {
            reload : null,
            getData:$scope.problemListPage.action.search,//getData应指定获取数据的函数
            columns : [
                {
                    sTitle: "<div class='checkbox'><label><input type='checkbox' ng-model='problemListPage.checkAllRow'><i></i></label></div>",
                    mData:"id",
                    mRender:function(mData,type,full) {
                        return '<div class="checkbox"><label><input type="checkbox" checklist-model="problemListPage.checkedList" checklist-value="'+mData+'" /><i></i></label></div>';
                    }
                },
                {
                    sTitle: "问题单号",
                    mData:"orderId"
                },
                {
                    sTitle: "问题标题",
                    mData:"title",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "资源类型",
                    mData:"params.mocId",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.mocId);
                    }
                },
                {
                    sTitle: "资源实例",
                    mData:"params.moId",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.moId);
                    }
                },
                {
                    sTitle: "优先级",
                    mData:"priority",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.priority);
                    }
                },
                {
                    sTitle: "报告人",
                    mData:"reporter",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle:"状态",
                    mData:"step",
                    mRender:function(mData,type,full) {
                        return Util.str2Html($rootScope.getStep(full,"problem"));
                    }
                },
                {
                    sTitle:"发生时间",
                    mData:"time",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle:"创建人",
                    mData:"applyUser",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.applyUser);
                    }
                },
                {
                 sTitle:"处理人",
                 mData:"resolveUser",
                 mRender:function(mData,type,full) {
                 return Util.str2Html(full.params.resolveUser);
                 }
                 },
                {
                    sTitle:"创建时间",
                    mData:"applyTime",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [ 0] },  //列不可排序
                { sWidth: "38px", aTargets: [ 0 ] },
                { sWidth: "80px", aTargets: [ 8 ] },
                { sWidth: "80px", aTargets: [ 9 ] },
                { sWidth: "80px", aTargets: [ 10 ] }
            ] , //定义列的约束
            defaultOrderBy : [[ 8, "desc" ]]  //定义默认排序列为第7列倒序
        };

        $scope.$watch("problemListPage.checkAllRow",function(newVal,oldVal){
            if(newVal){
                $scope.problemListPage.checkedList = Util.copyArray("id",$scope.problemListPage.data);
            }else{
                if($scope.problemListPage.data.length == $scope.problemListPage.checkedList.length){
                    $scope.problemListPage.checkedList = [];
                }
            }
        },false);

        $scope.$watch("problemListPage.checkedList",function(newVal,oldVal){
            $scope.problemListPage.checkAllRow = newVal && newVal.length>0 && newVal.length==$scope.problemListPage.data.length;

        },true);

        $scope.$watch("problemSearchPage.data.mocpId",function(newVal,oldVal){
            $scope.problemSearchPage.data.mocId = "";
            $scope.problemSearchPage.datas.moc = [];
            $scope.problemSearchPage.data.moId = "";
            $scope.problemSearchPage.datas.mos = [];
            if(Util.notNull(newVal)){
                $scope.problemSearchPage.datas.moc = Util.findFromArray("id",newVal,$scope.problemSearchPage.datas.mocp)['children'];
            }
        },false);

        $scope.$watch("problemSearchPage.data.mocId",function(newVal, oldVal){
            $scope.problemSearchPage.data.moId = "";
            $scope.problemSearchPage.datas.mos = [];
            if(Util.notNull(newVal)){
                ItsmService.getMoByMocId({mocId:newVal,orderBy:'displayName',orderByType:'asc'},{},function(data){
                    $scope.problemSearchPage.datas.mos = data.rows;
                });
            }
        },false);
        /////////////////
        $scope.changeDialog = Tools.dialog({
            id:"changeDialog",
            title:"变更单",
            save:function(){
                var changeData = [];
                var changes = [];
                var x = 0;
                for(var i=0;i<$scope.changeListPage.checkedList.length;i++){
                    $.each($scope.changeListPage.data,function(j,v){
                        if($scope.changeListPage.checkedList[i]== v.id){
                            var flag = false;
                            $.each($scope.changeData,function(ii,vv){
                                if(vv.id== v.id){
                                    flag = true;
                                }
                            });
                            if(!flag){
                                changeData[x]={"id":v.id,"orderId":v.orderId,"name": v.title,"resolveUser": v.params.resolveUser};
                                changes[x] = {"changeId":v.id};
                                x++;
                            }
                        }
                    });
                }
                $.each(changeData,function(i,v){
                    $scope.changeData.push(v);
                    $scope.formData.changes.push({"changeId":v.id});
                });
                $scope.changeDialog.hide();
            }
        });

        $scope.changeListPage = {
            data:[],
            checkedList : [],
            checkAllRow : false,
            action:{
                search:function(search,fnCallback){
                    $scope.changeSearchPage.data.limit = search.limit;
                    $scope.changeSearchPage.data.offset = search.offset;
                    $scope.changeSearchPage.data.orderBy = search.orderBy;
                    $scope.changeSearchPage.data.orderByType  = search.orderByType;
                    $scope.changeSearchPage.data.status="已关闭";
                    Loading.show();
                    ItsmService.getChange($scope.changeSearchPage.data,function(data){
                        $scope.changeListPage.data =data.rows;
                        fnCallback(data);
                        $scope.changeListPage.checkedList = [];
                        $scope.changeListPage.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }
            }
        };

        $scope.changeListPage.settings = {
            reload : null,
            getData:$scope.changeListPage.action.search,//getData应指定获取数据的函数
            columns : [
                {
                    sTitle: "<div class='checkbox'><label><input type='checkbox' ng-model='changeListPage.checkAllRow'><i></i></label></div>",
                    mData:"id",
                    mRender:function(mData,type,full) {
                        return '<div class="checkbox"><label><input type="checkbox" checklist-model="changeListPage.checkedList" checklist-value="'+mData+'" /><i></i></label></div>';
                    }
                },
                {
                    sTitle: "变更单号",
                    mData:"orderId"
//                    ,mRender:function(mData,type,full) {
//                        return '<a target="_blank" href="/index.html#/createChange?taskKey=sid-1100727C-0CC4-45BB-8763-73DD3D56539C&id='+full.id+'&taskId='+full.taskId+'&childId=00">'+mData+'</a>';
//                    }
                },
                {
                    sTitle: "变更标题",
                    mData:"title",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
//                {
//                    sTitle: "类型",
//                    mData:"typeId",
//                    mRender:function(mData,type,full) {
//                        return Util.str2Html(full.params.typeId);
//                    }
//                },
                {
                    sTitle: "优先级",
                    mData:"priority",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.priority);
                    }
                },
                {
                    sTitle: "报告人",
                    mData:"reporter",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle:"状态",
                    mData:"step",
                    mRender:function(mData,type,full) {
                        return Util.str2Html($rootScope.getStep(full,"change"));
                    }
                },
                {
                    sTitle:"计划开始时间",
                    mData:"startTime",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle:"计划结束时间",
                    mData:"endTime",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle:"创建人",
                    mData:"applyUser",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.applyUser);
                    }
                },
                {
                 sTitle:"处理人",
                 mData:"resolveUser",
                 mRender:function(mData,type,full) {
                 return Util.str2Html(full.params.resolveUser);
                 }
                 },
                {
                    sTitle:"创建时间",
                    mData:"applyTime",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [ 0] },  //列不可排序
                { sWidth: "38px", aTargets: [ 0 ] },
                { sWidth: "110px", aTargets: [ 6 ] },
                { sWidth: "110px", aTargets: [ 7 ] },
                { sWidth: "90px", aTargets: [ 9 ] }
            ] , //定义列的约束
            defaultOrderBy : [[ 9, "desc" ]]  //定义默认排序列为第7列倒序
        };

        $scope.$watch("changeListPage.checkAllRow",function(newVal,oldVal){
            if(newVal){
                $scope.changeListPage.checkedList = Util.copyArray("id",$scope.changeListPage.data);
            }else{
                if($scope.changeListPage.data.length == $scope.changeListPage.checkedList.length){
                    $scope.changeListPage.checkedList = [];
                }
            }
        },false);

        $scope.$watch("changeListPage.checkedList",function(newVal,oldVal){
            $scope.changeListPage.checkAllRow = newVal && newVal.length>0 && newVal.length==$scope.changeListPage.data.length;
        },true);

        // ****************  list page  ***************
        $scope.knowledgeList = {
            data:[],  //table 数据
            checkedList: [],
            checkAllRow:false
        };

        $scope.knowledgeSearchPage = {
            init : function(){
                $scope.knowledgeSearchPage.data = {
                    table:$location.path()=="/createKnowledgeLib"?"KnowledgeLib":null,
                    limit : 20, //每页条数(即取多少条数据)
                    offset : 0 , //从第几条数据开始取
                    orderBy : "",//排序字段
                    orderByType : "" //排序顺序
                }
            },
            search:function(){
                $scope.knowledgeList.settings.reload(true);
            }
        };
        $scope.knowledgeSearchPage.init();

        $scope.knowledgeList.settings = {
            reload : null,
            getData:function(search,fnCallback){
                $scope.knowledgeSearchPage.data.limit = search.limit;
                $scope.knowledgeSearchPage.data.offset = search.offset;
                $scope.knowledgeSearchPage.data.orderBy = search.orderBy;
                $scope.knowledgeSearchPage.data.orderByType = search.orderByType;
                Loading.show();
                if(typeof($scope.taskList)=="undefined"){
                    ItsmService.getKnowledge($scope.knowledgeSearchPage.data,function(data){
                        $scope.knowledgeList.data = data.rows;
                        fnCallback(data);
                        $scope.knowledgeList.checkedList = [];
                        $scope.knowledgeList.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                    Loading.hide();
                }else if($scope.taskList.childId==41){
                    ItsmService.queryClaimingKnowledge($scope.knowledgeSearchPage.data,function(data){
                        $scope.knowledgeList.data = data.rows;
                        fnCallback(data);
                        $scope.knowledgeList.checkedList = [];
                        $scope.knowledgeList.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }else if($scope.taskList.childId==42){
                    ItsmService.queryTaskKnowledge($scope.knowledgeSearchPage.data,function(data){
                        $scope.knowledgeList.data = data.rows;
                        fnCallback(data);
                        $scope.knowledgeList.checkedList = [];
                        $scope.knowledgeList.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }else if($scope.taskList.childId==43){
                    ItsmService.queryRunningKnowledge($scope.knowledgeSearchPage.data,function(data){
                        $scope.knowledgeList.data = data.rows;
                        fnCallback(data);
                        $scope.knowledgeList.checkedList = [];
                        $scope.knowledgeList.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }else if($scope.taskList.childId==44){
                    ItsmService.queryFinishedKnowledge($scope.knowledgeSearchPage.data,function(data){
                        $scope.knowledgeList.data = data.rows;
                        fnCallback(data);
                        $scope.knowledgeList.checkedList = [];
                        $scope.knowledgeList.checkAllRow = false;
                        Loading.hide();
                    },function(error){
                        Loading.hide();
                    });
                }
            },
            columns : [
                {
                    sTitle: "知识单号",
                    mData:"orderId"
                },
                {
                    sTitle: "知识标题",
                    mData:"title",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "关键字",
                    mData:"keyWord",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "创建人",
                    mData:"applyUser",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.params.applyUser);
                    }
                },
                {
                    sTitle:"状态",
                    mData:"step",
                    mRender:function(mData,type,full) {
                        return Util.str2Html($rootScope.getStep(full,"knowledge"));
                    }
                },
                {
                    sTitle:"创建时间",
                    mData:"applyTime",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle:"操作",
                    mData:"id",
                    mRender:function(mData,type,full) {
                        var str = "";
                        var taskKey = typeof(full.params.taskKey)!='undefined'?full.params.taskKey:"sid-777EE48E-2B08-47C6-B6CD-08500CD95654";
                        if(full.params.assignee == null && (typeof($scope.taskList)=="undefined" || $scope.taskList.childId==43 || $scope.taskList.childId==44)){
                            str = '<i class="fa fa-search" title="查看" ng-click="action.preProcess('+mData+',\''+taskKey+'\',\''+full.taskId+'\',\''+(full.params.pid?full.params.pid:full.instanceId)+'\')"> </i>';
                        }
                        else if(full.params.assignee == null){
                            str += '<i ng-disabled="loginUserMenuMap[currentView]" class="fa fa-edit" title="签收" ng-click="action.claim(\''+full.taskId+'\')"> </i>';
                            str += '<i class="fa fa-search" title="查看" ng-click="action.preProcess('+mData+',\'sid-777EE48E-2B08-47C6-B6CD-08500CD95654\',\''+full.taskId+'\',\''+(full.params.pid?full.params.pid:full.instanceId)+'\')"> </i>';
                        }else{
                            str = '<i ng-disabled="loginUserMenuMap[currentView]" class="fa fa-pencil" title="处理" ng-click="action.preProcess('+mData+',\''+taskKey+'\',\''+full.taskId+'\',\'\')"> </i>';
                        }
                        if(typeof($scope.taskList)!="undefined")
                            str += '<i class="fa fa-code-fork" title="流程图" ng-click="action.showFlow(\''+full.processId+'\',\''+full.params.pid+'\')"></i>';
                        if(typeof($scope.taskList)=="undefined")
                            str += '<i class="fa fa-trash-o" ng-show="loginUser.userName==\'admin\'" title="删除" ng-click="action.delete(\''+full.id+'\',\'knowledge\')"></i>';
                        return str;
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [6 ] },  //不可排序
                { sWidth: "100px", aTargets: [ 0 ] },
                { sWidth: "140px", aTargets: [ 5 ] },
                { sWidth: "140px", aTargets: [ 5 ] },
                { sWidth: "100px", aTargets: [ 6 ] }
            ], //定义列的约束
            defaultOrderBy : []  //定义默认排序列为第8列倒序
        }
    }]);

    itsmControllers.controller('workController',['$scope','$rootScope','$location','$timeout','ItsmService','Util','Loading','Tools','OperateService',function($scope,$rootScope,$location,$timeout,Itsm,Util,Loading,Tools,Operate){
        $scope.openDialog=Tools.dialog({
            id:"openDialog",
            title:"新建",
            userIds:[],
            status:0,
            hiddenButton:true,
            model:{name:"",key:"",desc:"",type:""},
            save:function(){
                $scope.openDialog.model.title=jQuery("#addUserNames").val();
                Itsm.saveWork($scope.openDialog.model,function(data){
                    jQuery('#workcalendar').fullCalendar('refetchEvents');
                    $scope.openDialog.hide();
                });
            },delete:function(){
                $rootScope.$confirm("确定要删除吗？",function(){
                    Itsm.deleteWork({id:$scope.openDialog.model.id},function(data){
                        jQuery('#workcalendar').fullCalendar('refetchEvents');
                        $scope.openDialog.hide();
                    });
                },"删除");
            }
        });
        Operate.getDepartUsers({userLoc:1},function(data){
            $scope.departUsers=data;
        });

        $scope.$watch("openDialog.userIds",function(s){
            if(s){
                var ids="";
                for(var i=0;i<$scope.openDialog.userIds.length;i++){
                    ids+=ids==""?$scope.openDialog.userIds[i]:","+$scope.openDialog.userIds[i];
                }
                $scope.openDialog.model.userIds=ids;
            }else{
                $scope.openDialog.model.userIds=null;
            }
        },true);



        $scope.searchPage = {
            data : {
                name:"",
                limit : 10, //每页条数(即取多少条数据)
                offset : 0 , //从第几条数据开始取
                time1:"",
                time2:"",
                createBy:"",
                orderBy : "updated",//排序字段
                orderByType : "desc" //排序顺序
            },
            search:function(){
                Loading.show();
                jQuery('#workcalendar').fullCalendar('refetchEvents');
                Loading.hide();
            }
        };
        jQuery('#workcalendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month'
            },
            editable: false,
            selectable: true,
            dragOpacity: {
                agenda: .5,
                '':.6
            },
            select: function( startDate, endDate, allDay, jsEvent, view ){ //添加
                $scope.openDialog.userIds=[];
                $scope.openDialog.model={};
                $scope.openDialog.title="新增";
                jQuery("#addUserNames").val("");
                $scope.openDialog.status = 0;
                $scope.openDialog.model.start=$.fullCalendar.formatDate(startDate,'yyyy-MM-dd');
                $scope.openDialog.model.end =$.fullCalendar.formatDate(endDate,'yyyy-MM-dd');
                $scope.openDialog.model.color="#339CD0";
                jQuery("#color").css("cssText","background-color:#339CD0!important;");
                $scope.$apply();


                var tree = jQuery.fn.zTree.getZTreeObj("addUserNames_div");
                var nodes = tree.getCheckedNodes();
                for(var i=0;i<nodes.length;i++){
                    nodes[i].checked = "false";
                    tree.updateNode(nodes[i]);
                }
                tree.refresh();



                $scope.openDialog.show();
            },
            events: function(start, end, callback){
                var start_=$.fullCalendar.formatDate(start,'yyyy-MM-dd');
                var end_ =$.fullCalendar.formatDate(end,'yyyy-MM-dd');
                Itsm.queryWork({start:start_,end:end_,name:$scope.searchPage.data.name},function(events){
                    callback(events);
                });
            },
            eventClick: function(calEvent, jsEvent, view) {//修改
                Itsm.getWork({id:calEvent.id},function(data){
                    $scope.openDialog.model=data;

                    $scope.openDialog.title="编辑";
                    var endTime = data.end;
                    if(endTime){
                        var arr=endTime.split("-");
                        var time=new Date(arr[0],arr[1],arr[2]);

                        var year1 = time.getYear();
                        var month1 = time.getMonth();
                        var day1 = time.getDay();


                        var time1=time.getTime();

                        var date =new Date();
                        var year = date.getYear();
                        var month = date.getMonth();
                        var day = date.getDay();

                        if(year>year1){
                            $scope.openDialog.status = 1;
                        }else if(year == year1){
                            if(month>month1){
                                $scope.openDialog.status = 1;
                            }else if(month==month1){
                                if(day>day1){
                                    $scope.openDialog.status = 1;
                                }else if(day==day1){
                                    $scope.openDialog.status = 0;
                                }else{
                                    $scope.openDialog.status = 0;
                                }
                            }else{
                                $scope.openDialog.status = 0;
                            }
                        }else{
                            $scope.openDialog.status = 0;
                        }
                        /*var nowTime =date.getYear();
                        if(nowTime>time1){
                            $scope.openDialog.status = 1;
                        }else{
                            $scope.openDialog.status = 0;
                        }*/
                    }else{
                        $scope.openDialog.status = 0;
                    }
                    jQuery("#editUserNames").val(data.title);
                    jQuery("#color").css("cssText","background-color:"+data.color+"!important;");

                    $scope.openDialog.show();
                });
            }
        });
    }]);

    itsmControllers.controller('abController',['$scope','$rootScope','$location','$timeout','ItsmService','Util','Loading','Tools','OperateService','UserService',function($scope,$rootScope,$location,$timeout,Itsm,Util,Loading,Tools,Operate,UserService){

        $scope.openDialog=Tools.dialog({
            id:"openDialog",
            title:"新建",
            hiddenButton:true,
            model:{},
            save:function(){
                var model={id:$scope.openDialog.model.id,userId:$scope.openDialog.model.userId+"",agentId:$scope.openDialog.model.agentId+""};
                if($scope.openDialog.model.userId==$scope.openDialog.model.agentId){
                    $rootScope.$alert("主用户不能与代理用户相同");
                    return;
                }
                if((model.userId+"").indexOf("u_")>-1){
                    model.userId=model.userId.substring(2,model.userId.length);
                }
                if((model.agentId+"").indexOf("u_")>-1){
                    model.agentId=model.agentId.substring(2,model.agentId.length);
                }
                Itsm.saveWorkAb(model,function(data){
                    $scope.searchPage.action.search();
                });
                $scope.openDialog.hide();
            }
        });
        $scope.isLeafNode=function(node){
            return (node.id+'').indexOf('u_')!=-1;
        }
        Operate.getDepartUsers(function(data){
            $scope.departUsers=data;
        });
        $scope.users=[];
        $rootScope.$watch("loginUser.locId",function(newVal){
            if(newVal){
                UserService.getUsers({departId:newVal},function(data){
                    if(data){
                        $scope.users=data.rows;
                    }
                });
            }
        },true);
        $scope.openDialog2=Tools.dialog({
            id:"openDialog2",
            title:"编辑",
            hiddenButton:true,
            model:{},
            save:function(){
                var model={id:$scope.openDialog2.model.id,userId:$scope.openDialog2.model.userId+"",agentId:$scope.openDialog2.model.agentId+""};
                if($scope.openDialog2.model.userId==$scope.openDialog2.model.agentId){
                    $rootScope.$alert("主用户不能与代理用户相同");
                    return;
                }
                if((model.userId+"").indexOf("u_")>-1){
                    model.userId=model.userId.substring(2,model.userId.length);
                }
                if((model.agentId+"").indexOf("u_")>-1){
                    model.agentId=model.agentId.substring(2,model.agentId.length);
                }
                Itsm.saveWorkAb(model,function(data){
                    $scope.searchPage.action.search();
                });
                $scope.openDialog2.hide();
            }
        });
        $scope.searchPage = {
            data : {
                name:"",
                limit : 10, //每页条数(即取多少条数据)
                offset : 0 , //从第几条数据开始取
                time1:"",
                time2:"",
                createBy:"",
                orderBy : "updated",//排序字段
                orderByType : "desc" //排序顺序
            },
            action:{
                search : function(){
                    $scope.listPage.settings.reload();
                }
            }
        };
        $scope.listPage = {
            data:[],
            checkedList : [],
            checkAllRow : false,
            action : {
                add:function(){
                    $scope.openDialog.title="新增";
                    $scope.openDialog.model={};
                    $scope.openDialog.show();
                },
                edit:function(id){
                    var model=Util.findFromArray("id",id,$scope.listPage.data);
                    $scope.openDialog2.model.id=model.id;
                    $scope.openDialog2.model.userId=model.userId;
                    $scope.openDialog2.model.agentId=model.agentId;
                    angular.element("#userId2").val(model.userName);
                    $scope.openDialog2.show();
                    $timeout(function(){
                        angular.element("#agentId2 option[value='"+model.agentId+"']").attr("selected","selected");
                    },50);
                },
                delete:function(id){
                    $rootScope.$confirm("确定要删除吗？",function(){
                        Itsm.deleteWorkAb({id:[id]},function(){
                            $rootScope.$alert("删除成功");
                            $scope.searchPage.action.search();
                        });
                    },"删除");
                },
                deleteAll:function(){
                    var ids=$scope.listPage.checkedList;
                    if(ids==null || ids.length==0){
                        $rootScope.$alert("请选择需要删除的数据");
                        return;
                    }
                    $rootScope.$confirm("确定要删除吗？",function(){
                        Itsm.deleteWorkAb({id:ids},function(){
                            $rootScope.$alert("删除成功");
                            $scope.searchPage.action.search();
                        });
                    },"删除");
                },
                search: function (search,fnCallback) {
                    $scope.searchPage.data.limit = search.limit;
                    $scope.searchPage.data.offset = search.offset;
                    $scope.searchPage.data.orderBy = search.orderBy;
                    $scope.searchPage.data.orderByType = search.orderByType;
                    Loading.show();
                    Itsm.queryWorkAb($scope.searchPage.data,function(data){
                        Loading.hide();
                        $scope.listPage.data =data.rows;
                        fnCallback(data);
                    },function(data){Loading.hide();});
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
                        return '<div class="checkbox"><label><input type="checkbox" checklist-model="listPage.checkedList" checklist-value=\''+mData+'\' /><i></i></label></div>';
                    }
                },
                {
                    sTitle: "主用户",
                    mData:"userName",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "代理用户",
                    mData:"agentName",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "更新时间",
                    mData:"updated",
                    mRender:function(mData,type,full) {
                        if(mData){
                            var t=mData;
                            var d=new Date(t);
                            return d.pattern("yyyy-MM-dd HH:mm:ss");
                        }else return "";
                    }
                },
                {
                    sTitle: "操作",
                    mData:"id",
                    mRender:function(mData,type,full) {
                        return '<i ng-disabled="loginUserMenuMap[currentView]" title="编辑" class="fa fa-pencil" ng-click="listPage.action.edit(\''+mData+'\')"> </i>' +
                            '<i ng-disabled="loginUserMenuMap[currentView]" title="删除" class="fa fa-trash-o" ng-click="listPage.action.delete(\''+mData+'\')"></i>';
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [0,4 ] },  //第0、9列不可排序
                { sWidth: "40px", aTargets: [ 0] },
                { sWidth: "120px", aTargets: [ 4] }
            ] , //定义列的约束
            defaultOrderBy : []
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

    itsmControllers.controller('slaController',['$scope','$rootScope','$location','$timeout','ItsmService','Util','Loading','Tools','OperateService',function($scope,$rootScope,$location,$timeout,Itsm,Util,Loading,Tools,Operate){
        $scope.openDialog=Tools.dialog({
            id:"openDialog",
            title:"新增",
            hiddenButton:true,
            time:0,
            model:{},
            save:function(){
                var time=$scope.openDialog.time;
                $scope.openDialog.model.time=time*3600000;
                Itsm.saveSla($scope.openDialog.model,function(data){
                    $scope.searchPage.action.search();
                });
                $scope.openDialog.hide();
            }
        });
        $scope.searchPage = {
            data : {
                type:"",
                limit : 10, //每页条数(即取多少条数据)
                offset : 0 , //从第几条数据开始取
                name:"",
                createBy:"",
                orderBy : "updated",//排序字段
                orderByType : "desc" //排序顺序
            },
            action:{
                search : function(){
                    $scope.listPage.settings.reload();
                }
            }
        };
        $scope.listPage = {
            data:[],
            checkedList : [],
            checkAllRow : false,
            action : {
                edit:function(id){
                    $scope.openDialog.title="编辑";
                    $scope.openDialog.model=Util.findFromArray("id",id,$scope.listPage.data);
                    $scope.openDialog.time=parseInt($scope.openDialog.model.time/3600000);
                    $scope.openDialog.show();
                },
                search: function (search,fnCallback) {
                    $scope.searchPage.data.limit = search.limit;
                    $scope.searchPage.data.offset = search.offset;
                    $scope.searchPage.data.orderBy = search.orderBy;
                    $scope.searchPage.data.orderByType = search.orderByType;
                    Loading.show();
                    Itsm.querySla($scope.searchPage.data,function(rows){
                        Loading.hide();
                        $scope.listPage.data =rows;
                        fnCallback({total:rows.length,rows:rows});
                    },function(data){Loading.hide();});
                }
            }
        };
        $scope.listPage.settings = {
            reload : null,
            getData:$scope.listPage.action.search, //getData应指定获取数据的函数
            columns : [
                {
                    sTitle: "工单类型",
                    mData:"processType",
                    mRender:function(mData,type,full) {
                        var nn=mData=='incident'?'故障工单':(mData=='problem'?'问题工单':'变更工单')
                        return Util.str2Html(nn);
                    }
                },
                {
                    sTitle: "优先级",
                    mData:"priority",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "超时时间(小时)",
                    mData:"time",
                    mRender:function(mData,type,full) {
                        var l=parseInt(mData/3600000);
                        return l+"小时";
                    }
                },
                {
                    sTitle: "操作",
                    mData:"id",
                    mRender:function(mData,type,full) {
                        return '<i ng-disabled="loginUserMenuMap[currentView]" title="编辑" class="fa fa-pencil" ng-click="listPage.action.edit(\''+mData+'\')"> </i>' ;
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [0,1,2,3 ] },  //第0、9列不可排序
                { sWidth: "120px", aTargets: [ 3] }
            ] , //定义列的约束
            defaultOrderBy : []
        };
    }]);

    itsmControllers.controller('hideController',['$scope','$rootScope','$location','$timeout','ItsmService','Util','Loading','Tools','OperateService',function($scope,$rootScope,$location,$timeout,Itsm,Util,Loading,Tools,Operate){
        $scope.searchPage = {
            data : {
                processType:"incident",
                limit : 10, //每页条数(即取多少条数据)
                offset : 0 , //从第几条数据开始取
                time1:"",
                time2:"",
                createBy:"",
                orderBy : "applyTime",//排序字段
                orderByType : "desc" //排序顺序
            },
            action:{
                search : function(){
                    $scope.listPage.settings.reload();
                }
            }
        };

        $scope.listPage = {
            data:[],
            checkedList : [],
            checkAllRow : false,
            action : {
                edit:function(id,processType){
                    var cked=angular.element("#ck_"+id).attr("checked");
                    if(cked==undefined || cked==null){

                    }
                    Loading.show();
                    Itsm.saveHide({orderId:id,processType:processType,cked:cked==undefined},function(data){
                        Loading.hide();
                    },function(data){
                        Loading.hide();
                    });
                },
                search: function (search,fnCallback) {
                    $scope.searchPage.data.limit = search.limit;
                    $scope.searchPage.data.offset = search.offset;
                    $scope.searchPage.data.orderBy = search.orderBy;
                    $scope.searchPage.data.orderByType = search.orderByType;
                    Loading.show();
                    Itsm.queryHide($scope.searchPage.data,function(data){
                        Loading.hide();
                        $scope.listPage.data =data.rows;
                        fnCallback(data);
                    },function(data){Loading.hide();});
                }
            }
        };
        $scope.listPage.settings = {
            reload : null,
            getData:$scope.listPage.action.search, //getData应指定获取数据的函数
            columns : [
                {
                    sTitle: "显示/隐藏",
                    mData:"orderId",
                    mRender:function(mData,type,full) {
                        if(full.userId==null)
                            return '<input type="checkbox" class="ace ace-switch ace-switch-4 ng-valid ng-dirty" id="ck_'+mData+'" checked="checked" ng-click="listPage.action.edit('+mData+',\''+full.processType+'\')"><span class="lbl"></span>';
                        else
                            return '<input type="checkbox" class="ace ace-switch ace-switch-4 ng-valid ng-dirty" id="ck_'+mData+'"  ng-click="listPage.action.edit('+mData+',\''+full.processType+'\')"><span class="lbl"></span>';
                    }
                },
                {
                    sTitle: "工单类型",
                    mData:"processType",
                    mRender:function(mData,type,full) {
                        var nn=mData=='incident'?'故障工单':(mData=='problem'?'问题工单':'变更工单')
                        return Util.str2Html(nn);
                    }
                },
                {
                    sTitle: "工单号",
                    mData:"orderDescId",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "标题",
                    mData:"title",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "创建时段",
                    mData:"applyTime",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [0 ] },  //第0、9列不可排序
                { sWidth: "100px", aTargets: [ 0] },
                { sWidth: "140px", aTargets: [ 4] }
            ] , //定义列的约束
            defaultOrderBy : []
        };
    }]);
})(angular);
