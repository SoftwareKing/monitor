angular.module("ServerIndex.NewNode", [])

.config ($stateProvider)->

  $stateProvider.state "resources.topos_detail.add",
    url: "/add"
    views:
      "@resources":
        templateUrl: "resources/manage/new.tpl.jade"
        controller: "NewModalCtrl"
        resolve:
          nodeService: 'NodeService'
          getNode: (nodeService, $stateParams)->
            path = $stateParams.path
            nodeService.get({path:path}).$promise

  $stateProvider.state "resources.topos_detail.add.resource",
    url: "/resource"
    views:
      "changeContent":
        controller: 'NewResourceCtrl'
        templateUrl: 'resources/manage/_form_resource.tpl.jade'

  $stateProvider.state 'resources.topos_detail.add.resource.item',
    url: '/item?url'
    views:
      "resourceItem":
        controller: 'NewResourceItemCtrl'
        templateUrl: (param)->
#            return 'resources/404.tpl.jade' if param.url is 'undefined'
          return param.url.replace(/resources\//g, "")
      "credentials":
        controller: 'NewResourceItemTabCtrl'
        templateUrl: 'resources/manage/credentials.tpl.jade'

  $stateProvider.state 'resources.topos_detail.add.static',
    url: '/static'
    views:
      "changeContent":
        controller: 'NewStaticCtrl'
        templateUrl: 'resources/manage/_form_static.tpl.jade'

  $stateProvider.state 'resources.topos_detail.add.dynamic',
    url: '/dynamic'
    views:
      "changeContent":
        controller: 'NewDynamicCtrl'
        templateUrl: 'resources/manage/_form_dynamic.tpl.jade'

.controller('NewModalCtrl',
  ['$scope', '$state', '$stateParams', '$log', '$previousState', 'getNode',\
    ($scope, $state, $stateParams, $log, $previousState, getNode) ->
      $log.log 'init NewModalCtrl'
      $previousState.memo "modalInvoker"

      $scope.title = $stateParams.title
      $scope.monitorModel = getNode

      $scope.node = {}
      $scope.snmp = {}
      $scope.passport = {}
      $scope.ssh = {}
      $scope.windows = {}

      $scope.versionNumbers = [{label: "v1", value: "v1"}, {label: "v2c", value: "v2"}, {label: "v3", value: "v3"}]

      $scope.create = ->

      $scope.overrideCreate = (funRef)->
        $scope.create = funRef

      $scope.cancel = ->
        $state.go "resources.topos_detail"

      $scope.parentNodeShow = true
      $scope.submitted = false
      $scope.editable = true
  ])

.controller('NewResourceCtrl', ['$scope', '$state', '$resource', '$stateParams', '$timeout', '$log', '$previousState', '$location', 'Utils', 'MetaService', 'CategoryService', 'NodesService', 'ProcessBar', 'Feedback',\
                                ($scope,   $state,   $resource,   $stateParams,   $timeout,   $log,   $previousState,   $location,   utils,   metaService,   categoryService,   nodesService,   processBar,   feedback) ->
      $log.log 'init NewResourceCtrl'

      resourceTree = []
      categoryService.get (data)->
        for child in data.children
          resourceTree.push child
        $scope.resourceTree = resourceTree
        $scope.disabledNodes = [{"name": "type", "value": "/application"}]
        $scope.removedNodes = [{"name": "type", "value": "/application/monitor_server"}]

      $scope.$watch 'resourceType', (newVal, oldVal)->
        aNewVal = if newVal and newVal.length > 0 then newVal[0].type else null
        aOldVal = if oldVal and oldVal.length > 0 then oldVal[0].type else null
        if aNewVal isnt aOldVal
          metaService.get( { path: aNewVal } ).$promise.then (data)->
            $scope.modelClass = data.modelClass
            $scope.node['@class'] = "dnt.monitor.model.ResourceNode" if data.modelClass.substring( data.modelClass.lastIndexOf( '.' ) + 1 ) is 'MonitorEngine'
            $stateParams.resourceItemPath = data.properties['view.new']
            return categoryService.get( { path: aNewVal } ).$promise.then (data)->
              $scope.categories = data
              if data.credentials
                $state.go 'resources.topos_detail.add.resource.item', {url: $stateParams.resourceItemPath}

      angular.element(document).ready ->
        $timeout ->
          search = $location.search()
          if search.url
            url = search.url
            return if !url.startWith( 'resources' )
            return if !path = url.substring( 9, url.lastIndexOf( '/' ))
            path = path.replace( 'applications', 'application' ).replace( 'monitor_engines', 'monitor_engine' )
            tree = $.fn.zTree.getZTreeObj('typeTree')
            $scope.resourceType = tree.getNodeByParam('type', path )
            tree.selectNode( $scope.resourceType )
            $scope.resourceType.checked = true
            tree.updateNode($scope.resourceType)
            tree.setting.callback.onCheck(null, 'typeTree', $scope.resourceType)
        , 0

      $scope.node.label = ''
      $scope.$watch 'node.resource.name', (newVal, oldVal)->
        return if !newVal
        oldVal = '' if !oldVal
        return if $scope.node.label isnt oldVal
        $scope.node.label = newVal

      $scope.node.resource = {}
      $scope.overrideCreate ->
        processBar.start()
        $scope.submitted = true

        if $scope.modelClass.substring( $scope.modelClass.lastIndexOf( '.' ) + 1 ) is 'MonitorEngine'
          $scope.node.label = $scope.node.resource.name if !$scope.node.label
          $scope.node.resource.label = $scope.node.resource.name

        $scope.node.credentials = []

        $scope.node.type = "Resource"

        $scope.node.resource.address = $scope.node.address
        if $scope.resourceType && $scope.resourceType.length > 0
          $scope.node.resource.type = $scope.resourceType[0].type
          $scope.node.resource['class'] = $scope.modelClass

        if utils.isNotEmpty $scope.snmp
          if $scope.snmp.version is 'v3'
            $scope.snmp.passport = $scope.passport
          $scope.snmp.class = "net.happyonroad.credential.SnmpCredential"
          $scope.node.credentials.push $scope.snmp
        if utils.isNotEmpty $scope.ssh
          $scope.ssh.class = "net.happyonroad.credential.SshCredential"
          $scope.node.credentials.push $scope.ssh
        if utils.isNotEmpty $scope.windows
          $scope.windows.class = "net.happyonroad.credential.WindowsCredential"
          $scope.node.credentials.push $scope.windows

        nodesService.save({path: $scope.monitorModel.path}, $scope.node).$promise
        .then ((data)->
          processBar.end()
          $state.go "resources.topos_detail"
          feedback.success "保存节点'#{$scope.node.label}'成功"
        ),(resp)->
          processBar.end()
          feedback.warn "保存节点'#{$scope.node.label}'失败",resp
  ])

.controller('NewResourceItemCtrl',
  ['$scope', '$state', '$resource', '$stateParams', '$log',\
    ($scope, $state, $resource, $stateParams, $log) ->
      $log.log "init PopupBoxResourceItemCtrl"
  ])

.controller('NewResourceItemTabCtrl',
  ['$scope', '$state', '$resource', '$stateParams', '$log',\
    ($scope, $state, $resource, $stateParams, $log) ->
      $log.log "init PopupBoxResourceItemTabCtrl"
  ])

.controller('NewStaticCtrl',
  ['$scope', '$state', '$resource', '$stateParams', '$previousState', '$log', 'Utils', 'NodesService', 'CategoryService','ProcessBar', 'Feedback',
    ($scope, $state, $resource, $stateParams, $previousState, $log, utils, nodesService, categoryService, processBar, feedback) ->
      $log.log "init NewStaticCtrl"

      jQuery ($) ->
        $(".rating").raty
          cancel: false
          half: false
          starType: "hint"
          targetKeep: true
          hints: ['VeryLow', 'Low', 'Normal', 'High', 'VeryHigh']
          click: (hint, evt)->
            $scope.node.priority = hint - 1
            return
          scoreName: 'node.priority'
        return

      categoryService.query().$promise
      .then (data)->
        $scope.credentials = []
        for val in data
          $scope.credentials.push val

      $scope.categories = {credentials: []}

      $scope.overrideCreate ->
        processBar.start()
        $scope.submitted = true
        $scope.node.credentials = []

        $scope.node.type = "Group"
        $scope.node.resource = {class: "dnt.monitor.model.Resource"}
        $scope.node.properties = {name: utils.uuid(8, 16)}

        if $scope.node.location
          locations = $scope.node.location.split(",")
          $scope.node.location = {latitude: locations[0]}
          $scope.node.location = {longitude: locations[1]}

        if $scope.categories.credentials
          for val in $scope.categories.credentials
            if val is 'snmp'
              $scope.snmp.class = "net.happyonroad.credential.SnmpCredential"
              if $scope.snmp.version is 'v3'
                $scope.snmp.passport = $scope.passport
              $scope.node.credentials.push $scope.snmp
            if val is 'ssh'
              $scope.ssh.class = "net.happyonroad.credential.SshCredential"
              $scope.node.credentials.push $scope.ssh
            if val is 'windows'
              $scope.windows.class = "net.happyonroad.credential.WindowsCredential"
              $scope.node.credentials.push $scope.windows

        nodesService.save({path: $scope.monitorModel.path}, $scope.node).$promise
        .then ((data)->
          processBar.end()
          $state.go "resources.topos_detail"
          feedback.success "保存节点'#{$scope.node.label}'成功"
        ),(resp)->
          feedback.warn "保存节点'#{$scope.node.label}'失败",resp
  ])

.controller('NewDynamicCtrl',
  ['$scope', '$state', '$resource', '$stateParams', '$log', '$previousState', 'Utils', 'NodesService',
   'CategoryService', 'ProcessBar', 'Feedback',\
    ($scope, $state, $resource, $stateParams, $log, $previousState, utils, nodesService, categoryService, processBar, feedback) ->
      $log.log "init NewDynamicCtrl"

      jQuery ($) ->
        $(".rating").raty
          cancel: false
          half: false
          starType: "hint"
          targetKeep: true
          hints: ['VeryLow', 'Low', 'Normal', 'High', 'VeryHigh']
          click: (hint, evt)->
            $scope.node.priority = hint - 1
            return
          scoreName: 'node.priority'
        return

      categoryService.query().$promise
      .then (data)->
        $scope.credentials = []
        for val in data
          $scope.credentials.push val

      $scope.categories = {credentials: []}
      # 方便输入，以后要去掉
      $scope.node.ipInfo = "192.168.0.0-192.168.0.255"

      $scope.overrideCreate ->
        processBar.start()
        $scope.submitted = true
        $scope.node.credentials = []

        $scope.node.type = "IpRange"
        $scope.node.resource = {class: "dnt.monitor.model.Resource"}
        $scope.node.properties = {range: $scope.node.ipInfo}

        if $scope.node.location
          locations = $scope.node.location.split(",")
          $scope.node.location = {latitude: locations[0]}
          $scope.node.location = {longitude: locations[1]}

        if $scope.categories.credentials
          for val in $scope.categories.credentials
            if val is 'snmp'
              $scope.snmp.class = "net.happyonroad.credential.SnmpCredential"
              if $scope.snmp.version is 'v3'
                $scope.snmp.passport = $scope.passport;
              $scope.node.credentials.push $scope.snmp
            if val is 'ssh'
              $scope.ssh.class = "net.happyonroad.credential.SshCredential"
              $scope.node.credentials.push $scope.ssh
            if val is 'windows'
              $scope.windows.class = "net.happyonroad.credential.WindowsCredential"
              $scope.node.credentials.push $scope.windows

        nodesService.save({path: $scope.monitorModel.path}, $scope.node).$promise
        .then ((data)->
          processBar.end()
          $state.go "resources.topos_detail"
          feedback.success "保存节点'#{$scope.node.label}'成功"
        ),(resp)->
          feedback.warn "保存节点'#{$scope.node.label}'失败",resp
  ])