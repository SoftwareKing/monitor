(function (angular) {
    angular.module('login.ynp', ['ngResource', 'ngRoute', 'login.ynp', 'ynp.client', 'dnt.loading'])
        .controller('YNPCtrl', ['$scope', '$rootScope', 'YNPClient', 'Loading', '$http', function ($scope, $rootScope, YNPClient, Loading, $http) {
            $scope.show = false;
            Loading.show();
            $scope.ship = {
                userName: "",
                userPassword: ""
            };

            $scope.bind = function () {
                $scope.error1 = null;
                $scope.error2 = null;
                if ($scope.loginForm.$valid) {
                    YNPClient.bindUser($scope.ship, function (data) {
                        if (data.success) {
                            location.href = "./index.html#/index";
                        } else {
                            alert(data.message);
                        }
                    });
                } else {
                    alert("请填写用户名和密码!");
                }
            };
            $scope.submit = function (e) {
                if (e.keyCode == "13") {
                    $scope.bind();
                }
            };

            var search = function (key) {
                var qs = location.search.length > 0 ? location.search.substring(1) : "";
                var items = qs.split("&");
                for (var i = 0; i < items.length; i++) {
                    var item = items[i].split("=");
                    if (item[0] == key) {
                        return item[1] ? item[1] : "";
                    }
                }
                return "";
            }

            if (search("code")) {
                YNPClient.getYNPAccessTokenUrl({code: search("code"), state: search("state")}, function (data) {
                    location.href = data.url;
                });
            } else if (search("access_token")) {
                $scope.ship = {
                    openId: search("openid"),
                    openKey: search("openkey"),
                    accessToken: search("access_token"),
                    refreshToken: search("refresh_token"),
                    expiresIn: search("expires_in"),
                    state: search("state")
                }
                YNPClient.checkLogin($scope.ship, function (data) {
                    if (data.success) {
                        if (data.bind) {
                            location.href = "./index.html#/index";
                        } else {
                            if (!data.ynpImg) {
                                data.ynpImg = "img/ynp/circle_blank_avatar.png";
                            }
                            $scope.ship = data;
                            Loading.hide();
                            $scope.show = true;
                        }
                    } else {
                        location.href = "./login.html";
                    }
                });
            } else {
                location.href = "./login.html";
            }
        }]);
})(angular);

