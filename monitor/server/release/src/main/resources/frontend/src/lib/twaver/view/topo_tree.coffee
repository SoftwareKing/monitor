angular.module("Lib.Twaver.View.TopoTree", [])

  .factory("TopoTree", ["$rootScope", 'TwaverTopoService', ($rootScope, TwaverTopoService)->

    class TopoTree

      Dummy         = twaver.Dummy
      Node          = twaver.Node
      Tree          = twaver.controls.Tree
      PopupMenu     = twaver.controls.PopupMenu

      constructor: (@topoView, @service)->
        @init()
        @addAllListener()

      ###=================   初始化   ==================###
      init: ->
        @service = new TwaverTopoService() if !@service
        @options        = @topoView.options
        @tree           = new Tree( @topoView.box )
        @selectionModel = @tree.getSelectionModel()
        @treeMenu     = new PopupMenu( @tree )
        @topoView.initMenu( @treeMenu )
        @tree.setVisibleFunction ( elem )->
          return elem instanceof Dummy
        @initEvent()

      initEvent: ->
        self = this
        # tree 监听事件
        self.tree.addInteractionListener (e)->
          self.service.treeClick( e )     if e.kind is "click"
          self.service.treeDbClick( e )   if e.kind is "doubleClick"
          self.service.treeIconClick( e ) if e.kind is "expand"

      ###=================   事件管理   ==================###
      addAllListener: ->
        self = this
        self.handleNodeAdded = (e, data)->
          return if !data
          return self.topoView.createDummy( data, parentDummy ) if parentDummy = self.topoView.getParent( data.path )
          self.topoView.createDummy( data )

        self.handleNodeUpdated = (e, data)->
          return if !data
          self.topoView.updateDummy( data )

        self.handleNodeRemoved = (e, data)->
          return if !data
          self.topoView.removeDummy( data )

        self.handleNodesAdded = (e, nodeDatas)->
          return if !nodeDatas
          for data in nodeDatas
            parentDummy = self.topoView.getParent( data.path )
            if parentDummy then self.topoView.createDummy( data, parentDummy ) else self.topoView.createDummy( data )

        self.handleTreeExpand = (e, path)->
          return if !path
          elem = self.topoView.getNodeByPath( path )
          return if !elem
          self.tree.expand( elem )

        self.handleTreeSelect = (e, path)->
          return if !path
          elem = self.topoView.getNodeByPath( path )
          return if !elem
          self.selectionModel.setSelection( elem )

        events = ["Node.Adding",  "Node.Added",   "Node.Updating",  "Node.Updated",   "Node.Removing",  "Node.Removed"
                , "Nodes.Adding", "Nodes.Added",  'Nodes.Updating', 'Nodes.Updated',  'Nodes.Removing', 'Nodes.Removed'
                , "Tree.Expand",  "Tree.Select"]
        for event in events
          handler = self["handle#{event.replace( /\./g, '' )}"]
          $rootScope.$on( event, handler ) if handler

      publishEvent: (name, type, data)->
        return if !name
        eventName = name
        eventName += ".#{type}" if type
        $rootScope.$broadcast(eventName, data)

  ])