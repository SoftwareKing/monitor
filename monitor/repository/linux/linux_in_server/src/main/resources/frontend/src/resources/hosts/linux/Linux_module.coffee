angular.module("Resources.Linux", [])

  .controller("LinuxDetailCtrl", ["$scope", "$stateParams", "$resource", "$location", "params", "parentScope", \
                                  ($scope,   $stateParams,   $resource,   $location,   params,   parentScope)->

    $resource("api/hosts/by_address?address=#{params.address}").get (data)->
      $scope.host = data
      console.log "Init LinuxDetailCtrl"
      console.log $scope.host

    $scope.path = $location.path()
    $scope.close = parentScope.close

  ])
