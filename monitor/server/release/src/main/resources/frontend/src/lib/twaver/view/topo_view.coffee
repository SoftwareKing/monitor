angular.module("Lib.Twaver.View.TopoView", [])

# 为Topo视图提供公用方法
.factory("TopoView", ["$rootScope", "JsonCycleParser", 'TopoUtils', \
                      ($rootScope,   JsonCycleParser,   TopoUtils)->

  class TopoView

    #     twaver object alias
    DataBox               = twaver.DataBox
    ElementBox            = twaver.ElementBox
    Data                  = twaver.Data
    Link                  = twaver.Link
    Node                  = twaver.Node
    Property              = twaver.Property
    Column                = twaver.Column
    Tab                   = twaver.Tab
    Dummy                 = twaver.Dummy
    SubNetwork            = twaver.SubNetwork
    Group                 = twaver.Group
    AlarmStatePropagator  = twaver.AlarmStatePropagator
    AlarmStateStatistics  = twaver.AlarmStateStatistics
    SelectionModel        = twaver.SelectionModel

    SpringLayouter        = twaver.layout.SpringLayouter

    Network               = twaver.network.Network
    ElementUI             = twaver.network.ElementUI
    LabelAttachment       = twaver.network.LabelAttachment

    Accordion             = twaver.controls.Accordion
    BorderPane            = twaver.controls.BorderPane
    List                  = twaver.controls.List
    PropertySheet         = twaver.controls.PropertySheet
    SplitPane             = twaver.controls.SplitPane
    Table                 = twaver.controls.Table
    TablePane             = twaver.controls.TablePane
    TabPane               = twaver.controls.TabPane
    TitlePane             = twaver.controls.TitlePane
    Tree                  = twaver.controls.Tree
    TreeTable             = twaver.controls.TreeTable
    PopupMenu             = twaver.controls.PopupMenu

    CLEARED               = twaver.AlarmSeverity.CLEARED
    INDETERMINATE         = twaver.AlarmSeverity.INDETERMINATE
    WARNING               = twaver.AlarmSeverity.WARNING
    MINOR                 = twaver.AlarmSeverity.MINOR
    MAJOR                 = twaver.AlarmSeverity.MAJOR
    CRITICAL              = twaver.AlarmSeverity.CRITICAL

    constructor: (@options, @menuItems)->
      @menuItems = [] if !@menuItems or @menuItems.length is 0
      @topoUtils      = new TopoUtils()

      defaultOptions  = { customActions:  {} }  # 业务Action
      @options        = $.extend( true, defaultOptions, @options )

      @box            = new ElementBox()
      @network        = new Network( @box )
      @selectionModel = new SelectionModel( @box )
      @nodePathMappings = {}
      @mapLinkPathMappings = {}  # {fromNodePath-toNodePath: link}
      @mapNodePathMappings = {}

      # 弹簧布局
#      @springLayouter = new SpringLayouter( @network )
#      @springLayouter.isVisible = (elem)->
#        return false if !elem
#        return false if elem instanceof Link or elem instanceof Dummy
#        data = elem.getClient('data')
#        return false if !data
#        return true if !data.hasOwnProperty( 'coordinate' )
#        coordinate = data.coordinate
#        return true if !coordinate or ( coordinate.x is 0 and coordinate.y is 0 )
#        return false
#      @springLayouter.setNodeRepulsionFactor( 0.4 )
#      @springLayouter.start()

      @initEvent()
      @addAllListeners()

    initEvent: ()->
      self = this

      self.box.addDataBoxChangeListener (e)->
        elem = e.data
        return if self.isFakeElem( elem )
        data = elem.getClient( "data" )
        switch e.kind
          when "add", "update"
            if elem instanceof Node
              self.mapNodePathMappings[ data.path ] = elem
              # 布局
#              self.priNodeLayout( elem )

            if elem instanceof Dummy
              self.nodePathMappings[ data.path ]  = elem
              self.createFakeDummy( elem ) if data.hasOwnProperty( 'groupSize' ) and data.groupSize > 0
              siblingElements = self.box.getSiblings( elem )
              # 删除fake节点
              siblingElements.forEach (elem)->
                return self.box.remove( elem ) if self.isFakeElem( elem )
              return
            if elem instanceof Link
              self.mapLinkPathMappings[ "#{data.fromId}-#{data.toId}" ] = elem
          when "remove"
            if elem instanceof Dummy
              delete self.nodePathMappings[ data.path ]
              return
            if elem instanceof Node
              delete self.mapNodePathMappings[ data.path ]
              return
            if elem instanceof Link
              delete self.mapLinkPathMappings[ "#{data.fromId}-#{data.toId}" ]

    ###====================   事件管理   ==================###
    addAllListeners: ()->
      self = this

      events = []
      for event in events
        handler = self["handle#{event.replace( /\./g, '' )}"]
        $rootScope.$on( event, handler ) if handler

    ###====================   node 布局   ==================###
    layout: (map)->
      return if !map
      return if !map.hasOwnProperty( 'nodes' ) or !map.nodes
      for node in map.nodes
        elem = @mapNodePathMappings[ node.path ]
        @priNodeLayout( elem )

    priNodeLayout: (elem)->
      return if !elem
      return if !data = elem.getClient( 'data' )
      initX = 20
      initY = 20
      intervalX = 100
      intervalY = 100

      location = elem.getLocation()
      return if location.x isnt 0 or location.y isnt 0
      width = elem.getWidth()
      height = elem.getHeight()

      minX = initX
      minY = initY
      maxX = minX + width
      maxY = minY + height

      viewWidth = $('#topoLayout').width()

      nodes = []
      @box.getDatas().forEach (e)->
        nodes.push( e ) if e instanceof Node and e.getClient( 'data' ).path isnt data.path

      isCompleted = false
      while !isCompleted
        num = 0
        for node in nodes
          judgeOne = Math.abs( 2 * node.getX() + node.getWidth() - minX - maxX ) <= maxX - minX + node.getWidth()
          judgeTwo = Math.abs( 2 * node.getY() + node.getHeight() - minY - maxY ) <= maxY - minY + node.getHeight()
          if judgeOne and judgeTwo
            minX = node.getX() + node.getWidth() + intervalX
            maxX = minX + width
            if maxX > viewWidth
              minX = initX
              maxX = minX + width
              minY = maxY + intervalY
              maxY = minY + height
            break
          num++
        if nodes.length is num
          isCompleted = true
          elem.setLocation( minX, minY )
          data.coordinate = elem.getLocation()
          delete data.map
          delete data['@id']
          @options.customActions[ "updateNode" ]( data ) if @options.customActions[ "updateNode" ]

    ###====================   管理fake节点(tree非叶子节点为了展示折叠图标而添加的假节点，假节点没有client数据)   ====================###
    isFakeElem: (elem)->
      return if !elem
      return false if elem.getClient("data")
      return true

    # 节点有且只有一个假节点则认为没有子结点
    hasChildren: (elem)->
      return if !elem
      children = elem.getChildren()
      return false if children.size() is 1 and @isFakeElem( children.get( 0 ) )
      return true if children.size() > 0
      return false

    # 节点有且只有一个假节点则返回空数组
    getChildren: (elem)->
      return if !elem
      return if !@hasChildren( elem )
      return elem.getChildren()

    isLeafElem: (elem)->
      return if !elem
      data = elem.getClient("data")
      return data.leaf if data.leaf
      return true if data.type is "Resource"
      return false

    ###====================   Start: 创建网元   ====================###

    createNode: (data)->
      node = new Node()
      @nodeSetting( node, data )
      @addAlarm( node, data.summary )
      @box.add( node )
      return node

    updateNode: (data)->
      return if !@nodePathMappings[ data.path ]
      node = @nodePathMappings[ data.path ]
      @nodeSetting( node, data )
      @updateAlarm node, data.summary
      return node

    removeNode: (data)->
      return if !data
      node = @mapNodePathMappings[ data.path ]
      return if !node
      @box.remove( node )

    nodeSetting: (node, data)->
      return if !node or !data
      @registerImage( data.icon, "assets/sys_icons/#{data.icon}/32x32.png", 32, 32) if data.icon
      node.setLocation data.coordinate.x, data.coordinate.y if data.coordinate
      node.setName data.label if data.label
      node.setImage data.icon if data.icon
      node.setClient "data", data

    createDummy: (data, parentDummy)->
      dummy = new Dummy()
      @dummySetting( dummy, data )
      dummy.setParent parentDummy if parentDummy
      @addAlarm dummy, data.summary if data.summary
      @box.add( dummy )
      return dummy

    # 为了让非叶子节点能显示折叠图标，为其创建一个假的子节点，当其子结点真正加载时去掉
    createFakeDummy: ( parentDummy )->
      return if !parentDummy
      dummy = new Dummy()
      dummy.setParent( parentDummy )
      @box.add( dummy )
      return dummy

    removeFakeDummyByPath: ( path )->
      return if !path
      parentElem = @nodePathMappings[ path ]
      return if !parentElem
      children = parentElem.getChildren()
      if children and children.size() is 1 and @isFakeElem( children.get( 0 ) )
        @box.remove( children.get( 0 ) )

    updateDummy: (data)->
      return if !@nodePathMappings[ data.path ]
      dummy = @nodePathMappings[ data.path ]
      @dummySetting( dummy, data )
      @updateAlarm( dummy, data.summary ) if data.summary
      return dummy

    removeDummy: (data)->
      @box.remove( dummy ) if dummy = @nodePathMappings[ data.path ]

    dummySetting: (dummy, data)->
      return if !dummy or !data
      dummy.setName data.label if data.label
      dummy.setClient "data", data

    createLinks: (mapData)->
      return if !mapData
      jsonCycleParser = new JsonCycleParser( mapData )
      mapData = jsonCycleParser.json
      return if !linkDatas = mapData.links
      for data in linkDatas
        continue if !fromNode = @mapNodePathMappings[ data.fromNode.path ]
        continue if !toNode   = @mapNodePathMappings[ data.toNode.path ]
        @createLink(data, fromNode, toNode)

    createLink: (data, fromNode, toNode)->
      link = new Link( fromNode, toNode )
      link.setName data.label
      link.setClient( "data", data )
      link.setStyle('arrow.to', true);
      link.setStyle('arrow.to.shape', 'arrow.slant');
      @box.add link
      return link

    removeLink: (link)->
      return if !link
      @box.remove( link )

    removeLinks: (mapData)->
      return if !mapData
      for path, link of @mapLinkPathMappings
        @box.remove( link )

    node2Dummy: (node)->
      return if !node
      data = node.getClient( "data" )
      dummy = new Dummy()
      dummy.setClient("data", data)
      # 考虑没有parent的情况
      dummy.setParent( node.getParent() )
      @dummySetting( dummy, data )
      @updateAlarm( dummy, @getAlarmSummary( node ) )
      children = $.extend( true, {}, @getChildren( node ) )
      @box.remove( node )
      @box.add( dummy )
      @setChildren( dummy, children ) if children and children["_as"] and children.size() > 0

    dummy2Node: (dummy)->
      return if !dummy
      data = dummy.getClient( "data" )
      node = new Node()
      # 考虑没有parent的情况
      node.setParent( dummy.getParent() )
      @nodeSetting( node, data )
      @updateAlarm( node, @getAlarmSummary( dummy ) )
      children = $.extend( true, {}, @getChildren( dummy ) )
      @box.remove( dummy )
      @box.add( node )
      @setChildren( node, children ) if children and children["_as"] and children.size() > 0

    # 删除父节点会自动删除子结点，所以把dummy与node的转换需要重新设置子节点
    setChildren: (elem, children)->
      return if !elem or !children or children.size() is 0
      for i in [0..( children.size() - 1 )]
        child = children.get( i )
        child.setParent( elem )
        @box.add( child )
        @setChildren( child, @getChildren( child ) ) if @hasChildren( child )

    ###====================   Start: 告警操作   ====================###

    addAlarm: (node, summary)->
      return if !node or !summary
      @alarmSetting( node, summary )

    updateAlarm: (node, summary)->
      return if !node or !summary
      node.getAlarmState().clear()
      @alarmSetting( node, summary )

    alarmSetting: (node, summary)->
      node.getAlarmState().increaseNewAlarm CLEARED, summary.CLEAR if summary.CLEAR
      node.getAlarmState().increaseNewAlarm INDETERMINATE, summary.INDETERMINATE if summary.INDETERMINATE
      node.getAlarmState().increaseNewAlarm WARNING, summary.WARNING if summary.WARNING
      node.getAlarmState().increaseNewAlarm MINOR, summary.MINOR if summary.MINOR
      node.getAlarmState().increaseNewAlarm MAJOR, summary.MAJOR if summary.MAJOR
      node.getAlarmState().increaseNewAlarm CRITICAL, summary.CRITICAL if summary.CRITICAL

    getAlarmSummary: (node)->
      summary =
        CLEAR:          node.getAlarmState().getAlarmCount( CLEARED )
        INDETERMINATE:  node.getAlarmState().getAlarmCount( INDETERMINATE )
        WARNING:        node.getAlarmState().getAlarmCount( WARNING )
        MINOR:          node.getAlarmState().getAlarmCount( MINOR )
        MAJOR:          node.getAlarmState().getAlarmCount( MAJOR )
        CRITICAL:       node.getAlarmState().getAlarmCount( CRITICAL )
      return summary

    ###====================   Start: 节点操作方法   ====================###

    hasParent: (path)->
      parentPath = @topoUtils.getPrePath( path )
      return true if @nodePathMappings[ parentPath ]
      return false

    getParent: (path)->
      return null if !@hasParent( path )
      parentPath = @topoUtils.getPrePath( path )
      return @nodePathMappings[ parentPath ]

    ###===============================  Start：对nodePathMappings做管理  ===============================###

    getNodeByPath: (path)->
      @nodePathMappings[ path ]

    getChildrenByPath: (path)->
      elem = @nodePathMappings[ path ]
      return @getChildren( elem ) if elem

    # 根据path迭代查找节点，直到找到为止或者path迭代结束；
    # 可能该path上都没有存在的节点，调用此方法需要判断非空，此情形属于异常情况
    getFirstExistNode: (path)->
      while path
        return @getNodeByPath( path ) if @isNodeExist( path )
        path = @topoUtils.getPrePath( path )

    isNodeExist: (path)->
      return true if @getNodeByPath( path )
      return false

    ###===============================  End：对path做管理  ===============================###

#      hasChildren: (path)->
#        node = @nodePathMappings[ path ]
#        return false if !node

    # 注册图像
    registerImage: (name, source, width, height)->
      twaver.Util.registerImage name, source, width, height

    # 初始化菜单
    initMenu: (popupMenu)->
      self = this
      lastData = {}
      lastPoint = {}
      magnifyInteraction = null

      # 菜单显示前的回调函数，如果返回false，则右键菜单不显示
      popupMenu.onMenuShowing = (e)->
        lastData = self.network.getSelectionModel().getLastData();
        lastPoint = self.network.getLogicalPoint(e);
        magnifyInteraction = null;
        self.network.getInteractions().forEach (interaction)->
          magnifyInteraction = interaction if interaction instanceof twaver.network.interaction.MagnifyInteraction or interaction instanceof twaver.canvas.interaction.MagnifyInteraction
        return true if lastData
        return false

      # 菜单点击时的回调函数
      popupMenu.onAction = (menuItem)->
        self.tree.expand lastData if menuItem.alias is "expand"
        if menuItem.alias is "execAutoFind"
          self.options.customActions[ "exec_auto_find" ] lastData if self.options.customActions[ "exec_auto_find" ]
        if menuItem.alias is "new_engine"
          self.options.customActions[ "new_engine" ] lastData if self.options.customActions[ "new_engine" ]
        if menuItem.alias is "new_dynamicResourceGroup"
          self.options.customActions[ "new_dynamicResourceGroup" ] lastData if self.options.customActions[ "new_dynamicResourceGroup" ]
        if menuItem.alias is "new_staticResourceGroup"
          self.options.customActions[ "new_staticResourceGroup" ] lastData if self.options.customActions[ "new_staticResourceGroup" ]
        if menuItem.alias is "new_resource"
          self.options.customActions[ "new_resource" ] lastData if self.options.customActions[ "new_resource" ]
        if menuItem.alias is "remove"
          self.options.customActions[ "remove" ] lastData if self.options.customActions[ "remove" ]
        if menuItem.alias is "properties"
          self.options.customActions[ "properties" ] lastData if self.options.customActions[ "properties" ]

      # 获取菜单项是否可见，默认菜单项的visible属性不为false时可用
      popupMenu.isVisible = (menuItem)->
        return menuItem.group is 'Magnify' if magnifyInteraction
        if lastData
          getNodeData = (data, conditions)->
            for condition in conditions
              # node 的数据可能是从api/map/path获取的，相关字段可能没有，所以需要判断获取最全的数据信息
              if !data[ condition.key ]
                $.ajax(
                  url: "api/node#{data.path}", type: "GET", async: false
                  success: (result)->
                    data = result
                )
              return data
            return data

          # 菜单项不可见 条件处理
          data = lastData.getClient "data"
          if conditions = menuItem.invisibleConditions
            data = getNodeData data, conditions
            return false for condition in conditions when data[ condition.key ] is condition.value
          # 菜单项可见 条件处理
          if conditions = menuItem.visibleConditions
            data = getNodeData data, conditions
            return false for condition in conditions when data[ condition.key ] isnt condition.value
          return true

      # 获取菜单项是否可用，默认菜单项的enable属性不为false时可用
      popupMenu.isEnabled = (menuItem)->
        if lastData
          return true if lastData instanceof SubNetwork
          if lastData instanceof Group and menuItem.group is 'Group'
            expanded = lastData.isExpanded();
            return !expanded if menuItem.expand
            return expanded
          if lastData instanceof Link and menuItem.group is 'Link'
            expanded = lastData.getStyle("link.bundle.expanded");
            return !expanded if menuItem.expand
            return expanded
          if menuItem.label is 'Clear Alarm'
            return !lastData.getAlarmState().isEmpty();
        else
          return self.network.getCurrentSubNetwork() != null if menuItem.label is 'Up SubNetwork'
        return true;

      # 设置菜单项数组
      popupMenu.setMenuItems( self.menuItems )

    ###==================  对外方法   =====================###

    setCustomActions: (key, action)->
      @options.customActions[ key ] = action

])