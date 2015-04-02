angular.module("Lib.TwaverUtils", [])

#1、监听当前topo图path change事件：如果已跳出资源页面，则停止监听，否则保存当前path
#2、根据当前path自动渲染tree和topo图
#  2.1、生成topo节点：如果缓存了topo节点，从缓存中取，否则向后台请求
#  2.2、生成tree：从缓存中取数据

  .factory("TwaverServicefff", ['$rootScope', '$location', '$log', ($rootScope, $location, $log)->
    class TwaverServicefffff

      #     twaver object alias
      DataBox     = twaver.DataBox
      ElementBox  = twaver.ElementBox

      Data                  = twaver.Data
      Link                  = twaver.Link
      Node                  = twaver.Node
      Property              = twaver.Property
      Column                = twaver.Column
      Tab                   = twaver.Tab
      Dummy                 = twaver.Dummy
      Network               = twaver.network.Network
      AlarmStatePropagator  = twaver.AlarmStatePropagator
      AlarmStateStatistics  = twaver.AlarmStateStatistics

      Accordion     = twaver.controls.Accordion
      BorderPane    = twaver.controls.BorderPane
      List          = twaver.controls.List
      PropertySheet = twaver.controls.PropertySheet
      SplitPane     = twaver.controls.SplitPane
      Table         = twaver.controls.Table
      TablePane     = twaver.controls.TablePane
      TabPane       = twaver.controls.TabPane
      TitlePane     = twaver.controls.TitlePane
      Tree          = twaver.controls.Tree
      TreeTable     = twaver.controls.TreeTable

      CLEARED       = twaver.AlarmSeverity.CLEARED
      INDETERMINATE = twaver.AlarmSeverity.INDETERMINATE
      WARNING       = twaver.AlarmSeverity.WARNING
      MINOR         = twaver.AlarmSeverity.MINOR
      MAJOR         = twaver.AlarmSeverity.MAJOR
      CRITICAL      = twaver.AlarmSeverity.CRITICAL

      constructor: (@options)->
        @options.customEvents =   {}  if !@options.customEvents # tree, topo图事件
        @options.customActions =  {}  if !@options.customActions # 业务Action
        @nodeIdMappings = {} # {nodeId: node}
        @nodePathMappings = {} # (nodePath: node)
        @nodePreAlarmState = {} # {nodeId: AlarmState}
        @currTopoParentPath = ""  # 当前topo图 父节点的path

        @initModel()
        @addPathChangeListener()

      # 初始化数据模型
      initModel: ->
        @model =                        # TwaverService 数据模型，所有的数据都存储在该模型中
          path: ""                      # 当前topo图父节点的path
          nodeMappings: {}              # node


      init: ->
        @box                  = new ElementBox()
        @network              = new Network @box
        @tree                 = new Tree @box
        @sheet                = new PropertySheet @box
        @toolbar              = graph.Util.createNetworkToolbar @network
        @popupMenu            = new twaver.controls.PopupMenu @network
        @treeMenu             = new twaver.controls.PopupMenu @tree

        twaver.Defaults.PROPERTYSHEET_EXPAND_CATEGORY = false
        graph.Util.initToolbar @toolbar, @network
        graph.Util.initPropertySheet @sheet
        @initMenu @popupMenu
        @initMenu @treeMenu
        @addEvent()

      appendTree: (elem)->
        self = this
        graph.Util.appendChild self.tree.getView(), elem, 0, 0, 0, 0

      appendToolbar: (elem)->
        self = this
        graph.Util.appendChild self.toolbar, elem, 0, 0, 0, 0

      appendTopo: (elem)->
        self = this
        graph.Util.appendChild self.network.getView(), elem, 60, 0, 0, 0

      appendSheet: (elem)->
        self = this
        graph.Util.appendChild self.sheet.getView(), elem, 0, 0, 0, 0
      #判断该节点是否展开
      isExpanded:(node)->
        return @tree.isExpanded(node)
      #合并指定的树节点
      collapse:(node)->
        @tree.collapse(node)
      #展开指定的节点
      expand:(node)->
        @tree.expand(node)

      initAlarmTable: ->
        @alarmTable.setEditable(true)
        column = graph.Util.createColumn(@alarmTable, 'Alarm Severity', 'alarmSeverity', 'accessor', 'string', true);
        column.setWidth(120);
        column.setHorizontalAlign('center');
        setValue = column.setValue;
        column.setValue = (data, value, view)->
          value = twaver.AlarmSeverity.getByName(value);
          setValue.call(column, data, value, view);
        column.setEnumInfo(twaver.AlarmSeverity.severities.toArray());
        graph.Util.createColumn(@alarmTable, 'Id', 'id', 'accessor', 'string').setWidth(50);
        graph.Util.createColumn(@alarmTable, 'Element Id', 'elementId', 'accessor', 'string').setWidth(100);
        graph.Util.createColumn(@alarmTable, 'Acked', 'acked', 'accessor', 'boolean', true).setWidth(50);
        graph.Util.createColumn(@alarmTable, 'Cleared', 'cleared', 'accessor', 'boolean', true).setWidth(50);
        @addTab('Alarm Table', new TablePane(@alarmTable));

      addTab: (name, view, selected)->
        tab = new twaver.Tab(name);
        tab.setName(name);
        tab.setView(view)
        @tabPane.getTabBox().add(tab);
        @tabPane.getTabBox().getSelectionModel().setSelection(tab) if selected

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
          if menuItem.alias is "new_engine"
            self.options.customActions[ "newEngine" ] lastData if self.options.customActions[ "newEngine" ]
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
            return true if lastData instanceof twaver.SubNetwork
            if lastData instanceof twaver.Group and menuItem.group is 'Group'
              expanded = lastData.isExpanded();
              return !expanded if menuItem.expand
              return expanded
            if lastData instanceof twaver.Link and menuItem.group is 'Link'
              expanded = lastData.getStyle("link.bundle.expanded");
              return !expanded if menuItem.expand
              return expanded
            if menuItem.label is 'Clear Alarm'
              return !lastData.getAlarmState().isEmpty();
          else
            return self.network.getCurrentSubNetwork() != null if menuItem.label is 'Up SubNetwork'
          return true;

        # 设置菜单项数组
        popupMenu.setMenuItems(
          [
            { label: '展开', alias: "expand", group: 'Element', invisibleConditions: [ { key: "type", value: "Resource" } ] },
            { separator: true, group: 'Link', invisibleConditions: [ { key: "type", value: "Resource" } ] },
            { label: '添加', alias: "new",    group: 'Element', visibleConditions: [ {key: "type", value: "Group"} ]
              ,items: [
                { label: "监控引擎",    alias: "new_engine",               group: "Element", visibleConditions: [ {key: "path", value: "/"} ] },
                { label: "动态资源组",  alias: "new_dynamicResourceGroup", group: "Element", visibleConditions: [ {key: "type", value: "Group"} ], invisibleConditions: [ { key: "path", value: "/" } ] },
                { label: "静态资源组",  alias: "new_staticResourceGroup",  group: "Element", visibleConditions: [ {key: "type", value: "Group"} ], invisibleConditions: [ { key: "path", value: "/" } ] },
                { label: "资源",       alias: "new_resource",             group: "Element", visibleConditions: [ {key: "type", value: "Group"} ], invisibleConditions: [ { key: "path", value: "/" } ] }
              ]
            },
            { label: '删除', alias: "remove",     group: 'Element' },
            { label: '属性', alias: "properties", group: 'Element' }
          ])

      # 添加事件
      addEvent: ()->
        self = this

        # 添加数据容器的数据增减变化的监听器。当数据容器中的数据发生改变时（增加，删除，清空），就可以通过此方法监听
        self.box.addDataBoxChangeListener (e)->
          if e.kind is "add"
            self.listenPropertyChange e.data

        # tip提示
        self.network.getToolTip = (data)->
          tooltip = data.getToolTip()
          return tooltip if tooltip
          return data.getName()
        # 鼠标按下事件
        self.network.getView().addEventListener 'mousedown', (e)->
          target = self.network.hitTest e
          if target
            console.log 'clicked ElementUI' if target instanceof twaver.network.ElementUI
            console.log 'clicked LabelAttachment' if target instanceof twaver.network.LabelAttachment
        # 单击、双击事件
        self.network.addInteractionListener (e)->
          if e.kind is 'doubleClickElement'
            self.options.customEvents[ "nodeDbClick" ] e if self.options.customEvents[ "nodeDbClick" ]
        self.network.setLinkableFunction (node)->
          return !(node instanceof twaver.Group)

        # tree 监听事件
        self.tree.addInteractionListener (e)->
          if e.kind is "doubleClick"
            self.options.customEvents[ "treeDbClick" ] e if self.options.customEvents[ "treeDbClick" ]
          if e.kind is "expand"
            self.options.customEvents[ "treeExpandClick" ] e if self.options.customEvents[ "treeExpandClick" ]
      # 注册图像
      registerImage: (name, source, width, height)->
        twaver.Util.registerImage name, source, width, height

      # 生成topo前先处理相关问题：
      # 问题：前进、后退或者直接在浏览器上输入地址，会导致节点增多
      # 原因：根据地址栏的地址，ui-router直接跳转到topo页面，执行topo_module.coffee的代码，而resource_module.coffee的代码没有执行
      # 解决方案：根据path，先准备好环境，在创建节点
      # path情形：
      # 1、path先于之前path
      # 1、path等于之前path（相当于刷新）此时会执行rsource_module.coffee的代码
      # 1、path后于之前path
      prepareToCreate: (path, getNodesFunc)->
        self = this

        dealWithNode = (queryPath)->
          currentNode = self.nodePathMappings[ queryPath ]
          siblingNodes = self.box.getSiblings currentNode
          parentNode = {}
          removingNodes = []
          for i in [0..(siblingNodes.size() - 1)]
            node = siblingNodes.get i
            dummy = self.createDummy node.getClient("data"), null, currentNode.getParent()
            self.createFakeDummy dummy
#            if self.currTopoParentPath isnt "/"
#              currTempPath = self.currTopoParentPath.substring 0, self.currTopoParentPath.lastIndexOf "/"
#            self.createFakeDummy dummy if !self.isLeafNode(dummy) and currTempPath.indexOf(dummy.getClient("data").path) is -1
            parentNode = dummy if node.getId() is currentNode.getId()
            removingNodes.push node
          self.box.remove node for node in removingNodes
          return parentNode

        createCurrDummy = (queryPath, parentDummy)->
          if self.nodePathMappings[ queryPath ]
            # 该节点为Node，非Dummy，说明path改变前该节点作为Topo节点展示
            return dealWithNode queryPath if self.nodePathMappings[ queryPath ] instanceof twaver.Node

            return self.nodePathMappings[ queryPath ]

          # 删除父节点－》兄弟节点－》所有子节点
          siblingsNodes = self.box.getSiblings parentDummy
          self.removeChildren siblingsNodes.get i for i in [0..(siblingsNodes.size() - 1)]
          # 对于根节点需要做特殊处理，因为获取数据的api不同
          if queryPath is "/"
            rootDummyData = null
            $.ajax(
              url: "api/node/", type: "GET", async: false
              success: (data)-> rootDummyData = data
            )
            return self.createDummy rootDummyData

          # 非根节点
          nodeDatas = getNodesFunc queryPath.substring( 0, queryPath.lastIndexOf( "/" ) )
          for data in nodeDatas
            dummy = if parentDummy then self.createDummy data, null, parentDummy else self.createDummy data
            self.createFakeDummy dummy
          return self.nodePathMappings[ queryPath ]

        if path isnt "/"
          path = path.substring 0, (path.length - 1) while path.lastIndexOf("/") is path.length - 1
        self.currTopoParentPath = path

        # 该path节点不存在
        if !self.nodePathMappings[ path ]
          paths = path.split "/"
          parentDummy = null # 作为下一个节点的父节点
          queryPath = ""
          for p in paths
            queryPath = "#{queryPath}/#{p}".replace /\/\//g, "/"
            parentDummy = createCurrDummy queryPath, parentDummy
          return parentDummy

        # 该节点为Node，非Dummy，说明path改变前该节点作为Topo节点展示
        return dealWithNode path if self.nodePathMappings[ path ] instanceof twaver.Node

        # 该path节点存在
        currNode = self.nodePathMappings[ path ]
        siblingNodes = self.box.getSiblings currNode
        # 此处使用for循环（for i in [0..(siblingNodes.size() - 1)]）会有问题，siblingNodes每次循环都会少一条数据，故暂时使用while
        # 删除当前兄弟节点的所有子结点
        exit = false
        i = 0
        while !exit
          if i is siblingNodes.size()
            exit = true
            break
          break if siblingNodes.get(i) instanceof twaver.Link
          self.removeChildren siblingNodes.get i
          ++i
        return currNode

      # 删除父节点下的所有子结点
      removeChildren: (parent)->
        self = this
        if !parent.hasChildren()
          self.createFakeDummy parent
#          currTempPath = self.currTopoParentPath.substring 0, self.currTopoParentPath.lastIndexOf "/"
#          return self.createFakeDummy parent if !self.isLeafNode(parent) and currTempPath.indexOf(parent.getClient("data").path) is -1

        if parent.hasChildren()
          children = parent.getChildren()
          self.removeNode children.get 0 while children.size() isnt 0
          self.createFakeDummy parent
#          currTempPath = self.currTopoParentPath.substring 0, self.currTopoParentPath.lastIndexOf "/"
#          self.createFakeDummy parent if !@isLeafNode(parent) and currTempPath.indexOf(parent.getClient("data").path) is -1

      isLeafNode: (node)->
        data = node.getClient "data"
        return true if data.leaf != null and data.leaf
        return true if data.type is "Resource"
        return false

      # 维护当前topo的父节点
      getParentNode: (path, getNodeFunc)->
        self = this
        return self.nodePathMappings[ path ] if self.nodePathMappings[ path ]

        createCurrNode = (queryPath, parentNode)->
          return self.nodePathMappings[ queryPath ] if self.nodePathMappings[ queryPath ]
          data = getNodeFunc queryPath
          return self.createNode data, null, parentNode if parentNode
          return self.createNode data

        paths = path.split "/"
        parentNode = null # 作为下一个节点的父节点
        queryPath = ""
        for p in paths
          queryPath = "#{queryPath}/#{p}".replace /\/\//g, "/"
          parentNode = createCurrNode queryPath, parentNode
        return parentNode

      # 创建节点
      createNode: (data, dataIdMappings, parentNode)->
        @registerImage(data.icon,"assets/sys_icons/#{data.icon}/32x32.png",32,32) if data.icon?
        node = new Node()
        node.setLocation data.coordinate.x, data.coordinate.y if data.coordinate?
        node.setName data.label
        node.setImage data.icon
        node.setClient "data", data
        node.setParent parentNode if parentNode
        @addAlarm node, data.summary
        @box.add(node)

        dataIdMappings[ data.id ] = node if dataIdMappings
        @nodeIdMappings[ node.getId() ] = node
        @nodePathMappings[ data.path ]  = node

        @createFakeDummy node if !data.leaf
        return node

      createFakeDummy: (parentNode)->
        self = this
        currTempPath = self.currTopoParentPath
        if self.currTopoParentPath isnt "/"
          currTempPath = self.currTopoParentPath.substring 0, self.currTopoParentPath.lastIndexOf "/"
          currTempPath = "/" if !currTempPath

        if !self.isLeafNode(parentNode)
          return if self.currTopoParentPath is parentNode.getClient("data").path
          if currTempPath.indexOf(parentNode.getClient("data").path) is -1
            dummy = new Dummy()
            dummy.setClient "fake_dummy", true
            dummy.setParent parentNode if parentNode
            self.box.add dummy
            self.collapse(parentNode)

      # 创建dummy
      createDummy: (data, dataPathMappings, parentDummy)->
        dummy = new Dummy()
        dummy.setName data.label
        dummy.setClient "data", data
        dummy.setParent parentDummy if parentDummy
        @addAlarm dummy, data.summary
        @box.add dummy

        @nodeIdMappings[ dummy.getId() ] = dummy
        dataPathMappings[ data.path ] = dummy if dataPathMappings
        @nodeIdMappings[ dummy.getId() ] = dummy
        @nodePathMappings[ data.path ]   = dummy
        return dummy

        #删除dummy
      deleteDummy:(dummy)->
        @box.remove(dummy)
      isExpendInChildren:(childrens)->
        for i in [0..(childrens.size() - 1)]
          node = childrens.get i
          if( @isExpanded(node))
            return true
        return false
      # 创建连线
      createEdge: (data, dataIdMappings)->
        fromNode = dataIdMappings[ data.fromId ] if dataIdMappings[ data.fromId ]
        toNode = dataIdMappings[ data.toId ] if dataIdMappings[ data.toId ]
        link = new Link fromNode, toNode
        link.setName data.label
        link.setStyle('arrow.to', true);
        link.setStyle('arrow.to.shape', 'arrow.slant');
        @box.add link
        return link

      # 添加告警
      addAlarm: (node, summary)->
#        node.getAlarmState().setEnablePropagation true
        return if !summary
        node.getAlarmState().increaseNewAlarm CLEARED, summary.CLEAR if summary.CLEAR
        node.getAlarmState().increaseNewAlarm INDETERMINATE, summary.INDETERMINATE if summary.INDETERMINATE
        node.getAlarmState().increaseNewAlarm WARNING, summary.WARNING if summary.WARNING
        node.getAlarmState().increaseNewAlarm MINOR, summary.MINOR if summary.MINOR
        node.getAlarmState().increaseNewAlarm MAJOR, summary.MAJOR if summary.MAJOR
        node.getAlarmState().increaseNewAlarm CRITICAL, summary.CRITICAL if summary.CRITICAL

      listenPropertyChange: (node)->
        count = (currAlarmState, preAlarmState, severity)->
          currCount = currAlarmState.getAlarmCount severity
          preCount  = if preAlarmState then preAlarmState.getAlarmCount(severity) else 0
          return currCount - preCount if currCount isnt preCount

        self = this
        node.addPropertyChangeListener (e)->
          return if e.property isnt "alarmState"
          node = e.source
          # 事件的变化可以传播到父节点，但是知识改变了父节点图标的边框，图标颜色没变，而且父节点的AlarmState也没有更新，所以暂时自行处理
          # 由于e.oldValue为null，无法获取到change前的AlarmState，所以存入nodePreAlarmState变量
          preAlarmState = self.nodePreAlarmState[ node.getId() ]
          parentNode = node.getParent()
          if parentNode
            currAlarmState = e.newValue
            increase =
              CLEAR:          count(currAlarmState, preAlarmState, CLEARED)
              INDETERMINATE:  count(currAlarmState, preAlarmState, INDETERMINATE)
              WARNING:        count(currAlarmState, preAlarmState, WARNING)
              MINOR:          count(currAlarmState, preAlarmState, MINOR)
              MAJOR:          count(currAlarmState, preAlarmState, MAJOR)
              CRITICAL:       count(currAlarmState, preAlarmState, CRITICAL)
            self.addAlarm parentNode, increase
          self.nodePreAlarmState[ node.getId() ] =  $.extend(true, {}, e.newValue)

      # 处理树双击事件
      dealWithTreeClick: (currentNode)->
        self = this
        self.currTopoParentPath = currentNode.getClient("data").path
        newCurrentNode
        parentNode = currentNode.getParent()
        if parentNode is null
          self.box.clear()
          newCurrentNode = self.createDummy currentNode.getClient "data"
          return newCurrentNode
        else
          siblingNodes = parentNode.getChildren()
        #delete父层级下生成的dummy  此dummy是兄弟产生的dummy
        for i in [0..(siblingNodes.size() - 1)]
          node = siblingNodes.get i
          if node
            if node.getClient("data") is "dummy"
              self.box.remove(node)
              siblingNodes.remove(node)
        removingNodes = []
        #生成dummy数据
        for i in [0..(siblingNodes.size() - 1)]
          node = siblingNodes.get i
          dummy = self.createDummy node.getClient "data"
          dummy.setParent parentNode
          if(node.getClient("data").leaf is false or node.getClient("data").type is "Group" or node.getClient("data").type is "IpRange")
            vdummy = new Dummy()
            vdummy.setClient "data", "dummy"
            vdummy.setParent dummy if dummy
          newCurrentNode = dummy if node.getId() is currentNode.getId()
          removingNodes.push node
        self.box.remove node for node in removingNodes
        return newCurrentNode

      setCustomActions: (key, action)->
        @options.customActions[ key ] = action

      # 删除节点
      removeNode: (node)->
        self = this
        return self.box.remove node if self.isFakeDummy node
        path = node.getClient('data').path
        temp = self.nodePathMappings
        delete self.nodePathMappings[ key ] for key of temp when key.indexOf( path ) isnt -1
        self.box.remove node

      isFakeDummy: (node)->
        return true if node.getClient("fake_dummy")
        return false

      removeFakeDummy: (parent)->
        self = this
        return if !parent.hasChildren()
        children = parent.getChildren()
        self.box.remove children.get(i) for i in [0..(children.size() - 1)] when children.get(i).getClient("fake_dummy")

      getSeverity: (severity)->
        switch severity
          when "CLEAR"          then return CLEARED
          when "INDETERMINATE"  then return INDETERMINATE
          when "WARNING"        then return WARNING
          when "MINOR"          then return MINOR
          when "MAJOR"          then return MAJOR
          when "CRITICAL"       then return CRITICAL

      ###===============================  Start：对nodePathMappings做管理  ===============================###

      getNodeByPath: (path)->
        @nodePathMappings[ path ]

      # 根据path迭代查找节点，直到找到为止或者path迭代结束；
      # 可能该path上都没有存在的节点，调用此方法需要判断非空，此情形属于异常情况
      getFirstExistNode: (path)->
        while path
          return @getNodeByPath( path ) if @isNodeExist( path )
          path = @getPrePath( path )

      isNodeExist: (path)->
        return true if @getNodeByPath( path )
        return false

      ###===============================  End：对nodePathMappings做管理  ===============================###

      ###===============================  Start：对path做管理(path处理不当容易造成逻辑错误)  ===============================###

      # 去掉path后边多余的斜杠（／）；
      # 如果path全是斜杠，是否保留根路径，即（／）；［true：保留；false：不保留（默认false）］
      prettyPath: (path, keepRoot)->
        return "" if !path
        path = path.substring( 0, path.length - 1 ) while path.lastIndexOf( "/" ) is path.length
        return path if !keepRoot
        return "/" if path is ""

      # 获取前一路径
      getPrePath: (path)->
        return "" if !path
        path = @prettyPath( path )
        originalPath = path
        path = path.substring( 0, path.lastIndexOf( "/" ) )
        return "/" if path is "" and originalPath.length > 1 and originalPath.startWith( "/" )
        return path

      ###===============================  End：对path做管理  ===============================###

      ###===================  START:  重构与整合  ===================###

      # 监听当前topo图path change事件, 将最新的path存储到数据模型中
      addPathChangeListener: ->
        self = this
        remove = $rootScope.$watch(->
          return $location.$$url

        , (newPath, oldPath)->
          return remove() if self.removePathChangeListener(newPath, oldPath)
          path = newPath.substring(0, newPath.indexOf("?"))
          path = self.prettyPath( path )
          self.setPath( path )
          self.render()
        )

      # 删除topo图path change事件监听器
      removePathChangeListener: (newVal, oldVal)->
        return true if newVal.substring(0, newVal.indexOf("?")) isnt oldVal.substring(0, oldVal.indexOf("?"))
        return false

      render: ->
        path = @getPath()
        @box.get

      # 对数据模型的操作
      setPath: (path)->
        @model.path = path

      getPath: ->
        return @model.path

      ###===================  END:    重构与整合  ===================###


  ])