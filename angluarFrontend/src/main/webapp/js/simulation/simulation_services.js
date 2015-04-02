(function (angular) {

    angular.module('dnt.simulation.services', [])
         //factory
        .factory('simulationViewService', ['$resource',
            function ($resource) {
                return $resource(simulation_path + "", {}, {
                    get: {method: 'GET', url: simulation_path + "business/:id", isArray: false},
                    queryBusinessTree: {method: 'GET', url: simulation_path + "business/queryBusinessTree", isArray: false},
                    getCurrentPerformance: {method: 'GET', url: simulation_path + "business/:id/currentPerformance", isArray: false}
                });
            }])
        .factory('simulationNodeService', ['$resource',
            function ($resource) {
                return $resource(simulation_path + "", {}, {
                    saveNodesLocations: {method: 'PUT', url: simulation_path + "business/:id/nodes/locations", isArray: false}
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