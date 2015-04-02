(function(angular){

angular.module('resource.roomSync', [])
.controller('resourceRoomSyncCtrl',['$scope','$rootScope','Util','$timeout','Modal','RoomService','Loading',function($scope,$rootScope,Util,$timeout,Modal,RoomService,Loading){
    $rootScope.resource.showRoomSyncPage = function(fnAfterRoomSync,fnCloseModal){
        $scope.roomSetting.getSetting();
        $scope.fnRoomSyncCloseModal = fnCloseModal;
        $scope.fnAfterRoomSync = fnAfterRoomSync;
        Modal.show($scope.roomSetting.modal.settings.id);
    };
//roomSync部分
    $scope.roomSetting = {
        canSave:false,
        canDelete:false,
        modal : {
            settings : {
                id : "room_sync_modal_div",
                title:"同步",
                closeBtnText:"关闭",
                saveBtnHide : true,
                hiddenFn : function(){
                    if($scope.fnRoomSyncCloseModal){
                        $scope.fnRoomSyncCloseModal();
                    }
                }
            }
        },
        save : function(){
            if($scope.roomSetting.model.name==null)$scope.roomSetting.model.name="";
            if($scope.roomSetting.model.mokey==null||$scope.roomSetting.model.mokey=="")$scope.roomSetting.model.mokey="e7e36532-4c45-4b09-syb2-d44f213a9e06";
            if($scope.roomSetting.model.type==null||$scope.roomSetting.model.type=="")$scope.roomSetting.model.type="database.mssql";
            if($scope.roomSetting.model.setting==null||$scope.roomSetting.model.setting=="")$scope.roomSetting.model.setting="";
            RoomService.saveSetting($scope.roomSetting.model,function(data){
                if(data && data.result=="success"){
                    $scope.roomSetting.canDelete = true;
                    $rootScope.$alert("保存成功");
                }
            });
        },
        deleteConfig:function(){
            RoomService.deleteSetting(function(data){
                if(data && data.result=="success"){
                    $scope.roomSetting.model={};
                    $scope.roomSetting.canDelete = false;
                    $rootScope.$alert("配置已删除");
                }
            });
        },
        synData : function(){
            Loading.show();
            RoomService.execute(function(data){
                if(data && data.result=="success"){
                    $scope.searchPage.action.search();
                    $scope.fnAfterRoomSync();
                    Loading.hide();
                    $rootScope.$alert("同步完成");
                }else{
                    Loading.hide();
                    $rootScope.$alert("同步失败");
                }
            },function(data){
                Loading.hide();
            });
        },
        getSetting : function(){
            RoomService.getSetting(function(data){
                if(Util.notNull(data.address)){
                    $scope.roomSetting.model=data;
                    $scope.roomSetting.canDelete = true;
                }else{
                    $scope.roomSetting.canDelete = false;
                }
            });
        }
    };

    $scope.$watch("[roomSetting.model.address,roomSetting.model.port,roomSetting.model.userName,roomSetting.model.databaseName]",function(newVal){
        $scope.roomSetting.canSave = Util.notNull(newVal[0],newVal[1],newVal[2],newVal[3]);
    },true);
}]);

})(angular);

