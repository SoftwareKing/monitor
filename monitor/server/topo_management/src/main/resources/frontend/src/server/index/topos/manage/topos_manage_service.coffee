angular.module( 'ToposManageService', [] )

.factory( 'ToposManageService', [ '$log', '$rootScope', '$state', 'TopoView', 'TopoUtils', 'TwaverTopoService', \
                                (  $log,   $rootScope,   $state,   TopoView,   TopoUtils,   TwaverTopoService)->

  class ToposManageService extends TwaverTopoService

    ###===========  access data interface  ===========###
    # get single node
    getNode: (path)->
      return null if !path
      data = null
      $.ajax(
        url: "api/node#{path}", type: "GET", async:  false
        success: (result)-> data = result
      )
      return data

    # get multiple node without leaf node
    getNodes: (path, isContainLeaf)->
      return null if !path
      data = null
      $.ajax(
        url: "api/nodes#{path}?leaf=#{isContainLeaf}", type: "GET", async:  false
        success: (result)-> data = result
      )
      return data

    # get topo map
    getMap: (path)->
      return null if !path
      data = null
      $.ajax(
        url: "api/map#{path}", type: "GET", async:  false
        success: (result)-> data = result
      )
      return data

    ###===========  tree events  ===========###
    # 1. click: show topo map
    # 2. double click: show topo map and expand tree
    # 3. icon click (expand | collapse):
    ## 3.1. expanding: collapse
    ## 3.2. no expanding: expand

    # handle tree click event
    treeClick: (e)->
      return if !e
      @showMap( e.data )

    # handle tree double click event
    treeDbClick: (e)->
      return if !e
      elem = e.data
      @loadNodes( elem )
      @showMap( elem )

    # handle tree icon click event (expand | collapse)
    treeIconClick: (e)->
      return if !e
      @loadNodes( e.data )

    ###===========  topo node events  ===========###
    # 1. click:
    # 2. double click:
    ## 2.1. Group: 显示子节点，并展开tree
    ## 2.2. Resource: 显示运转图

    # handle topo node double click event
    nodeDbClick: (e)->
      return if !e
      elem = e.element
      data = elem.getClient( "data" )
      if data.leaf
        @publishEvent( "ResourceModel", "Open", elem )
        return
      # show child nodes and expand tree
      @loadNodes( elem )
      @showMap( elem )

    ###===========  内部方法  ===========###

    loadNodes: (elem)->
      return if !elem
      data = elem.getClient( "data" )
      if !@topoView.hasChildren( elem )
        @publishEvent( "TwaverService", "LoadNodes", data.path )
      @publishEvent( "Tree", "Expand", data.path )

    showMap: (elem)->
      return if !elem
      @publishEvent( "TwaverService", "ShowMap", elem.getClient( "data" ) )

    publishEvent: (name, type, data)->
      return if !name
      eventName = name
      eventName += ".#{type}" if type
      $rootScope.$broadcast(eventName, data)

] )
