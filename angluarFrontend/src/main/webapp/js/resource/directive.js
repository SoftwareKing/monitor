(function (angular) {

angular.module('resource.directives', [])
.directive('resourcesTree', ["Util",'MetricClient', function (Util, MetricClient) {
    return {
        restrict: 'AE',
        transclude: false,
        link: function (scope, element, attrs) {
            var ztreeData = Util.getValue(attrs.resourcesTree, scope);
            var on_treeData_change = function () {
                var setting = {
                    check: {
                        enable: true,
                        chkStyle: "radio",
                        radioType: "all"
                    },
                    callback: {
                        onCheck: zTreeOnCheck
                    }
                };
                var treeObj = angular.element.fn.zTree.init(angular.element("#" + ztreeData.treeId), setting, ztreeData.data);
                if(scope.editPage.isEdit) {
                    if (ztreeData.treeId == "leftResources") {
                        treeObj.cancelSelectedNode();
                        var leftNodes = treeObj.transformToArray(treeObj.getNodes());
                        for (var i = 0, l = leftNodes.length; i < l; i++) {
                            if (scope.editPage.data.resource.leftMoId == leftNodes[i].id) {
                                scope.editPage.leftType = leftNodes[i].displayName;
                                treeObj.checkNode(leftNodes[i], true, true);
                                treeObj.expandNode(leftNodes[i].getParentNode(), true, true, true);
                                var indicatorName = getIndicatorName(leftNodes[i]);
                                MetricClient.getMetricValues({id:leftNodes[i].id,indicatorName:indicatorName},{},function(data){
                                    if (data.length <= 0){
                                        scope.editPage.modal.settings.saveDisabled = true;
                                    }
                                    for(var i=0;i<data.length;i++){
                                        if((data[i].metricName == "Interface" && indicatorName == "NIO") || (data[i].metricName == "IfIndex" && indicatorName == "Interface")){
                                            //console.log(data[i].moId);
                                            //console.log(data[i].value);
                                            //console.log(data[i].index);
                                            scope.listPage.leftPorts.push(data[i]);
                                        }
                                    }
                                    Util.go(scope);
                                },function(error){
                                    jQuery("#my-ajax-view").hide();
                                    jQuery("#my-ajax-view-center").hide();
                                });
                            }
                            treeObj.setChkDisabled(leftNodes[i], true);
                        }
                    } else if (ztreeData.treeId == "rightResources") {
                        treeObj.cancelSelectedNode();
                        var rightNodes = treeObj.transformToArray(treeObj.getNodes());
                        for (var i = 0, l = rightNodes.length; i < l; i++) {
                            if (scope.editPage.data.resource.rightMoId == rightNodes[i].id) {
                                scope.editPage.rightType = rightNodes[i].displayName;
                                treeObj.checkNode(rightNodes[i], true, true);
                                treeObj.expandNode(rightNodes[i].getParentNode(), true, true, true);
                                var indicatorName = getIndicatorName(rightNodes[i]);
                                MetricClient.getMetricValues({id:rightNodes[i].id,indicatorName:indicatorName},{},function(data){
                                    if (data.length <= 0){
                                        scope.editPage.modal.settings.saveDisabled = true;
                                    }
                                    for(var i=0;i<data.length;i++){
                                        if((data[i].metricName == "Interface" && indicatorName == "NIO") || (data[i].metricName == "IfIndex" && indicatorName == "Interface")){
                                            //console.log(data[i].moId);
                                            //console.log(data[i].value);
                                            //console.log(data[i].index);
                                            scope.listPage.rightPorts.push(data[i]);
                                        }
                                    }
                                    Util.go(scope);
                                },function(error){
                                    jQuery("#my-ajax-view").hide();
                                    jQuery("#my-ajax-view-center").hide();
                                });
                            }
                            treeObj.setChkDisabled(rightNodes[i], true);
                        }
                    }
                    jQuery("#my-ajax-view").hide();
                    jQuery("#my-ajax-view-center").hide();
                } else {
                    jQuery("#my-ajax-view").hide();
                    jQuery("#my-ajax-view-center").hide();
                }
            };

            var getIndicatorName = function(treeNode){
                if(treeNode.type == "host"){
                    return "NIO";
                }else if(treeNode.type == "network"){
                    return "Interface";
                }
            };
            var zTreeOnCheck = function (event, treeId, treeNode) {
                var treeId = treeNode.tId.split("_")[0];
                if(treeId == "leftResources"){
                    scope.editPage.resource.leftMoId = null;
                    scope.editPage.resource.leftDisplayName = null;
                    scope.editPage.resource.leftPort = "";
                    scope.listPage.leftPorts = [];
                    if(treeNode.checked == true){
                        scope.editPage.resource.leftMoId = treeNode.id;
                        scope.editPage.resource.leftDisplayName = treeNode.name;
                        var indicatorName = getIndicatorName(treeNode);
                        MetricClient.getMetricValues({id:treeNode.id,indicatorName:indicatorName,resourceId:scope.editPage.data.resourceId + "",type:"1"},{},function(data){
                            for(var i=0;i<data.length;i++){
                                if((data[i].metricName == "Interface" && indicatorName == "NIO") || (data[i].metricName == "IfIndex" && indicatorName == "Interface")){
                                    scope.listPage.leftPorts.push(data[i]);
                                }
                            }
                            Util.go(scope);
                        });
                    }else{
                        Util.go(scope);
                    }
                }else if(treeId == "rightResources"){
                    scope.editPage.resource.rightMoId = null;
                    scope.editPage.resource.rightDisplayName = null;
                    scope.editPage.resource.rightPort = "";
                    scope.listPage.rightPorts = [];
                    if(treeNode.checked == true){
                        scope.editPage.resource.rightMoId = treeNode.id;
                        scope.editPage.resource.rightDisplayName = treeNode.name;
                        var indicatorName = getIndicatorName(treeNode);
                        MetricClient.getMetricValues({id:treeNode.id,indicatorName:indicatorName,resourceId:scope.editPage.data.resourceId + "",type:"1"},{},function(data){
                            for(var i=0;i<data.length;i++){
                                if((data[i].metricName == "Interface" && indicatorName == "NIO") || (data[i].metricName == "IfIndex" && indicatorName == "Interface")){
                                    scope.listPage.rightPorts.push(data[i]);
                                }
                            }
                            Util.go(scope);
                        });
                    }else{
                        Util.go(scope);
                    }
                }
            };
            return scope.$watch(attrs.resourcesTree, on_treeData_change, true);
        }
    };
}])
.directive('busTree', ["Util", function (Util) {
    return {
        restrict: 'AE',
        transclude: false,
        link: function (scope, element, attrs) {
            var ztreeData = Util.getValue(attrs.busTree, scope);
            var on_treeData_change = function () {
                var setting = {
                    check: {
                        enable: true,
                        chkStyle: "checkbox"
                    },
                    callback: {
                        onCheck: zTreeOnCheck
                    }
                };
                var treeObj = angular.element.fn.zTree.init(angular.element("#" + ztreeData.treeId), setting, ztreeData.data);
                if(scope.editPage.isEdit) {
                    treeObj.cancelSelectedNode();
                    var nodes = treeObj.transformToArray(treeObj.getNodes());
                    for (var i = 0, l = nodes.length; i < l; i++) {
                        for (var j = 0, al = scope.editPage.relationShip.moIds.length; j < al; j++) {
                            if (scope.editPage.relationShip.moIds[j] == nodes[i].id) {
                                treeObj.checkNode(nodes[i], true, true);
                                treeObj.expandNode(nodes[i].getParentNode(), true, true, true);
                            }
                        }
                    }
                }
            };
            var zTreeOnCheck = function (event, treeId, treeNode) {
                if(treeNode.checked == true){
                    scope.editPage.relationShip.moIds.push(treeNode.id);
                }else{
                    var index = -1;
                    for (var i = 0; i <  scope.editPage.relationShip.moIds.length; i++) {
                        if ( scope.editPage.relationShip.moIds[i] == treeNode.id){
                            index = i;
                        }
                    }
                    if (index > -1) {
                        scope.editPage.relationShip.moIds.splice(index, 1);
                    }
                }

            };
            return scope.$watch(attrs.busTree, on_treeData_change, true);
        }
    };
}])
.directive('colorBar', ["$rootScope", function (rootScope) {
        return {
            restrict: 'AE',
            transclude: true,
            templateUrl: 'views/resource/colorbar.html',
            replace: true,
            link: function (scope, elem, attrs) {
                if(!rootScope.loginUserMenuMap[rootScope.currentView]){
                    $(elem[0]).find(".xntp_aca_conb_linecon").set_limen(0,100);
                }
            }
        }
    }]);

})(angular);