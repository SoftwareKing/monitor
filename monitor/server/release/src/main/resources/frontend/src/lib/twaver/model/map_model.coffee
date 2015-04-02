angular.module("Lib.Twaver.Model.MapModel", [])

.service( 'MapModelService', [ '$log', 'MapModel', ($log, MapModel)->
  @mapModel = new MapModel()

  @getMapModel = ->
    @mapModel.init()
    return @mapModel

  return
] )

.factory("MapModel", ['$log', "$rootScope", 'TopoUtils', ($log, $rootScope, TopoUtils)->

  class MapModel

    constructor: ->
      @init()

    init: ->
      @maps     = {} # 加载过的map数据
      @openMap  = {} # 当前打开的map

    addMap: (map)->
      return if !map
      @publishEvent("Map", "Adding", map)
      @maps[map.path] = map
      @publishEvent("Map", "Added", map)

    updateMap: (map)->
      return if !map
      @publishEvent("Map", "Updating", map)
      @maps[map.path] = map
      @publishEvent("Map", "Updated", map)

    removeMap: (map)->
      return if !map
      @publishEvent("Map", "Removing", map)
      delete @maps[map.path]
      @publishEvent("Map", "Removed", map)

    setOpenMap: (map)->
      return if !map
      @publishEvent("Map", "Opening", map)
      @openMap = map
      @publishEvent("Map", "Opened", map)

    # 添加node到map.nodes数组中
    addNodeIntoMap: (node)->
      return if !node
      @publishEvent("Map", "NodeAdding", node)
      topoUtils = new TopoUtils()
      map = @maps[ topoUtils.getPrePath( node.path ) ]
      return if !map
      map.nodes.push( node )
      @publishEvent("Map", "NodeAdded", node)

    removeNodeFromMap: (node)->
      return if !node
      @publishEvent("Map", "NodeRemoving", node)
      topoUtils = new TopoUtils()
      map = @maps[ topoUtils.getPrePath( node.path ) ]
      return if !map
      map.nodes.removeElem( node )
      @publishEvent("Map", "NodeRemoved", node)

    # 添加node到openMap.nodes数组中
    addNodeIntoOpenMap: (node)->
      return if !node
      @publishEvent("Map", "OpenNodeAdding", node)
      topoUtils = new TopoUtils()
      openMap = @openMap[ topoUtils.getPrePath( node.path ) ]
      return if !openMap
      openMap.nodes.push( node )
      @publishEvent("Map", "OpenNodeAdded", node)

    removeNodeFromOpenMap: (node)->
      return if !node
      @publishEvent("Map", "OpenNodeRemoving", node)
      topoUtils = new TopoUtils()
      openMap = @openMap[ topoUtils.getPrePath( node.path ) ]
      return if !openMap
      openMap.nodes.removeElem( node )
      @publishEvent("Map", "OpenNodeRemoved", node)

    # 对应path的map是否已经加载过
    isExistMap: (path)->
      return false if !path
      return true if @maps[ path ]
      return false

    # 对应path的node是否已在topo图中显示
    isOpen: (path)->
      return false if !path
      return true if @openMap.path is path
      return false

    getOpenPath: ->
      return @openMap.path if @openMap

    getMap: (path)->
      return if !path
      return if !@isExistMap( path )
      return @maps[ path ]

    ###==============  getter  ==============###
    getMaps: ->
      return @maps
    getOpenMap: ->
      return @openMap

    publishEvent: (name, type, data)->
      return if !name
      eventName = name
      eventName += ".#{type}" if type
      $rootScope.$emit(eventName, data)

])