angular.module( 'Lib.Twaver.Service.TwaverTopoService', [] )

.factory( 'TwaverTopoService', [ '$log', '$rootScope', '$state', 'TopoView', 'TopoUtils', \
                                ( $log,   $rootScope,   $state,   TopoView,   TopoUtils)->

  class TopoService

    constructor: ()->
      @topoView   = new TopoView()
      @topoUtils  = new TopoUtils()

    ###===========  access data interface  ===========###

    # get single node
    getNode: (path)->
      return null

    # get multiple node without leaf node
    getNodes: (path, isContainLeaf)->
      return null

    # get topo map
    getMap: (path)->
      return null

    ###===========  tree events  ===========###
    # 1. click: show topo map
    # 2. double click: show topo map and expand tree
    # 3. icon click (expand | collapse):
    ## 3.1. expanding: collapse
    ## 3.2. no expanding: expand

    # handle tree click event
    treeClick: (e)->

    # handle tree double click event
    treeDbClick: (e)->

    # handle tree icon click event (expand | collapse)
    treeIconClick: (e)->

    ###===========  topo node events  ===========###
    # 1. click:
    # 2. double click:
    ## 2.1. Group: 显示子节点，并展开tree
    ## 2.2. Resource: 显示运转图

    # handle topo node double click event
    nodeDbClick: (e)->

    ###===========  内部方法  ===========###

    loadNodes: (elem)->

    showMap: (elem)->

    publishEvent: (name, type, data)->
      return if !name
      eventName = name
      eventName += ".#{type}" if type
      $rootScope.$broadcast(eventName, data)

] )
