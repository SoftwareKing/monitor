(function(angular){
    var system = angular.module('user',['ngResource']);
    var app_path="/dmonitor-webapi";

    system.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/user',{
            templateUrl:'views/user/user.html',
            controller:'userController'});
        $routeProvider.when('/role',{
            templateUrl:'views/user/role.html',
            controller:'roleController'});
        $routeProvider.when('/construct',{
            templateUrl:'views/user/depart.html'});
        $routeProvider.when('/communicateSetting',{
            templateUrl:'views/user/message.html',
            controller:'messageController'});
        $routeProvider.when('/usergroup',{
            templateUrl:'views/user/usergroup.html'});
    }]);
    system.directive('dialog',['Util',function(Util) {
        return {
            restrict: 'AE',
            transclude:true,
            scope: {
                dialog: '=info',
                model: '=data'
            },
            templateUrl: 'templates/user/dialog.html',
            link: function(scope, element, attrs) {

            }
        };
    }]);

    system.directive('editZtree',["$compile","$timeout","Util",function($compile,$timeout,Util){
        return {
            link:function(scope, element, attrs) {
                var ztreeId=attrs.id;
                var ztreeData=Util.getValue(attrs.editZtree,scope);
                var zTreeOnClick=function(event, treeId, treeNode){
                    if(treeNode.id && treeNode.id>0){
                        ztreeData.active(treeNode);
                    }
                };
                var settings={
                    view: {
                        addHoverDom: function(treeId, treeNode){
                            var sObj = angular.element("#" + treeNode.tId + "_a");
                            if (angular.element("#addBtn_"+treeNode.tId).length==0 && (treeNode.isJF==null || treeNode.isJF==false)){
                                var add =$("<span class='button add' id='addBtn_" + treeNode.tId
                                    + "' title='添加节点' onfocus='this.blur();'></span>");
                                sObj.append(add);
                                add.bind("click", function(){
                                    ztreeData.add(treeNode);
                                });
                            };

                            if (angular.element("#editBtn_"+treeNode.tId).length==0 && (treeNode.delete==null || treeNode.delete==false)){
                                var edit =$("<span class='button edit' id='editBtn_" + treeNode.tId
                                    + "' title='编辑节点' onfocus='this.blur();'></span>");
                                sObj.append(edit);
                                edit.bind("click", function(){
                                    ztreeData.edit(treeNode);
                                });
                            };

                            if (angular.element("#removeBtn_"+treeNode.tId).length==0 && (treeNode.delete==null || treeNode.delete==false)){
                                var remove =$("<span class='button remove' id='removeBtn_" + treeNode.tId
                                    + "' title='删除节点' onfocus='this.blur();'></span>");
                                sObj.append(remove);
                                remove.bind("click", function(){
                                    ztreeData.remove(treeNode);
                                });
                            };
                        },
                        removeHoverDom:function(treeId, treeNode){
                            angular.element("#addBtn_"+treeNode.tId).unbind().remove();
                            angular.element("#editBtn_"+treeNode.tId).unbind().remove();
                            angular.element("#removeBtn_"+treeNode.tId).unbind().remove();
                        },
                        selectedMulti: false
                    },
                    callback: {
                        onClick:zTreeOnClick
                    }
                };
                var initData=function(){
                    ztreeData=Util.getValue(attrs.editZtree,scope);
                    if(ztreeData.hideButton){
                        settings.view={};
                    }
                    if(ztreeData.settingData){
                        settings.data=ztreeData.settingData;
                    }
                    var treeObj =angular.element.fn.zTree.init(angular.element("#"+attrs.id), settings,ztreeData.data);
                    //treeObj.expandAll(true);
                    var nodes=treeObj.getNodes();
                    if(nodes.length>0)treeObj.expandNode(nodes[0]);
                };
                return scope.$watch(attrs.editZtree,function(){
                    $timeout(initData,200);
                },true);
            }
        };
    }]);

    system.directive('userZtree',["Util", function(Util) {
        return {
            restrict: 'AE',
            transclude:false,
            link: function(scope, element, attrs) {
                var ztreeData=Util.getValue(attrs.userZtree,scope);
                var on_treeData_change=function(){
                    var setting = {
                        view: {
                            selectedMulti: true
                        },
                        data:ztreeData.settingData?ztreeData.settingData:{},
                        callback: {
                            beforeClick: function(treeId, treeNode){
                                if(ztreeData.crossParent==null){
                                    if(treeNode.isParent){
                                        return false;
                                    }
                                }
                                click(treeNode);
                                return true;
                            },
                            onClick:function(event, treeId, treeNode){
                                var zTree =angular.element.fn.zTree.getZTreeObj(ztreeData.treeId)
                                zTree.checkNode(treeNode, true, true);
                            },
                            beforeAsync:function(){
                                return true;
                            },
                            onCheck:function(event, treeId, treeNode){
                                check();
                            },
                            onExpand:function(event, treeId, treeNode){
                                if(ztreeData.onExpand){
                                    ztreeData.onExpand(treeNode)
                                }
                            },
                            onAsyncSuccess:function(event, treeId, treeNode, msg) {
                                if(ztreeData.checked){
                                    var zTree =angular.element.fn.zTree.getZTreeObj(ztreeData.treeId);
                                    zTree.checkAllNodes(false);
                                    var ids=ztreeData.checked.split(",");
                                    for(var i=0;i<ids.length;i++){
                                        var node =zTree.getNodeByParam("id",ids[i], null);
                                        if(node){
                                            zTree.checkNode(node, true,true);
                                        }
                                    }
                                }
                            }
                        }
                    };
                    if(ztreeData.checkbox=="all"){
                        var checkAccessories=function(treeNode, btn) {
                            var r = document.getElementsByName("radio_"+treeNode.id);
                            if(r.length>0){
                                var checkedRadio = getCheckedRadio("radio_"+treeNode.id);
                                if (btn.attr("checked")) {
                                    if (!checkedRadio) {
                                        $("#radio_" + treeNode.children[0].id).attr("checked", true);
                                    }
                                } else {
                                    if (!checkedRadio)
                                        checkedRadio.attr("checked", false);
                                }
                            }else{
                                if (btn.attr("checked")) {
                                    $(":checkbox[name='checkbox_"+treeNode.id+"']").attr("checked", true);
                                } else {
                                    $(":checkbox[name='checkbox_"+treeNode.id+"']").removeAttr("checked");
                                }
                                $(":checkbox[name='checkbox_"+treeNode.id+"']").each(function(){
                                    $(this).change();
                                });
                            }
                        };
                        var checkBrand=function(treeNode, btn) {
                            if (btn.attr("checked")) {
                                var pObj = $("#checkbox_" + treeNode.getParentNode().id);
                                if (!pObj.attr("checked")) {
                                    pObj.attr("checked", true);
                                }
                            }
                        };
                        var getCheckedRadio=function (radioName) {
                            var r = document.getElementsByName(radioName);
                            for(var i=0; i<r.length; i++)    {
                                if(r[i].checked)    {
                                    return $(r[i]);
                                }
                            }
                            return null;
                        };

                        setting.view ={
                            addDiyDom: function(treeId, treeNode) {
                                var aObj = $("#" + treeNode.tId + "_a");
                                if (treeNode.level != ztreeData.level) {
                                    var pid=0;
                                    if(treeNode.getParentNode()){
                                        pid=treeNode.getParentNode().id;
                                    }
                                    var editStr = "<input type='checkbox' class='checkboxBtn' id='checkbox_" +treeNode.id+ "' name='checkbox_"+pid+"' onfocus='this.blur();'></input>";
                                    aObj.before(editStr);
                                    var btn = $("#checkbox_"+treeNode.id);
                                    if (btn) btn.bind("change", function() {checkAccessories(treeNode, btn);});
                                } else if (treeNode.level == ztreeData.level) {
                                    var editStr = "<input type='radio' class='radioBtn' id='radio_" +treeNode.id+ "' name='radio_"+treeNode.getParentNode().id+"' onfocus='this.blur();'></input>";
                                    aObj.before(editStr);
                                    var btn = $("#radio_"+treeNode.id);
                                    if (btn) btn.bind("click", function() {checkBrand(treeNode, btn);});
                                }
                            }
                        };
                    }else if(ztreeData.checkbox){
                        setting.check={
                            enable: true,
                            chkboxType: ztreeData.checkType?ztreeData.checkType:{"Y" : "s", "N" : "ps"},
                            chkStyle :ztreeData.checkbox=='radio'?'radio':'checkbox'
                        };
                        if(ztreeData.checkbox=='radio'){
                            setting.check.radioType="all";
                        }
                    }
                    angular.element.fn.zTree.init(angular.element("#"+ztreeData.treeId), setting,ztreeData.data);
                };
                var click=function(node){
                    if(ztreeData.treeClick){
                        ztreeData.treeClick(node);
                    }
                };
                var check=function(){
                    if(ztreeData.onCheck){
                        var treeObj = angular.element.fn.zTree.getZTreeObj(ztreeData.treeId);
                        var nodes =treeObj.getCheckedNodes(true);
                        ztreeData.onCheck(nodes);
                    }
                };
                return scope.$watch(attrs.userZtree, on_treeData_change, true);
            }
        };
    }]);
    system.factory('UserService',['$resource',function(resource){
        return resource(app_path+"/users/:id",{},{
            getUsers:{method:'GET',isArray:false},
            add:{method:'POST',url:app_path+"/users",isArray:false},
            remove:{method:'DELETE',isArray:false},
            removeBatch:{method:'DELETE',url:app_path+"/users/delete",isArray:false},
            editPass:{method:'POST',url:app_path+"/users/editPass",isArray:false},
            edit:{method:'PUT',isArray:false}
        });
    }])
        .factory('DepartService',['$resource',function(resource){
            return resource(app_path+"/department/:id",{},{
                getDeparts:{method:'GET',url:app_path+"/operation/departTree",isArray:true},
                add:{method:'POST',url:app_path+"/department",isArray:false},
                remove:{method:'DELETE',isArray:false},
                move:{method:'GET',url:app_path+"/department/move",isArray:false},
                edit:{method:'PUT',isArray:false}
            });
        }])
        .factory('UserGroupService',['$resource',function(resource){
            return resource(app_path+"/usergroup",{},{
                query:{method:'GET',isArray:false},
                add:{method:'POST',isArray:false},
                remove:{method:'DELETE',isArray:false},
                edit:{method:'PUT',isArray:false}
            });
        }])
        .factory('RoleService',['$resource',function(resource){
            return resource(app_path+"/roles/:id",{},{
                getMenus:{url:app_path+"/roles/getMenus",method:'GET',isArray:true},
                getRoles:{method:'GET',isArray:false},
                getUserRoles:{url:app_path+"/roles/getRoles",method:'GET',isArray:true},
                add:{method:'POST',isArray:false},
                remove:{method:'DELETE',isArray:false},
                removeBatch:{method:'DELETE',url:app_path+"/roles/delete",isArray:false},
                edit:{method:'PUT',isArray:false}
            });
        }])
        .factory('OperateService',['$resource',function(resource){
            return resource('',{},{
                getDepartUsers:{method:'GET',url:app_path+"/operation/departUserTree",isArray:true},
                getGroupUsers:{method:'GET',url:app_path+"/operation/groupUserTree",isArray:true},
                getMenus:{method:'GET',url:app_path+"/operation/menuTree",isArray:true},
                getLocs:{method:'GET',url:app_path+"/operation/locTree",isArray:true},
                getUserLocs:{method:'GET',url:app_path+"/operation/userLocTree",isArray:true},
                getLocLevel:{method:'GET',url:app_path+"/operation/userLocLevel",isArray:false},
                getMocs:{method:'GET',url:app_path+"/operation/mocTree",isArray:true},
                getMos:{method:'GET',url:app_path+"/operation/moTree",isArray:true},
                getUsers:{method:'GET',url:app_path+"/users",isArray:false}
            });
        }])
        .factory('MetricService',['$resource',function(resource){
            return resource('',{},{
                getTypes:{method:'GET',url:app_path+"data/user/types.json",isArray:true}
            });
        }])
        .factory('SmsService',['$resource',function(resource){
            return resource('',{},{
                emailConfig: {method:'GET',url:app_path+"/notify/mail", isArray:false},
                messageConfig: {method:'GET',url:app_path+"/notify/sms", isArray:false},
                emailAdd: {method:'POST',url:app_path+"/notify/mail", isArray:false},
                emailTest: {method:'POST',url:app_path+"/notify/mail/test", isArray:false},
                messageTest: {method:'POST',url:app_path+"/notify/sms/test", isArray:false},
                messageAdd: {method:'POST',url:app_path+"/notify/sms", isArray:false}
            });
        }]);
    system.service('Tools',['$parse','$timeout',function($parse,$timeout){
        this.dialog=function(dialog){
            dialog.show=function(){
                angular.element('#'+dialog.id).modal('show');
            };
            dialog.hide=function(){
                angular.element('#'+dialog.id).modal('hide');
            };
            return dialog;
        };
        this.stripScript=function(s) {
            if(s==null)return null;
            var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）—|{}【】‘；：”“'。，、？]")
            var rs = "";
            for (var i = 0; i < s.length; i++) {
                rs = rs + s.substr(i, 1).replace(pattern, '');
            }
            return rs;
        }
    }]);

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

    system.controller('messageController',['$scope','$rootScope','$location','SmsService','Tools','$timeout',function($scope,$rootScope,$location,Sms,Tools,$timeout) {
        $scope.model=Sms.messageConfig();
        $scope.add=function(){
            $rootScope.$confirm("确定要保存吗？",function(){
                Sms.messageAdd($scope.model,function(data){
                    if(data && data.result=="success"){
                        $rootScope.$alert("保存成功");
                    }else{
                        $rootScope.$alert("保存失败");
                    }
                });
            },"提示");
        };
        $scope.test=function(){
            Sms.messageTest($scope.model,function(data){
                if(data && data.result=="success"){
                    $rootScope.$alert("测试成功");
                }else{
                    $rootScope.$alert("测试失败");
                }
            });
        };
    }]);

    system.controller('emailController',['$scope','$rootScope','$location','SmsService','Tools','$timeout',function($scope,$rootScope,$location,Sms,Tools,$timeout) {
        $scope.email={};
        Sms.emailConfig(function(data){
            $scope.email=data;
        });
        $scope.addEmail=function(){
            $rootScope.$confirm("确定要保存吗？",function(){
                Sms.emailAdd($scope.email,function(data){
                    if(data && data.result=="success"){
                        $rootScope.$alert("保存成功");
                    }else{
                        $rootScope.$alert("保存失败");
                    }
                });
            },"提示");
        };
        $scope.testEmail=function(){
            Sms.emailTest($scope.email,function(data){
                if(data && data.result=="success"){
                    $rootScope.$alert("测试成功");
                }else{
                    $rootScope.$alert("测试失败");
                }
            });
        };
    }]);

    system.controller('roleController',['$scope','$rootScope','$location','UserService','RoleService','OperateService','DepartService','MetricService','Util','Tools','$timeout','Loading',function($scope,$rootScope,$location,User,Role,Operate,Depart,Metric,Util,Tools,$timeout,Loading){

        $scope.searchPage = {
            init : function(){
                $scope.searchPage.data = {
                    name:"",
                    active:"",
                    interval:"",
                    level:[1,2,3,4,5],
                    categoryId:"",
                    resourceTypeId:"",
                    metricId : "",
                    moId : "",
                    limit : 20, //每页条数(即取多少条数据)
                    offset : 0 , //从第几条数据开始取
                    orderBy : "updateTime",//排序字段
                    orderByType : "desc" //排序顺序
                }
            },
            checkAllLevel:false,
            resourceTypes:[],
            metrics:[],
            mos:[]
        };
        $scope.searchPage.action={};
        $scope.searchPage.action.search = function(){
            $scope.listPage.settings.reload();
        };
        $scope.locMap={};
        $scope.searchPage.init();
        $scope.roleDailog=Tools.dialog({
            id:"roleDialog",
            title:"角色维护",
            hiddenButton:true,
            mocs:[],
            allMocs:[],
            menuScope:"0",
            selectedMoc:[],
            selectedMap:{},
            selectedMo:[],
            currentMoc:null,
            initMos:{},
            mos:{},
            noCheckedMoc:"",
            model:{},
            locTree:{
                data:[],
                checked:"",
                treeId: 'locTree',
                checkType: { "Y" : "", "N" : "" },
                checkbox: "radio",
                onCheck:function(nodes){
                    $scope.roleDailog.model.locId=null;
                    if(nodes.length>0)$scope.roleDailog.model.locId=nodes[0].id;
                    $scope.$apply();
                }
            },
            menuTree:{
                data:[],
                returnData:[],
                checkType: { "Y" : "ps", "N" : "ps" },
                checked:"",
                treeId: 'menuTree',
                checkbox: "true",
                level:2,
                treeClick:function(){},
                onCheck:function(nodes){}
            },
            moTree:{
                data:[],
                returnData:[],
                checked:"",
                checkType: { "Y" : "ps", "N" : "ps" },
                treeId: 'moTree1',
                checkbox: "true",
                treeClick:function(){},
                onCheck:function(){}
            },
            initMenuTree:function(){
                Operate.getMenus(function(data){
                    for(var i=0;i<data.length;i++){
                        if(data[i].code=="overview"){
                            data[i].checked=true;
                            data[i].chkDisabled=true;
                            break;
                        }
                    }
                    $scope.roleDailog.menuTree.data=data;
                });
                Operate.getMocs(function(data){
                    $scope.roleDailog.allMocs=[];
                    if(data && data.length>0){
                        $scope.roleDailog.mocs=data;
                        for(var i=0;i<data.length;i++){
                            var subs=data[i].children;
                            for(var j= 0;j<subs.length;j++){
                                $scope.roleDailog.allMocs.push(subs[j]);
                            }
                        }

                        $timeout(function(){
                            //$scope.showTab(data[0].id);
                            angular.element(".tab-title>span").first().click();
                        },1000);
                    }
                });
                Operate.getUserLocs(function(data){
                    var foreach=function(children){
                        for(var i=0;i<children.length;i++){
                            $scope.locMap[children[i].id]=children[i].name;
                            if(children[i].children && children[i].children.length>0){
                                foreach(children[i].children);
                            }
                        }
                    }
                    foreach(data);
                    $scope.roleDailog.locTree.data=data;
                });
            },
            save:function(){
                var mos=getInMos();
                $scope.roleDailog.model.mos=mos;
                var menus=getInMenus();
                $scope.roleDailog.model.menus=menus;
                $scope.roleDailog.model.name=$scope.roleDailog.model.name;
                Loading.show();
                if($scope.roleDailog.model.id){
                    Role.edit($scope.roleDailog.model,function(data){
                        Loading.hide();
                        if(data.result=="success"){
                            $scope.listPage.settings.reload();
                            $scope.roleDailog.hide();
                        }
                    },function(data){
                        Loading.hide();
                    });
                    return;
                }
                Role.add($scope.roleDailog.model,function(data){
                    Loading.hide();
                    if(data.result=="success"){
                        $scope.listPage.settings.reload();
                        $scope.roleDailog.hide();
                    }
                },function(data){
                    Loading.hide();
                });
            }
        });
        $scope.roleDailog.initMenuTree();

        $scope.topoNotInMos=function(topoid){
            for(var x=0;x<$scope.roleDailog.model.mos.length;x++){
                var moId=$scope.roleDailog.model.mos[x].moId;
                if($scope.roleDailog.model.mos[x].scope==2 && topoid==moId){
                    return false;
                }
            }
            return true;
        };

        $scope.showTab=function(id){
            $scope.roleDailog.currentMoc=id;
            var moTreeObj = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.moTree.treeId);
            var nodes=moTreeObj.getNodes();
            var cid="c_"+id;
            for(var i=0;i<nodes.length;i++){
                var node=nodes[i];
                var isCheck=findMo(node.id.substring(2,node.id.length));
                if(node.pid==cid && !isCheck){
                    moTreeObj.showNode(node);
                    if($scope.roleDailog.model.id && id=="-1"){
                        var topos=moTreeObj.getCheckedNodes(true);
                        for(var j=0;j<topos.length;j++){
                            var topoid=topos[j].id+"";
                            if(topoid.indexOf("_")>-1){
                                topoid=topoid.substring(2,topoid.length);
                                if(topos[j].isParent)continue;
                                if($scope.topoNotInMos(topoid)){
                                    moTreeObj.checkNode(topos[j],false,false);
                                }else{
                                    moTreeObj.checkNode(topos[j],true,false);
                                }
                            }
                        }
                        for(var j=0;j<topos.length;j++){
                            var topoid=topos[j].id+"";
                            if(topoid.indexOf("_")>-1) {
                                topoid = topoid.substring(2, topoid.length);
                                if (!topos[j].isParent)continue;
                                if ($scope.topoNotInMos(topoid)) {
                                    moTreeObj.checkNode(topos[j], false, false);
                                } else {
                                    moTreeObj.checkNode(topos[j], true, false);
                                }
                            }
                        }
                    }
                }else{
                    moTreeObj.hideNode(node);
                }
            }
            if($scope.roleDailog.model.id==null){
                var nodess=moTreeObj.getCheckedNodes(true);
                for(var x=0;x<nodess.length;x++){
                    if(nodess[x].chkv){
                        nodess[x].checked=false;
                        nodess[x].chkv=false;
                        moTreeObj.updateNode(nodess[x],false);
                    }
                }
            }
        };

        $scope.showTab2=function(id){
            $scope.roleDailog.currentMoc=id;
            var moTreeObj = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.moTree.treeId);
            var nodes=moTreeObj.getNodes();
            var cid="c_"+id;
            for(var i=0;i<nodes.length;i++){
                var node=nodes[i];
                moTreeObj.hideNode(node);
            }
        };

        var findMo=function(id){
            for(var i=0;i<$scope.roleDailog.selectedMoc.length;i++){
                if(id==$scope.roleDailog.selectedMoc[i]){
                    return true;
                }
            }
            return false;
        };
        var findMoInMap=function(id){
            if($scope.roleDailog.selectedMap[id]) return true;
            else return false;
        };
        $scope.checkMo=function(id,state){
            var isCheck;
            var time=0;
            if(state)isCheck=findMo(id);
            else isCheck=!findMo(id);
            if($scope.roleDailog.mos[id]==null && !isCheck ){
                $scope.showMos(id);
                if(state)time=100;
            }else if(isCheck && $scope.roleDailog.mos[id]!=null){
                var moTreeObj = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.moTree.treeId);
                var node=moTreeObj.getNodeByParam("id", "c_"+id);
                moTreeObj.checkNode(node,false,true);
                moTreeObj.hideNode(node);
                $scope.roleDailog.initMos[id]=true;
            }else{
                var moTreeObj = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.moTree.treeId);
                var node=moTreeObj.getNodeByParam("id", "c_"+id);
                moTreeObj.showNode(node);
                if($scope.roleDailog.model.id==null){
                    var nodes=moTreeObj.getCheckedNodes(true);
                    for(var x=0;x<nodes.length;x++){
                        if(nodes[x].chks || nodes[x].checked){
                            nodes[x].checked=false;
                            nodes[x].chks=false;
                            moTreeObj.updateNode(nodes[x],true);
                        }
                    }
                }
                $scope.roleDailog.initMos[id]=true;
            }
            return time;
        };

        $scope.$watch("roleDailog.model.locId",function(newValue,oldValue){
            if(newValue && oldValue && newValue!=oldValue){
                $scope.roleDailog.selectedMoc=[];
                for(var i=0;i<$scope.roleDailog.allMocs.length;i++){
                    $scope.roleDailog.selectedMoc[i]=$scope.roleDailog.allMocs[i].id;
                }
                $scope.roleDailog.initMos=[];
                $scope.roleDailog.mos=[];
                $scope.roleDailog.moTree.data=[];
                var moTreeObj = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.moTree.treeId);
                var nodes=moTreeObj.getNodes();
                for(var i=0;i<nodes.length;i++){
                    moTreeObj.removeNode(nodes[i]);
                }
            }
        },true);

        $scope.showMos=function(id){
            Operate.getMos({mocId:id,locId:$scope.roleDailog.model.locId},function(data){
                $scope.roleDailog.initMos[id]=true;
                $scope.roleDailog.mos[id]=id;
                if(data && data.length>0){
                    var moTreeObj = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.moTree.treeId);
                    var nodes=new Array();
                    for(var i=0;i<data.length;i++){
                        nodes.push(data[i]);
                    }
                    moTreeObj.addNodes(null,nodes);
                }
            });
        };

        var getInMos=function(){
            var moTreeObj = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.moTree.treeId);
            var moNodes =moTreeObj.transformToArray(moTreeObj.getNodes());
            var mos=new Array();
            for(var i=0;i<$scope.roleDailog.selectedMoc.length;i++){
                mos[mos.length]={moId:$scope.roleDailog.selectedMoc[i],scope:0};
            }
            for(var i= 0;i<moNodes.length;i++){
                var node=moNodes[i];
                if(node.level>0 && node.checked){
                    var id=node.id+"";
                    if(id.indexOf("_")>-1){
                        var tid=0;
                        if(id.substring(0,1)=="t")
                            tid=2;
                        else if (id.substring(0,1)=="g")
                            tid=-2;
                        else if(id.substring(0,1)=="r")
                            tid=-3;
                        mos[mos.length]={moId:parseInt(id.substring(2,id.length)),scope:tid};
                    }else
                        mos[mos.length]={moId:node.id,scope:1};
                }
            }
            return mos;
        };

        var getInMenus=function(){
            var treeObj = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.menuTree.treeId);
            var allNodes = treeObj.transformToArray(treeObj.getNodes());
            var nodes=new Array();
            for(var i=0;i<allNodes.length;i++){
                var node=allNodes[i];
                var s=node.getCheckStatus();
                if(s==null){
                    nodes.push(node);
                }else if(s.checked || s.half){
                    nodes.push(node);
                }
            }
            var menus=new Array();
            for(var i=0;i<nodes.length;i++){
                var id=nodes[i].id;
                menus[menus.length]={menuId:id,permission:$scope.roleDailog.menuScope==0?false:true};
            }
            return menus;
        };

        var clearTree=function(){
            var treeObj = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.menuTree.treeId);
            treeObj.checkAllNodes(false);
            var moTreeObj = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.moTree.treeId);
            moTreeObj.checkAllNodes(false);
            $scope.roleDailog.selectedMoc=[];
            $scope.roleDailog.selectedMap={};

        };

        var checkTree=function(model){
            var treeObj = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.menuTree.treeId);
            var moTreeObj = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.moTree.treeId);
            for(var i= 0,c=model.menus.length;i<c;i++){
                var m=model.menus[i];
                var node1=treeObj.getNodeByParam("id", m.menuId);
                treeObj.checkNode(node1,true,false);
                $scope.roleDailog.menuScope=m.permission;
            }
            for(var i= 0,c=model.mos.length;i<c;i++){
                var m=model.mos[i];
                if(m.scope==0){
                    $scope.roleDailog.selectedMap[m.moId]=true;
                }
            }
            $scope.roleDailog.initMos={};
            var firstId= 0;
            for(var i= 0,c=$scope.roleDailog.mocs.length;i<c;i++){
                if(i==0)firstId=$scope.roleDailog.mocs[i].id;
                var subs=$scope.roleDailog.mocs[i].children;
                if(subs){
                    for(var j= 0;j<subs.length;j++){
                        var noCheck=!findMoInMap(subs[j].id)
                        if(noCheck){
                            $scope.roleDailog.initMos[subs[j].id]=false;
                            $scope.checkMo(subs[j].id,true);
                        }
                    }
                }
            }
            moInit(model,firstId,moTreeObj,0);
        };
        var moInit=function(model,firstId,moTreeObj,index){
            index++;
            $timeout(function(){
                var finish=true;
                for(var key in $scope.roleDailog.initMos){
                    if(!$scope.roleDailog.initMos[key]){
                        finish=false;
                        break;
                    }
                }
                if(finish){
                    for(var i= 0,c=model.mos.length;i<c;i++){
                        var m=model.mos[i];
                        if(m.scope==1){
                            var node=moTreeObj.getNodeByParam("id", m.moId);
                            if(node && node.id) moTreeObj.checkNode(node,true,true);
                        }else if(m.scope==2){
                            var node=moTreeObj.getNodeByParam("id", "t_"+m.moId);
                            if(node && node.id) moTreeObj.checkNode(node,true,true);
                        }else if(m.scope==-2){
                            var node=moTreeObj.getNodeByParam("id", "g_"+m.moId);
                            if(node && node.id) moTreeObj.checkNode(node,true,false);
                        }else if(m.scope==-3){
                            var node=moTreeObj.getNodeByParam("id", "r_"+m.moId);
                            if(node && node.id) moTreeObj.checkNode(node,true,true);
                        }
                    }
                    for(var id in $scope.roleDailog.selectedMap){
                        $scope.roleDailog.selectedMoc.push(parseInt(id))
                    }
                    $scope.showTab(firstId);
                    angular.element(".tab-title>span").first().click();
                    if(!$scope.moTreeShow){
                        for(var i=0;i<$scope.roleDailog.allMocs.length;i++){
                            if(findMoc($scope.roleDailog.allMocs[i].id)){
                                $scope.moTreeShow=true;
                                return;
                            }
                        }
                        $scope.moTreeShow=false;
                    }
                }else{
                    if(index>100) return;
                    moInit(model,firstId,moTreeObj);
                }
            },100);
        };


        $scope.moTreeShow=false;

        var findMoc=function(id){
            for(var i=0;i<$scope.roleDailog.selectedMoc.length;i++){
                if(id==$scope.roleDailog.selectedMoc[i])return false;
            }
            return true;
        }

        $scope.$watch("roleDailog.selectedMoc.length",function(n){
            for(var i=0;i<$scope.roleDailog.allMocs.length;i++){
                if(findMoc($scope.roleDailog.allMocs[i].id)){
                    $scope.moTreeShow=true;
                    return;
                }
            }
            $scope.moTreeShow=false;
        },true);
        $scope.listPage = {
            data:[],
            checkedList : [],
            checkAllRow : false,
            action : {
                add: function () {
                    var moTreeObj = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.moTree.treeId);
                    $scope.roleDailog.title="新增";
                    $scope.roleDailog.model={};
                    $scope.roleDailog.show();

                    var rowss=$scope.roleDailog.locTree.data;
                    $scope.roleDailog.locTree.data=[];
                    $timeout(function(){
                        $scope.roleDailog.locTree.data=rowss;
                    },100);

                    $scope.roleDailog.menuScope="0";
                    $scope.roleDailog.noCheckedMoc="";
                    $scope.roleDailog.selectedMoc=[];
                    $scope.roleDailog.selectedMap={};
                    var firstId=0;
                    for(var i=0;i<$scope.roleDailog.mocs.length;i++){
                        var moc=$scope.roleDailog.mocs[i];
                        if(i==0)firstId=moc.id;
                        if(moc.children){
                            for(var j=0;j<moc.children.length;j++){
                                $scope.roleDailog.selectedMoc.push(moc.children[j].id);
                            }
                        }
                    }
                    var nodes=moTreeObj.getCheckedNodes(true);
                    for(var x=0;x<nodes.length;x++){
                        if(nodes[x].checked){
                            nodes[x].chks=true;
                            nodes[x].chkv=true;
                            moTreeObj.updateNode(nodes[x],false);
                        }else{
                            nodes[x].chks=false;
                            nodes[x].chkv=false;
                            moTreeObj.updateNode(nodes[x],false);
                        }
                    }
                    moTreeObj.checkAllNodes(false);
                    var treeObj = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.menuTree.treeId);
                    treeObj.checkAllNodes(true);
                    $scope.showTab2(firstId);
//                    var moTreeObj = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.moTree.treeId);
//                    var nodes=moTreeObj.getNodes();
//                    for(var i=0;i<nodes.length;i++){
//                        var cc=nodes[i].children;
//                        if(nodes[i].checked){
//                            moTreeObj.checkNode(nodes[i],false,false);
//                        }
//                        for(var j=0;j<cc.length;j++){
//                            if(cc[j].checked){
//                                moTreeObj.checkNode(cc[j],false,false);
//                            }
//                        }
//                    }
//                    var nodes=moTreeObj.getNodes();
//                    for(var i=0;i<nodes.length;i++){
//                        var cc=nodes[i].children;
//                        if(nodes[i].checked){
//                            nodes[i].checked=false;
//                            moTreeObj.updateNode(nodes[i],false);
//                        }
//                    }
//                    var nodes=moTreeObj.getNodes();
//                    for(var i=0;i<nodes.length;i++){
//                        var cc=nodes[i].children;
//                        if(nodes[i].checked){
//                            moTreeObj.checkNode(nodes[i],false,false);
//                        }
//                    }
//                    nodes=moTreeObj.getCheckedNodes(true);
//                    for(var i=0;i<nodes.length;i++){
//                        var cc=nodes[i].children;
//                        if(nodes[i].checked){
//                            moTreeObj.checkNode(nodes[i],false,false);
//                        }
//                    }
                    jQuery(".tab-title>span").first().click();
                },
                edit: function (id) {
                    $scope.roleDailog.title="编辑";
                    var model=Util.findFromArray("id",id,$scope.listPage.data);
                    $scope.roleDailog.model=angular.copy(model);
                    $scope.roleDailog.show();

                    if(model.locId){
                        var departObj = angular.element.fn.zTree.getZTreeObj($scope.roleDailog.locTree.treeId);
                        departObj.checkAllNodes(false);
                        var nodes=departObj.getCheckedNodes(false);
                        for(var i=0;i<nodes.length;i++){
                            if(model.locId==nodes[i].id){
                                departObj.checkNode(nodes[i],true,true);
                                break;
                            }
                        }
                    }else{
                        var rowss=$scope.roleDailog.locTree.data;
                        $scope.roleDailog.locTree.data=[];
                        $timeout(function(){
                            $scope.roleDailog.locTree.data=rowss;
                        },100);
                    }

                    clearTree();

                    Role.getMenus({roleId:model.id},function(rows){
                        model['menus']=rows;
                        $scope.roleDailog.model['menus']=rows;
                        checkTree(model);
                    });
                },
                remove: function (id) {
                    var model=Util.findFromArray("id",id,$scope.listPage.data);
                    if(model.name=="admin" || model.name=="知识库经理" || model.name=="变更经理"){
                        $rootScope.$alert("不能删除系统角色");
                        return;
                    }
                    $rootScope.$confirm("确定要删除吗？",function(){
                        Loading.show();
                        Role.remove({id:id},function(data){
                            Loading.hide();
                            $rootScope.$alert("删除成功");
                            if(data.result=="success")
                                $scope.listPage.settings.reload();
                        },function(data){
                            Loading.hide();
                        });
                    },"删除");
                },
                removeAll: function () {
                    var ids=$scope.listPage.checkedList;
                    if(ids==null || ids.length==0){
                        $rootScope.$alert("请选择需要删除的角色");
                        return;
                    }
                    for(var i=0;i<ids.length;i++){
                        var id=ids[i];
                        var model=Util.findFromArray("id",id,$scope.listPage.data);
                        if(model.name=="admin" || model.name=="知识库经理" || model.name=="变更经理"){
                            $rootScope.$alert("不能删除系统角色");
                            return;
                        }
                    }
                    $rootScope.$confirm("确定要删除吗？",function(){
                        Loading.show();
                        Role.removeBatch({ids:ids},function(data){
                            Loading.hide();
                            $rootScope.$alert("删除成功");
                            if(data.result=="success")
                                $scope.listPage.settings.reload();
                        },function(data){
                            Loading.hide();
                        });
                    },"删除");
                },
                search: function (search,fnCallback) {
                    Loading.show();
                    $scope.searchPage.data.limit = search.limit;
                    $scope.searchPage.data.offset = search.offset;
                    $scope.searchPage.data.orderBy = search.orderBy;
                    $scope.searchPage.data.orderByType = search.orderByType;
                    Role.getRoles($scope.searchPage.data,function(data){
                        Loading.hide();
                        $scope.listPage.data =data.rows;
                        fnCallback(data);
                        $scope.listPage.checkedList = [];
                        $scope.listPage.checkAllRow = false;
                    },function(data){Loading.hide();});
                }
            }
        };
        $scope.listPage.settings = {
            reload : null,
            getData:$scope.listPage.action.search, //getData应指定获取数据的函数
            columns : [
                {
                    sTitle: "<div class='checkbox'><label><input type='checkbox' ng-model='listPage.checkAllRow'/><i></i></label></div>",
                    mData:"id",
                    mRender:function(mData,type,full) {
                        return "<div class='checkbox'><label><input type='checkbox' checklist-model='listPage.checkedList' checklist-value='"+mData+"' /><i></i></label></div>"
                    }
                },
                {
                    sTitle: "角色名称",
                    mData:"name",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "备注",
                    mData:"remark",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "所属区域",
                    mData:"locId",
                    mRender:function(mData,type,full) {
                        return Util.str2Html("{{locMap['"+mData+"']}}");
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
                        if(full.name=="admin" || full.name=="知识库经理" || full.name=="变更经理" || full.name=="区县审核人" || full.name=="市州审核人" || full.name=="省审核人"){
                            return '<i title="编辑"  disabled="disabled" class="fa fa-pencil"></i>'
                                +'<i title="删除"  disabled="disabled" class="fa fa-trash-o"></i>';
                        }else {
                            return '<i title="编辑"  ng-disabled="loginUserMenuMap[currentView]" class="fa fa-pencil" ng-click="listPage.action.edit(\''+mData+'\')"> </i>'
                                +'<i title="删除"  ng-disabled="loginUserMenuMap[currentView]" class="fa fa-trash-o" ng-click="listPage.action.remove(\''+mData+'\')">  </i>';
                        }
                    }
                }

            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [0,5 ] },  //第0、9列不可排序
                { sWidth: "38px", aTargets: [ 0 ] },
                { sWidth: "140px", aTargets: [ 4] },
                { sWidth: "100px", aTargets: [ 5] }
            ] , //定义列的约束
            defaultOrderBy : [ ]  //定义默认排序列为第8列倒序
        };
        $scope.$watch("listPage.checkAllRow",function(newVal,oldVal){
            if(newVal){
                $scope.listPage.checkedList = Util.copyArray("id",$scope.listPage.data);
            }else{
                if($scope.listPage.data.length == $scope.listPage.checkedList.length){
                    $scope.listPage.checkedList = [];
                }
            }
            console.log($scope.listPage.checkedList);
        },false);
        $scope.$watch("listPage.checkedList",function(newVal,oldVal){
            $scope.listPage.checkAllRow = newVal && newVal.length>0 && newVal.length==$scope.listPage.data.length;
        },true);
    }]);

    system.controller('departController',['$scope','$rootScope','$location','UserService','DepartService','OperateService','Tools','Util','$timeout','Loading',function($scope,$rootScope,$location,User,Depart,Operate,Tools,Util,$timeout,Loading){

        $scope.departDialog=Tools.dialog({
            depart:{},
            id:"departDialog",

            title:"维护",
            hiddenButton:true,
            model:{},
            node:{
                upDisabled: true,
                downDisabled: true,
                rightDisabled: true,
                leftDisabled: true
            },
            save:function(){
                $scope.departDialog.model.name=$scope.departDialog.model.name;
                $scope.departDialog.model.desc=$scope.departDialog.model.desc;
                var departTreeObj = angular.element.fn.zTree.getZTreeObj($scope.departTree.treeId);
                Loading.show();
                if($scope.departDialog.model.isJF=="1"){
                    $scope.departDialog.model.isJF=1;
                }
                if($scope.departDialog.model.isJF=="0"){
                    $scope.departDialog.model.isJF=0;
                }
                if($scope.departDialog.model.id){
                    Depart.edit($scope.departDialog.model,function(data){
                        Loading.hide();
                        if(data.result=="success"){
                            var node=departTreeObj.getNodeByParam("id",$scope.departDialog.model.id);
                            node.name=$scope.departDialog.model.name;
                            node.desc=$scope.departDialog.model.desc;
                            if(node.display.indexOf("(")>-1){
                                node.display=$scope.departDialog.model.name+(node.display.substring(node.display.indexOf("("),node.display.length));
                            }else{
                                node.display=$scope.departDialog.model.name;
                            }
                            node.orgLevel=$scope.departDialog.model.orgLevel;
                            node.remark=$scope.departDialog.model.remark;
                            node.isJF=$scope.departDialog.model.isJF;
                            departTreeObj.updateNode(node);
                            $scope.departDialog.hide();
                        }
                    },function(data){
                        Loading.hide();
                    });
                    return;
                }
                Depart.add($scope.departDialog.model,function(data){
                    Loading.hide();
                    if(data.result=="success"){
                        var node=data.bean;
                        node.display=$scope.departDialog.model.name+"(0)";
                        var pnode=departTreeObj.getNodeByParam("id",$scope.departDialog.model.pid);
                        departTreeObj.addNodes(pnode,node);
                        $scope.departDialog.hide();
                    }
                },function(data){
                    Loading.hide();
                });
            },
            isShow: function (node) {
                var next = node.getNextNode();
                var prev = node.getPreNode();
                var parent = node.getParentNode();
                if (next) $scope.departDialog.node.downDisabled = false;
                else $scope.departDialog.node.downDisabled = true;
                if (prev) $scope.departDialog.node.upDisabled = false;
                else $scope.departDialog.node.upDisabled = true;
                if (prev) $scope.departDialog.node.rightDisabled = false;
                else $scope.departDialog.node.rightDisabled = true;
                if (parent) $scope.departDialog.node.leftDisabled = false;
                else $scope.departDialog.node.leftDisabled = true;
                //$scope.$apply();
            },
            moveTreeNode: function (id, direction, depart) {
                var departTreeObj = angular.element.fn.zTree.getZTreeObj($scope.departTree.treeId);
                var allNodes = departTreeObj.transformToArray(departTreeObj.getNodes());
                var currentNode, currentParentNode, currentPrevNode, currentNextNode, currentLastParentNode;
                var prevSort = -1, nextSort = 10000;
                for (var i = 0; i < allNodes.length; i++) {
                    if (allNodes[i].id == id) {
                        currentNode = allNodes[i];
                        for (var j = 0; j < allNodes.length; j++) {
                            if (allNodes[j].pid == currentNode.pid) {
                                if (allNodes[j].orderBy < currentNode.orderBy && allNodes[j].orderBy > prevSort) {
                                    currentPrevNode = allNodes[j];
                                    prevSort = allNodes[j].orderBy;
                                }
                                if (allNodes[j].orderBy > currentNode.orderBy && allNodes[j].orderBy < nextSort) {
                                    currentNextNode = allNodes[j];
                                    nextSort = allNodes[j].orderBy;
                                }
                            }
                            if (allNodes[j].id == currentNode.pid) {
                                currentParentNode = allNodes[j];
                                currentLastParentNode = allNodes[j];
                                for (var z = 0; z < allNodes.length; z++){
                                    if (allNodes[z].pid == currentParentNode.pid && allNodes[z].orderBy > currentLastParentNode.orderBy) {
                                        currentLastParentNode = allNodes[z];
                                    }
                                }
                            }
                        }
                    }
                }
                if (direction == "up") {
                    if (currentNode != null && currentPrevNode != null){
                        var tmpSort = currentPrevNode.orderBy;
                        if (tmpSort == depart.orderBy) {
                            currentPrevNode.orderBy = currentNode.orderBy;
                            departTreeObj.updateNode(currentPrevNode);
                            currentNode.orderBy = tmpSort;
                            departTreeObj.updateNode(currentNode);
                            departTreeObj.moveNode(currentPrevNode, currentNode, "prev");
                            $scope.departDialog.isShow(currentNode);
                        }
                    }
                }
                if (direction == "down") {
                    if (currentNode != null && currentNextNode != null) {
                        var tmpSort = currentNextNode.orderBy;
                        if (tmpSort == depart.orderBy) {
                            currentNextNode.orderBy = currentNode.orderBy;
                            departTreeObj.updateNode(currentNextNode);
                            currentNode.orderBy = tmpSort;
                            departTreeObj.updateNode(currentNode);
                            departTreeObj.moveNode(currentNextNode, currentNode, "next");
                            $scope.departDialog.isShow(currentNode);
                        }
                    }
                }
                if (direction == "in") {
                    if (currentNode != null && currentPrevNode != null) {
                        currentNode.pid = currentPrevNode.id;
                        currentNode.sort = depart.orderBy;
                        if (currentNode.pid == depart.pid) {
                            departTreeObj.updateNode(currentNode);
                            departTreeObj.moveNode(currentPrevNode, currentNode, "inner");
                            $scope.departDialog.isShow(currentNode);
                        }
                    }
                }
                if (direction == "out") {
                    if (currentNode != null && currentParentNode != null) {
                        currentNode.pid = currentParentNode.pid;
                        currentNode.orderBy = depart.orderBy;
                        if (currentNode.pid == depart.pid && (depart.orderBy == (currentLastParentNode.orderBy + 1))) {
                            departTreeObj.updateNode(currentNode);
                            departTreeObj.moveNode(currentLastParentNode, currentNode, "next");
                            $scope.departDialog.isShow(currentNode);
                        }
                    }
                }
            },
            arrow: function (op) {
                Depart.move({id: $scope.searchPage.departId, op: op}, function (depart) {
                    $scope.departDialog.moveTreeNode($scope.searchPage.departId,op,depart);
//                    Depart.getDeparts(function(rows){
//                        $scope.departTree.data=rows;
//                    });
                });
            }
        });
        $scope.departTree={
            treeId:"departTree",
            settingData:{key:{name:"display"}},
            hideButton:false,
            init:function(){
                Operate.getUserLocs({needCount:1,needJf:1},function(data){
                    for(var i=0;i<data.legnth;i++){
                        var row=data[i]
                        for(var j=0;j<row.children.length;j++){
                            row.children[j].open=true;
                        }
                    }
                    $scope.departTree.data=data;
                });
            },
            data:[],
            remove:function(node){
                var tip="确定要删除吗？";
                if(node.isParent){
                    tip="确定要删除该节点及其子节点吗？";
                }
                $rootScope.$confirm(tip,function(){
                    Loading.show();
                    Depart.remove({id:node.id},function(data){
                        Loading.hide();
                        $rootScope.$alert("删除成功");
                        $scope.departDialog.node={
                            upDisabled: true,
                            downDisabled: true,
                            rightDisabled: true,
                            leftDisabled: true
                        };
                        if(data.result=="success"){
                            var treeObj = angular.element.fn.zTree.getZTreeObj($scope.departTree.treeId);
                            treeObj.removeNode(node);
                        }
                    },function(data){
                        Loading.hide();
                    });
                },"删除");
            },
            add:function(node){
                $scope.departDialog.title="新增";
                $scope.departDialog.model={isJF:0,delete:0};
                $scope.departDialog.model.name=null;
                $scope.departDialog.model.remark=null;
                $scope.departDialog.model.desc=null;
                if(node.name.indexOf("省局")>-1){
                    $scope.departDialog.model.orgLevel="省";
                }else if(node.orgLevel=="省"){
                    $scope.departDialog.model.orgLevel="市州";
                }else{
                    $scope.departDialog.model.orgLevel="区县";
                }
                $scope.form.$setPristine();
                if(node) $scope.departDialog.model.pid=node.id;
                $scope.departDialog.show();
            },
            edit:function(node){
                $scope.departDialog.title="编辑";
                $scope.departDialog.model={delete:0,id:node.id,name:node.name,pid:node.pid,desc:node.desc,remark:node.remark,orgLevel:node.orgLevel,isJF:node.isJF==true?1:0};
                $scope.departDialog.show();
            },
            active:function(node){
                $scope.departDialog.depart=node;
                $scope.searchPage.departId=node.id;
                $scope.departDialog.isShow(node);
                $scope.listPage.settings.reload();
            }
        };
        $rootScope.$watch("loginUserMenuMap",function(){
            if($rootScope.loginUserMenuMap && $rootScope.loginUserMenuMap[$rootScope.currentView]!=null){
                $scope.departTree.hideButton=$rootScope.loginUserMenuMap[$rootScope.currentView];
                $scope.departTree.init();
            }
        },true);

        $scope.searchPage={departId:0};
        $scope.listPage = {
            data:[],
            checkedList : [],
            checkAllRow : false,
            action : {
                search: function (search,fnCallback) {
                    $scope.searchPage.limit = search.limit;
                    $scope.searchPage.offset = search.offset;
                    $scope.searchPage.orderBy = search.orderBy;
                    $scope.searchPage.orderByType = search.orderByType;
                    User.getUsers($scope.searchPage,function(data){
                        var rows=data.rows;
                        $scope.listPage.data=rows;
                        fnCallback(data);
                        $scope.listPage.checkedList = [];
                        $scope.listPage.checkAllRow = false;
                    });
                }
            }
        };
        $scope.listPage.settings = {
            reload : null,
            getData:$scope.listPage.action.search, //getData应指定获取数据的函数
            columns : [
                {
                    sTitle: "用户名",
                    mData:"name",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "用户显示名",
                    mData:"realName",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "手机号",
                    mData:"mobile",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "邮箱",
                    mData:"email",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "电话",
                    mData:"phone",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [ ] }
            ] , //定义列的约束
            defaultOrderBy : []  //定义默认排序列为第8列倒序
        };
    }]);
    system.controller('userController',['$scope','$rootScope','$location','UserService','DepartService','RoleService','Util','Tools','Loading','OperateService','$timeout','Loading',function($scope,$rootScope,$location,User,Depart,Role,Util,Tools,Loading,Operate,$timeout,Loading){
        $scope.searchPage = {
            init : function(){
                $scope.searchPage.data = {
                    name:"",
                    departId:null,
                    limit : 20, //每页条数(即取多少条数据)
                    offset : 0 , //从第几条数据开始取
                    orderBy : "updated",//排序字段
                    orderByType : "desc" //排序顺序
                }
            },
            checkAllLevel:false,
            resourceTypes:[],
            metrics:[],
            mos:[]
        };
        $scope.searchPage.action={};
        $scope.searchPage.action.search = function(){
            $scope.listPage.settings.reload();
        };
        $scope.searchPage.init();

        var forEachArray=function(array){
            for(var i=0;i<array.length;i++){
                if(array[i].children && array[i].children.length>0){
                    //array[i].nocheck=true;
                    array[i].open=true;
                    forEachArray(array[i].children)
                }
            }
        }
        $scope.locMap={};
        $scope.userDialog=Tools.dialog({
            id:"userDialog",
            title:"维护用户",
            hiddenButton:true,
            locLevel:"",
            model:{
            },
            roleList:[],
            userRoleList:[],
            groupTree:{
                data:[],
                checked:"",
                treeId: 'groupTree',
                checkType: { "Y" : "s", "N" : "s" },
                checkbox: "true",
                onCheck:function(nodes){
                    var menus=new Array();
                    $scope.userDialog.model.groups=null;
                    for(var i=0;i<nodes.length;i++){
                        var node=nodes[i];
                        if(!node.isParent){
                            menus[menus.length]=nodes[i].id;
                        }
                    }
                    if(menus.length>0)
                        $scope.userDialog.model.groups=menus;
                    $scope.$apply();
                }
            },
            locTree:{
                data:[],
                checked:"",
                treeId: 'locTree',
                checkType: { "Y" : "", "N" : "" },
                checkbox: "radio",
                onCheck:function(nodes){
                    $scope.userDialog.model.mainRoleId=null;
                    $scope.userDialog.model.locId=null;
                    $scope.userDialog.model.roles=new Array();
                    $scope.userDialog.locLevel="";
                    if(nodes.length>0){
                        $scope.userDialog.model.locId=nodes[0].id;
                        $scope.userDialog.locLevel=nodes[0].orgLevel;
                    }
                    $scope.$apply();
                }
            },
            initData:function(){
                Role.getUserRoles(function(data){
                    $scope.userDialog.roleList=data;
                });
                Role.getRoles({limit:100000},function(data){
                    $scope.roleMap={};
                    for(var i=0;i<data.rows.length;i++){
                        var role=data.rows[i];
                        $scope.roleMap[role.id]=role.name;
                    }
                });
                Operate.getGroupUsers(function(data){
                    $scope.userDialog.groupTree.data=data;
                });



                Operate.getUserLocs(function(data){
                    var foreach=function(children){
                        for(var i=0;i<children.length;i++){
                            $scope.locMap[children[i].id]=children[i].name;
                            if(children[i].children && children[i].children.length>0){
                                foreach(children[i].children);
                            }
                        }
                    }
                    foreach(data);
                    $scope.userDialog.locTree.data=data;
                });
            },
            save:function(){
                if($scope.userDialog.model.groups==null)
                    $scope.userDialog.model.groups=[];

                if($scope.userDialog.model.mainRoleId && ($scope.userDialog.model.roles==null || $scope.userDialog.model.roles.length==0)){
                    $scope.userDialog.model.roles=[$scope.userDialog.model.mainRoleId];
                }

                $scope.userDialog.model.name=$scope.userDialog.model.name;
                $scope.userDialog.model.realName=$scope.userDialog.model.realName;

                if($scope.userDialog.model.id){
                    if("admin"==$scope.editUser.name && $scope.userDialog.model.name!="admin"){
                        $rootScope.$alert("不能修改admin用户名");
                        return;
                    }
                    if("******"==$scope.userDialog.model.password){
                        $scope.userDialog.model.password=null;
                    }
                    Loading.show();
                    User.edit($scope.userDialog.model,function(data){
                        Loading.hide();
                        if(data.result=="success"){
                            $scope.listPage.settings.reload();
                            $scope.userDialog.hide();
                        }else{
                            $scope.userDialog.model.password="******";
                        }
                    },function(data){
                        Loading.hide();
                    });
                    return;
                }
                $scope.userDialog.model.flag=true;
                Loading.show();
                User.add($scope.userDialog.model,function(data){
                    Loading.hide();
                    if(data.result=="success"){
                        $scope.listPage.settings.reload();
                        $scope.userDialog.hide();
                    }
                },function(data){
                    Loading.hide();
                });
            }
        });
        $scope.userDialog.initData();
        $scope.editUser={};
        $scope.listPage = {
            data:[],
            checkedList : [],
            checkAllRow : false,
            action : {
                add: function () {
                    $scope.userDialog.title="新增";
                    $scope.userDialog.model={};
                    $scope.userDialog.model.name=null;
                    $scope.userDialog.model.remark=null;
                    $scope.userDialog.model.realName=null;
                    $scope.userDialog.model.phone=null;
                    $scope.userDialog.model.email=null;
                    $scope.userDialog.model.mobile=null;
                    $scope.userDialog.model.password=null;
                    $scope.userDialog.model.roles=[];
                    $scope.userDialog.show();

                    var rowss=$scope.userDialog.locTree.data;
                    $scope.userDialog.locTree.data=[];
                    $timeout(function(){
                        $scope.userDialog.locTree.data=rowss;
                    },100);

                    var groupTree = angular.element.fn.zTree.getZTreeObj($scope.userDialog.groupTree.treeId);
                    groupTree.checkAllNodes(false);
                },
                edit: function (id) {
                    $scope.userDialog.title="编辑";
                    var model=Util.findFromArray("id",id,$scope.listPage.data);
                    var notIn=true;
                    for(var i=0;i<model.roles.length;i++){
                        if(model.roles[i]==model.mainRoleId){
                            notIn=false;break;
                        }
                    }
                    if(notIn)model.mainRoleId=null;
                    $scope.userDialog.prevRoleId=model.mainRoleId;

                    $scope.editUser={id:model.id,name:model.name};
                    model.password="******";
                    $scope.userDialog.model=angular.copy(model);
                    $scope.userDialog.show();

                    if(model.locId){
                        var departObj = angular.element.fn.zTree.getZTreeObj($scope.userDialog.locTree.treeId);
                        departObj.checkAllNodes(false);
                        var nodes=departObj.getCheckedNodes(false);
                        for(var i=0;i<nodes.length;i++){
                            if(model.locId==nodes[i].id){
                                departObj.checkNode(nodes[i],true,true);
                                break;
                            }
                        }
                    }else{
                        var rowss=$scope.userDialog.locTree.data;
                        $scope.userDialog.locTree.data=[];
                        $timeout(function(){
                            $scope.userDialog.locTree.data=rowss;
                        },100);
                    }


                    Operate.getLocLevel({locId:$scope.userDialog.model.locId},function(data){
                       // alert($scope.userDialog.model.locId);
                        $scope.userDialog.locLevel=data.orgLevel;
                    });

                    var groups=model.groups;
                    var ids=",";
                    for(var i=0;i<groups.length;i++){
                        ids+=groups[i]+",";
                    }
                    var groupTree = angular.element.fn.zTree.getZTreeObj($scope.userDialog.groupTree.treeId);
                    groupTree.checkAllNodes(false);
                    var nodes=groupTree.getCheckedNodes(false);
                    for(var i=0;i<nodes.length;i++){
                        if(ids.indexOf(","+nodes[i].id+",")>-1){
                            groupTree.checkNode(nodes[i],true,true);
                        }
                    }
                },
                remove: function (id) {
                    var model=Util.findFromArray("id",id,$scope.listPage.data);
                    if(model.name=="admin"){
                        $rootScope.$alert("不能删除admin用户");
                        return;
                    }
                    $rootScope.$confirm("确定要删除吗？",function(){
                        Loading.show();
                        User.remove({id:id},function(data){
                            Loading.hide();
                            $rootScope.$alert("删除成功");
                            if(data.result=="success")
                                $scope.listPage.settings.reload();
                        },function(data){
                            Loading.hide();
                        });
                    },"删除");
                },
                removeAll: function () {
                    var ids=$scope.listPage.checkedList;
                    if(ids==null || ids.length==0){
                        $rootScope.$alert("请选择需要删除的用户");
                        return;
                    }
                    for(var i=0;i<ids.length;i++){
                        var id=ids[i];
                        var model=Util.findFromArray("id",id,$scope.listPage.data);
                        if(model.name=="admin"){
                            $rootScope.$alert("不能删除admin用户");
                            return;
                        }
                    }
                    $rootScope.$confirm("确定要删除吗？",function(){
                        Loading.show();
                        User.removeBatch({ids:ids},function(data){
                            Loading.hide();
                            $rootScope.$alert("删除成功");
                            if(data.result=="success")
                                $scope.listPage.settings.reload();
                        },function(data){
                            Loading.hide();
                        });
                    },"删除");
                },
                active: function (id,flag) {
                    var model=Util.findFromArray("id",id,$scope.listPage.data);
                    model.flag=flag;
                    User.edit(model,function(data){
                        if(data.result=="success"){
                            $scope.listPage.settings.reload();
                        }
                    });
                },
                search: function (search,fnCallback) {
                    $scope.searchPage.data.limit = search.limit;
                    $scope.searchPage.data.offset = search.offset;
                    $scope.searchPage.data.orderBy = search.orderBy;
                    $scope.searchPage.data.orderByType = search.orderByType;
                    User.getUsers($scope.searchPage.data,function(data){
                        $scope.listPage.data =data.rows;
                        fnCallback(data);
                        $scope.listPage.checkedList = [];
                        $scope.listPage.checkAllRow = false;
                    });
                }
            }
        };

        $scope.changeRole=function(){
            if($scope.userDialog.prevRoleId){
                for(var i=0;i<$scope.userDialog.model.roles.length;i++){
                    if($scope.userDialog.model.roles[i]==$scope.userDialog.prevRoleId){
                        $scope.userDialog.model.roles.remove(i);
                        break;
                    }
                }
            }
            $scope.userDialog.prevRoleId=$scope.userDialog.model.mainRoleId;
            $scope.userDialog.model.roles.push($scope.userDialog.model.mainRoleId);

        };
        $scope.isSelected=function(id){
            if($scope.userDialog.model.roles){
                var rows=$scope.userDialog.model.roles;
                for(var i=0;i<rows.length;i++){
                    if(rows[i]==id) return true;
                }
            }
            return false;
        };

        Array.prototype.remove = function (dx) {
            if (isNaN(dx) || dx > this.length) {
                return false;
            }
            for (var i = 0, n = 0; i < this.length; i++) {
                if (this[i] != this[dx]) {
                    this[n++] = this[i];
                }
            }
            this.length -= 1;
        };

        $scope.checkRole=function(id){
            if($scope.userDialog.model.roles==null){
                $scope.userDialog.model.roles=new Array();
            }
            var ins=false;
            var rows=$scope.userDialog.model.roles;
            for(var i=0;i<rows.length;i++){
                if(rows[i]==id){
                    ins=true;
                    $scope.userDialog.model.roles.remove(i);
                    break;
                };
            }
            if(!ins){$scope.userDialog.model.roles[$scope.userDialog.model.roles.length]=id;}
            return false;
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
                    sTitle: "用户名",
                    mData:"name",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "用户显示名",
                    mData:"realName",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "手机号",
                    mData:"mobile",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "邮箱",
                    mData:"email",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "主角色",
                    mData:"mainRoleId",
                    mRender:function(mData,type,full) {
                        return Util.str2Html("{{roleMap['"+mData+"']}}");
                    }
                },
                {
                    sTitle: "所属区域",
                    mData:"locId",
                    mRender:function(mData,type,full) {
                        return Util.str2Html("{{locMap['"+mData+"']}}");
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
                        if(full.name=='admin'){
                            return '<i title="编辑"  ng-disabled="loginUserMenuMap[currentView] || loginUser.userName!=\'admin\'" class="fa fa-pencil" ng-click="listPage.action.edit(\''+mData+'\')"> </i>' +
                                '<i title="删除"  ng-disabled="loginUserMenuMap[currentView] || loginUser.userName!=\'admin\'" class="fa fa-trash-o" ng-click="listPage.action.remove(\''+mData+'\')"></i>';
                        }else{
                            return '<i title="编辑"  ng-disabled="loginUserMenuMap[currentView]" class="fa fa-pencil" ng-click="listPage.action.edit(\''+mData+'\')"> </i>' +
                                '<i title="删除"  ng-disabled="loginUserMenuMap[currentView]" class="fa fa-trash-o" ng-click="listPage.action.remove(\''+mData+'\')"></i>';
                        }
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [ 0,6,8 ] },  //第0、9列不可排序
                { sWidth: "38px", aTargets: [ 0 ] },
                { sWidth: "140px", aTargets: [ 7] },
                { sWidth: "100px", aTargets: [ 8] }
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

    system.controller('userGroupController',['$scope','$rootScope','$location','UserService','UserGroupService','OperateService','Tools','Util','Loading','$timeout',function($scope,$rootScope,$location,User,UserGroup,Operate,Tools,Util,Loading,$timeout){
        $scope.locMap={};
        $scope.departDialog=Tools.dialog({
            id:"departDialog",
            title:"部门维护",
            hiddenButton:true,
            model:{},
            locTree:{
                data:[],
                checked:"",
                treeId: 'locTree',
                checkType: { "Y" : "", "N" : "" },
                checkbox: "radio",
                onCheck:function(nodes){
                    $scope.departDialog.model.locId=null;
                    if(nodes.length>0){
                        $scope.departDialog.model.locId=nodes[0].id;
                    }
                    $scope.$apply();
                }
            },
            save:function(){
                var users=[];
                if($scope.departDialog.model.userIds){
                    for(var i=0;i<$scope.departDialog.model.userIds.length;i++){
                        users[i]={id:$scope.departDialog.model.userIds[i]};
                    }
                }
                $scope.departDialog.model.users=users;
                Loading.show();
                if($scope.departDialog.model.id){
                    UserGroup.edit($scope.departDialog.model,function(data){
                        Loading.hide();
                        $scope.listPage.settings.reload();
                        $scope.departDialog.hide();
                    },function(data){
                        Loading.hide();
                    });
                    return;
                }
                UserGroup.add($scope.departDialog.model,function(data){
                    Loading.hide();
                    $scope.listPage.settings.reload();
                    $scope.departDialog.hide();
                },function(data){
                    Loading.hide();
                });
            },
            userList:[],
            init:function(){
                User.getUsers(function(data){
                    if(data){
                        $scope.departDialog.userList=data.rows;
                    }
                });
                Operate.getUserLocs(function(data){
                    var foreach=function(children){
                        for(var i=0;i<children.length;i++){
                            $scope.locMap[children[i].id]=children[i].name;
                            if(children[i].children && children[i].children.length>0){
                                foreach(children[i].children);
                            }
                        }
                    }
                    foreach(data);
                    $scope.departDialog.locTree.data=data;
                });
            }
        });

        Operate.getUserLocs(function(data){
            var foreach=function(children){
                for(var i=0;i<children.length;i++){
                    $scope.locMap[children[i].id]=children[i].name;
                    if(children[i].children && children[i].children.length>0){
                        foreach(children[i].children);
                    }
                }
            }
            foreach(data);
            $scope.departDialog.locTree.data=data;
        });

        var forEachArray=function(array,index){
            index++;
            for(var i=0;i<array.length;i++){
                if((array[i].id+"").indexOf("_")==-1){
                    array[i].nocheck=true;
                    if(index<3)array[i].open=true;
                    array[i].isParent=true;
                }
                if(array[i].children && array[i].children.length>0){
                    array[i].nocheck=true;
                    if(index<3)array[i].open=true;
                    forEachArray(array[i].children,index);
                }
            }
        };
        $scope.departTree={
            treeId:"departTree",
            init:function(){
                Operate.getDepartUsers(function(rows){
                    forEachArray(rows,0);
                    $scope.departTree.data=rows;
                });
            },
            data:[],
            checked:"",
            settingData:{key:{name:"name"}},
            checkType: { "Y" : "", "N" : "" },
            checkbox: "true",
            onCheck:function(nodes){
                $scope.departDialog.model.userIds=[];
                for(var i=0;i<nodes.length;i++){
                    var node=nodes[i];
                    if(!node.isParent){
                        $scope.departDialog.model.userIds[$scope.departDialog.model.userIds.length]=nodes[i].id.substring(2,nodes[i].id.length);
                    }
                }
                $scope.$apply();
            }
        };
        $scope.departTree.init();

        $scope.searchPage = {
            data : {
                name:"",
                limit : 20, //每页条数(即取多少条数据)
                offset : 0 , //从第几条数据开始取
                orderBy : "updated",//排序字段
                orderByType : "desc" //排序顺序
            },
            checkAllLevel:false
        };

        $scope.listPage = {
            data:[],
            checkedList : [],
            checkAllRow : false,
            action : {
                remove:function(id){
                    var tip="确定要删除吗？";
                    if(id){
                        $rootScope.$confirm(tip,function(){
                            Loading.show();
                            UserGroup.remove({ids:[id]},function(data){
                                Loading.hide();
                                $rootScope.$alert("删除成功");
                                $scope.listPage.settings.reload();
                            },function(data){
                                Loading.hide();
                            });
                        },"删除");
                    }else{
                        var ids=$scope.listPage.checkedList;
                        if(ids==null || ids.length==0){
                            $rootScope.$alert("请选择需要删除的用户组");
                            return;
                        }
                        $rootScope.$confirm(tip,function(){
                            Loading.show();
                            UserGroup.remove({ids:ids},function(data){
                                Loading.hide();
                                $rootScope.$alert("删除成功");
                                $scope.listPage.settings.reload();
                            },function(data){
                                Loading.hide();
                            });
                        },"删除");
                    }
                },
                add:function(){
                    $scope.departDialog.title="新增";
                    $scope.departDialog.model={};
                    $scope.departDialog.init();
                    $scope.departDialog.show();
                    var departTree = angular.element.fn.zTree.getZTreeObj($scope.departTree.treeId);
                    departTree.checkAllNodes(false);

                    var rowss=$scope.departDialog.locTree.data;
                    $scope.departDialog.locTree.data=[];
                    $timeout(function(){
                        $scope.departDialog.locTree.data=rowss;
                    },100);

                },
                edit:function(id){
                    var model=Util.findFromArray("id",id,$scope.listPage.data);
                    $scope.departDialog.title="编辑";
                    $scope.departDialog.model=model;
                    $scope.departDialog.init();
                    $scope.departDialog.show();
                    var departTree = angular.element.fn.zTree.getZTreeObj($scope.departTree.treeId);
                    departTree.checkAllNodes(false);
                    for(var i=0;i<model.userIds.length;i++){
                        var node=departTree.getNodeByParam("id", "u_"+model.userIds[i], null);
                        if(node) departTree.checkNode(node,true,true);
                    }

                    if(model.locId){
                        var departObj = angular.element.fn.zTree.getZTreeObj($scope.departDialog.locTree.treeId);
                        departObj.checkAllNodes(false);
                        var nodes=departObj.getCheckedNodes(false);
                        for(var i=0;i<nodes.length;i++){
                            if(model.locId==nodes[i].id){
                                departObj.checkNode(nodes[i],true,true);
                                departObj.expandNode(nodes[i]);
                                break;
                            }
                        }
                    }else{
                        var rowss=$scope.departDialog.locTree.data;
                        $scope.departDialog.locTree.data=[];
                        $timeout(function(){
                            $scope.departDialog.locTree.data=rowss;
                        },100);
                    }
                },
                search: function (search,fnCallback) {
                    $scope.searchPage.data.limit = search.limit;
                    $scope.searchPage.data.offset = search.offset;
                    $scope.searchPage.data.orderBy = search.orderBy;
                    $scope.searchPage.data.orderByType = search.orderByType;
                    UserGroup.query($scope.searchPage.data,function(data){
                        var rows=data.rows;
                        $scope.listPage.data=rows;
                        fnCallback(data);
                        $scope.listPage.checkedList = [];
                        $scope.listPage.checkAllRow = false;
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
                        return '<div class="checkbox"><label><input type="checkbox" checklist-model="listPage.checkedList" checklist-value=\''+mData+'\' /><i></i></label></div>';
                    }
                },
                {
                    sTitle: "用户组名称",
                    mData:"name",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(mData);
                    }
                },
                {
                    sTitle: "包含用户",
                    mData:"id",
                    mRender:function(mData,type,full) {
                        return Util.str2Html(full.userNames);
                    }
                },
                {
                    sTitle: "所属区域",
                    mData:"locId",
                    mRender:function(mData,type,full) {
                        return Util.str2Html("{{locMap['"+mData+"']}}");
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
                            '<i ng-disabled="loginUserMenuMap[currentView]" title="删除"  class="fa fa-trash-o" ng-click="listPage.action.remove(\''+mData+'\')"></i>';
                    }
                }
            ] , //定义列的形式,mRender可返回html
            columnDefs : [
                { bSortable: false, aTargets: [ 0,2,3 ] },  //第0、9列不可排序
                { sWidth: "38px", aTargets: [ 0 ] },
                { sWidth: "140px", aTargets: [ 4] },
                { sWidth: "100px", aTargets: [ 5] }
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
})(angular);