(function (angular) {
    var api_path = "/dmonitor-webapi/";
    var itsm_path = "/dmonitor-itsmapp/";

    var login = angular.module('login', ['ngResource', 'ngRoute', 'login.ynp','ynp.client', 'dnt.loading']);

    login.factory('LoginService', ['$resource', function (resource) {
        return resource(api_path + "/", {}, {
            login: {url: api_path + "login", method: 'GET', isArray: false},
            itsmLogin: {url: itsm_path + "login.action", method: 'GET', isArray: false},
            logout: {url: api_path + "logout", method: 'GET', isArray: false}
        });
    }]);

    login.controller("loginController", ["$scope", "LoginService","YNPClient", function ($scope, LoginService,YNPClient) {
        $scope.login = function () {
            $scope.error1 = null;
            $scope.error2 = null;
            if ($scope.loginForm.$valid) {
                LoginService.login($scope.user, function (data) {
                    if (data.result == "success") {
                        var url = jQuery.cookie("dmonitor_url");
                        if (url) {
                            jQuery.cookie("dmonitor_url", null);
                            location.href = url;
                        } else {
                            location.href = "./index.html#/index";
                        }
                    } else {
                        if (data.msg && data.msg.indexOf("用户") > -1) {
                            $scope.error1 = data.msg;
                            jQuery("#username").focus();
                        } else {
                            $scope.error2 = data.msg;
                            jQuery("#password").focus();
                        }
                        alert(data.msg);
                    }
                });
            } else {
                alert("请填写用户名和密码!");
            }
        };
        $scope.submit = function (e) {
            if (e.keyCode == "13") {
                $scope.login();
            }
        };

        $scope.user = {
            userName: '',
            password: ''
        };

        $scope.loginYNP = function(){
            YNPClient.getYNPLoginUrl(function (data) {
                location.href = data.url;
            });
        }
    }]);

})(angular);
