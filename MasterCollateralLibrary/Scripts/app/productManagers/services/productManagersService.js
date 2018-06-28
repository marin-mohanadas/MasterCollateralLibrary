

(function () {
    'use strict'

    angular
        .module('app.productManagers')
        .factory('productManagersService', ['$http', '$q', 'constants', productManagersService]);

    function productManagersService($http, $q, constants) {

        var baseUri = constants.baseUri;

        var service = {           
            getFind: getFind,
            updateproductManagers: updateProductManagers,
            deleteproductManagers: deleteProductManagers,
            createproductManagers: createProductManagers
            
        };

        return service;

        function getFind(param) {
            var deferred = $q.defer();
            $http.post(baseUri + 'ProductManagers/Find', param)
                .then(function (response) {
                        deferred.resolve(response.data);
                    },
                    function (err) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        }

        function deleteProductManagers(model) {
            var deferred = $q.defer();
            $http.delete(baseUri + 'ProductManagers/Delete?id=' + model.id)
                .then(function (response) {
                        deferred.resolve(response.data);
                    },
                    function (err) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        };

        function createProductManagers(model) {
            var deferred = $q.defer();
            $http.post(baseUri + 'ProductManagers/SaveNew', model)
                .then(function (response) {
                        deferred.resolve(response.data);
                    },
                    function (err) {
                        deferred.reject(err);
                    });
            return deferred.promise;
        }

        function updateProductManagers(model) {
            var deferred = $q.defer();
            $http.put(baseUri + 'ProductManagers/Update', model)
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