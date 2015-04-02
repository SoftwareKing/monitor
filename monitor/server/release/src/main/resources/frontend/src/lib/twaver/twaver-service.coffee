angular.module("Lib.Twaver.TwaverService", [
  # 数据模型
  "Lib.Twaver.Model.NodeModel",
  "Lib.Twaver.Model.MapModel",
  "Lib.Twaver.Model.EventModel",
  # 视图模型
  "Lib.Twaver.View.TopoView",
  "Lib.Twaver.View.TopoTree",
  "Lib.Twaver.View.TopoMap",

  'Lib.Twaver.TopoUtils',
  'Lib.Twaver.Service.TwaverTopoService'
])

.factory("TwaverService", ["$log", "$rootScope", "$location", "NodeModelService", "MapModelService", "EventModelService", "TopoView", "TopoTree", "TopoMap", 'TopoUtils', 'TwaverTopoService', \
                          ( $log,   $rootScope,   $location,   nodeModelService,   mapModelService,   eventModelService,   TopoView,   TopoTree,   TopoMap,   TopoUtils,   TwaverTopoService)->
  class TwaverService

    constructor: (@options, @service, menuItems)->
      @nodeType =
        GROUP:    "Group"
        IP_RANGE: "IpRange"
        RESOURCE: "Resource"
      @init( menuItems )

    ###======  初始化  ========###
    init: ( menuItems )->
      @service = new TwaverTopoService() if !@service
      @topoUtils        = new TopoUtils()

      defaultOptions    = { customActions:  {} }  # 业务Action
      @options          = $.extend( true, defaultOptions, @options )

      @nodeModel        = nodeModelService.getNodeModel()
      @mapModel         = mapModelService.getMapModel()
      @eventModel       = eventModelService.getEventModel()
      # TopoView中的databox是全局共用的，所以在manager层初始化TopoView
      @topoView         = new TopoView( { customActions: @options.customActions }, menuItems )
      @topoTree         = new TopoTree( @topoView, @service )
      @topoMap          = new TopoMap( @topoView, @service )

      @addAllListeners()

    ###======  事件监听  ========###
    addAllListeners: ->
      self = this
      # 浏览器地址路径change事件
      remove = $rootScope.$watch( ->
        return $location.$$url
      , (newPath, oldPath)->
        return remove() if self.removePathChangeListener(newPath, oldPath)
        topoPath = self.getTopoPath( newPath )
        self.showTree( topoPath )
        self.showMap( topoPath )
      , true)

      self.handleTwaverServiceLoadNodes = (e, path)->
        nodeDatasArray = self.loadFullNodeDatas( path )
        self.nodeModel.addNodes( nodeDatas ) for nodeDatas in nodeDatasArray

      self.handleTwaverServiceShowMap = (e, data)->
        return if !data
        self.showMap( data.path )
        self.options.customActions[ "reloadEventTable" ]( data.path ) if self.options.customActions[ "reloadEventTable" ]

      events = ["TwaverService.LoadNodes", "TwaverService.ShowMap"]
      for event in events
        handler = self["handle#{event.replace( /\./g, '' )}"]
        $rootScope.$on( event, handler ) if handler

    ###======  内部方法  ========###
    showTree: (path)->
      return if !path
      nodeDatasArray = @loadParentNodeDatas( path )
      @nodeModel.addNodes( nodeDatas ) for nodeDatas in nodeDatasArray

    showMap: (path)->
      return if !path
      mapData = @loadMapData( path )
      @mapModel.addMap( mapData )
      @mapModel.setOpenMap( mapData )

    # 获取浏览器url topo path     
    getTopoPath: (urlPath)->
      return "/" if urlPath.indexOf( "path=" ) is -1
      topoPath = urlPath.substring(urlPath.indexOf("path=") + 5, urlPath.length)
      topoPath = @topoUtils.prettyPath( topoPath )
      topoPath = "/" if !topoPath
      return topoPath

    # 加载该路径上的父节点、兄弟节点和子节点
    loadFullNodeDatas: (path)->
      return if !path
      nodeDatasArray = []
      tmpArray = @loadParentNodeDatas( path )
      nodeDatasArray = nodeDatasArray.concat( tmpArray ) if tmpArray? and tmpArray.length > 0
      tmp = @loadSiblingNodeDatas( path )
      nodeDatasArray.push( tmp ) if tmp? and tmp.length > 0
      tmp = @loadChildNodeDatas( path )
      nodeDatasArray.push( tmp ) if tmp? and tmp.length > 0
      return nodeDatasArray

    # 加载该路径上未加载过的节点
    loadParentNodeDatas: (path)->
      nodeDatasArray = []
      while @topoUtils.hasPrePath( path )
        path = @topoUtils.getPrePath( path )
        break if @nodeModel.nodes[ path ] # 节点加载过则该路径上的节点都已加载过
        nodeDatas = @service.getNodes( path, false )
        return if !nodeDatas or nodeDatas.length is 0
        nodeDatasArray.unshift( nodeDatas )
      # 根节点需要处理
      if !@nodeModel.nodes[ "/" ]
        rootDatas = []
        rootData = @service.getNode( "/" )
        return if !rootData
        rootDatas.push( rootData )
        nodeDatasArray.unshift( rootDatas )
      return nodeDatasArray

    loadSiblingNodeDatas: (path)->
      return if !path
      return if @nodeModel.nodes[ path ]
      return @service.getNodes( @topoUtils.getPrePath( path ), false )

    # 加载当前选中路径下的子节点
    loadChildNodeDatas: (path)->
      return if !path
      path = @topoUtils.prettyPath( path, true )
      children = @topoView.getChildrenByPath( path )
      return if children and children.size() > 0
      return @service.getNodes( path, false )

    # 加载map
    loadMapData: (path)->
      return if !path
      mapData = @mapModel.maps[ path ]
      return mapData if mapData
      return mapData if mapData = @service.getMap( path )

    removePathChangeListener: (currUrl, preUrl)->
      currUrl = if currUrl.indexOf("?") is -1 then currUrl else currUrl.substring( 0, currUrl.indexOf( "?" ) )
      preUrl = if preUrl.indexOf("?") is -1 then preUrl else preUrl.substring( 0, preUrl.indexOf( "?" ) )
      return true if currUrl isnt preUrl
      return false

    ###======  对外提供的方法  ========###
    appendTree: (elem)->
      graph.Util.appendChild @topoTree.tree.getView(), elem, 0, 0, 0, 0

    appendToolbar: (elem)->
      graph.Util.appendChild @topoMap.toolbar, elem, 0, 0, 0, 0

    appendTopo: (elem)->
      graph.Util.appendChild @topoMap.network.getView(), elem, 60, 0, 0, 0

    appendSheet: (elem)->
      graph.Util.appendChild @topoMap.sheet.getView(), elem, 0, 0, 0, 0

    setCustomActions: (key, action)->
      @options.customActions[ key ] = action
      @topoView.setCustomActions( key, action )

    ###======  属性get方法  ========###
    getNodeModel: ->
      return @nodeModel
    getMapModel: ->
      return @mapModel
    getEventModel: ->
      return @eventModel

    getTopoView: ->
      return @topoView
    getTopoTree: ->
      return @topoTree
    getTopoMap: ->
      @topoMap

    addResource: ->
    updateResource: ->
    removeResource: ->

    addGroup: ->
    updateGroup: ->
    removeGroup: ->

])