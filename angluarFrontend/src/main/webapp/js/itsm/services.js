(function(angular){

    var api_path="/dmonitor-webapi";
    var itsmServices = angular.module('itsm.services', ['ngResource']);

    itsmServices.factory('ItsmService', function($resource){
        return $resource("",{},{
            queryAgent:{method:'GET',url:api_path+'/itsm/work/queryAgent',isArray:true},
            saveHide:{method:'GET',url:api_path+'/itsm/work/saveHide',isArray:false},
            queryHide:{method:'GET',url:api_path+'/itsm/work/queryHide',isArray:false},
            querySla:{method:'GET',url:api_path+'/itsm/sla',isArray:true},
            saveSla:{method:'POST',url:api_path+'/itsm/sla/save',isArray:false},
            queryWorkAb:{method:'GET',url:api_path+'/itsm/work/queryAb',isArray:false},
            saveWorkAb:{method:'POST',url:api_path+'/itsm/work/saveAb',isArray:false},
            deleteWorkAb:{method:'DELETE',url:api_path+'/itsm/work/deleteAb',isArray:false},
            queryWork:{method:'GET',url:api_path+'/itsm/work/query',isArray:true},
            saveWork:{method:'POST',url:api_path+'/itsm/work/save',isArray:false},
            deleteWork:{method:'DELETE',url:api_path+'/itsm/work/delete',isArray:false},
            getWork:{method:'GET',url:api_path+'/itsm/work/:id',isArray:false},
            getLocation:{method:'GET',url:api_path+'/department/:id',isArray:false},
            getLocItsm:{method:'GET',url:api_path+'/operation/itsmLoc',isArray:true},
            getUserByGroup:{method:'GET',url:api_path+'/usergroup/users/:groupName',isArray:true},
            getMoById:{method:'GET',url:api_path+'/resources/mo/:moId',isArray:false},
            saveIncident:{method: 'POST', url: api_path + "/itsm/incident/save", isArray: false},
            updateIncident:{method: 'POST', url: api_path + "/itsm/incident/update", isArray: false},
            deleteIncident:{method: 'DELETE', url: api_path + "/itsm/incident/delete", isArray: false},
            batchDeleteIncident:{method: 'DELETE', url: api_path + "/itsm/incident/delete", isArray: false},
            queryClaimingIncident:{method: 'GET', url: api_path + "/itsm/incident/claiming", isArray: false},                     //查询待签收故障单
            queryTaskIncident:{method: 'GET', url: api_path + "/itsm/incident/task", isArray: false},                         //查询待处理故障单
            queryRunningIncident:{method: 'GET', url: api_path + "/itsm/incident/running", isArray: false},                   //查询已办故障单
            queryFinishedIncident:{method: 'GET', url: api_path + "/itsm/incident/finished", isArray: false},                 //查询关闭故障单
            querySingleIncident:{method: 'GET', url: api_path + "/itsm/incident/detail", isArray: false},        //查询具体一个故障单
            startIncident: {method: 'POST', url: api_path + "/itsm/incident/start", isArray: false},             //提交故障单
            claimIncident:{method: 'POST', url: api_path + "/itsm/incident/claim/:id", isArray: false},     //签收故障单
            processIncident:{method: 'POST', url: api_path + "/itsm/incident/complete", isArray: false},         //处理故障单
            forwardIncident:{method: 'POST', url: api_path + "/itsm/incident/forward", isArray: false},
            getUser: {method:'GET',url:api_path+'/users/:id',isArray:false},
            getHistoryEvent: {method:'GET',url:api_path+'/alarm/event/history/recover',isArray:false},
            getCurrentEvent: {method:'GET',url:api_path+'/alarm/event/current',isArray:false},
            getCurrentEventMo: {method:'GET',url:api_path+'/alarm/event/current/mo',isArray:true},

            getForm:{method: 'GET', url: api_path + "/itsm/form", isArray: true},
            getItsmDefInfluenceType:{method: 'GET', url: api_path + "/itsm/ItsmDefInfluenceType", isArray: true},
            getItsmDefEmergencyType:{method: 'GET', url: api_path + "/itsm/ItsmDefEmergencyType", isArray: true},
            getItsmDefPriorityMatrix:{method: 'GET', url: api_path + "/itsm/ItsmDefPriorityMatrix", isArray: false},
            getItsmDefCloseCode:{method: 'GET', url: api_path + "/itsm/ItsmDefCloseCode", isArray: true},
            getItsmDefChangeType:{method: 'GET', url: api_path + "/itsm/ItsmDefChangeType", isArray: true},
            getAllMoc:{method:'GET',url:api_path+"/resources/moc",isArray:true},
            getMoByMocId:{method:'GET',url:api_path+'/resources/mo',isArray:false},
            getUsergroup  :{method:'GET',url:api_path+'/usergroup',isArray:false},
            getUsergroupValue :{method:'GET',url:api_path+'/usergroup/value',isArray:true},
            getUsers:{method:'GET',url:api_path+'/users',isArray:false},
            getTime:{method:'GET',url:api_path+'/itsm/form/time',isArray:false},
            getCurrentEvent: {method:'GET',url:api_path+'/alarm/event/current',isArray:false},
            getMetricByMocId:{method:'GET',url:api_path+'/resources/metric/select',isArray:true},
            getIncidentHistory:{method:'GET',url:api_path+'/itsm/incident/history',isArray:false},
            getIncident:{method: 'GET', url: api_path + "/itsm/incident/page", isArray: false},
            getImagePosition:{method: 'GET', url: api_path + "/itsm/workflow/process/trace", isArray: true},

            saveProblem:{method: 'POST', url: api_path + "/itsm/problem/save", isArray: false},
            updateProblem:{method: 'POST', url: api_path + "/itsm/problem/update", isArray: false},
            deleteProblem:{method: 'DELETE', url: api_path + "/itsm/problem/delete", isArray: false},
            batchDeleteProblem:{method: 'DELETE', url: api_path + "/itsm/problem/delete", isArray: false},
            queryClaimingProblem:{method: 'GET', url: api_path + "/itsm/problem/claiming", isArray: false},                     //查询待签收故障单
            queryTaskProblem:{method: 'GET', url: api_path + "/itsm/problem/task", isArray: false},                         //查询待处理故障单
            queryRunningProblem:{method: 'GET', url: api_path + "/itsm/problem/running", isArray: false},                   //查询已办故障单
            queryFinishedProblem:{method: 'GET', url: api_path + "/itsm/problem/finished", isArray: false},                 //查询关闭故障单
            querySingleProblem:{method: 'GET', url: api_path + "/itsm/problem/detail", isArray: false},        //查询具体一个故障单
            startProblem: {method: 'POST', url: api_path + "/itsm/problem/start", isArray: false},             //提交故障单
            claimProblem:{method: 'POST', url: api_path + "/itsm/problem/claim/:id", isArray: false},     //签收故障单
            processProblem:{method: 'POST', url: api_path + "/itsm/problem/complete", isArray: false},         //处理故障单
            getProblem:{method: 'GET', url: api_path + "/itsm/problem/page", isArray: false},
            getProblemHistory:{method:'GET',url:api_path+'/itsm/problem/history',isArray:false},
            forwardProblem:{method: 'POST', url: api_path + "/itsm/problem/forward", isArray: false},

            saveChange:{method: 'POST', url: api_path + "/itsm/change/save", isArray: false},
            updateChange:{method: 'POST', url: api_path + "/itsm/change/update", isArray: false},
            deleteChange:{method: 'DELETE', url: api_path + "/itsm/change/delete", isArray: false},
            batchDeleteChange:{method: 'DELETE', url: api_path + "/itsm/change/delete", isArray: false},
            queryClaimingChange:{method: 'GET', url: api_path + "/itsm/change/claiming", isArray: false},                     //查询待签收故障单
            queryTaskChange:{method: 'GET', url: api_path + "/itsm/change/task", isArray: false},                         //查询待处理故障单
            queryRunningChange:{method: 'GET', url: api_path + "/itsm/change/running", isArray: false},                   //查询已办故障单
            queryFinishedChange:{method: 'GET', url: api_path + "/itsm/change/finished", isArray: false},                 //查询关闭故障单
            querySingleChange:{method: 'GET', url: api_path + "/itsm/change/detail", isArray: false},        //查询具体一个故障单
            startChange: {method: 'POST', url: api_path + "/itsm/change/start", isArray: false},             //提交故障单
            claimChange:{method: 'POST', url: api_path + "/itsm/change/claim/:id", isArray: false},     //签收故障单
            processChange:{method: 'POST', url: api_path + "/itsm/change/complete", isArray: false},         //处理故障单
            getMo:{method:"GET",url: api_path + "/resources/mo",isArray:false},
            getChange:{method: 'GET', url: api_path + "/itsm/change/page", isArray: false},
            getChangeHistory:{method:'GET',url:api_path+'/itsm/change/history',isArray:false},
            forwardChange:{method: 'POST', url: api_path + "/itsm/change/forward", isArray: false},

            saveKnowledge:{method: 'POST', url: api_path + "/itsm/knowledge/save", isArray: false},
            updateKnowledge:{method: 'POST', url: api_path + "/itsm/knowledge/update", isArray: false},
            deleteKnowledge:{method: 'DELETE', url: api_path + "/itsm/knowledge/delete", isArray: false},
            batchDeleteKnowledge:{method: 'DELETE', url: api_path + "/itsm/knowledge/delete", isArray: false},
            queryClaimingKnowledge:{method: 'GET', url: api_path + "/itsm/knowledge/claiming", isArray: false},                     //查询待签收故障单
            queryTaskKnowledge:{method: 'GET', url: api_path + "/itsm/knowledge/task", isArray: false},                         //查询待处理故障单
            queryRunningKnowledge:{method: 'GET', url: api_path + "/itsm/knowledge/running", isArray: false},                   //查询已办故障单
            queryFinishedKnowledge:{method: 'GET', url: api_path + "/itsm/knowledge/finished", isArray: false},                 //查询关闭故障单
            querySingleKnowledge:{method: 'GET', url: api_path + "/itsm/knowledge/detail", isArray: false},        //查询具体一个故障单
            startKnowledge: {method: 'POST', url: api_path + "/itsm/knowledge/start", isArray: false},             //提交故障单
            claimKnowledge:{method: 'POST', url: api_path + "/itsm/knowledge/claim/:id", isArray: false},     //签收故障单
            processKnowledge:{method: 'POST', url: api_path + "/itsm/knowledge/complete", isArray: false},         //处理故障单
            getKnowledge:{method: 'GET', url: api_path + "/itsm/knowledge/page", isArray: false},
            getKnowledgeHistory:{method:'GET',url:api_path+'/itsm/knowledge/history',isArray:false},
            deleteFlow:{method:'DELETE',url:api_path+'/itsm/form/delete',isArray:false},
            prevTask:{method:'GET',url:api_path+'/itsm/form/prevTask',isArray:false},
            taskGroup:{method:'GET',url:api_path+'/itsm/form/group',isArray:false},


            getResolveUser:{method:'GET',url:api_path+'/itsm/incident/resolveUser',isArray:false},    //获取列表中的处理人结果集  故障工单
            getResolveUserProblem:{method:'GET',url:api_path+'/itsm/problem/resolveUser/problem',isArray:false},    //获取列表中的处理人结果集  问题工单
            getResolveUserChange:{method:'GET',url:api_path+'/itsm/change/resolveUser/change',isArray:false},    //获取列表中的处理人结果集  变更工单


            getResolveUserByLocToUser:{method:'GET',url:api_path+'/itsm/incident/resolveUserByLocId',isArray:true}    //根据处理人获得locId、再根据Loc_id获得处理人


        });
    })

})(angular);