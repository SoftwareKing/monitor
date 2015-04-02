angular.module("Lib.Twaver.View.TopoMap", [])

.factory("TopoMap", ["$log", "$rootScope", 'TopoUtils', 'TwaverTopoService', \
                    ( $log,   $rootScope,   TopoUtils,   TwaverTopoService)->

  class TopoMap

    Dummy           = twaver.Dummy
    Node            = twaver.Node
    Group           = twaver.Group

    Network         = twaver.network.Network
    ElementUI       = twaver.network.ElementUI
    LabelAttachment = twaver.network.LabelAttachment

    PopupMenu       = twaver.controls.PopupMenu
    PropertySheet   = twaver.controls.PropertySheet

    constructor: (@topoView, @service)->
      @init()

    ###=================   初始化   ==================###
    init: ->
      @service = new TwaverTopoService() if !@service
      @topoUtils        = new TopoUtils()
      @options          = @topoView.options
      @network          = @topoView.network
      @popupMenu        = new PopupMenu( @network )
      @sheet            = new PropertySheet( @topoView.box )
      @toolbar          = graph.Util.createNetworkToolbar( @network )
      @topoView.initMenu( @popupMenu )
      @initEvent()
      @addAllListener()
      graph.Util.initToolbar( @toolbar, @network )
      graph.Util.initPropertySheet( @sheet )

    initEvent: ->
      self = this
      # tip提示
      self.network.getToolTip = (data)->
        tooltip = data.getToolTip()
        return tooltip if tooltip
        return data.getName()

      # 鼠标按下事件
      self.network.getView().addEventListener 'mousedown', (e)->
        target = self.network.hitTest e
        return if !target
        $log.log 'clicked ElementUI' if target instanceof ElementUI
        $log.log 'clicked LabelAttachment' if target instanceof LabelAttachment

      # 单击、双击事件
      self.network.addInteractionListener (e)->
        if e.kind is 'clickBackground '
          console.log 'click background'
        if e.kind is 'doubleClickElement'
          self.service.nodeDbClick( e )

        if e.kind is 'liveMoveEnd'
          data={}
          self.network.getMovableSelectedElements().forEach (node) ->
            data = node.getClient( "data" )
            data.coordinate = node.getLocation()
            node.setClient( "data", data )
            delete data.map
            delete data['@id']
          self.options.customActions[ "updateNode" ]( data ) if self.options.customActions[ "updateNode" ]

      self.network.setLinkableFunction (node)->
        return !(node instanceof Group)

    ###=================   事件管理   ==================###
    addAllListener: ->
      self = this

      self.handleMapOpened = (e, map)->
        return if !map
        self.removePreMap()
        self.showMap( map )
        self.publishEvent("Tree", "Expand", self.topoUtils.getPrePath( map.path ))
        self.publishEvent("Tree", "Select", map.path)

      self.handlePathSelected = (e, selectedPath)->
        return if !selectedPath
        self.publishEvent("Tree", "Select", selectedPath)

      self.handleMapOpenNodeAdded = (e, node)->
        return if !node
        self.showNode( node )

      self.handleMapOpenNodeRemoved = (e, node)->
        return if !node
        self.removeNode( node )

      events = ['Map.Adding', 'Map.Added', 'Map.Updating', 'Map.Updated', 'Map.Removing', 'Map.Removed'
              , "Map.Opening", "Map.Opened"
              , "Map.NodeAdding", "Map.NodeAdded", "Map.NodeRemoving", "Map.NodeRemoved"
              , "Map.OpenNodeAdding", "Map.OpenNodeAdded", "Map.OpenNodeRemoving", "Map.OpenNodeRemoved"]
      for event in events
        handler = self["handle#{event.replace( /\./g, '' )}"]
        $rootScope.$on( event, handler ) if handler

    ###=================   内部方法   ==================###
    # 删除之前的topo map
    removePreMap: ->
      @topoView.removeNode( node.getClient( "data" ) ) for path, node of @topoView.mapNodePathMappings
      @topoView.removeLinks(  )

    # 展示当前topo map
    showMap: (map)->
      return if !map
      return if !map.hasOwnProperty('nodes')
      return if !map.nodes
      @topoView.createNode( data ) for data in map.nodes
      @topoView.createLinks( map )
      @topoView.layout( map )

    showNode: (node)->
      return if !node
      @topoView.createNode( node )
      # TODO: create links

    removeNode: (node)->
      return if !node
      @topoView.removeNode( node )
      # TODO: remove links

    # 将当前展开的topo节点转dummy
    topoMap2Dummy: (nodeDatas)->
      return if !nodeDatas
      for data in nodeDatas
        node = @topoView.getNodeByPath( data.path )
        @topoView.node2Dummy( node )

    # 删除之前的link
    removeLinks: (mapData)->
      return if !mapData
      @topoView.removeLinks( mapData )

    createLink: (mapData)->
      return if !mapData
      parentElem = @topoView.getNodeByPath( mapData.path )
      return if !parentElem
      @topoView.createLinks( mapData, parentElem )

    showTopoMap: (mapData)->
      return if !mapData
      parentElem = @topoView.getNodeByPath( mapData.path )
      return if !parentElem
      # topo节点已生成
      if @topoView.hasChildren( parentElem )
        elements = $.extend( true, {}, @topoView.getChildren( parentElem ) )
        for i in [0..(elements.size() - 1 )]
          elem = elements.get( i )
          if elem instanceof Dummy
            @topoView.dummy2Node( elem )
        return
      # topo节点未生成
      @topoView.createNode( data, parentElem ) for data in mapData.nodes

    publishEvent: (name, type, data)->
      return if !name
      eventName = name
      eventName += ".#{type}" if type
      $rootScope.$broadcast(eventName, data)

])