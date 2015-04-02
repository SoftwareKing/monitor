(function (angular) {

    angular.module('dnt.businessChart.services', [])
        //factory
        .factory('businessChartViewService', ['$resource',
            function ($resource) {
                return $resource(businessChart_path + "", {}, {
                    deleteElements: {method: 'POST', url: businessChart_path + "business/:id/deleteElements", isArray: false},
                    getBusinessChart: {method: 'GET', url: businessChart_path + "business/businessChart/:id", isArray: false},
                    queryApplicationTree: {method: 'GET', url: businessChart_path + "business/queryApplicationTree", isArray: false}
                });
            }])

        .factory('businessChartNodeService', ['$resource',
            function ($resource) {
                return $resource(businessChart_path + "", {}, {
                    batchsave: {method: 'POST', url: businessChart_path + "business/:id/nodes/batch/save", isArray: false}
                });
            }])

        .factory('businessChartLinkService', ['$resource',
            function ($resource) {
                return $resource(businessChart_path + "", {}, {
                    query: {method: 'GET', url: businessChart_path + "business/:id/relationship", isArray: false},
                    updateLinksStyle: {method: 'PUT', url: businessChart_path + "business/:id/relationship/style", isArray: false},
                    save: {method: 'POST', url: businessChart_path + "business/:id/relationship", isArray: false}
                });
            }])

        .factory('businessChartTopoResourceService', ['$resource',
            function ($resource) {
                return $resource(topo_path + "", {}, {
                    getMetricByMocId: {method: 'GET', url: topo_path + '/resources/metric/select', isArray: true},
                    synMocResource: {method: 'GET', url: topo_path + "topo/resource/moc", isArray: false},
                    synNodesResource: {method: 'GET', url: topo_path + "topo/resource/nodes/query", isArray: false}
                });
            }])

        .factory('alarmAffectColorService', ['$resource',
            function ($resource) {
                return $resource(businessChart_path + "", {}, {
                    save: {method: 'POST', url: businessChart_path + "business/alarmAffectColor", isArray: false},
                    remove: {method: "DELETE", url: businessChart_path + "business/alarmAffectColor/:id", isArray: false},
                    batchRemove: {method: "DELETE", url: businessChart_path + "business/alarmAffectColor/batchRemove", isArray: false},
                    query: {method: 'GET', url: businessChart_path + "business/alarmAffectColor", isArray: false}
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