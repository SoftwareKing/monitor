angular.module("ServerIndex.Topos", [])

.config ($stateProvider)->

  $stateProvider.state 'resources.topos_detail',
    url: '/topos/detail?path&title',
    controller: 'TopoDetailCtrl',
    templateUrl: 'topos/detail.tpl.jade',
    data: {pageTitle: '拓扑图详情'}

.factory('ToPoNodeService', ['$resource', ($resource) ->
    $resource("/api/topo_nodes/:id", {},
      save: {method: 'POST'},
      update: {method: 'PUT', params: {id: '@id'}}
    )
  ])

.factory('NodeService', ['$resource', ($resource) ->
    $resource("/api/node:path", {}
      get: {method: 'GET', path: '@path'},
      save: {method: 'POST'},
      update: {method: 'PUT', path: '@path'},
      remove: {method: 'DELETE', params: {path: '@path'}}
    )
  ])

.factory('NodesService', ['$resource', ($resource) ->
    $resource "/api/nodes:path", {path: '@path'},
      save:
        method:'POST'
      query: { method: 'GET', params: {path: '@path'}, isArray: true},
      update: { method: 'PUT', params: {name: '@name'}},
      remove: {method: 'DELETE', params: {path: '@path'}}
  ])

.factory('MetaService', ['$resource', ($resource) ->
    $resource "/api/meta/:path", {path: '@path'}
  ])

.factory('CategoryService', ['$resource', ($resource) ->
    $resource "/api/categories/:path", {},
      get:{ method: 'GET', params: {path: '@path'}}
      query:{ method: 'GET', params: {path: 'credentials'}, isArray: true}
  ])

.factory('OperationLogService', ['$resource', ($resource) ->
    $resource("/api/operation_logs:path", {},
      query:
        method: 'GET',
        params: {path: '@path'},
        isArray: true,
    )
  ])

.factory('MonitorLogService', ['$resource', ($resource) ->
    $resource "/api/monitor_logs:path", {path: '@path'}
  ])

.factory('EventService', ['$resource', ($resource) ->
    $resource "/api/events/:path", {path: '@path'}
  ])

  .controller('TopoDetailCtrl', ['$rootScope', '$scope', '$filter', '$timeout', '$resource', '$state', '$stateParams','$location', '$log', '$modal', 'Utils', 'ngTableParams', 'SelectionService', 'MonitorLogService', 'OperationLogService', 'ToPoNodeService','NodeService', 'NodesService', 'MetaService', 'CategoryService', 'CacheService','EventService', 'LayoutService', 'MonitorCommonService', \
                                ( $rootScope,   $scope,   $filter,   $timeout,   $resource,   $state,   $stateParams,  $location,   $log,   $modal,   utils,   NgTable,         SelectionService,   monitorlogService,   operationlogService,   topoNodeService,  nodeService,   nodesService,   metaService,   categoryService,   CacheService,  eventService,   LayoutService,   MonitorCommonService)->
    topoLayoutID = "topoLayout"

    monitorCommonService = new MonitorCommonService()
    layoutService = new LayoutService {elemID: topoLayoutID}
    $scope.$on("$viewContentLoaded", (event)->
      $timeout ->
#        chartTreeService.initTree('#realTimeTree',topoNodeService,'realTimeLineGraph',echartService)
        monitorCommonService.onWindowResize(topoLayoutID, 60)
        monitorCommonService.onWindowResize("topoGraph", 60)
        monitorCommonService.onWindowResize("topoTable", 60)
        layoutService.aspectSettings "east", {initClosed: true}
        layoutService.aspectSettings "south"
        layoutService.aspectSettings "center", {paneSelector: "#topoLayoutCenter"}
        layout = layoutService.layout()
        eastSelector  = "#" + topoLayoutID + " > .ui-layout-east"
        southSelector = "#" + topoLayoutID + " > .ui-layout-south"
        layoutService.addPinBtn eastSelector, "east"
        layoutService.addPinBtn southSelector, "south"
        layoutService.addCloseBtn eastSelector, "east", "topoLayout_eastCloser"
        layoutService.addCloseBtn southSelector,  "south", "topoLayout_southCloser"
        twaverService.appendToolbar document.getElementById "topoToolbar"
        twaverService.appendTopo    document.getElementById "topoGraph"
        twaverService.appendSheet   document.getElementById "topoSheet"
      , 0
    )

    $log.log "init TopoDetailCtrl"
    $scope.topoClass="ng-show"
    path = $stateParams.path || "/"

    ###========================   twaverService   ============================###
    twaverService = $scope.twaverService

    #获取监控日志列表和操作日志列表
    $scope.options =
      page: 1   # show first page
      count: 10 # count per page
    $scope.cacheService = new CacheService "id", (value)->
      operationlogService.get {id:value}
    args =
     total: 0,
     getData: ($defer,params) ->
       operationlogService.query params.url(), (data, headers) ->
         params.total headers('total')
         $defer.resolve $scope.operationlog = data
    args2 =
     total: 0,
     getData: ($defer,params) ->
       monitorlogService.query params.url(), (data, headers) ->
         params.total headers('total')
         $defer.resolve $scope.monitorlog = data

    $scope.operationlogTable = new NgTable(angular.extend($scope.options, $location.search()), args)
    $scope.monitorlogTable = new NgTable(angular.extend($scope.options, $location.search()), args2)
    $scope.initEventLogTable("/")
    $scope.initTopoTable( "/" )

    $scope.showTopoTable = ->
      path = twaverService.getMapModel().getOpenPath()
      path = "/" if !path or !path.startWith( '/' )
      $scope.reloadTopoTable( path )

    # 鼠标右键事件，弹窗相关方法
    $scope.newEngine (node)->
      $state.go "resources.topos_detail.add"
      $state.go "resources.topos_detail.add.engine", {path:node.getClient("data").path, title : "引擎"}

    $scope.newResource (node)->
      $state.go "resources.topos_detail.add"
      $state.go "resources.topos_detail.add.resource", {path:node.getClient("data").path, title : "资源项"}

    $scope.newDynamicResourceGroup (node)->
      $state.go "resources.topos_detail.add"
      $state.go "resources.topos_detail.add.dynamic", {path:node.getClient("data").path, title : "动态资源组"}

    $scope.newStaticResourceGroup (node)->
      $state.go "resources.topos_detail.add"
      $state.go "resources.topos_detail.add.static", {path:node.getClient("data").path, title : "静态资源组"}

    $scope.remove (node)->
      $rootScope.resourceModel = node.getClient("data")
      $rootScope.twaverTopoNode = node
      console.log "rewrite remove function"
      path = node.getClient("data").path
      end = path.lastIndexOf("/")
      parentPath = path.substr(0, end+1)
      nodeService.get({path:parentPath}).$promise
      .then (data)->
        $rootScope.monitorModel = data
        nodeService.get({path:path}).$promise
      .then (data)->
        $state.params.scope = $scope
        switch data.type
          when "Resource"
            $state.params.title = "资源项"
            $state.go "resources.topos_detail.delete"
            $state.go "resources.topos_detail.delete.resource", {path:parentPath, title : "资源项"}
          when "IpRange"
            $state.params.title = "动态资源组"
            $state.go "resources.topos_detail.delete"
            $state.go "resources.topos_detail.delete.dynamic", {path:parentPath, title : "动态资源组"}
          when "Group"
            $state.params.title = "静态资源组"
            $state.go "resources.topos_detail.delete"
            $state.go "resources.topos_detail.delete.static", {path:parentPath, title : "静态资源组"}

    $scope.properties (node)->
      data = node.getClient("data")
      path = data.path
      $state.go "resources.topos_detail.edit"
      switch data.type
        when "Resource"
          $state.go "resources.topos_detail.edit.resource",{path:path, title:"资源项"}
        when "IpRange"
          $state.go "resources.topos_detail.edit.dynamic",{path:path, title:"动态资源组"}
        when "Group"
          $state.go "resources.topos_detail.edit.static",{path:path, title:"静态资源组"}

    $scope.execAutoFind (node)->
      data = node.getClient("data")
      path = data.path
      $resource('/api/discover/' + path).save()
  ])
