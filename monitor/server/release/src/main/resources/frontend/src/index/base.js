angular.module('Platform.Index', [
    'ui.router',
    'ngAnimate',
    'ct.ui.router.extras',
    'ngResource',
    'ngLocale',
    'ngSanitize',
    'ngTable',
    'jcs-autoValidate',
    'dataTablesDirective',
    'tabs',
    'ng-ztree',
    'ui.bootstrap',

    'dnt.action.service',
    'Lib.Interceptor',
    'Lib.Directives',
    'Lib.Templates',
    'Lib.JcsEnhance',
    'Lib.Filters',
    'Lib.Feedback',
    'Lib.ProcessBar',
    'Lib.Utils',
    'Lib.Commons',
    'Lib.SocketManager',
    'Lib.MonitorUtils',
    'Lib.JsonCycleParser',
    'Lib.LayoutUtils',
    'Lib.Twaver.TwaverService',
    'Lib.ChartUtils',

    'Index.Templates',
    'Index.Menu',
    'Index.Dialog'
])
  .config(function ($httpProvider, $stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('resources');
        $stateProvider.state('dashboard', {
                url: '/dashboard',
                templateUrl: 'dashboard/dashboard.tpl.jade',
                data: {pageTitle: '总览'}
        });


  })

  // 登录/登出
  .factory('SessionService', ['$resource', function ($resource) {
      return $resource('/api/session', null, {
          logout: {method: 'DELETE'}
      });
  }])

  // 获取用户信息工厂
  .factory('ProfileService', ['$resource', function ($resource) {
      return $resource('/api/profile', null, {
          get: {method: 'GET'}
      });
  }])

  .controller('IndexCtrl', ['$rootScope', '$scope', '$state', '$location', 'SessionService', '$window', 'SocketManager',
    function ($rootScope, $scope, $state, $location, sessionService, $window, SocketManager) {
      $rootScope.system = window.system;
      $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        // Record current breadcrumbs
        var breadcrumb = toState;
        var breadcrumbs = [breadcrumb];
        var last = breadcrumb.name.lastIndexOf('.');
        var pageTitle = (breadcrumb.data || {pageTitle: "未命名"}).pageTitle;
        while(last > 0 ){
          breadcrumb = $state.get(breadcrumb.name.substring(0, last));
          breadcrumbs.push(breadcrumb);
          pageTitle = pageTitle + " | " + (breadcrumb.data || {pageTitle: "未命名"}).pageTitle;
          last = breadcrumb.name.lastIndexOf('.');
        }
        $rootScope.pageTitle = pageTitle;
        $rootScope.breadcrumbs = breadcrumbs.reverse();
      });
      $scope.logout = function(){
        sessionService.logout(function(){
          $window.location.href='/login.html';
        });
      };
      /*===========================  WebSocket  ===========================*/
      $rootScope.socketManager = new SocketManager();
      var path = "{0}://{1}:{2}/north".interpolate($location.protocol(), $location.host(), $location.port());
      var onmessage = function(event){
        if (null == event || null == event.data) { return ; }
        var data = JSON.parse(event.data);
        if ( !data.hasOwnProperty( '@class' ) ) { return ; }
        var type = data[ '@class'].substring( data[ '@class'].lastIndexOf( '.' ) + 1 );
        if ( null != type && "" !== type ) { $scope.$broadcast(type, data); }
      };
      var socket = $rootScope.socketManager.instanceSocket(path, true, null, onmessage, null);
  }])

  // 获取用户信息
  .run(['$rootScope', 'ProfileService',
    function ($rootScope, profileService) {
      profileService.get(function (data) {
          $rootScope.user = data;
      });
  }])

  // angular-auto-validate error message
  .run(['defaultErrorMessageResolver', 'validator', 'AceElementModifier',
    function (defaultErrorMessageResolver, validator, aceElementModifier) {
      defaultErrorMessageResolver.setI18nFileRootPath('assets/json');
      defaultErrorMessageResolver.setCulture('zh-CN');
      validator.registerDomModifier(aceElementModifier.key, aceElementModifier);
      validator.setDefaultElementModifier(aceElementModifier.key);
    }
  ]);
