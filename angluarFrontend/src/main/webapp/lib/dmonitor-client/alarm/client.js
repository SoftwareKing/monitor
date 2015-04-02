(function (angular) {

    var api_path = "../dmonitor-webapi";

    angular.module('alarm.client', ['ngResource'])

        .factory('BaselineClient', function ($resource) {
            return $resource(api_path + "/alarm/baseline/:id", {}, {
//        get : {method:"GET",isArray:false},
                query: {method: "GET", isArray: false},
//        save : {method:"POST",isArray:false},
                update: {method: "PUT", isArray: false},
//        remove : {method:"DELETE",isArray:false},
                batchRemove: {url: api_path + "/alarm/baseline/batch", method: "DELETE", isArray: false},
                tree: {url: api_path + "/alarm/baseline/mocpTree", method: "GET", isArray: true},
                metric: {url: api_path + "/resources/metric/select", method: "GET", isArray: true},
                historyRule: {url: api_path + "/history/rules", method: "GET", isArray: false},
                getChartData: {url: api_path + "/history/rules/chart", method: 'GET', isArray: true}
            });
        })

        .factory('BaselineRuleClient', function ($resource) {
            return $resource(api_path + "/alarm/baselineRule/:id", {}, {
//        get : {method:"GET",isArray:false},
                query: {method: "GET", isArray: false},
//        save : {method:"POST",isArray:false},
                batchSave:{method:'POST',url:api_path+'/alarm/baselineRule/batch',isArray:true},
                update: {method: "PUT", isArray: false},
//        remove : {method:"DELETE",isArray:false},
                batchRemove: {url: api_path + "/alarm/baselineRule/batch", method: "DELETE", isArray: false},
                tree: {url: api_path + "/alarm/baselineRule/mocpTree", method: "GET", isArray: true},
                active:{method:'GET',url:api_path+'/alarm/baselineRule/active/:id',isArray:false},
                batchActive:{method:'GET',url:api_path+'/alarm/baselineRule/batch/active',isArray:false},
                sampleInterval:{method:'GET',url:api_path+'/alarm/baselineRule/sampleInterval',isArray:false},
                hitRules:{method:'GET',url:api_path+'/alarm/rules/prepare',isArray:true},
                userTreeData:{method:'GET',url:api_path+'/operation/departUserTree',isArray:true}
            });
        })


})(angular);