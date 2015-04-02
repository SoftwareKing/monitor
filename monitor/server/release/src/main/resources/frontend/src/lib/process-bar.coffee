angular.module('Lib.ProcessBar', [])
  .factory 'ProcessBar', ['$rootScope', '$timeout', '$modal', ($rootScope, $timeout, $modal)->
    modalInstance = {}
    {
      start: ->
        modalInstance = $modal.open
          templateUrl: "page/process_bar.tpl.jade"
          backdrop: "static"
        $rootScope.percent = "width: 10%"
        for i in [2..9]
          @process(i)
      end: ->
        $rootScope.percent = "width: 100%"
        modalInstance.close(true)
      process: (n)->
          $timeout( ->
            $rootScope.percent = "width: "+n+"0%"
            return
          , 1000)
    }
  ]