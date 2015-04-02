angular.module("ServerIndex.ToposManage", [
  'ToposManageService'
])

.config ($stateProvider, $urlRouterProvider)->
  $urlRouterProvider.when '/topos/manage', '/topos/manage/detail'
  $stateProvider.state 'topos_manage',
    url: '/topos/manage',
    abstract: true,
    controller: 'ToposManageCtrl',
    templateUrl: 'topos/manage/index.tpl.jade',
    data: {pageTitle: '拓扑管理', default: 'topos_manage.detail'}

.controller( 'ToposManageCtrl', [ '$log', '$scope', '$timeout', 'LayoutService', 'TwaverService', 'ToposManageService', 'MonitorCommonService', \
                                (  $log,   $scope,   $timeout,   LayoutService,   TwaverService,   ToposManageService,   MonitorCommonService)->
  toposManageService = new ToposManageService()
  monitorCommonService = new MonitorCommonService()
  ###==================   布局   ==================###
  layout = (elemID)->
    layoutService = new LayoutService {elemID: elemID}
    layoutService.aspectSettings "west"
    layoutService.aspectSettings "center", {paneSelector: "#resourceTopo"}
    layoutService.layout()

    westSelector = "#" + elemID + " > .ui-layout-west"
    layoutService.addPinBtn westSelector, "west"
    layoutService.addCloseBtn westSelector, "west", "resourceLayout_westCloser"

    $scope.twaverService.appendTree document.getElementById "resourceTree"

  ###====================  界面布局  =================###
  angular.element(document).ready ->
    $timeout ->
      resourceLayoutID = "resourceLayout"
      monitorCommonService.onWindowResize( resourceLayoutID, $(".main-content-inner > .main-content").css("padding-bottom").replace("px", "") )
      layout resourceLayoutID
    , 0

  ###====================  twaverService  =================###
  $scope.twaverService = new TwaverService( {}, toposManageService)

  ###====================  WebSocket  =================###

])
