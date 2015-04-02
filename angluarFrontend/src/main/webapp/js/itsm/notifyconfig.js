(function (angular) {

    var app_path = "/dmonitor-webapi";

    var dm = angular.module('config-notifyconfig', [
        'ngRoute',
        'ngResource'
    ]);
    dm.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/notifyconfig', {templateUrl: 'views/itsm/notifyconfig.html', controller: 'notifyConfigController'});
    }]);

    dm.factory('notifyConfigService', ['$resource', function (resource) {
        return resource(app_path + "", {}, {
            get: {method: 'GET', url: app_path + "/itsm/notifyconfig", isArray: false},
            save: {method: 'POST', url: app_path + "/itsm/notifyconfig", isArray: false}
        });
    }])

    dm.controller('notifyConfigController', ['$scope', '$rootScope', '$location', '$timeout', 'notifyConfigService',
        function ($scope, $rootScope, $location, $timeout, notifyConfigService) {

            $scope.notifyConfigPage = {
                data: {
                    smsNotifyConfig: [],
                    emailNotifyConfig: [],
                    smsNotify: [],
                    emailNotify: []
                },
                init: function () {
                    var obj = new Object();
                    obj.value = "incident"
                    obj.label = "故障通知";
                    $scope.notifyConfigPage.data.smsNotifyConfig.push(obj);
                    obj = new Object();
                    obj.value = "problem"
                    obj.label = "问题通知";
                    $scope.notifyConfigPage.data.smsNotifyConfig.push(obj);
                    obj = new Object();
                    obj.value = "change"
                    obj.label = "变更通知";
                    $scope.notifyConfigPage.data.smsNotifyConfig.push(obj);
                    obj = new Object();
                    obj.value = "knowledge"
                    obj.label = "知识通知";
                    $scope.notifyConfigPage.data.smsNotifyConfig.push(obj);

                    obj = new Object();
                    obj.value = "incident"
                    obj.label = "故障通知";
                    $scope.notifyConfigPage.data.emailNotifyConfig.push(obj);
                    obj = new Object();
                    obj.value = "problem"
                    obj.label = "问题通知";
                    $scope.notifyConfigPage.data.emailNotifyConfig.push(obj);
                    obj = new Object();
                    obj.value = "change"
                    obj.label = "变更通知";
                    $scope.notifyConfigPage.data.emailNotifyConfig.push(obj);
                    obj = new Object();
                    obj.value = "knowledge"
                    obj.label = "知识通知";
                    $scope.notifyConfigPage.data.emailNotifyConfig.push(obj);
                },
                save: function () {
                    var emailNotify = $scope.notifyConfigPage.data.emailNotify.toString(),
                        smsNotify = $scope.notifyConfigPage.data.smsNotify.toString();
                    notifyConfigService.save({emailNotifyParam: emailNotify, smsNotifyParam: smsNotify}, {}, function (data) {
                        if (null != data && data.result != null && data.result == "success") {
                            $rootScope.$alert("保存成功！", "");
                            return;
                        }
                    });
                },
                load: function () {
                    notifyConfigService.get({}, function (data) {
                        if (null != data && data.result != null && data.result == "success") {
                            for (var i = 0; i < data.msg.length; i++) {
                                if (data.msg[i].configType == "email") {
                                    if (data.msg[i].configInfo != null && data.msg[i].configInfo != "" && data.msg[i].configInfo.split(",").length > 0) {
                                        $.each(data.msg[i].configInfo.split(","), function (x, v) {
                                            $scope.notifyConfigPage.data.emailNotify[x] = v;
                                        });
                                    }
                                }

                                if (data.msg[i].configType == "sms") {
                                    if (data.msg[i].configInfo != null && data.msg[i].configInfo != "" && data.msg[i].configInfo.split(",").length > 0) {
                                        $.each(data.msg[i].configInfo.split(","), function (x, v) {
                                            $scope.notifyConfigPage.data.smsNotify[x] =v;
                                        });
                                    }
                                }
                            }
                        }
                    });
                }
            };
            $scope.notifyConfigPage.init();
            $scope.notifyConfigPage.load();
        }]);

})(angular);


