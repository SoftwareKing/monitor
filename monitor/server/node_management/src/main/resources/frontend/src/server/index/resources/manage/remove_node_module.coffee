angular.module("ServerIndex.RemoveNode", [])

.config ($stateProvider)->

  $stateProvider.state "resources.topos_detail.delete",
    url: "/delete"
    onEnter: [
      "$stateParams"
      "$state"
      "$modal"
      "$previousState"
      ($stateParams, $state, $modal, $previousState) ->
        $previousState.memo "modalInvoker"
        $modal.open(
          templateUrl: "resources/manage/delete.tpl.jade"
          controller: "RemoveModalCtrl"
          backdrop: "static"
          resolve:
            modalScope: ->
              $state.params.scope
        )
    ]

  $stateProvider.state "resources.topos_detail.delete.resource",
    url: "/resource"
    views:
      "changeContent@":
        controller: 'DeleteResourceCtrl'
        templateUrl: 'resources/manage/_form_resource_delete.tpl.jade'

  $stateProvider.state 'resources.topos_detail.delete.static',
    url: '/static'
    views:
      "changeContent@":
        controller: 'DeleteStaticCtrl'
        templateUrl: 'resources/manage/_form_static_delete.tpl.jade'


  $stateProvider.state 'resources.topos_detail.delete.dynamic',
    url: '/dynamic'
    views:
      "changeContent@":
        controller: 'DeleteDynamicCtrl'
        templateUrl: 'resources/manage/_form_dynamic_delete.tpl.jade'

.controller('RemoveModalCtrl',
  ['$scope', '$state', '$stateParams', '$log', '$previousState', 'modalScope',
    ($scope, $state, $stateParams, $log, $previousState, modalScope) ->
      $log.log 'init RemoveModalCtrl'

      $scope.title = modalScope.title
      $scope.twaverTopoNode = modalScope.twaverTopoNode
      $scope.monitorModel = modalScope.monitorModel
      $scope.node = modalScope.node
      $scope.twaverService = modalScope.twaverService

      $scope.delete = ->
        $previousState.go "modalInvoker"
        $scope.$close true

      $scope.overrideDelete = (funRef)->
        $scope.delete = funRef

      $scope.cancel = ->
        $previousState.go "modalInvoker" # return to previous state
        $scope.$dismiss()

      $scope.submitted = false
  ])

.controller('DeleteResourceCtrl',
  ['$rootScope', '$scope', '$state', '$resource', '$stateParams', '$log', '$previousState', 'Utils', 'MetaService',
   'CategoryService', 'NodeService',\
    ($rootScope, $scope, $state, $resource, $stateParams, $log, $previousState, utils, metaService, categoryService, nodeService) ->
      $log.log 'init DeleteResourceCtrl'

      $scope.node = $scope.resourceModel
      #      console.log $scope.node
      #      if $scope.node.type == "resource"
      $scope.overrideDelete ->
        $scope.submitted = true
        if $scope.node isnt null
          #          console.log $scope.node.path
          nodeService.remove({path: $scope.node.path}, $scope.node).$promise
          .then (data)->
            $log.log "delete #{data} success"
            $previousState.go "modalInvoker"
            $scope.$close true
#            $scope.twaverService.box.remove $rootScope.twverTreeNode
  ])

.controller('DeleteStaticCtrl',
  ['$rootScope', '$scope', '$state', '$resource', '$stateParams', '$log', '$previousState', 'Utils', 'NodeService',
   'NodesService',\
    ($rootScope, $scope, $state, $resource, $stateParams, $log, $previousState, utils, nodeService, nodesService) ->
      $log.log "init DeleteStaticCtrl"

      $scope.node = $scope.resourceModel
      $scope.nodes = nodesService.query({path: $scope.node.path}, $scope.node)
      $scope.overrideDelete ->
        $scope.submitted = true
        console.log $scope.nodes
        nodesService.remove({path: $scope.node.path}, $scope.nodes).$promise
        .then (data)->
          $log.log "delete #{data} success"
          $previousState.go "modalInvoker"
          $scope.$close true
#            $scope.twaverService.box.remove $rootScope.twverTreeNode
  ])

.controller('DeleteDynamicCtrl',
  ['$rootScope', '$scope', '$state', '$resource', '$stateParams', '$log', '$previousState', 'Utils', 'NodeService',
   'NodesService',\
    ($rootScope, $scope, $state, $resource, $stateParams, $log, $previousState, utils, nodeService, nodesService) ->
      $log.log "init PopupBoxDynamicCtrl"

      $scope.node = $scope.resourceModel
      $scope.nodes = nodesService.query({path: $scope.node.path}, $scope.node)
      $scope.overrideDelete ->
        $scope.submitted = true
        console.log $scope.nodes
        nodesService.remove({path: $scope.node.path}, $scope.nodes).$promise
        .then (data)->
          $log.log "delete #{data} success"
          $previousState.go "modalInvoker"
          $scope.$close true
#            $scope.twaverService.box.remove $rootScope.twverTreeNode
  ])