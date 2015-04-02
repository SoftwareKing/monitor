(function(angular){
    var base_url = "../dmonitor-webapi";
    var assetServices = angular.module('asset.services', ['ngResource']);

    assetServices.factory('AssetInfoClient', function($resource){
        return $resource(base_url+"/asset/info/:id",{},{
            //资产管理
            query : {method:"GET",isArray:false},
            save : {method:"POST",isArray:false},
            update : {method:"PUT",isArray:false},
            remove : {method:"DELETE",isArray:false},
            batchRemove : {url:base_url+"/asset/info/batch",method:"DELETE",isArray:false},
            getDifferenceAssets : {url:base_url+"/asset/check/difference",method:"GET",isArray:true},
            getAssetHistory : {url:base_url+"/asset/history/:id",method:"GET",isArray:true},
            saveStatus : {url:base_url+"/asset/info/status",method:"POST",isArray:false}
        });
    });

    assetServices.factory('AssetCheckClient', function($resource){
        return $resource(base_url+"/asset/check/:id",{},{
            query : {method:"GET",isArray:false},
            save : {method:"POST",isArray:false},
            update : {method:"PUT",isArray:false},
            remove : {method:"DELETE",isArray:false},
            batchRemove : {url:base_url+"/asset/check/batch",method:"DELETE",isArray:false},
            saveCheck : {url:base_url+"/asset/check/checkout",method:"GET",isArray:false},
            hasChecking : {url:base_url+"/asset/check/hasChecking",method:"GET",isArray:false},
            getCheckedAssets : {url:base_url+"/asset/check/checkedAssets",method:"GET",isArray:false},
            finishCheck :  {url:base_url+"/asset/check/finishCheck",method:"GET",isArray:false}
        });
    });

    assetServices.factory('AssetAlarmClient', function($resource){
        return $resource(base_url+"/asset/alarmConfig",{},{
            query : {method:"GET",isArray:false},
            save : {method:"POST",isArray:false},
            update : {method:"PUT",isArray:false},
            remove : {method:"DELETE",isArray:false}
        });
    });

    assetServices.factory('AssetAbandonReasonClient', function($resource){
        return $resource(base_url+"/asset/abandonReason/:id",{},{
            query : {method:"GET",isArray:false},
            save : {method:"POST",isArray:false},
            update : {method:"PUT",isArray:false},
            remove : {method:"DELETE",isArray:false},
            batchRemove : {url:base_url+"/asset/abandonReason/batch",method:"DELETE",isArray:false}
        });
    });

})(angular);

