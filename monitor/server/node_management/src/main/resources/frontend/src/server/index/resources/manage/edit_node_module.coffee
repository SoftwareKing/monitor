angular.module("ServerIndex.EditNode", [])

.config ($stateProvider)->

  $stateProvider.state "resources.topos_detail.edit",
    url: "/edit"
    views:
      "@resources":
        templateUrl: "resources/manage/edit.tpl.jade"
        controller: "EditModalCtrl"
        resolve:
          nodeService: 'NodeService'
          getNode: (nodeService, $stateParams)->
            path = $stateParams.path
            nodeService.get({path:path}).$promise

  $stateProvider.state "resources.topos_detail.edit.resource",
    url: "/resource"
    views:
      "changeContent":
        controller: 'EditResourceCtrl'
        templateUrl: 'resources/manage/_form_resource.tpl.jade'

  $stateProvider.state 'resources.topos_detail.edit.resource.item',
    url: '/item?url'
    views:
      "resourceItem":
        controller: 'EditResourceItemCtrl'
        templateUrl: (param)->
#            return 'resources/404.tpl.jade' if param.url is 'undefined'
          return param.url.replace(/resources\//g, "")
      "credentials":
        controller: 'EditResourceItemTabCtrl'
        templateUrl: 'resources/manage/credentials.tpl.jade'

  $stateProvider.state 'resources.topos_detail.edit.static',
    url: '/static'
    views:
      "changeContent":
        controller: 'EditStaticCtrl'
        templateUrl: 'resources/manage/_form_static.tpl.jade'

  $stateProvider.state 'resources.topos_detail.edit.dynamic',
    url: '/dynamic'
    views:
      "changeContent":
        controller: 'EditDynamicCtrl'
        templateUrl: 'resources/manage/_form_dynamic.tpl.jade'

.controller('EditModalCtrl',
  ['$scope', '$state', '$stateParams', '$log', 'NodeService', 'getNode',\
    ($scope, $state, $stateParams, $log, nodeService, getNode) ->
      $log.log 'init EditModalCtrl'

      $scope.title = $stateParams.title
      $scope.node = getNode

      $scope.snmp = {}
      $scope.passport = {}
      $scope.ssh = {}
      $scope.windows = {}

      $scope.versionNumbers = [{label: "v1", value: "v1"}, {label: "v2c", value: "v2c"}, {label: "v3", value: "v3"}]

      $scope.update = ->

      $scope.overrideUpdate = (funRef)->
        $scope.update = funRef

      $scope.cancel = ->
        $state.go "resources.topos_detail"

      $scope.parentNodeShow = false
      $scope.submitted = false
      $scope.editable = false

  ])

.controller('EditResourceCtrl',
  ['$scope', '$state', '$resource', '$stateParams', '$log', 'Utils', 'NodeService',
   'CategoryService', 'MetaService',  'ProcessBar', 'Feedback',\
    ( $scope, $state, $resource, $stateParams, $log, utils, nodeService, categoryService, metaService, processBar, feedback) ->
      $log.log 'init EditResourceCtrl'

      resourceTree = []
      categoryService.get (data)->
        for child in data.children
          resourceTree.push child

        for resource in resourceTree
          resource.checked = true if resource.type is $scope.node.resource.type
          for children in resource.children
            children.checked = true if children.type is $scope.node.resource.type
        $scope.resourceTree = resourceTree
        $scope.disabledNodes = [{"name": "type", "value": "/app"}]
        $scope.removedNodes = [{"name": "type", "value": "/app/jvm/monitor/server"}]

      $scope.$watch 'resourceType', (newVal, oldVal)->
        aNewVal = if newVal and newVal.length > 0 then newVal[0].type else null
        aOldVal = if oldVal and oldVal.length > 0 then oldVal[0].type else null
        if aNewVal isnt aOldVal
          metaService.get({path: aNewVal}).$promise
          .then (data)->
            $scope.modelClass = data.modelClass
            $stateParams.resourceItemPath = data.properties['view.new']
            categoryService.get({path: aNewVal}).$promise
          .then (data)->
            $scope.categories = data
            if data.credentials
              $state.go 'resources.topos_detail.edit.resource.item', {url: $stateParams.resourceItemPath}

      $scope.node.address = $scope.node.resource.address

      if $scope.node.credentials
        for credential in $scope.node.credentials
          if credential.class is "net.happyonroad.credential.SnmpCredential"
            if credential.version is 'v3'
              $scope.passport = credential.passport
            $scope.snmp = credential
          if credential.class is "net.happyonroad.credential.SshCredential"
            $scope.ssh = credential
          if credential.class is "net.happyonroad.credential.WindowsCredential"
            $scope.windows = credential

      $scope.overrideUpdate ->
        processBar.start()
        $scope.submitted = true
        delete $scope.node['@id']
        $scope.node.type = "Resource"

        $scope.node.resource.address = $scope.node.address
        if $scope.resourceType && $scope.resourceType.length > 0
          $scope.node.resource.type = $scope.resourceType[0].type
          $scope.node.resource['class'] = $scope.modelClass

        $scope.node.credentials = []
        for credential in $scope.categories.credentials
          if credential is 'snmp'
            $scope.snmp.class = "net.happyonroad.credential.SnmpCredential"
            if $scope.snmp.version is 'v3'
              $scope.snmp.passport = $scope.passport
            $scope.node.credentials.push $scope.snmp
          if credential is 'ssh'
            $scope.ssh.class = "net.happyonroad.credential.SshCredential"
            $scope.node.credentials.push $scope.ssh
          if credential is 'windows'
            $scope.windows.class = "net.happyonroad.credential.WindowsCredential"
            $scope.node.credentials.push $scope.windows

        nodeService.update({path: $scope.node.path}, $scope.node).$promise
        .then ((data)->
          processBar.end()
          $state.go "resources.topos_detail"
          feedback.success "更新节点'#{$scope.node.label}'成功"
        ),(resp)->
          feedback.warn "更新节点'#{$scope.node.label}'失败",resp
  ])

.controller('EditResourceItemCtrl',
  ['$scope', '$state', '$resource', '$stateParams', '$log',\
    ($scope, $state, $resource, $stateParams, $log) ->
      $log.log "init PopupBoxResourceItemCtrl"
  ])

.controller('EditResourceItemTabCtrl',
  ['$scope', '$state', '$resource', '$stateParams', '$log',\
    ($scope, $state, $resource, $stateParams, $log) ->
      $log.log "init PopupBoxResourceItemTabCtrl"
  ])

.controller('EditStaticCtrl',
  ['$scope', '$state', '$resource', '$stateParams', '$log', '$previousState', 'Utils', 'NodeService', 'CategoryService', 'ProcessBar', 'Feedback',\
    ($scope, $state, $resource, $stateParams, $log, $previousState, utils, nodeService, categoryService, processBar, feedback) ->
      $log.log "init EditStaticCtrl"

      jQuery ($) ->
        $(".rating").raty
          scoreName: 'node.priority'
          cancel: false
          half: false
          starType: "hint"
          targetKeep: true
          hints: ['VeryLow', 'Low', 'Normal', 'High', 'VeryHigh']
          click: (hint, evt)->
            $scope.node.priority = hint - 1
            return
          score: (hint) ->
            hint = $scope.node.priority
            hint = 1 if hint is "VeryLow"
            hint = 2 if hint is "Low"
            hint = 3 if hint is "Normal"
            hint = 4 if hint is "High"
            hint = 5 if hint is "VeryHigh"
            return hint
        return

      categoryService.query().$promise
      .then (data)->
        $scope.credentials = []
        for val in data
          $scope.credentials.push val

      $scope.categories = {credentials: []}

      if $scope.node.credentials
        for credential in $scope.node.credentials
          if credential.class is "net.happyonroad.credential.SnmpCredential"
            $scope.categories.credentials.push 'snmp'
            if credential.version is 'v3'
              $scope.passport = credential.passport
            $scope.snmp = credential
          if credential.class is "net.happyonroad.credential.SshCredential"
            $scope.categories.credentials.push 'ssh'
            $scope.ssh = credential
          if credential.class is "net.happyonroad.credential.WindowsCredential"
            $scope.categories.credentials.push 'windows'
            $scope.windows = credential

      $scope.node.location = $scope.node.location.latitude + ',' + $scope.node.location.longitude if $scope.node.location

      $scope.overrideUpdate ->
        processBar.start()
        $scope.submitted = true
        delete $scope.node["@id"]

        $scope.node.credentials = []
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

        if $scope.node.location
          locations = $scope.node.location.split(",")
          $scope.node.location = {latitude: locations[0]}
          $scope.node.location = {longitude: locations[1]}

        $scope.node.resource = {class: "dnt.monitor.model.Resource"}

        nodeService.update({path: $scope.node.path}, $scope.node).$promise
        .then ((data)->
          processBar.end()
          $state.go "resources.topos_detail"
          feedback.success "更新节点'#{$scope.node.label}'成功"
        ),(resp)->
          feedback.warn "更新节点'#{$scope.node.label}'失败",resp
  ])

.controller('EditDynamicCtrl',
  ['$scope', '$state', '$resource', '$stateParams', '$log', '$previousState', 'Utils', 'NodeService', 'CategoryService', 'ProcessBar', 'Feedback',
    ($scope, $state, $resource, $stateParams, $log, $previousState, utils, nodeService, categoryService, processBar, feedback) ->
      $log.log "init EditDynamicCtrl"

      jQuery ($) ->
        $(".rating").raty
          scoreName: 'node.priority'
          cancel: false
          half: false
          starType: "hint"
          targetKeep: true
          hints: ['VeryLow', 'Low', 'Normal', 'High', 'VeryHigh']
          click: (hint, evt)->
            $scope.node.priority = hint - 1
            return
          score: (hint) ->
            hint = $scope.node.priority
            hint = 1 if hint is "VeryLow"
            hint = 2 if hint is "Low"
            hint = 3 if hint is "Normal"
            hint = 4 if hint is "High"
            hint = 5 if hint is "VeryHigh"
            return hint
        return

      $scope.node.location = $scope.node.location.latitude + ',' + $scope.node.location.longitude if $scope.node.location
      $scope.node.ipInfo = $scope.node.properties.range if $scope.node.properties

      categoryService.query().$promise
      .then (data)->
        $scope.credentials = []
        for val in data
          $scope.credentials.push val

      $scope.categories = {credentials: []}

      if $scope.node.credentials
        for credential in $scope.node.credentials
          if credential.class is "net.happyonroad.credential.SnmpCredential"
            $scope.categories.credentials.push 'snmp'
            if credential.version is 'v3'
              $scope.passport = credential.passport
            $scope.snmp = credential
          if credential.class is "net.happyonroad.credential.SshCredential"
            $scope.categories.credentials.push 'ssh'
            $scope.ssh = credential
          if credential.class is "net.happyonroad.credential.WindowsCredential"
            $scope.categories.credentials.push 'windows'
            $scope.windows = credential

      $scope.overrideUpdate ->
        processBar.start()
        $scope.submitted = true

        delete $scope.node["@id"]

        $scope.node.credentials = []
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

        if $scope.node.location
          locations = $scope.node.location.split(",")
          $scope.node.location = {latitude: locations[0]}
          $scope.node.location = {longitude: locations[1]}

        $scope.node.resource = {class: "dnt.monitor.model.Resource"}
        $scope.node.properties = {range: $scope.node.ipInfo}

        nodeService.update({path: $scope.node.path}, $scope.node).$promise
        .then ((data)->
          processBar.end()
          $state.go "resources.topos_detail"
          feedback.success "更新节点'#{$scope.node.label}'成功"
        ),(resp)->
          feedback.warn "更新节点'#{$scope.node.label}'失败",resp
  ])
