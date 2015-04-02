(function (angular) {

    angular.module('dnt.topo.services', [])
         //factory
        .factory('topoViewService', ['$resource',
            function ($resource) {
                return $resource(topo_path + "", {}, {
                    save: {method: 'POST', url: topo_path + "topo", isArray: false},
                    delete: {method: 'DELETE', url: topo_path + "topo/:id", isArray: false},
                    updateName: {method: 'PUT', url: topo_path + "topo/:id/update/name", isArray: false},
                    get: {method: 'GET', url: topo_path + "topo/:id", isArray: false},
                    queryByClassify: {method: 'GET', url: topo_path + "topo/queryByClassify", isArray: false},
                    queryListByClassify: {method: 'GET', url: topo_path + "topo/queryListByClassify", isArray: false},
                    getCurrentPerformance: {method: 'GET', url: topo_path + "topo/:id/currentPerformance", isArray: false},
                    getNotDeviceCurrentPerformance: {method: 'GET', url: topo_path + "topo/:id/notDeviceCurrentPerformance", isArray: false},
                    synchronous: {method: 'GET', url: topo_path + "topo/:id/node/:node_id/synchronous", isArray: false},
                    deleteElements: {method: 'POST', url: topo_path + "topo/:id/deleteElements", isArray: false},
                    deleteBackground: {method: 'PUT', url: topo_path + "topo/:id/deleteBackground", isArray: false},
                    arrow: {method: 'PUT', url: topo_path + "topo/:id/arrow", isArray: false}
//                    saveStatusConfig: {method: 'PUT', url: topo_path + "topo/:id/saveStatusConfig", isArray: false}
                });
            }])
        .factory('topoNodeService', ['$resource',
            function ($resource) {
                return $resource(topo_path + "", {}, {
                    batchsave: {method: 'POST', url: topo_path + "topo/:id/nodes/batch/save", isArray: false},
                    delete: {method: 'DELETE', url: topo_path + "topo/:id/nodes/:node_id", isArray: false},
                    drill: {method: 'PUT', url: topo_path + "topo/:id/nodes/:node_id/drill", isArray: false},
                    deleteDrill: {method: 'PUT', url: topo_path + "topo/:id/nodes/:node_id/deleteDrill", isArray: false},
                    updateNodesSize: {method: 'PUT', url: topo_path + "topo/:id/nodes/size", isArray: false},
                    updateNodesMirroring: {method: 'PUT', url: topo_path + "topo/:id/nodes/mirroring", isArray: false},
                    updateNodesPositioning: {method: 'PUT', url: topo_path + "topo/:id/nodes/positioning", isArray: false},
                    query: {method: 'GET', url: topo_path + "topo/:id/nodes", isArray: false},
                    getContainPort: {method: 'GET', url: topo_path + "topo/:id/nodes/containPort", isArray: false},
                    saveNodesLocations: {method: 'PUT', url: topo_path + "topo/:id/nodes/locations", isArray: false},
                    getNodesCurrentAlarm: {method: 'GET', url: topo_path + "topo/:id/nodes/currentAlarm", isArray: false},
                    updateCustomName: {method: 'PUT', url: topo_path + "topo/:id/nodes/:node_id/updateCustomName", isArray: false}
                });
            }])
        .factory('topoLineService', ['$resource',
            function ($resource) {
                return $resource(topo_path + "", {}, {
                    save: {method: 'POST', url: topo_path + "topo/:id/lines", isArray: false},
                    batchsave: {method: 'POST', url: topo_path + "topo/:id/lines/batch/save", isArray: false},
                    delete: {method: 'DELETE', url: topo_path + "topo/:id/lines/:line_id", isArray: false},
                    query: {method: 'GET', url: topo_path + "topo/:id/lines", isArray: false},
                    updateLinksStyle: {method: 'PUT', url: topo_path + "topo/:id/lines/style", isArray: false},
                    updateCustomName: {method: 'PUT', url: topo_path + "topo/:id/lines/:line_id/updateCustomName", isArray: false}
                });
            }])
        .factory('topoResourceService', ['$resource',
            function ($resource) {
                return $resource(topo_path + "", {}, {
                    getResource: {method: 'GET', url: topo_path + "topo/resource", isArray: false},
                    synNodesResource: {method: 'GET', url: topo_path + "topo/resource/nodes/query", isArray: false},
                    synLinksResource: {method: 'GET', url: topo_path + "topo/resource/links/query", isArray: false}
//                    getStatusConfigInfo: {method: 'GET', url: topo_path + "topo/resource/statusConfig/query", isArray: false}
                });
            }])
        .factory('topoDiscoveryClient', ['$resource',
            function ($resource) {
                return $resource(topo_path + "topo/discovery/job", {}, {
                    topoDodiscover: {method: "POST", isArray: false},
                    getTopoDiscoverResult: {method: "GET", isArray: false}
                });
            }])

         //service
        .service('utilTools', ['$parse', function ($parse) {
            this.currentDialog = function (dialogtmp) {
                dialogtmp.show = function () {
                    angular.element('#' + dialogtmp.id).modal('show');
                };
                dialogtmp.hide = function () {
                    angular.element('#' + dialogtmp.id).modal('hide');
                };
                return dialogtmp;
            };
        }])
    ;
})(angular);