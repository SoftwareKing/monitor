angular.module('ServerIndex.OperationLogs', [])

.config ($stateProvider, $urlRouterProvider)->
  $stateProvider.state 'operation_logs',
    url: '/operation_logs'
    abstract: true
    templateUrl: 'operation_logs/index.tpl.jade'
    controller: 'OperationLogCtrl'
    data: {pageTitle: '操作日志', default: 'operation_logs.list'}
  $stateProvider.state 'operation_logs.list',
    url: '/list/{path:.*}'
    templateUrl: 'operation_logs/list.tpl.jade'
    controller: 'OperationLogListCtrl'
    data: {pageTitle: '日志列表'}
  $urlRouterProvider.when '/operation_logs', '/operation_logs/list/default'

.factory('OperationLogService', ['$resource', ($resource) ->
    $resource "/api/operation_logs/:path", {path: '@path'}
])

.controller('OperationLogCtrl', ['$scope', '$state', '$log', 'Feedback', 'CacheService', 'OperationLogService',
    ($scope, $state, $log, feedback, CacheService, logService) ->

      $log.log "Initialized the log controller"

      $scope.options =
        page: 1   # show first page
        count: 10 # count per page

      $scope.cacheService = new CacheService "id", (value)->
        logService.get {id:value}
  ])

.controller('OperationLogListCtrl',
  ['$scope', '$location', '$stateParams', '$log', 'ngTableParams', 'ActionService', 'SelectionService', 'OperationLogService',
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
