angular.module('ServerIndex.Events', ['infinite-scroll'])

.config ($stateProvider, $urlRouterProvider)->
  $stateProvider.state 'events',
    url: '/events'
    abstract: true
    templateUrl: 'events/index.tpl.jade'
    controller: 'EventCtrl'
    data: {pageTitle: '事件管理', default: 'events.list'}
  $stateProvider.state 'events.list',
    url: '/list/{path:.*}'
    templateUrl: 'events/list.tpl.html'
    controller: 'EventListCtrl'
    data: {pageTitle: '事件列表'}
  $urlRouterProvider.when '/events', '/events/list/default'

.factory "Reddit", ($http) ->
  Reddit = undefined
  Reddit = ->
    @items = []
    @busy = false
    @after = ""
    return

  Reddit::nextPage = ->
    url = undefined
    return  if @busy
    @busy = true
    url = "http://api.reddit.com/hot?after=" + @after + "&jsonp=JSON_CALLBACK"
    $http.jsonp(url).success ((data) ->
      i = undefined
      items = undefined
      items = data.data.children
      i = 0
      while i < items.length
        @items.push items[i].data
        i++
      @after = "t3_" + @items[@items.length - 1].id
      @busy = false
      return
    ).bind(this)
    return

  Reddit
#.factory('EventService', ['$resource', ($resource) ->
#    $resource "/api/events/:path", {path: '@path'}
#])

.controller('EventCtrl', ['$scope', '$state', '$log', 'Feedback', 'CacheService', 'EventService',
    ($scope, $state, $log, feedback, CacheService, eventService) ->

      $log.log "Initialized the event controller"
#      $scope.reddit = new Reddit()
#      $scope.options =
#        page: 1   # show first page
#        count: 10 # count per page
#
#      $scope.cacheService = new CacheService "id", (value)->
#        eventService.get {id:value}
  ])

.controller('EventListCtrl',
  ['$scope', '$location', '$stateParams', '$log', 'ngTableParams', 'ActionService', 'SelectionService', 'EventService','Reddit'
    ($scope,  $location,   $stateParams,   $log,   NgTable,         ActionService,   SelectionService,   eventService,  Reddit ) ->

      $log.log "Initialized the event list controller"
      $scope.reddit = new Reddit()




#      path = $stateParams.path
#      $scope.event = eventService.query path
#      console.log $scope.event
#      args =
#        total: 0,
#        getData: ($defer, params) ->
#          $location.search(params.url()) # put params in url
#          eventService.query angular.extend(path: $stateParams.path, params.url()), (data, headers) ->
#            params.total headers('total')
#            $scope.cacheService.cache data
#            $defer.resolve data
#
#      $scope.eventTable = new NgTable(angular.extend($scope.options, $location.search()), args)
#      $scope.selectionService = new SelectionService($scope.cacheService.records, "id")
#      $scope.actionService = new ActionService({watch: $scope.selectionService.items, mapping: $scope.cacheService.find})
  ])
