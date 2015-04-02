angular.module("ServerIndex.ToposManageView", [])

.config ($stateProvider)->
  $stateProvider.state 'topos_manage.detail',
    url: '/detail?path&title',
    controller: 'TopoManageDetailCtrl',
    templateUrl: 'topos/manage/detail.tpl.jade',
    data: {pageTitle: '拓扑图详情'}

.controller( 'TopoManageDetailCtrl', [ '$log', '$scope', '$timeout', 'LayoutService', 'MonitorCommonService', \
                                     (  $log,   $scope,   $timeout,   LayoutService,   MonitorCommonService)->
  topoLayoutID = "topoLayout"
  monitorCommonService = new MonitorCommonService()
  ###==================   布局   ==================###
  layoutService = new LayoutService {elemID: topoLayoutID}
  $scope.$on("$viewContentLoaded", (event)->
    $timeout ->
      monitorCommonService.onWindowResize( topoLayoutID, 60 )
      layoutService.aspectSettings "east", {initClosed: true}
      layoutService.aspectSettings "south"
      layoutService.aspectSettings "center", {paneSelector: "#topoLayoutCenter"}
      layout = layoutService.layout()
      eastSelector  = "#" + topoLayoutID + " > .ui-layout-east"
      southSelector = "#" + topoLayoutID + " > .ui-layout-south"
      layoutService.addPinBtn eastSelector, "east"
      layoutService.addPinBtn southSelector, "south"
      layoutService.addCloseBtn eastSelector, "east", "topoLayout_eastCloser"
      layoutService.addCloseBtn southSelector,  "south", "topoLayout_southCloser"

      twaverService.appendToolbar document.getElementById "topoToolbar"
      twaverService.appendTopo    document.getElementById "topoGraph"
      twaverService.appendSheet   document.getElementById "topoSheet"
    , 0
  )

  ###==================   twaverService   ==================###
  twaverService = $scope.twaverService

] )
