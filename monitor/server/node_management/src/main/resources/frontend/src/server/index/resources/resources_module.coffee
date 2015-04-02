angular.module('ServerIndex.Resources', [
  'ResourceService'
])

.config ($stateProvider, $urlRouterProvider)->

  $urlRouterProvider.when '/resources', '/resources/topos/detail'

  $stateProvider.state 'resources',
    url: '/resources',
    abstract: true,
    controller: 'ResourcesCtrl',
    templateUrl: 'resources/index.tpl.jade',
    data: {pageTitle: '资源管理', default: 'resources.topos_detail'}

.factory('EventService', ['$resource', ($resource) ->
  $resource "/api/events/:pentsath", {path: '@path'}
])

.controller('ResourcesCtrl', ['$scope', '$rootScope', '$state', '$filter', '$resource', '$stateParams', '$log', '$location', '$modal', '$timeout', '$interval', 'Feedback', 'MetaService', 'CategoryService', 'TwaverService', 'EventService','ngTableParams', 'LayoutService','ChartService','ChartTreeService', 'ResourceService', 'TopoUtils', 'MonitorCommonService', \
                              ($scope,   $rootScope,   $state,   $filter,   $resource,   $stateParams,   $log,   $location,   $modal,   $timeout,   $interval,   feedback,   metaService,   categoryService,   TwaverService,   eventService,  NgTable,         LayoutService,  ChartService,  ChartTreeService,   ResourceService,   TopoUtils,   MonitorCommonService ) ->
    resourceService = new ResourceService()
    topoUtils = new TopoUtils()
    monitorCommonService = new MonitorCommonService()
    $scope.chartService=new ChartService()
    $scope.chartTreeService=new ChartTreeService()
    ###==================   布局   ==================###
    layout = (elemID)->
      layoutService = new LayoutService {elemID: elemID}
      layoutService.aspectSettings "west"
      layoutService.aspectSettings "center", {paneSelector: "#resourceTopo"}
      layoutService.layout()

      westSelector = "#" + elemID + " > .ui-layout-west"
      layoutService.addPinBtn westSelector, "west"
      layoutService.addCloseBtn westSelector, "west", "resourceLayout_westCloser"

      $scope.twaverService.appendTree document.getElementById "resourceTree"

    ###==================   获取告警数据   ==================###
    #获取告警数据
    path=$stateParams.path
    path = "/" if !$stateParams.path
    $scope.options =
      page: 1   # show first page
      count: 10 # count per page
    args3 =
      total: 0,
      getData: ($defer,params) ->
        eventService.query params.url(), (data, headers) ->
          params.total headers('total')
          $defer.resolve $scope.eventlog = data
#    $scope.eventlogTable = null
#    $scope.preEventQueryPath = ""
#    $scope.initEventLogTable = (path)->
#      return if !path
#      return if path is $scope.preEventQueryPath
#      $scope.preEventQueryPath = path
#      $scope.eventlogTable = new NgTable(angular.extend({page: 1, count: 10, "path": path}), args3)
#      $timeout ->
#        $scope.eventlogTable.reload()
#      , 0

    $scope.initEventLogTable = (path)->
      $scope.listPage = {
        data: []
        checkedList: []
        checkAllRow: false
        search: {limit:10, offset:0, orderBy:"", orderByType:""}
        settings: {
          reload: null
          getData: (search, fnCallback)->
            $scope.listPage.search.path         = path
            $scope.listPage.search.limit        = search.limit
            $scope.listPage.search.offset       = search.offset
            $scope.listPage.search.orderBy      = search.orderBy
            $scope.listPage.search.orderByType  = search.orderByType
            eventService.query($scope.listPage.search, (data)->
              $scope.listPage.data = data
              page = {rows: data, total: 40}
              fnCallback(page)
              $scope.listPage.checkedList = []
              $scope.listPage.checkAllRow = false
            )
          columns: [
            {
              sTitle: "<div class='checkbox'><label><input type='checkbox' ng-model='listPage.checkAllRow'><i></i></label></div>",
              mData: "id",
              mRender: (mData, type, full)->
                return '<div class="checkbox"><label><input type="checkbox" checklist-model="listPage.checkedList" checklist-value=\'' + mData + '\' /><i></i></label></div>';
            },
            {
              sTitle: "级别",
              mData: "severity",
              mRender: (mData, type, full)->
                return mData.str2Html()
            },
            {
              sTitle: "来源(群组/资源/组件)",
              mData: "path",
              mRender: (mData, type, full)->
                return mData.str2Html()
            },
            {
              sTitle: "消息",
              mData: "content",
              mRender: (mData, type, full)->
                return mData.str2Html()
            },
            {
              sTitle: "优先级",
              mData: "priority",
              mRender: (mData, type, full)->
                return mData.str2Html()
            },
            {
              sTitle: "确认状态",
              mData: "ack",
              mRender: (mData, type, full)->
                return mData.str2Html()
            },
            {
              sTitle: "创建时间",
              mData: "createdAt",
              mRender: (mData, type, full)->
                return $filter('date')(mData, 'yyyy-MM-dd HH:MM:ss')
            }
          ]
          columnDefs: [] # 定义列的约束
          defaultOrderBy: [] # 定义默认排序列为第8列倒序
        }
        action: {}
      }

    $scope.initTopoTable = (path)->
      $scope.topoTable = {
        data: []
        checkedList: []
        checkAllRow: false
        search: {limit:10, offset:0, orderBy:"", orderByType:""}
        settings: {
          reload: null
          getData: (search, fnCallback)->
            $scope.topoTable.search.limit        = search.limit
            $scope.topoTable.search.offset       = search.offset
            $scope.topoTable.search.orderBy      = search.orderBy
            $scope.topoTable.search.orderByType  = search.orderByType
            $resource( '/api/map:path', { "path": '@path' } ).get( $scope.topoTable.search, (data)->
              $scope.topoTable.data = data.nodes
              page = {rows: data.nodes, total: 40}
              fnCallback(page)
              $scope.topoTable.checkedList = []
              $scope.topoTable.checkAllRow = false
            )
          columns: [
            {
              sTitle: "<div class='checkbox'><label><input type='checkbox' ng-model='topoTable.checkAllRow'><i></i></label></div>",
              mData: "id",
              mRender: (mData, type, full)->
                return '<div class="checkbox"><label><input type="checkbox" checklist-model="topoTable.checkedList" checklist-value=\'' + mData + '\' /><i></i></label></div>';
            },
            {
              sTitle: "资源名称",
              mData: "label",
              mRender: (mData, type, full)->
                return mData.str2Html()
            },
            {
              sTitle: "资源路径",
              mData: "path",
              mRender: (mData, type, full)->
                return mData.str2Html()
            },
            {
              sTitle: "创建时间",
              mData: "createdAt",
              mRender: (mData, type, full)->
                return $filter('date')(mData, 'yyyy-MM-dd HH:MM:ss')
            },
            {
              sTitle: "更新时间",
              mData: "updatedAt",
              mRender: (mData, type, full)->
                return $filter('date')(mData, 'yyyy-MM-dd HH:MM:ss')
            }
          ]
          columnDefs: [] # 定义列的约束
          defaultOrderBy: [] # 定义默认排序列为第8列倒序
        }
        action: {}
      }

    $scope.reloadTopoTable = (path)->
      return if !$scope.topoTable
      $scope.topoTable.search.path = path
      $scope.topoTable.settings.reload()

    # 右键菜单-添加引擎
    $scope.newEngine = (funRef)->
      $scope.twaverService.setCustomActions("new_engine", funRef)

    # 右键菜单-添加资源
    $scope.newResource = (funRef)->
      $scope.twaverService.setCustomActions("new_resource", funRef)

    # 右键菜单-添加动态资源组
    $scope.newDynamicResourceGroup = (funRef)->
      $scope.twaverService.setCustomActions("new_dynamicResourceGroup", funRef)

    # 右键菜单-添加静态资源组
    $scope.newStaticResourceGroup = (funRef)->
      $scope.twaverService.setCustomActions("new_staticResourceGroup", funRef)

    # 右键菜单-删除...
    $scope.remove = (funRef)->
      $scope.twaverService.setCustomActions("remove", funRef)

    # 右键菜单-属性...
    $scope.properties = (funRef)->
      $scope.twaverService.setCustomActions("properties", funRef)

    # 右键菜单-执行自动发现
    $scope.execAutoFind = (funRef)->
      $scope.twaverService.setCustomActions("exec_auto_find", funRef)

    $scope.updateNode = (data)->
      topoNodeService = $resource("/api/topo_nodes/:id", {},
        update: {method: 'PUT', params: {id: '@id'}}
      )
      topoNodeService.update( { id: data.id },  data )

    ###====================================     = ===================================###
    # 界面布局
    angular.element(document).ready ->
      $timeout ->
        resourceLayoutID = "resourceLayout"
        monitorCommonService.onWindowResize( resourceLayoutID, $(".main-content-inner > .main-content").css("padding-bottom").replace("px", ""))
        layout resourceLayoutID
      , 0

    ### =========================   twaverService   ========================= ###

    modal = null
    $scope.close = ->
      modal.close()
      modal = null
    firstLetterToUpperCase = (str)->
      return str.replace str.charAt( 0 ), str.charAt( 0 ).toUpperCase() if str

    # 获取
    getOpenData = (currElem)->
      data = currElem.getClient( "data" )
      modelData={}
      resource = null
      $.ajax(
        url: "api/node#{data.path}", type: "GET", async: false
        success: (data)->
          resource = data.resource
          type = resource.type
          flag = true
          while flag
            $.ajax(
              url: "api/meta#{type}", type: "GET", async: false
              success: (data)->
                modelData=data
                path = data.properties["view.detail"]
                if path
                  path = path.substring( "resources/".length , path.length )
                  flag = false
                else
                  type = type.substring( 0, type.lastIndexOf("/") )
              error: (error)->
                type = type.substring( 0, type.lastIndexOf("/") )
            )
      )
      ctrl = path.substring( 0, path.lastIndexOf( "." ) )
      splits = ctrl.split( "/" )
      length = splits.length
      if length >= 2
        ctrl =  firstLetterToUpperCase( splits[ length - 2 ] )
        ctrl += firstLetterToUpperCase( splits[ length - 1 ] )
        ctrl += "Ctrl"

      return {"path": path, "ctrl": ctrl, address: resource.address,"modelData":modelData}

    # 打开资源对话框
    openResourceModel = (currElem)->
      openData = getOpenData( currElem )
      # 运转图对话框展示
      $scope.close() if modal
      modal = $modal.open(
        templateUrl: openData.path
        controller: openData.ctrl
        backdrop: false
        keyboard: false
        size: "lg"
        resolve:
          params: ->
            return {address: openData.address}
          parentScope: ->
            return $scope
      )
      modal.opened.then ->
        setTimeout ->
          $("#graphModalHeader").closest(".modal").css({overflow:"hidden"}).draggable()
        , 1000

    $rootScope.$on "ResourceModel.Open", (e, elem)->
      openResourceModel( elem )

    dbClick = (e, currElem)->
      data = currElem.getClient( "data" )
      switch data.type
        when "Group", "IpRange"
          $state.go "resources.topos_detail", {path: data.path}
        when "Resource"
          openResourceModel( currElem )

    getRealModel=( currElem )->
      realModelData = getOpenData( currElem)
      modelData=realModelData.modelData
      realData={}
      address=realModelData.address
      return if !urldetail=modelData.properties["api.detail"]
      url=urldetail.substring(0,urldetail.length-18)
      $.ajax(
        url: url, type: "GET", async: false,data:{"address":address}
        success: (data)->
          realData=data
        error: (error)->
      )
      $scope.chartTreeService.setChartService($scope.chartService)
      $scope.chartTreeService. setRealAndModelData(modelData,realData)
      console.log realModelData

    reloadEventTable = (path)->
      return if !path
      $scope.initEventLogTable(path)

    options =
      customActions:
        "properties":         $scope.properties
        "updateNode":         $scope.updateNode
        "reloadEventTable":   reloadEventTable

    menuItems = [
      { label: '展开', alias: "expand", group: 'Element' },
      { label: '执行自动发现', alias: "execAutoFind", group: 'Element', invisibleConditions: [ { key: "path", value: "/" }, { key: "path", value: "/infrastructure" } ] },
      { separator: true, group: 'Link' },
      { label: '添加', alias: "new",    group: 'Element', visibleConditions: [ {key: "@class", value: "dnt.monitor.model.GroupNode"} ]
        ,items: [
          { label: "监控引擎",    alias: "new_engine",               group: "Element", visibleConditions: [ {key: "path", value: "/"} ] },
          { label: "动态资源组",  alias: "new_dynamicResourceGroup", group: "Element", visibleConditions: [ {key: "@class", value: "dnt.monitor.model.GroupNode"} ], invisibleConditions: [ { key: "path", value: "/" } ] },
          { label: "静态资源组",  alias: "new_staticResourceGroup",  group: "Element", visibleConditions: [ {key: "@class", value: "dnt.monitor.model.GroupNode"} ], invisibleConditions: [ { key: "path", value: "/" } ] },
          { label: "资源",       alias: "new_resource",             group: "Element", visibleConditions: [ {key: "@class", value: "dnt.monitor.model.GroupNode"} ], invisibleConditions: [ { key: "path", value: "/" } ] }
        ]
      },
      { label: '删除', alias: "remove",     group: 'Element' },
      { label: '属性', alias: "properties", group: 'Element' }
    ]
    $scope.twaverService = new TwaverService( options, resourceService, menuItems )

    $scope.openPath = "/"
    $scope.$watch ->
      $scope.twaverService.getMapModel().getOpenPath()
#      console.log $scope.twaverService.getMapModel().getOpenPath()
    , (path)->
      $scope.reloadTopoTable( path )

    ## =========================   WebSocket   ========================= ###

    # 更新topo节点
    ## 1. 更新topo map（只更新加载过的数据）
    #### 1.1. 更新map_model.maps（根据路径判断有没有加载过）
    #### 1.2. 更新map_model.openMap
    ## 2. 更新topo tree（只更新加载过的数据）
    #### 2.1. 更新node_model.nodes（根据路径判断有没有加载过）

    # 监听node、map创建事件
    $scope.$on "ObjectCreatedEvent", (e, msg)->
      return if !msg.hasOwnProperty( 'source' )

      addMap = (map)->
        return if !map
        mapModel = $scope.twaverService.getMapModel()
        return if !mapModel.isExistMap( topoUtils.getPrePath( map.path ) )
        mapModel.addMap( map )
        mapModel.setOpenMap( map ) if mapModel.isOpen( map.path )

      addNode = (node)->
        return if !node
        nodeModel =  $scope.twaverService.getNodeModel()
        nodeModel.addNode( node ) if nodeModel.isExistPath( topoUtils.getPrePath( node.path ) )

      data = msg[ 'source' ]
      return addMap( data[ 'map' ] ) if data.hasOwnProperty( 'map' )
      return addNode( data[ 'node' ] ) if data.hasOwnProperty( 'node' )

    # 监听node、map更新事件
    $scope.$on "ObjectUpdatedEvent", (e, msg)->
      return if !msg.hasOwnProperty( 'source' )

      updateMap = (map)->
        return if !map
        mapModel = $scope.twaverService.getMapModel()
        return if !mapModel.isExistMap( map.path )
        mapModel.updateMap( map )
        mapModel.setOpenMap( map ) if mapModel.isOpen( map.path )

      updateNode = (node)->
        return if !node
        nodeModel =  $scope.twaverService.getNodeModel()
        nodeModel.updateNode( node ) if nodeModel.isExistPath( topoUtils.getPrePath( node.path ) )

      data = msg[ 'source' ]
      return updateMap( data[ 'map' ] ) if data.hasOwnProperty( 'map' )
      return updateNode( data[ 'node' ] ) if data.hasOwnProperty( 'node' )

    # 监听node、map删除事件
    $scope.$on "ObjectDestroyedEvent", (e, msg)->
      return if !msg.hasOwnProperty( 'source' )

      # 删除map后自动显示父级map
      removeMap = (map)->
        return if !map
        mapModel = $scope.twaverService.getMapModel()
        return if !mapModel.isExistMap( map.path )
        mapModel.removeMap( map )
        return if !mapModel.isOpen( map.path )
        parentPath = topoUtils.getPrePath(map.path)
        map = mapModel.getMap( parentPath )
        mapModel.setOpenMap( map ) if map

      removeNode = (node)->
        return if !node
        nodeModel =  $scope.twaverService.getNodeModel()
        nodeModel.removeNode( node ) if nodeModel.isExistPath( topoUtils.getPrePath( node.path ) )

      data = msg[ 'source' ]
      return removeMap( data[ 'map' ] ) if data.hasOwnProperty( 'map' )
      return removeNode( data[ 'node' ] ) if data.hasOwnProperty( 'node' )

    $scope.$on 'ResourcesCtrl.ReloadTopoTable', (e, path)->
      return if !path
      $scope.reloadTopoTable( path )


    ## =========================   old   ========================= ###
    $scope.$on "updateEvent", (e, msg)->
      # 更新告警
      updateAlarm = (data)->
        return if !data
        node = $scope.twaverService.getTopoView().getFirstExistNode( data.path )
        node.getAlarmState().increaseNewAlarm( topoUtils.getSeverity( data.severity ), 1 ) if node

      # 更新事件列表
      updateEventLog = (data)->
        return if !data
        return if !data.path.startWith( $scope.twaverService.getMapModel().getOpenMap().path )
        datas = $scope.listPage.data
        datas.unshift data
        datas.pop()
        $scope.listPage.data = datas
        $scope.$apply()

      data = msg.data
      console.log data.path
      updateAlarm( data )
      updateEventLog( data )

    # 更新topo node
    # include：new, remove
    # not include: update
    $scope.$on "updateTopoNode", (e, msg)->
      # 更新topo节点
      ## 1. 更新topo map（只更新加载过的数据）
      #### 1.1. 更新map_model.maps（根据路径判断有没有加载过）
      #### 1.2. 更新map_model.openMap
      ## 2. 更新topo tree（只更新加载过的数据）
      #### 2.1. 更新node_model.nodes（根据路径判断有没有加载过）
      updateTopoNodes = (data)->
        return if !data
        updateNode = null
        updateMap = null
        updateOpenMap = null
        switch data.type
          when "new"
            updateNode    = eval( nodeModel.addNode )
            updateMap     = eval( mapModel.addNodeIntoMap )
            updateOpenMap = eval( mapModel.addNodeIntoOpenMap )
          when "remove"
            updateNode    = eval( nodeModel.removeNode )
            updateMap     = eval( mapModel.removeNodeFromMap )
            updateOpenMap = eval( mapModel.removeNodeFromOpenMap )

        nodeModel = $scope.twaverService.getNodeModel()
        mapModel = $scope.twaverService.getMapModel()
        for node in nodes
          updateNode( node ) if nodeModel.isExistPath( node.path )
          continue if !mapModel.isExistMap( node.path )
          updateMap( node )
          continue if !mapModel.isOpen( node.path )
          updateOpenMap( node )

      data = msg.data # {type: new|remove, nodes: []}
      updateTopoNodes( data )

])
