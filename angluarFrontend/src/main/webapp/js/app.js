(function (angular) {
    'use strict';
    var dm = angular.module('dmonitor', ['ngRoute', 'systemheader', 'navbar', 'breadcrumb', 'dnt.widget', 'log-module', 'flow-module', 'dnt.layout', 'overview-module', 'user', 'itsm', 'room-module', 'alarm-module', 'topo-module', 'history-module', 'resource-module','audit-module', 'dnt.loading', 'compile','about-module','timer-report-module','history.flowchart','deployApp','config-notifyconfig','archivedir-module','asset-module','jfpatrol-module','simulation-module','businessChart-module']);

    dm.run(['$rootScope', '$timeout', '$location', function ($rootScope, $timeout, $location) {
        $rootScope.$on('$routeChangeSuccess', function (event) {
            var path = $location.path();
            angular.element('#' + $rootScope.confirm.id).modal('hide');
            angular.element('#' + $rootScope.alert.id).modal('hide');
            $rootScope.currentView = path.substring(1, path.length);
            $(".modal-backdrop").hide();
        });
        $rootScope.openWindows=[];
        $rootScope.alert = {id: "myalert", info: "", level: "info"};
        $rootScope.confirm = {id: "myconfirm", info: "", save: function () {
        }, cancel: function () {
        }};
        $rootScope.$alert = function (info, level) {
//            info == DOMException: false
//            info.message: "Blocked a frame with origin "http://localhost:8080" from accessing a cross-origin frame."
//                info.name: "SecurityError"
//            info.code: 18
//            info == DOMException: false
//            info.message: "Cannot read property 'indexOf' of undefined"
//            info.name: "TypeError"
//            info.code: undefined
            if (null != info.code && info.code == 18 && info.name == "SecurityError"){
                return;
            } else if (null == info.code && info.name == "TypeError" && info.message.indexOf("indexOf") > 0){
                info = "上传文件未找到，请查看上传文件位置！";
            }
            if(level)$rootScope.alert.level=level;
            else $rootScope.alert.level="info";
            $rootScope.alert.info = info;
            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }
            angular.element('#' + $rootScope.alert.id).modal('show');
        };
        $rootScope.$confirm = function (info, fn,title) {
            $rootScope.confirm.info = info;
            $rootScope.confirm.save = fn;
            $rootScope.confirm.title = title;
            angular.element('#' + $rootScope.confirm.id).modal('show');
        };
    }]).config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push("interceptor");
    }]).factory('interceptor', function ($q, $rootScope) {
        return {
            'request': function (config) {
                if (!new RegExp("html$").test(config.url)) {
                    config.url = config.url + '?r=' + new Date().getTime();
                }
                return config || $q.when(config);
            },
            'response': function (response) {
                return response || $q.when(response);
            },
            'responseError': function (e) {
                var info = "";
                if (e.data && e.data.message) {
                    info = e.data.message;
                } else if (e.status == 0) {
                    info = "服务器无法访问";
                } else {
//                    info = "未知错误";
                }
                if (info && info != "") {
                    if (info.indexOf("用户未登录") > -1) {
                        jQuery.cookie("dmonitor_url", window.location.href);
                        location.href = "./login.html";
                    } else {
                        $rootScope.$alert(info, "alarm");
                    }
                }
                return $q.reject(e);
            }
        };
    });
})(angular);