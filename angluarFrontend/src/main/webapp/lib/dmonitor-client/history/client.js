(function(angular){

var api_path = "../dmonitor-webapi";

angular.module('history.client', ['ngResource'])

.factory('FlowChartClient', function($resource){
    return $resource(api_path+"/history/flowchart",{},{
        getTree : {url:api_path+"/history/flowchart/tree",method:"GET",isArray:true},
        getChartTemplate : {url:api_path+"/history/flowchart/:moId/:port",method:"GET",isArray:true},
        getChartData : {url:api_path+"/history/flowchart/data",method:"POST",isArray:false},
        getLinks : {url:api_path+"/history/links",method:"GET",isArray:false}
    });
})

})(angular);