angular.module('ServerIndex.MonitorLogs', [])

.config ($stateProvider, $urlRouterProvider)->
  $stateProvider.state 'monitor_logs',
    url: '/monitor_logs'
    abstract: true
    templateUrl: 'monitor_logs/index.tpl.jade'
    controller: 'MonitorLogCtrl'
    data: {pageTitle: '监控日志', default: 'monitor_logs.list'}
  $stateProvider.state 'monitor_logs.list',
    url: '/list/{path:.*}'
    templateUrl: 'monitor_logs/list.tpl.jade'
    controller: 'MonitorLogListCtrl'
    data: {pageTitle: '日志列表'}
  $urlRouterProvider.when '/monitor_logs', '/monitor_logs/list/default'

.factory('MonitorLogService', ['$resource', ($resource) ->
    $resource "/api/monitor_logs/:path", {path: '@path'}
])

.controller('MonitorLogCtrl', ['$scope', '$state', '$log', 'Feedback', 'CacheService', 'MonitorLogService',
    ($scope, $state, $log, feedback, CacheService, logService) ->

      $log.log "Initialized the log controller"

      $scope.options =
        page: 1   # show first page
        count: 10 # count per page

      $scope.cacheService = new CacheService "id", (value)->
        logService.get {id:value}
  ])

.controller('MonitorLogListCtrl',
  ['$scope', '$location', '$stateParams', '$log', 'ngTableParams', 'ActionService', 'SelectionService', 'MonitorLogService',
    ($scope, $location, $stateParams, $log, NgTable, ActionService, SelectionService, logService) ->

      $log.log "Initialized the log list controller"

      args =
        total: 0,
        getData: ($defer, params) ->
          $location.search(params.url()) # put params in url
          logService.query angular.extend(path: $stateParams.path, params.url()), (data, headers) ->
            params.total headers('total')
            $scope.cacheService.cache data
            $defer.resolve data

      $scope.logTable = new NgTable(angular.extend($scope.options, $location.search()), args)
      $scope.selectionService = new SelectionService($scope.cacheService.records, "id")
      $scope.actionService = new ActionService({watch: $scope.selectionService.items, mapping: $scope.cacheService.find})
  ])
