angular.module("ServerIndex.ManageNodeService", [])

.factory('NodeService', ['$resource', ($resource) ->
    $resource("/api/node:path", {}
      get: {method: 'GET', path: '@path'},
      save: {method: 'POST'},
      update: {method: 'PUT', path: '@path'},
      remove: {method: 'DELETE', params: {path: '@path'}}
    )
  ])

.factory('NodesService', ['$resource', ($resource) ->
    $resource "/api/nodes:path", {path: '@path'},
      save:
        method: 'POST'
      query: {method: 'GET', params: {path: '@path'}, isArray: true},
      update: {method: 'PUT', params: {name: '@name'}},
      remove: {method: 'DELETE', params: {path: '@path'}}
  ])

.factory('MetaService', ['$resource', ($resource) ->
    $resource "/api/meta/:path", {path: '@path'}
  ])

.factory('CategoryService', ['$resource', ($resource) ->
    $resource "/api/categories/:path", {},
      get: {method: 'GET', params: {path: '@path'}}
      query: {method: 'GET', params: {path: 'credentials'}, isArray: true}
  ])

.factory('CredentialJudgeService', ['$resource', ($resource) ->
    $resource "/api/categories/:path", {},
      get: {method: 'GET', params: {path: '@path'}}
      query: {method: 'GET', params: {path: 'credentials'}, isArray: true}
  ])
