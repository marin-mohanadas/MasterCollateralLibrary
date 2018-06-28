

(function () {
    'use strict'

    angular
        .module('app.costTypes')
        .factory('costTypesService', ['$http', '$q', 'constants', costTypesService]);

    function costTypesService($http, $q, constants) {

        var baseUri = constants.baseUri;

        var service = {           
            getFind: getFind,
            //getBrandEdit: getBrandEdit,
            updateCostType: updateCostType,
            createCostType: createCostType,
            deleteCostType: deleteCostType
            
        };

        return service;

        function getFind(param) {
            var deferred = $q.defer();
            $http.post(baseUri + 'CostTypes/Find', param)
                .then(function (response) {
                        deferred.resolve(response.data);
                    },
                    function (err) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        }

        //function getBrandEdit(id) {
        //    var deferred = $q.defer();
        //    $http.get(baseUri + 'ProductBrands/GetComponentEdit?id=' + id)
        //        .then(function (response) {
        //                deferred.resolve(response.data);
        //            },
        //            function (err) {
        //                deferred.reject(err);
        //            });
        //    return deferred.promise;
        //}

        function updateCostType(model) {
            var deferred = $q.defer();
            $http.put(baseUri + 'CostTypes/Update', model)
                .then(function (response) {
                        deferred.resolve(response.data);
                    },
                    function (err) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        }

        function deleteCostType(model) {
            var deferred = $q.defer();
            $http.delete(baseUri + 'CostTypes/Delete?id=' + model.id)
                .then(function (response) {
                        deferred.resolve(response.data);
                    },
                    function (err) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        function createCostType(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'CostTypes/SaveNew', model)
                .then(function (response) {
                        deferred.resolve(response.data);
                    },
                    function (err) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        }

    }

})();