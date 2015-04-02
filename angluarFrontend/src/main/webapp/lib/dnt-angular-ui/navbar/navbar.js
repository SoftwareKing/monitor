(function(angular){
    var navbar = angular.module('navbar',['ngResource']);
    var api_path="../dmonitor-webapi/";
    navbar.factory('portalNavbarService',['$resource',function(resource){
        return resource(api_path+'loginMenus',{},{
            getNavbar:{method:'GET',isArray:true}
        });
    }]);

    navbar.directive('navBar',function(){
        return {
            replace: true,
            transclude: true,
            restrict: 'E',
            templateUrl:"lib/dnt-angular-ui/navbar/navbar.html",
            link: function(scope, element, attrs) {
                //初始化设置下拉菜单宽度
                var setDivWidth = function(){
                    $("#nav-menu .dropdown-menu").each(function(index,obj){
                        var size = $(obj).find(".submenu-wrapper").length;
                        if(size > 0){
                            $(obj).find(">ul").css({width: 120*size + "px"});
                        }
                    });
                };
                scope.$watch("isNavReady", setDivWidth, true);

//                var _fix_position = function(){
//                    $("#nav-menu").css('right', ($(window).scrollLeft() + $(window).width() - $(document).width()) + 'px');
//                    $("#nav-menu").css('left', ( - $(window).scrollLeft()) + 'px');
//                };
//                $(window).resize(_fix_position);
//                $(window).scroll(_fix_position);
            }
        };
    });

    navbar.controller('navbarController',['$scope','$rootScope','$location','portalNavbarService','RoomService',function($scope,$rootScope,$location,svc,Room){
        $scope.isNavReady = false;
        $scope.navbarItems =[];
        $scope.loaded=false;
        $scope.openWindow=function(url,type){
           var newWindow= window.open(url,type);
            $rootScope.openWindows.push(newWindow);
        }
        $rootScope.$watch("loginUser",function(){
            if($rootScope.loginUser)$scope.loaded=true;
        },true);
        $scope.activeClass=function(path){
            return $location.path()==path ? "on":"";
        };
        $scope.room_activex_url="";
        function isIE() { //ie?
            if (!!window.ActiveXObject || "ActiveXObject" in window)
                return true;
            else
                return false;
        }
        $scope.$watch("loaded",function(){
            if($scope.loaded){
                $scope.navbarItems=$rootScope.loginUser.menus;
                Room.getSetting(function(data){
                    var u=$rootScope.loginUser;
                    if(u){
                        var username= u.userName;
                        var password= encodeURIComponent(u.roomPass);
                        var address= data.address;
                        var dbusername= data.userName;
                        var dbpassword= data.password;
                        if(dbpassword==null){
                            dbpassword="";
                        }
                        var server= data.databaseName;
                        var view="room.html";
                        if(isIE())view="ie_room.html";
                        $scope.room_activex_url="./views/room/"+view+"?u="+username+"&p="+password+"&ip="+address+"&dbu="+dbusername+"&dbp="+dbpassword+"&s="+server;
                    }

                    $scope.isNavReady = true;
                });
            }
        },true);
    }]);
})(angular);