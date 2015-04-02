angular.module("Lib.Twaver.Model.NodeModel", [])

.service( 'NodeModelService', [ '$log', 'NodeModel', ($log, NodeModel)->
  @nodeModel = new NodeModel()

  @getNodeModel = ->
    @nodeModel.init()
    return @nodeModel

  return
] )

.factory("NodeModel", ['$log', "$rootScope", 'TopoUtils', ($log, $rootScope, TopoUtils)->

  class NodeModel

    constructor: ->
      @init()

    init: ->
      @nodes  = {} # 已加载的node数据
      @paths  = { "/": "/"} # 已加载的node数据的path集合

    addNode: (node)->
      return if !node
      @publishEvent("Node", "Adding", node)
      @nodes[node.path] = node
      @priAddFullPath( node.path )
      @publishEvent("Node", "Added", node)

    updateNode: (node)->
      return if !node
      @publishEvent("Node", "Updating", node)
      @nodes[node.path] = node
      @priAddFullPath( node.path )
      @publishEvent("Node", "Updated", node)

    removeNode: (node)->
      return if !node
      @publishEvent("Node", "Removing", node)
      delete @nodes[node.path]
      @priRemoveFullPath( node.path )
      @publishEvent("Node", "Removed", node)

    addNodes: (nodes)->
      return if !nodes or nodes.length is 0
      @publishEvent("Nodes", "Adding", nodes)
      for node in nodes
        @nodes[ node.path ] = node
        @priAddFullPath( node.path )
      @publishEvent("Nodes", "Added", nodes)

    updateNodes: (nodes)->
      return if !nodes or nodes.length is 0
      @publishEvent("Nodes", "Updating", nodes)
      for node in nodes
        @nodes[ node.path ] = node
        @priAddFullPath( node.path )
      @publishEvent("Nodes", "Updated", nodes)

    removeNodes: (nodes)->
      return if !nodes or nodes.length is 0
      @publishEvent("Nodes", "Removing", nodes)
      for node in nodes
        delete @nodes[ node.path ]
        @priRemoveFullPath( node.path )
      @publishEvent("Nodes", "Removed", nodes)

    isExistPath: (path)->
      return false if !path
      return true if @paths[ path ]
      return false

    ###================  getter  ================###
    # paths 由本类维护，只对外提供获取的方法
    getNodes: ->
      return @nodes
    getPaths: ->
      return @paths

    ###================  内部方法  ================###
    # 添加指定path的所有父级path到paths集合中
    priAddFullPath: (path)->
      return if !path
      topoUtils = new TopoUtils()
      tempPath = path
      while tempPath isnt "/" and tempPath isnt ""
        return if @paths[ tempPath ]
        @paths[ tempPath ] = tempPath
        tempPath = topoUtils.getPrePath( tempPath )

    # 删除指定path及path下的所有子path
    priRemoveFullPath: (path)->
      return if !path
      tempPaths = $.extend( true, {}, @paths )
      delete @paths[ p ] for p of tempPaths when @paths[ p ].startWith( path )

    publishEvent: (name, type, data)->
      return if !name
      eventName = name
      eventName += ".#{type}" if type
      $rootScope.$emit(eventName, data)

])